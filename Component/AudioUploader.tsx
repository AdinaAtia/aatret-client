import{ useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, CircularProgress, 
  MenuItem, Stack, Divider, Autocomplete, Zoom, FormControlLabel, Switch
} from '@mui/material';
import axios from 'axios';
import { HDate } from '@hebcal/core'; // ייבוא הספרייה החדשה
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FolderIcon from '@mui/icons-material/Folder';
import { Snackbar, Alert, Button as MuiButton } from '@mui/material';
import { PlusCircle, Send, FileEdit } from 'lucide-react';

import { colors } from '../src/theme/tokens';
const GOLD = colors.gold;
const COLORS = {
  SIDEBAR_BROWN: colors.gold,
  BROWN_DARK: colors.gold,
};
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL;

const buildSafeUrl = (dir: string, fileName: string) => {
  if (!dir || !fileName) return null;
  const cleanDir = dir.replace(/^\/+|\/+$/g, '');
  const encodedPath = cleanDir.split('/').map(part => encodeURIComponent(part)).join('/');
  const encodedFileName = encodeURIComponent(fileName);
  return `${MEDIA_BASE_URL}/${encodedPath}/${encodedFileName}`;
};

const editFieldStyle = {
  mb: { xs: 1.5, sm: 2 },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': { borderColor: GOLD },
    '&.Mui-focused fieldset': { borderColor: GOLD },
    '& fieldset': { textAlign: 'right' },
    '& input': { textAlign: 'right' },
  },
  '& .MuiInputLabel-root': { 
    right: 22, left: 'auto', transformOrigin: 'top right',
    '&.Mui-focused': { color: GOLD },
  },
  '& .MuiInputLabel-shrink': { transform: 'translate(0, -9px) scale(0.75)', right: 14, left: 'auto' },
  '& legend': { textAlign: 'right' },
};

const NUM_PATTERN = /שיעור(?:\s+מס.?)?\s+(\d+)/;

const extractNum = (t: string) => {
  const m = t.match(NUM_PATTERN);
  if (!m || m.index === undefined) return null;
  return { num: parseInt(m[1]), padWidth: m[1].length, prefixEnd: m.index + m[0].length - m[1].length };
};

const detectTitlePrefix = (titles: string[]): string => {
  if (titles.length === 0) return '';

  if (titles.length === 1) {
    const n = extractNum(titles[0]);
    if (n) {
      const nextNum = String(n.num + 1).padStart(n.padWidth, '0');
      return titles[0].substring(0, n.prefixEnd) + nextNum + ' - ';
    }
    const lastDash = titles[0].lastIndexOf(' - ');
    return lastDash > 0 ? titles[0].substring(0, lastDash + 3) : '';
  }

  const [t1, t2] = titles;
  const n1 = extractNum(t1);
  const n2 = extractNum(t2);

  if (n1 && n2) {
    const nextNum = Math.max(n1.num, n2.num) + 1;
    const padWidth = Math.max(n1.padWidth, n2.padWidth);
    const paddedNum = String(nextNum).padStart(padWidth, '0');
    return t1.substring(0, n1.prefixEnd) + paddedNum + ' - ';
  }

  let common = '';
  const parts1 = t1.split(' - ');
  const parts2 = t2.split(' - ');
  for (let i = 0; i < Math.min(parts1.length - 1, parts2.length - 1); i++) {
    if (parts1[i] === parts2[i]) common = parts1.slice(0, i + 1).join(' - ') + ' - ';
    else break;
  }
  return common;
};

const AudioUploader = () => {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [categoriesPath, setCategoriesPath] = useState<any[]>([]);
  const [suggestedFolders, setSuggestedFolders] = useState<string[]>([]);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [suggestedPdfs, setSuggestedPdfs] = useState<string[]>([]);
  const [_titlePrefix, setTitlePrefix] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const titlePatternAbortRef = useRef<AbortController | null>(null);
  const selectedAudioFileRef = useRef<File | null>(null);

  const fetchPdfFiles = (audioDir: string) => {
    if (!audioDir) { setSuggestedPdfs([]); return; }
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/pdf-files`, {
      params: { audioDir }
    }).then(res => {
      setSuggestedPdfs(res.data);
      if (res.data.length === 1) {
        setLessonData(prev => ({ ...prev, pdfFileName: res.data[0] }));
      }
    }).catch(() => setSuggestedPdfs([]));
  };
  const [loading, setLoading] = useState(false);
  const [selectedRabbi, setSelectedRabbi] = useState('');
const [errors, setErrors] = useState<any>({});
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', audioUrl: '' });
  const [lessonData, setLessonData] = useState({
    title: '',
    lesson_date_gregorian: new Date().toISOString().split('T')[0],
    lesson_date_hebrew: '',
    audioDir: '',
    audioFileName: '',
    pdfFileName: '',
    duration: ''
  });

  // הפונקציה החדשה והבטוחה להמרת תאריך באמצעות Hebcal
const formatToHebrewDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const dateParts = dateString.split('-');
    // יצירת אובייקט תאריך (חודש ב-JS מתחיל מ-0)
    const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    const hDate = new HDate(d);
    
    // ה-false כאן מבטל את הניקוד
    const fullHebrewStr = hDate.renderGematriya(false); 
    
    // סידור התאריך להוספת ה' לפני השנה
    const parts = fullHebrewStr.split(' ');
    const year = parts.pop(); 
    const rest = parts.join(' '); 
    
    return `${rest} ׳${year}`;
  } catch (e) {
    console.error("Error formatting Hebrew date:", e);
    return '';
  }
};
  useEffect(() => {
    setLessonData(prev => ({
      ...prev,
      lesson_date_hebrew: formatToHebrewDate(prev.lesson_date_gregorian)
    }));
  }, [lessonData.lesson_date_gregorian]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis`).then(res => {
      const data: any[] = res.data.data || [];
      setLecturers(data.sort((a, b) => {
        const na = a.name || a.attributes?.name || '';
        const nb = b.name || b.attributes?.name || '';
        if (na.includes('מרדכי עטייה')) return -1;
        if (nb.includes('מרדכי עטייה')) return 1;
        return na.localeCompare(nb, 'he');
      }));
    });
  }, []);

  const fetchAudioDirs = (rabbiId: string, mainCatId?: string, subCatId?: string, autoFill = false) => {
    if (!rabbiId) { setSuggestedFolders([]); return; }
    const params: any = { rabbiDocumentId: rabbiId };
    if (subCatId) params.subCategoryDocumentId = subCatId;
    else if (mainCatId) params.mainCategoryDocumentId = mainCatId;
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/audio-dirs`, { params })
      .then(res => {
        setSuggestedFolders(res.data);
        if (autoFill && res.data.length > 0) {
          const dir = res.data[0];
          setLessonData(prev => ({ ...prev, audioDir: dir }));
          fetchPdfFiles(dir);
        }
      })
      .catch(() => setSuggestedFolders([]));
  };

  useEffect(() => {
    if (!selectedRabbi) {
      setCategoriesPath([]);
      setSuggestedFolders([]);
      setSuggestedTitles([]);
      setTitlePrefix('');
      setLessonData(prev => ({ ...prev, audioDir: '', pdfFileName: '', title: '' }));
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[rabbi][documentId][$eq]=${selectedRabbi}`)
      .then(res => {
        const sorted = (res.data.data || []).sort((a: any, b: any) =>
          (a.name || a.attributes?.name || '').localeCompare(b.name || b.attributes?.name || '', 'he')
        );
        setCategoriesPath([{ level: 1, label: 'קטגוריה ראשית', options: sorted, selected: '' }]);
      });

    fetchAudioDirs(selectedRabbi);
    setSuggestedTitles([]);

  }, [selectedRabbi]);

  const handleCategoryChange = async (index: number, documentId: string) => {
    const updatedPath = [...categoriesPath];
    updatedPath[index].selected = documentId;
    const newPath = updatedPath.slice(0, index + 1);

    const sortByName = (arr: any[]) => [...arr].sort((a, b) =>
      (a.name || a.attributes?.name || '').localeCompare(b.name || b.attributes?.name || '', 'he')
    );

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${documentId}`);
      let children = response.data.data;
      if (index === 0 && (!children || children.length === 0)) {
        const subRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[main_category][documentId][$eq]=${documentId}&filters[parent_sub][documentId][$null]=true`);
        children = subRes.data.data;
      }
      if (children && children.length > 0) {
        newPath.push({ level: index + 2, label: `תת קטגוריה`, options: sortByName(children), selected: '' });
      }
    } catch (e) { console.error(e); }
    setCategoriesPath(newPath);
    if (index === 0) {
      setTitlePrefix('');
      setLessonData(prev => ({ ...prev, title: '' }));
    }

    // טעינת שמות שיעורים לפי הקטגוריה הנבחרת
    const lastSubSelected = newPath.slice(1).reverse().find(c => c.selected);
    const mainCatSelected = newPath[0]?.selected;

    let titlesUrl = `${import.meta.env.VITE_API_URL}/api/lessons?fields[0]=title&pagination[pageSize]=150&filters[rabbi][documentId][$eq]=${selectedRabbi}`;
    if (lastSubSelected?.selected) {
      titlesUrl += `&filters[sub_category][documentId][$eq]=${lastSubSelected.selected}`;
    } else if (mainCatSelected) {
      titlesUrl += `&filters[main_category][documentId][$eq]=${mainCatSelected}`;
    }

    axios.get(titlesUrl)
      .then(res => {
        const titles = (res.data.data || [])
          .map((l: any) => l.title || l.attributes?.title)
          .filter(Boolean);
        setSuggestedTitles([...new Set(titles)] as string[]);
      })
      .catch(() => setSuggestedTitles([]));

    fetchAudioDirs(selectedRabbi, newPath[0]?.selected, lastSubSelected?.selected, true);

    // שליפת תבנית כותרת — מבטל קריאה קודמת אם קיימת
    titlePatternAbortRef.current?.abort();
    const abortCtrl = new AbortController();
    titlePatternAbortRef.current = abortCtrl;
    const patternParams: any = { rabbiDocumentId: selectedRabbi };
    if (lastSubSelected?.selected) patternParams.subCategoryDocumentId = lastSubSelected.selected;
    else if (mainCatSelected) patternParams.mainCategoryDocumentId = mainCatSelected;
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/title-pattern`, { params: patternParams, signal: abortCtrl.signal })
      .then(res => {
        const prefix = detectTitlePrefix(res.data);
        setTitlePrefix(prefix);
        if (prefix) setLessonData(prev => ({ ...prev, title: prefix }));
      })
      .catch(err => { if (!axios.isCancel(err)) setTitlePrefix(''); });
  };
const handleSubmit = async () => {
  // 1. יצירת אובייקט שגיאות חדש לבדיקת השדות הנדרשים
  const newErrors: any = {};
  
  if (!lessonData.title) newErrors.title = "לא מילאת את כל השורות";
  if (!selectedRabbi) newErrors.rabbi = "לא מילאת את כל השורות";
  if (!lessonData.audioDir) newErrors.audioDir = "לא מילאת את כל השורות";
  if (!lessonData.audioFileName) newErrors.audioFileName = "לא מילאת את כל השורות";

  // 2. אם יש שדות ריקים, נעדכן את ה-State ונפסיק את הריצה
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // 3. ניקוי שגיאות קודמות והפעלת מצב טעינה
  setErrors({});
  setLoading(true);

  // 3.5 העלאת קובץ שמע ישירות לשרת לפני שמירה ב-DB
  if (selectedAudioFileRef.current) {
    try {
      const formData = new FormData();
      formData.append('file', selectedAudioFileRef.current);
      formData.append('audioDir', lessonData.audioDir);
      await axios.post(import.meta.env.VITE_UPLOAD_PHP_URL, formData, {
        headers: { 'X-Upload-Secret': import.meta.env.VITE_UPLOAD_SECRET },
      });
    } catch {
      setSnackbar({ open: true, message: 'שגיאה בהעלאת קובץ השמע לשרת', severity: 'error', audioUrl: '' });
      setLoading(false);
      return;
    }
  }

  try {
    // 4. הכנת הנתונים למבנה שסטראפי מצפה לו (כולל PascalCase לשדות הקבצים)
    const dataToSend = {
      data: {
        title: lessonData.title,
        lesson_date_gregorian: lessonData.lesson_date_gregorian,
        lesson_date_hebrew: lessonData.lesson_date_hebrew,
        
        // שמות ה-Attributes כפי שמופיעים בסכמה שלך
        AudioDir: lessonData.audioDir,
        AudioFileName: lessonData.audioFileName,
        PdfFileName: lessonData.pdfFileName,
        PdfFiles: lessonData.pdfFileName ? [lessonData.pdfFileName] : [],
        duration: lessonData.duration || undefined,

        
        // קישור לישויות אחרות (Relations)
        rabbi: selectedRabbi, 
        main_category: categoriesPath[0]?.selected || null,
        sub_category: [...categoriesPath].slice(1).reverse().find(s => s.selected)?.selected || null,
        
        views: 0
      }
    };

    console.log("Sending data to Strapi:", dataToSend);

    // 5. שליחת הבקשה לשרת
const url = isPublished 
      ? `${import.meta.env.VITE_API_URL}/api/lessons` 
      : `${import.meta.env.VITE_API_URL}/api/lessons?status=draft`;
    await axios.post(url, dataToSend);    // 6. הצגת הודעת הצלחה ב-Snackbar ואיפוס חלקי של הטופס
    setSnackbar({
      open: true,
      message: 'השיעור נשמר בהצלחה בבסיס הנתונים!',
      severity: 'success',
      audioUrl: buildSafeUrl(lessonData.audioDir, lessonData.audioFileName) || ''
    });

    // איפוס השדות כדי שיהיה אפשר להזין שיעור חדש מיד
    selectedAudioFileRef.current = null;
    setLessonData({
      ...lessonData,
      title: '',
      audioFileName: '',
      pdfFileName: '',
      duration: ''
    });

  } catch (err: any) {
    // 7. טיפול בשגיאות מהשרת (400/500) והצגת הודעה מתאימה
    const errorMessage = err.response?.data?.error?.message || 'שגיאה בתקשורת עם השרת';
    console.error("Save error details:", err.response?.data || err);
    
    setSnackbar({
      open: true,
      message: `שגיאה בשמירה: ${errorMessage}`,
      severity: 'error',
      audioUrl: ''
    });
  } finally {
    // 8. כיבוי ה-Spinner בכפתור
    setLoading(false);
  }
};
return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, direction: 'rtl' }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: '24px', width: '100%', maxWidth: '640px', border: '1px solid #eee' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, color: GOLD, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlusCircle size={28} color="#000" /> רישום שיעור חדש
        </Typography>

        <Stack spacing={1}>

          {/* העלאת קובץ שמע — ראשון */}
          <Box
            component="label"
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 1.5, p: 5, mb: 1, borderRadius: '16px',
              border: `2px dashed ${lessonData.audioFileName ? GOLD : '#ccc'}`,
              bgcolor: lessonData.audioFileName ? '#fffbf0' : '#fafafa',
              cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { borderColor: GOLD, bgcolor: '#fffbf0' }
            }}
          >
            <AudioFileIcon sx={{ fontSize: 40, color: lessonData.audioFileName ? GOLD : '#bbb' }} />
            {lessonData.audioFileName ? (
              <>
                <Typography sx={{ fontWeight: 700, color: GOLD, fontSize: '0.95rem' }}>
                  {lessonData.audioFileName}
                </Typography>
                {lessonData.duration && (
                  <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                    אורך: {lessonData.duration}
                  </Typography>
                )}
              </>
            ) : (
              <Typography sx={{ color: '#999', fontWeight: 600 }}>לחץ לבחירת קובץ שמע</Typography>
            )}
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                selectedAudioFileRef.current = file;
                setLessonData(prev => ({ ...prev, audioFileName: file.name }));
                // שליפת אורך מהקובץ באמצעות HTML5 Audio
                const audio = document.createElement('audio');
                audio.src = URL.createObjectURL(file);
                audio.addEventListener('loadedmetadata', () => {
                  const sec = Math.round(audio.duration);
                  const h = Math.floor(sec / 3600);
                  const m = Math.floor((sec % 3600) / 60);
                  const s = sec % 60;
                  const dur = h > 0
                    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
                    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                  setLessonData(prev => ({ ...prev, duration: dur }));
                  URL.revokeObjectURL(audio.src);
                });
                e.target.value = '';
              }}
            />
          </Box>

          {/* שורת תאריכים עם תיקון ריווח */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              width: '100%', 
              mb: 2,
              '& > :not(style) + :not(style)': { 
                marginRight: { sm: '16px !important' }, 
                marginLeft: { sm: '0 !important' } 
              } 
            }}
          >
            <TextField
              type="date"
              fullWidth
              size="small"
              label="תאריך לועזי"
              InputLabelProps={{ shrink: true }}
              sx={editFieldStyle}
              value={lessonData.lesson_date_gregorian}
              onChange={(e) => setLessonData({...lessonData, lesson_date_gregorian: e.target.value})}
            />
            <TextField
              fullWidth
              size="small"
              label="תאריך עברי"
              sx={editFieldStyle}
              value={lessonData.lesson_date_hebrew}
              InputProps={{ readOnly: true }}
            />
          </Stack>

          <Divider sx={{ my: 2, '& .MuiDivider-wrapper': { color: GOLD } }}>שיוך רב וקטגוריות</Divider>

          {/* בחירת רב */}
          <Box>
            <TextField
              select
              size="small"
              label="בחר רב"
              value={selectedRabbi}
              sx={editFieldStyle}
              fullWidth 
              onChange={(e) => {
                setSelectedRabbi(e.target.value);
                if (errors.rabbi) setErrors({...errors, rabbi: ''});
              }}
            >
               {lecturers.map((r) => (
                 <MenuItem key={r.documentId} value={r.documentId}>
                   {r.name || r.attributes?.name}
                 </MenuItem>
               ))}
            </TextField>
            {errors.rabbi && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1.5, mb: 1.5, mr: 2 }}>
                {errors.rabbi}
              </Typography>
            )}
          </Box>

          {categoriesPath.map((step, index) => (
            <Zoom in={true} key={index}>
              <TextField
                select
                size="small"
                label={step.label}
                value={step.selected}
                sx={editFieldStyle}
                fullWidth
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              >
                {step.options.map((opt: any) => (
                  <MenuItem key={opt.documentId} value={opt.documentId}>
                    {opt.name || opt.attributes?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Zoom>
          ))}

          {/* כותרת השיעור */}
          <Box>
            <Autocomplete
              freeSolo
              options={suggestedTitles}
              value={lessonData.title}
              onInputChange={(_, val) => {
                setLessonData({...lessonData, title: val});
                if (errors.title) setErrors({...errors, title: ''});
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="כותרת השיעור"
                  sx={editFieldStyle}
                />
              )}
            />
            {errors.title && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1.5, mb: 1.5, mr: 2 }}>
                {errors.title}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2, '& .MuiDivider-wrapper': { color: GOLD } }}>פרטי קובץ</Divider>

          {/* תיקיית יעד */}
          <Box>
            <Autocomplete
              freeSolo
              options={suggestedFolders}
              value={lessonData.audioDir}
              onInputChange={(_, val) => {
                setLessonData({...lessonData, audioDir: val});
                if (errors.audioDir) setErrors({...errors, audioDir: ''});
                fetchPdfFiles(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="תיקיית יעד (AudioDir)"
                  sx={editFieldStyle}
                  inputProps={{ ...params.inputProps, dir: 'ltr' }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FolderIcon sx={{ color: COLORS.SIDEBAR_BROWN, ml: 1 }} />
                  }}
                />
              )}
            />
            {errors.audioDir && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1, mb: 1, mr: 2 }}>
                {errors.audioDir}
              </Typography>
            )}
          </Box>

          {/* שם קובץ אודיו */}
          <Box>
            <Autocomplete
              freeSolo
              options={[]}
              value={lessonData.audioFileName}
              onInputChange={(_, val) => {
                setLessonData({...lessonData, audioFileName: val});
                if (errors.audioFileName) setErrors({...errors, audioFileName: ''});
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="שם קובץ אודיו"
                  sx={editFieldStyle}
                  inputProps={{ ...params.inputProps, dir: 'ltr' }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <AudioFileIcon sx={{ color: GOLD, ml: 1 }} />
                  }}
                />
              )}
            />
            {errors.audioFileName && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1, mb: 1, mr: 2 }}>
                {errors.audioFileName}
              </Typography>
            )}
          </Box>
          {/* שם קובץ PDF */}
          <Autocomplete
            freeSolo
            options={suggestedPdfs}
            value={lessonData.pdfFileName}
            onInputChange={(_, val) => setLessonData({...lessonData, pdfFileName: val})}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="שם קובץ PDF"
                sx={editFieldStyle}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <PictureAsPdfIcon sx={{ color: GOLD, ml: 1 }} />
                }}
              />
            )}
          />
          {/* העלאת PDF חדש */}
          {lessonData.audioDir && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: -0.5 }}>
              <Button
                component="label"
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                sx={{ borderColor: GOLD, color: GOLD, fontSize: '0.75rem', borderRadius: '8px' }}
              >
                העלה PDF חדש
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !lessonData.audioDir) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('audioDir', lessonData.audioDir);
                    try {
                      await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/upload-pdf`, formData);
                      setLessonData({...lessonData, pdfFileName: file.name});
                      fetchPdfFiles(lessonData.audioDir);
                      setSnackbar({ open: true, message: 'PDF הועלה בהצלחה!', severity: 'success', audioUrl: '' });
                    } catch {
                      setSnackbar({ open: true, message: 'שגיאה בהעלאת PDF', severity: 'error', audioUrl: '' });
                    }
                    e.target.value = '';
                  }}
                />
              </Button>
              <Typography sx={{ fontSize: '0.72rem', color: '#888' }}>לנתיב: {lessonData.audioDir}</Typography>
            </Box>
          )}

          <Box sx={{ p: 2, borderRadius: '12px', border: `1px dashed ${isPublished ? GOLD : '#ccc'}` }}>
            <FormControlLabel
              control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD },
              }} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isPublished ? <Send size={18} color={GOLD} /> : <FileEdit size={18} color="gray" />}
                  <Typography sx={{ fontWeight: 600 }}>{isPublished ? 'פרסום מיידי לאתר' : 'שמור כטיוטה בלבד'}</Typography>
                </Box>
              }
            />
          </Box>

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSubmit} 
            disabled={loading} 
            sx={{ 
              py: 1.8,
              mt: 2,
              borderRadius: '12px', 
              bgcolor: '#000', 
              color: GOLD,
              fontWeight: 800, 
              '&:hover': { bgcolor: GOLD, color: '#000' } 
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'הוסף שיעור '}
          </Button>
        </Stack>
      </Paper>

      {/* הודעת הצלחה/שגיאה בצד שמאל למעלה */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '20% !important', transform: 'translateY(-50%)' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          variant="filled"
          icon={false}
          action={
            snackbar.audioUrl ? (
              <MuiButton
                size="small"
                onClick={() => window.open(snackbar.audioUrl, '_blank')}
                sx={{ color: colors.gold, fontWeight: 700, border: `1px solid ${colors.gold}`, borderRadius: '8px', px: 1.5, ml: 2 }}
              >
                האזן
              </MuiButton>
            ) : undefined
          }
          sx={{
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
            bgcolor: '#000',
            color: colors.gold,
            '& .MuiAlert-action': { color: colors.gold, alignItems: 'center', paddingLeft: '0' },
            '& .MuiAlert-message': { paddingLeft: '20px' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AudioUploader;