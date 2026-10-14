import  { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem, Typography, Divider, Zoom, Autocomplete,
  InputAdornment, IconButton, Tooltip, CircularProgress, Box
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { getPdfList } from './shared/pdfFiles';
import { HDate, gematriyaStrToNum } from '@hebcal/core';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  TEXT_GRAY: '#5f6368'
};

const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    direction: 'rtl' as const,
    '& fieldset': { textAlign: 'right' as const },
    '&.Mui-focused fieldset': { borderColor: colors.gold },
    '&:hover fieldset': { borderColor: colors.gold },
  },
  '& .MuiInputLabel-root': {
    right: 28, left: 'auto', transformOrigin: 'right',
    '&.Mui-focused': { color: COLORS.BROWN_DARK },
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(0, -9px) scale(0.75)',
    right: 10,
  }
};

const stripHebrew = (s: string) => s.replace(/[֑-ׇ]/g, '').replace(/[״׳"'.,]/g, '').trim();

// לועזי (yyyy-mm-dd) -> עברי, באותו פורמט כמו בהעלאת שיעור
const gregorianToHebrew = (iso: string): string => {
  if (!iso) return '';
  try {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return '';
    const parts = new HDate(new Date(y, m - 1, d)).renderGematriya(false).split(' ');
    const year = parts.pop();
    return `${parts.join(' ')} ׳${year}`;
  } catch { return ''; }
};

// עברי (טקסט חופשי, למשל: כ״ה אדר ב׳ תשפ״ד) -> לועזי yyyy-mm-dd, או null אם לא ניתן לפענח
const hebrewToGregorian = (text: string): string | null => {
  try {
    const tokens = (text || '').trim().split(/\s+/).filter(Boolean);
    if (tokens.length < 3) return null;

    const day = gematriyaStrToNum(stripHebrew(tokens[0]));
    const yearRaw = stripHebrew(tokens[tokens.length - 1]);
    let year = /^\d+$/.test(yearRaw) ? Number(yearRaw) : gematriyaStrToNum(yearRaw);
    if (!day || !year) return null;
    if (year < 1000) year += 5000;

    const monthName = stripHebrew(tokens.slice(1, -1).join(' '));
    const leap = new HDate(1, 7, year).isLeapYear();
    let month = 0;
    for (let m = 1; m <= 13; m++) {
      const parts = new HDate(1, m, year > 0 ? year : 5784).renderGematriya(false).split(' ');
      if (stripHebrew(parts.slice(1, -1).join(' ')) === monthName) { month = m; break; }
    }
    if (!month && monthName === 'אדר' && !leap) month = 12;
    if (!month) return null;

    const hd = new HDate(day, month, year);
    if (hd.getDate() !== day || hd.getMonth() !== month) return null;
    const g = hd.greg();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}`;
  } catch { return null; }
};

// --- הצעות תיקייה / PDF משתי בדיקות: ה-DB / שרת המדיה, ותיאור סרטון היוטיוב ---

interface HintOption { label: string; value: string; note?: string }

const parseYoutubeId = (raw: string): string | null => {
  const m = (raw || '').match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : ((raw || '').length === 11 ? raw : null);
};

// השוואה סלחנית: לוכסנים, רווחים כפולים ואותיות גדולות/קטנות
const normPath = (s: string) =>
  '/' + (s || '').trim().replace(/\\/g, '/').replace(/\s+/g, ' ').replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/').toLowerCase();
const normName = (s: string) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

// כשהבדיקות מתנגשות מוצגות כמה אפשרויות לבחירה; כשהן מסכימות — אפשרות אחת לאישור
const HintCard = ({ title, options, onPick, onClose }: {
  title: string; options: HintOption[]; onPick: (value: string) => void; onClose: () => void;
}) => (
  <Stack
    spacing={1}
    sx={{ px: 1.5, py: 1, borderRadius: '12px', border: '1px solid #dcc9a0', bgcolor: '#faf7f0' }}
  >
    <Stack direction="row" alignItems="center">
      <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, color: '#8c6644' }}>{title}</Typography>
      <IconButton size="small" onClick={onClose}>
        <CloseIcon fontSize="small" sx={{ color: COLORS.TEXT_GRAY }} />
      </IconButton>
    </Stack>
    {options.map((opt) => (
      <Stack key={opt.value} direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ display: 'block', color: COLORS.TEXT_GRAY }}>{opt.label}</Typography>
          <Typography
            variant="body2"
            sx={{ direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', overflowWrap: 'anywhere' }}
          >
            {opt.value}
          </Typography>
          {opt.note && (
            <Typography variant="caption" sx={{ display: 'block', color: '#c62828', fontWeight: 700 }}>{opt.note}</Typography>
          )}
        </Box>
        <Button
          size="small"
          variant="contained"
          onClick={() => onPick(opt.value)}
          sx={{ whiteSpace: 'nowrap', borderRadius: '8px', boxShadow: 'none', bgcolor: colors.gold, '&:hover': { bgcolor: '#b48a66', boxShadow: 'none' } }}
        >
          {options.length > 1 ? 'בחר' : 'אישור'}
        </Button>
      </Stack>
    ))}
  </Stack>
);

interface EditLessonDialogProps {
  open: boolean;
  onClose: () => void;
  lesson: any;
  lecturers: any[];
  onSaveSuccess: () => void;
  isDraft?: boolean;
  // כשמועבר — ההמרה רצה ברקע, החלון נסגר מיד וההתקדמות מדווחת לשורה בטבלה
  onConvertChange?: (documentId: string, state: ConvertState) => void;
}

export type ConvertState = {
  status: 'running' | 'done' | 'failed' | 'timeout';
  stage?: string;
  error?: string;
};

const EditLessonDialog = ({ open, onClose, lesson, lecturers, onSaveSuccess, isDraft = false, onConvertChange }: EditLessonDialogProps) => {
  const [editedLesson, setEditedLesson] = useState<any>(null);
  const [categoriesPath, setCategoriesPath] = useState<any[]>([]);
  const [suggestedFolders, setSuggestedFolders] = useState<string[]>([]);
  const [suggestedPdfs, setSuggestedPdfs] = useState<string[]>([]);

  const [converting, setConverting] = useState(false);
  const [convertStage, setConvertStage] = useState('');
  const [nameHint, setNameHint] = useState<any>(null);
  const [suggesting, setSuggesting] = useState(false);

  // הצעות תיקייה/PDF: linkInfo מתיאור היוטיוב, pdfLatest משרת המדיה
  const [linkInfo, setLinkInfo] = useState<{ audioDir: string; pdfFileName: string } | null>(null);
  const [pdfLatest, setPdfLatest] = useState<{ dir: string; latest: { fileName: string; date: string } | null; files: string[] } | null>(null);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [hintsForced, setHintsForced] = useState(false); // "בדוק שוב" — מציג גם כששדות כבר מלאים
  const [hintsMsg, setHintsMsg] = useState('');
  const [dismissedDir, setDismissedDir] = useState(false);
  const [dismissedPdf, setDismissedPdf] = useState(false);

  // מושך את סטטוס ההמרה מהשרת עד לסיום. מוותר אחרי 35 דקות —
  // מעט מעל מגבלת 30 הדקות של yt-dlp בשרת, כדי לא לוותר לפניו.
  const pollConvertStatus = async (jobKey: string, onStage?: (stage: string) => void): Promise<any> => {
    const deadline = Date.now() + 35 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/convert-status`, {
          params: { jobKey }
        });
        const job = res.data || {};
        if (job.status === 'done' || job.status === 'failed') return job;
        // 'unknown' = השרת עלה מחדש או שהעבודה נוקתה; אין טעם להמשיך לחכות
        if (job.status === 'unknown') return { status: 'timeout' };
        if (job.stage) { setConvertStage(job.stage); onStage?.(job.stage); }
      } catch {
        // תקלת רשת זמנית — ננסה שוב בסבב הבא
      }
    }
    return { status: 'timeout' };
  };

  // _force=true מגיע מלחיצה על כפתור "הצע שם". הכוונה המקורית הייתה להציע
  // אוטומטית רק כששדה שם הקובץ ריק — הלוגיקה הזו עדיין לא מומשה.
  const fetchSuggestedFileName = (audioDir: string, _force = false) => {
    if (!audioDir) return;
    setSuggesting(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/suggest-filename`, {
      params: { audioDir, lessonDate: editedLesson?.lesson_date_gregorian || undefined }
    })
      .then(res => {
        const { suggested, exists, lastFile } = res.data || {};
        // ההצעה רק מוצגת; היא נכנסת לשדה רק בלחיצה על "אישור"
        if (suggested) setNameHint({ suggested, exists, lastFile });
      })
      .catch(() => setNameHint(null))
      .finally(() => setSuggesting(false));
  };

  const applySuggestedName = () => {
    setEditedLesson((prev: any) => ({ ...prev, AudioFileName: nameHint.suggested }));
    setNameHint(null);
  };

  const fetchPdfFiles = (audioDir: string) => {
    if (!audioDir) { setSuggestedPdfs([]); return; }
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/pdf-files`, {
      params: { audioDir }
    }).then(res => setSuggestedPdfs(res.data)).catch(() => setSuggestedPdfs([]));
  };

  const loadLinkInfo = async (youtubeRaw: string) => {
    const id = parseYoutubeId(youtubeRaw);
    if (!id) { setHintsMsg('אין קישור יוטיוב לשיעור'); return; }
    setHintsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/youtube-hints`, { params: { youtubeId: id } });
      const pdf = res.data?.pdf;
      setLinkInfo(pdf ? { audioDir: pdf.audioDir, pdfFileName: pdf.pdfFileName } : null);
      setHintsMsg(pdf ? '' : 'לא נמצא קישור PDF בתיאור הסרטון');
    } catch {
      setLinkInfo(null);
      setHintsMsg('לא הצלחנו לקרוא את תיאור הסרטון');
    } finally {
      setHintsLoading(false);
    }
  };

  const recheckHints = () => {
    setHintsForced(true);
    setDismissedDir(false);
    setDismissedPdf(false);
    loadLinkInfo(editedLesson?.youtube_id || '');
  };

  // ה-PDF האחרון שהוכנס לתיקייה הנבחרת (עם השהיה, כי השדה מתעדכן בכל הקשה)
  useEffect(() => {
    const dir = editedLesson?.AudioDir;
    if (!open || !dir) { setPdfLatest(null); return; }
    const t = setTimeout(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/pdf-latest`, { params: { audioDir: dir } })
        .then(res => setPdfLatest({ dir, latest: res.data?.latest || null, files: res.data?.files || [] }))
        .catch(() => setPdfLatest({ dir, latest: null, files: [] }));
    }, 400);
    return () => clearTimeout(t);
  }, [open, editedLesson?.AudioDir]);

  useEffect(() => {
    if (lesson && open) {
      setNameHint(null);
      setLinkInfo(null);
      setHintsForced(false);
      setHintsMsg('');
      setDismissedDir(false);
      setDismissedPdf(false);
      // חילוץ נתונים מסטרפי 5: הנתונים יכולים להיות ישירות באובייקט או תחת attributes
      const attrs = lesson.attributes || lesson;
      
      // חשוב: חילוץ ה-documentId לצורך עדכון
      const docId = lesson.documentId || lesson.id;

      setEditedLesson({
        ...attrs,
        documentId: docId,
        AudioDir: attrs.AudioDir || attrs.audioDir || '',
        AudioFileName: attrs.AudioFileName || attrs.audioFileName || '',
        PdfFileName: attrs.PdfFileName || attrs.pdfFileName || '',
        PdfFiles: getPdfList(attrs),
        youtube_id: attrs.youtube_id ? `https://www.youtube.com/watch?v=${attrs.youtube_id}` : '',
        duration: attrs.duration || '',
        lesson_date_gregorian: attrs.lesson_date_gregorian
          ? attrs.lesson_date_gregorian.split('T')[0]
          : ''
      });
      
      const rabbiId = attrs.rabbi?.data?.documentId || attrs.rabbi?.documentId || attrs.rabbi?.id;
      const mainCatNumericId = attrs.main_category?.data?.id || null;
      const subCatId = attrs.sub_category?.data?.documentId || null;
      if (rabbiId) {
        loadCategoriesWithSelection(rabbiId, mainCatNumericId, subCatId);
        axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/audio-dirs`, {
          params: { rabbiDocumentId: rabbiId }
        }).then(res => setSuggestedFolders(res.data)).catch(() => setSuggestedFolders([]));
      }

      const audioDir = attrs.AudioDir || attrs.audioDir || '';
      if (audioDir) {
        fetchPdfFiles(audioDir);
      }

      // שיעור שכבר מלא בתיקייה וב-PDF לא נבדק אוטומטית — רק ב"בדוק שוב"
      const hasPdf = getPdfList(attrs).length > 0;
      if (attrs.youtube_id && (!audioDir || !hasPdf)) loadLinkInfo(attrs.youtube_id);
    }
  }, [lesson, open]);

  const loadCategoriesWithSelection = async (rabbiId: string, mainCatNumericId: number | null, subCatDocId: string | null) => {
    try {
      const mainRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[rabbi][documentId][$eq]=${rabbiId}`);
      const mainOptions = mainRes.data.data || [];

      // הפיכת ID מספרי ל-documentId מתוך הרשימה שנטענה
      const matchedMain = mainCatNumericId ? mainOptions.find((opt: any) => opt.id === mainCatNumericId) : null;
      const mainCatDocId = matchedMain?.documentId || null;

      const pathBuilder: any[] = [{ level: 1, label: 'קטגוריה ראשית', options: mainOptions, selected: mainCatDocId || '' }];

      if (!mainCatDocId) {
        setCategoriesPath(pathBuilder);
        return;
      }

      // בנייה של שרשרת האבות מהתת-קטגוריה עלה למעלה
      const ancestorIds: string[] = [];
      if (subCatDocId) {
        let currentId = subCatDocId;
        for (let i = 0; i < 6; i++) {
          ancestorIds.unshift(currentId);
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/categories-subs/${currentId}?fields[0]=documentId&populate[parent_sub][fields][0]=documentId`
            );
            const parentData = res.data.data?.parent_sub;
            const parentId = parentData?.documentId || parentData?.data?.documentId;
            if (!parentId) break;
            currentId = parentId;
          } catch { break; }
        }
      }

      // בניית הנתיב רמה-רמה עם בחירה מראש
      for (let i = 0; i < ancestorIds.length; i++) {
        let options: any[];
        if (i === 0) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/categories-subs?filters[main_category][documentId][$eq]=${mainCatDocId}&filters[parent_sub][documentId][$null]=true`
          );
          options = res.data.data || [];
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${ancestorIds[i - 1]}`
          );
          options = res.data.data || [];
        }
        pathBuilder.push({ level: i + 2, label: `תת קטגוריה (רמה ${i + 2})`, options, selected: ancestorIds[i] });
      }

      // טעינת ילדים של הרמה האחרונה שנבחרה
      if (ancestorIds.length > 0) {
        const lastId = ancestorIds[ancestorIds.length - 1];
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${lastId}`);
        const children = res.data.data || [];
        if (children.length > 0) {
          pathBuilder.push({ level: ancestorIds.length + 2, label: `תת קטגוריה (רמה ${ancestorIds.length + 2})`, options: children, selected: '' });
        }
      } else {
        // אין תת-קטגוריה, הצג את הרמה הראשונה ריקה
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories-subs?filters[main_category][documentId][$eq]=${mainCatDocId}&filters[parent_sub][documentId][$null]=true`
        );
        const children = res.data.data || [];
        if (children.length > 0) {
          pathBuilder.push({ level: 2, label: 'תת קטגוריה (רמה 2)', options: children, selected: '' });
        }
      }

      setCategoriesPath(pathBuilder);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleRabbiChange = (rabbiId: string) => {
    setEditedLesson((prev: any) => ({ ...prev, rabbi: { documentId: rabbiId } }));
    setCategoriesPath([]);
    loadCategoriesWithSelection(rabbiId, null, null);
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/audio-dirs`, {
      params: { rabbiDocumentId: rabbiId }
    }).then(res => setSuggestedFolders(res.data)).catch(() => setSuggestedFolders([]));
  };

  const handleCategoryChange = async (index: number, documentId: string) => {
    const updatedPath = [...categoriesPath];
    updatedPath[index].selected = documentId;
    const newPath = updatedPath.slice(0, index + 1);
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${documentId}`);
      let children = response.data.data;
      if (index === 0 && (!children || children.length === 0)) {
        const subRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[main_category][documentId][$eq]=${documentId}&filters[parent_sub][documentId][$null]=true`);
        children = subRes.data.data;
      }
      if (children && children.length > 0) {
        newPath.push({ level: index + 2, label: `תת קטגוריה (רמה ${index + 2})`, options: children, selected: '' });
      }
    } catch (e) { console.error(e); }
    setCategoriesPath(newPath);

    // שליפת תיקיית שמע לפי רב + קטגוריה שנבחרה
    const rabbiId = editedLesson?.rabbi?.data?.documentId || editedLesson?.rabbi?.documentId || editedLesson?.rabbi?.id;
    if (rabbiId) {
      const mainCatId = newPath[0]?.selected;
      const lastSub = [...newPath].slice(1).reverse().find(c => c.selected);
      const params: any = { rabbiDocumentId: rabbiId };
      if (lastSub?.selected) params.subCategoryDocumentId = lastSub.selected;
      else if (mainCatId) params.mainCategoryDocumentId = mainCatId;
      axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/audio-dirs`, { params })
        .then(res => {
          setSuggestedFolders(res.data);
          if (res.data.length === 1) {
            setEditedLesson((prev: any) => ({ ...prev, AudioDir: res.data[0] }));
            fetchPdfFiles(res.data[0]);
            fetchSuggestedFileName(res.data[0]);
          }
        })
        .catch(() => {});
    }
  };

  const handleUpdate = async () => {
    try {
      const docId = editedLesson.documentId;
      if (!docId) { alert("לא נמצא מזהה (documentId) לעדכון"); return; }

      let mainCatId = editedLesson.main_category?.data?.documentId || editedLesson.main_category?.documentId || null;
      let subCatId = editedLesson.sub_category?.data?.documentId || editedLesson.sub_category?.documentId || null;
      if (categoriesPath.length > 0) {
        if (categoriesPath[0].selected) mainCatId = categoriesPath[0].selected;
        const lastSelectedSub = [...categoriesPath].slice(1).reverse().find(c => c.selected);
        if (lastSelectedSub) subCatId = lastSelectedSub.selected;
      }

      const youtubeIdRaw = editedLesson.youtube_id || '';
      const youtubeIdMatch = youtubeIdRaw.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : (youtubeIdRaw.length === 11 ? youtubeIdRaw : null);

      const payload = {
        data: {
          title: editedLesson.title,
          duration: editedLesson.duration,
          lesson_date_hebrew: editedLesson.lesson_date_hebrew,
          lesson_date_gregorian: editedLesson.lesson_date_gregorian,
          AudioDir: editedLesson.AudioDir,
          AudioFileName: editedLesson.AudioFileName,
          PdfFileName: getPdfList(editedLesson)[0] || null,
          PdfFiles: getPdfList(editedLesson),
          youtube_id: youtubeId,
          rabbi: editedLesson.rabbi?.documentId || editedLesson.rabbi?.id || null,
          main_category: mainCatId,
          sub_category: subCatId
        }
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/lessons/${docId}${isDraft ? '?status=draft' : ''}`, payload);

      // אם יש youtube_id ו-AudioDir ו-AudioFileName → הרץ המרה
      // אם קובץ השמע כבר קיים בשרת — מדלגים על ההמרה ומעדכנים רק את הנתונים
      let audioAlreadyExists = false;
      if (youtubeId && editedLesson.AudioDir && editedLesson.AudioFileName) {
        try {
          const existsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/audio-exists`, {
            params: { audioDir: editedLesson.AudioDir, audioFileName: editedLesson.AudioFileName },
          });
          audioAlreadyExists = !!existsRes.data?.exists;
        } catch { /* לא הצלחנו לבדוק — ממשיכים להמרה כרגיל */ }
      }

      if (youtubeId && editedLesson.AudioDir && editedLesson.AudioFileName && !audioAlreadyExists) {
        setConverting(true);
        setConvertStage('מתחיל המרה');
        try {
          const startRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/convert-audio`, {
            documentId: docId,
            audioDir: editedLesson.AudioDir,
            audioFileName: editedLesson.AudioFileName,
            youtubeId,
          });

          // ההמרה רצה ברקע בשרת (שיעור של שעה לוקח כמה דקות),
          // לכן מושכים את הסטטוס עד שהיא מסתיימת במקום להניח שהצליחה
          const jobKey = startRes.data?.jobKey || docId;

          if (onConvertChange) {
            // ההמרה רצה ברקע: סוגרים את החלון מיד ומעדכנים את התגית בשורה עד הסיום
            onConvertChange(docId, { status: 'running', stage: 'מתחיל המרה' });
            pollConvertStatus(jobKey, (stage) => onConvertChange(docId, { status: 'running', stage }))
              .then((final) => onConvertChange(docId, { status: final.status, error: final.error }))
              .catch((err) => onConvertChange(docId, { status: 'failed', error: err?.message }));
            onSaveSuccess();
            onClose();
            return;
          }

          const finalStatus = await pollConvertStatus(jobKey);

          if (finalStatus.status === 'failed') {
            alert(`השיעור נשמר אך ההמרה נכשלה:\n${finalStatus.error || 'שגיאה לא ידועה'}`);
          } else if (finalStatus.status === 'timeout') {
            alert('השיעור נשמר. ההמרה עדיין רצה ברקע בשרת — בדקי בעוד כמה דקות אם הקובץ הגיע.');
          }
        } catch (convertErr: any) {
          alert(`השיעור נשמר אך ההמרה נכשלה: ${convertErr.response?.data?.error?.message || convertErr.message}`);
        } finally {
          setConverting(false);
          setConvertStage('');
        }
      }

      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error('Update Error:', error.response?.data || error);
      alert(`שגיאה בשמירה: ${error.response?.data?.error?.message || "בדקי את שדות החובה בסטרפי"}`);
    }
  };

  if (!editedLesson) return null;

  // --- הצעות תיקייה ---
  const curDir: string = editedLesson.AudioDir || '';
  const linkDir = linkInfo?.audioDir || '';
  let dirOptions: HintOption[] = [];
  if (linkDir) {
    if (curDir) {
      // שדה מלא: מציעים רק ב"בדוק שוב", ורק אם יש התנגשות
      if (hintsForced && normPath(curDir) !== normPath(linkDir)) {
        dirOptions = [
          { label: 'בשדה כעת', value: curDir },
          { label: 'מהקישור ביוטיוב', value: linkDir },
        ];
      }
    } else {
      const dbMatch = suggestedFolders.find(f => normPath(f) === normPath(linkDir));
      const dbSingle = suggestedFolders.length === 1 ? suggestedFolders[0] : '';
      if (dbSingle && !dbMatch) {
        dirOptions = [
          { label: 'לפי ה-DB (הרב והקטגוריה)', value: dbSingle },
          { label: 'מהקישור ביוטיוב', value: linkDir },
        ];
      } else {
        dirOptions = [{ label: dbMatch ? 'מהקישור ביוטיוב (תואם ל-DB)' : 'מהקישור ביוטיוב', value: dbMatch || linkDir }];
      }
    }
  }

  // --- הצעות PDF (רק כשהתיקייה ידועה) ---
  const curPdfs: string[] = getPdfList(editedLesson);
  const latestForDir = pdfLatest && normPath(pdfLatest.dir) === normPath(curDir) ? pdfLatest : null;
  let pdfOptions: HintOption[] = [];
  if (curDir && (curPdfs.length === 0 || hintsForced)) {
    const cands: HintOption[] = [];
    // שם הקובץ מהקישור שייך לתיקייה שבקישור — לא מציעים אותו אם נבחרה תיקייה אחרת
    if (linkInfo?.pdfFileName && (!linkDir || normPath(linkDir) === normPath(curDir))) {
      const inDir = latestForDir ? latestForDir.files.some(f => normName(f) === normName(linkInfo.pdfFileName)) : true;
      cands.push({
        label: 'מהקישור ביוטיוב',
        value: linkInfo.pdfFileName,
        note: inDir ? undefined : 'הקובץ לא נמצא בתיקייה בשרת המדיה',
      });
    }
    if (latestForDir?.latest) {
      const latest = latestForDir.latest;
      const when = latest.date ? ` (${latest.date.slice(0, 10)})` : '';
      const same = cands.find(c => normName(c.value) === normName(latest.fileName));
      if (same) same.label = 'מהקישור ביוטיוב (תואם לאחרון בתיקייה)';
      else cands.push({ label: `האחרון שהוכנס לתיקייה${when}`, value: latest.fileName });
    }
    pdfOptions = cands.filter(c => !curPdfs.some(f => normName(f) === normName(c.value)));
  }

  const applyDirHint = (value: string) => {
    setEditedLesson((prev: any) => ({ ...prev, AudioDir: value }));
    fetchPdfFiles(value);
    fetchSuggestedFileName(value);
  };

  return (
    <Dialog open={open} onClose={onClose} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 900, color: colors.gold, textAlign: 'center', pt: 3 }}>
        עריכת פרטי שיעור
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="כותרת השיעור"
            value={editedLesson.title || ''}
            onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
            sx={editFieldStyle}
          />

          <Stack direction="row" gap={3}>
            <TextField
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              label="תאריך לועזי"
              value={editedLesson.lesson_date_gregorian || ''}
              onChange={(e) => {
                const greg = e.target.value;
                const heb = gregorianToHebrew(greg);
                setEditedLesson({ ...editedLesson, lesson_date_gregorian: greg, ...(heb ? { lesson_date_hebrew: heb } : {}) });
              }}
              sx={editFieldStyle}
            />
            <TextField
              fullWidth
              label="תאריך עברי"
              value={editedLesson.lesson_date_hebrew || ''}
              onChange={(e) => {
                const heb = e.target.value;
                const greg = hebrewToGregorian(heb);
                setEditedLesson({ ...editedLesson, lesson_date_hebrew: heb, ...(greg ? { lesson_date_gregorian: greg } : {}) });
              }}
              sx={editFieldStyle}
            />
          </Stack>

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 'bold' }}>שיוך והיררכיה</Typography>
          </Divider>

          <TextField
            select
            fullWidth
            label="בחר רב"
            value={editedLesson.rabbi?.data?.documentId || editedLesson.rabbi?.documentId || editedLesson.rabbi?.id || ''}
            onChange={(e) => handleRabbiChange(e.target.value)}
            sx={editFieldStyle}
          >
            {lecturers.map((r) => (
              <MenuItem key={r.id} value={r.documentId || r.id}>
                {r.name || r.attributes?.name}
              </MenuItem>
            ))}
          </TextField>

          {categoriesPath.map((step, index) => (
            <Zoom in={true} key={index}>
              <TextField
                select
                fullWidth
                label={step.label}
                value={step.selected}
                sx={editFieldStyle}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              >
                {[...step.options]
                  .sort((a: any, b: any) =>
                    (a.name || a.attributes?.name || '').localeCompare(b.name || b.attributes?.name || '', 'he')
                  )
                  .map((opt: any) => (
                    <MenuItem key={opt.documentId} value={opt.documentId}>
                      {opt.name || opt.attributes?.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Zoom>
          ))}

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 'bold' }}>נתוני קובץ אודיו</Typography>
          </Divider>

<Stack direction="row" gap={3} sx={{ mt: 1, width: '100%' }}>
                <Autocomplete
              freeSolo
              sx={{ flex: 1 }}
              options={suggestedFolders}
              value={editedLesson.AudioDir || ''}
              onInputChange={(_, val, reason) => {
                setEditedLesson((prev: any) => ({ ...prev, AudioDir: val }));
                fetchPdfFiles(val);
                // 'reset' נורה גם כשה-Autocomplete נטען עם ערך קיים — אז אסור להציע ולדרוס
                if (reason !== 'reset') fetchSuggestedFileName(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="תיקיית יעד (AudioDir)"
                  sx={editFieldStyle}
                  inputProps={{ ...params.inputProps, dir: 'ltr' }}
                />
              )}
            />
            <TextField
              label="שם קובץ"
              value={editedLesson.AudioFileName || ''}
              onChange={(e) => setEditedLesson((prev: any) => ({ ...prev, AudioFileName: e.target.value }))}
              sx={[{ flex: 1 }, editFieldStyle]}
              inputProps={{ dir: 'ltr' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="בנה שם לפי הקבצים שכבר בתיקייה">
                      <span>
                        <IconButton
                          size="small"
                          disabled={!editedLesson.AudioDir || suggesting}
                          onClick={() => fetchSuggestedFileName(editedLesson.AudioDir, true)}
                        >
                          {suggesting
                            ? <CircularProgress size={16} sx={{ color: colors.gold }} />
                            : <AutoFixHighIcon fontSize="small" sx={{ color: colors.gold }} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          {!dismissedDir && dirOptions.length > 0 && (
            <HintCard
              title={dirOptions.length > 1 ? 'התיקייה לא תואמת בין הבדיקות — בחרי' : 'הצעה לתיקיית יעד'}
              options={dirOptions}
              onPick={(v) => { applyDirHint(v); setDismissedDir(true); }}
              onClose={() => setDismissedDir(true)}
            />
          )}

          {nameHint && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                px: 1.5, py: 1, borderRadius: '12px',
                border: '1px solid',
                borderColor: nameHint.exists ? '#e57373' : '#dcc9a0',
                bgcolor: nameHint.exists ? '#fdf3f3' : '#faf7f0',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', fontWeight: 700, color: nameHint.exists ? '#c62828' : '#8c6644' }}
                >
                  {nameHint.exists ? 'שם זה כבר קיים בתיקייה' : 'הצעה לשם הקובץ'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', overflowWrap: 'anywhere' }}
                >
                  {nameHint.suggested}
                </Typography>
              </Box>

              <Button
                size="small"
                variant="contained"
                onClick={applySuggestedName}
                sx={{
                  whiteSpace: 'nowrap', borderRadius: '8px', boxShadow: 'none',
                  bgcolor: nameHint.exists ? '#c62828' : colors.gold,
                  '&:hover': { bgcolor: nameHint.exists ? '#a61b1b' : '#b48a66', boxShadow: 'none' },
                }}
              >
                אישור
              </Button>

              <IconButton size="small" onClick={() => setNameHint(null)}>
                <CloseIcon fontSize="small" sx={{ color: COLORS.TEXT_GRAY }} />
              </IconButton>
            </Stack>
          )}

          <Stack direction="row" gap={3} sx={{ width: '100%' }}>
            <Autocomplete
              freeSolo
              sx={{ flex: 1 }}
              options={suggestedPdfs}
              multiple
              filterSelectedOptions
              autoSelect
              value={curPdfs}
              onChange={(_, val) => setEditedLesson({ ...editedLesson, PdfFiles: (val as string[]).map(v => v.trim()).filter(Boolean) })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="קבצי PDF (אפשר כמה)"
                  sx={editFieldStyle}
                  inputProps={{ ...params.inputProps, dir: 'ltr' }}
                />
              )}
            />
            <TextField
              label="קישור יוטיוב (youtube_id)"
              value={editedLesson.youtube_id || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, youtube_id: e.target.value })}
              sx={[{ flex: 1 }, editFieldStyle]}
              inputProps={{ dir: 'ltr' }}
            />
          </Stack>

          {!dismissedPdf && pdfOptions.length > 0 && (
            <HintCard
              title={pdfOptions.length > 1 ? 'קובץ ה-PDF לא תואם בין הבדיקות — בחרי' : 'הצעה לקובץ PDF'}
              options={pdfOptions}
              onPick={(v) => { setEditedLesson((prev: any) => ({ ...prev, PdfFiles: [...getPdfList(prev), v] })); setDismissedPdf(true); }}
              onClose={() => setDismissedPdf(true)}
            />
          )}

          {editedLesson.youtube_id && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                size="small"
                onClick={recheckHints}
                disabled={hintsLoading}
                startIcon={hintsLoading ? <CircularProgress size={14} sx={{ color: colors.gold }} /> : <RefreshIcon fontSize="small" />}
                sx={{ color: COLORS.BROWN_DARK, fontWeight: 700 }}
              >
                בדוק תיקייה ו-PDF מתיאור היוטיוב
              </Button>
              {hintsMsg && <Typography variant="caption" sx={{ color: COLORS.TEXT_GRAY }}>{hintsMsg}</Typography>}
            </Stack>
          )}

          <TextField
            fullWidth
            label="אורך השיעור"
            value={editedLesson.duration || ''}
            onChange={(e) => setEditedLesson({ ...editedLesson, duration: e.target.value })}
            sx={editFieldStyle}
            inputProps={{ dir: 'ltr' }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>
          ביטול
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained"
          disabled={converting}
          sx={{ 
            bgcolor: '#000', 
            color: colors.gold,
            borderRadius: '8px', 
            px: 4, 
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
            transition: '0.3s'
          }}
        >
          {converting ? (convertStage ? `${convertStage}...` : 'ממיר ומעלה...') : 'שמור שינויים'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLessonDialog;