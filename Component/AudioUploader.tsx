import{ useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, CircularProgress, 
  MenuItem, Stack, Divider, Autocomplete, Zoom 
} from '@mui/material';
import axios from 'axios';
import { HDate } from '@hebcal/core'; // ייבוא הספרייה החדשה
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FolderIcon from '@mui/icons-material/Folder';
import { Snackbar, Alert } from '@mui/material'; // ודאי שהם מיובאים
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
};

const editFieldStyle = {
  mb: { xs: 1.5, sm: 2 },
  '& .MuiInputLabel-root': { right: 25, left: 'auto', transformOrigin: 'right' },
  '& .MuiInputLabel-shrink': { transform: 'translate(0, -1.5px) scale(0.75)', right: 20 },
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    '& fieldset': { textAlign: 'right' },
    '& input': { textAlign: 'right' },
  },
};

const AudioUploader = () => {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [categoriesPath, setCategoriesPath] = useState<any[]>([]);
  const [suggestedFolders, setSuggestedFolders] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [selectedRabbi, setSelectedRabbi] = useState('');
const [errors, setErrors] = useState<any>({});
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [lessonData, setLessonData] = useState({
    title: '',
    lesson_date_gregorian: new Date().toISOString().split('T')[0],
    lesson_date_hebrew: '',
    audioDir: '', 
    audioFileName: '',
    pdfFileName: '' 
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
    axios.get('http://localhost:1337/api/rabbis').then(res => setLecturers(res.data.data || []));
  }, []);

  useEffect(() => {
    if (!selectedRabbi) {
      setCategoriesPath([]);
      setSuggestedFolders([]);
      return;
    }

    axios.get(`http://localhost:1337/api/categories-mains?filters[rabbi][documentId][$eq]=${selectedRabbi}`)
      .then(res => setCategoriesPath([{ level: 1, label: 'קטגוריה ראשית', options: res.data.data || [], selected: '' }]));

axios.get(`http://localhost:1337/api/lessons/audio-dirs`, {
    params: {
      rabbiDocumentId: selectedRabbi
    }
  })
  .then(res => {
    // כאן res.data הוא כבר מערך של מחרוזות בזכות ה-SQL שעשינו
    setSuggestedFolders(res.data);
    console.log("Found folders:", res.data.length);
  })
  .catch(err => {
    console.error("Error fetching audio dirs:", err);
    setSuggestedFolders([]); // איפוס במקרה של שגיאה
  });

}, [selectedRabbi]);

  const handleCategoryChange = async (index: number, documentId: string) => {
    const updatedPath = [...categoriesPath];
    updatedPath[index].selected = documentId;
    const newPath = updatedPath.slice(0, index + 1);
    
    try {
      const response = await axios.get(`http://localhost:1337/api/categories-subs?filters[parent_sub][documentId][$eq]=${documentId}`);
      let children = response.data.data;
      if (index === 0 && (!children || children.length === 0)) {
        const subRes = await axios.get(`http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${documentId}&filters[parent_sub][documentId][$null]=true`);
        children = subRes.data.data;
      }
      if (children && children.length > 0) {
        newPath.push({ level: index + 2, label: `תת קטגוריה`, options: children, selected: '' });
      }
    } catch (e) { console.error(e); }
    setCategoriesPath(newPath);
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
        
        // קישור לישויות אחרות (Relations)
        rabbi: selectedRabbi, 
        main_category: categoriesPath[0]?.selected || null,
        sub_category: categoriesPath.length > 1 ? categoriesPath[categoriesPath.length - 1].selected : null,
        
        views: 0
      }
    };

    console.log("Sending data to Strapi:", dataToSend);

    // 5. שליחת הבקשה לשרת
    const response = await axios.post('http://localhost:1337/api/lessons', dataToSend);
    
    // 6. הצגת הודעת הצלחה ב-Snackbar ואיפוס חלקי של הטופס
    setSnackbar({ 
      open: true, 
      message: 'השיעור נשמר בהצלחה בבסיס הנתונים!', 
      severity: 'success' 
    });

    // איפוס השדות כדי שיהיה אפשר להזין שיעור חדש מיד
    setLessonData({
      ...lessonData,
      title: '',
      audioFileName: '',
      pdfFileName: ''
    });

  } catch (err: any) {
    // 7. טיפול בשגיאות מהשרת (400/500) והצגת הודעה מתאימה
    const errorMessage = err.response?.data?.error?.message || 'שגיאה בתקשורת עם השרת';
    console.error("Save error details:", err.response?.data || err);
    
    setSnackbar({ 
      open: true, 
      message: `שגיאה בשמירה: ${errorMessage}`, 
      severity: 'error' 
    });
  } finally {
    // 8. כיבוי ה-Spinner בכפתור
    setLoading(false);
  }
};
return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, direction: 'rtl' }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', width: '100%', maxWidth: '650px', border: '1px solid #f0f0f0' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 900, color: COLORS.SIDEBAR_BROWN, textAlign: 'center' }}>
          רישום שיעור חדש
        </Typography>

        <Stack spacing={1}>
          {/* כותרת השיעור */}
          <Box>
            <TextField 
              fullWidth 
              label="כותרת השיעור" 
              sx={editFieldStyle} 
              value={lessonData.title} 
              onChange={(e) => {
                setLessonData({...lessonData, title: e.target.value});
                if (errors.title) setErrors({...errors, title: ''});
              }}
            />
            {errors.title && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1.5, mb: 1.5, mr: 2 }}>
                {errors.title}
              </Typography>
            )}
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
              label="תאריך לועזי" 
              InputLabelProps={{ shrink: true }} 
              sx={editFieldStyle} 
              value={lessonData.lesson_date_gregorian} 
              onChange={(e) => setLessonData({...lessonData, lesson_date_gregorian: e.target.value})} 
            />
            <TextField 
              fullWidth 
              label="תאריך עברי" 
              sx={editFieldStyle} 
              value={lessonData.lesson_date_hebrew} 
              InputProps={{ readOnly: true }} 
            />
          </Stack>

          <Divider sx={{ my: 2 }}>שיוך רב וקטגוריות</Divider>

          {/* בחירת רב */}
          <Box>
            <TextField 
              select 
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

          <Divider sx={{ my: 2 }}>פרטי קובץ</Divider>

          {/* תיקיית יעד */}
          <Box>
            <Autocomplete
              freeSolo
              options={suggestedFolders}
              value={lessonData.audioDir}
              onInputChange={(_, val) => {
                setLessonData({...lessonData, audioDir: val});
                if (errors.audioDir) setErrors({...errors, audioDir: ''});
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="תיקיית יעד (AudioDir)" 
                  sx={editFieldStyle} 
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
            <TextField 
              fullWidth 
              label="שם קובץ אודיו" 
              sx={editFieldStyle} 
              value={lessonData.audioFileName} 
              onChange={(e) => {
                setLessonData({...lessonData, audioFileName: e.target.value});
                if (errors.audioFileName) setErrors({...errors, audioFileName: ''});
              }} 
              InputProps={{ startAdornment: <AudioFileIcon sx={{ color: COLORS.SIDEBAR_BROWN, ml: 1 }} /> }}
            />
            {errors.audioFileName && (
              <Typography sx={{ color: 'red', fontSize: '0.75rem', mt: -1, mb: 1, mr: 2 }}>
                {errors.audioFileName}
              </Typography>
            )}
          </Box>

          <TextField 
            fullWidth 
            label="שם קובץ PDF" 
            sx={editFieldStyle} 
            value={lessonData.pdfFileName} 
            onChange={(e) => setLessonData({...lessonData, pdfFileName: e.target.value})} 
            InputProps={{ startAdornment: <PictureAsPdfIcon sx={{ color: '#d32f2f', ml: 1 }} /> }}
          />

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSubmit} 
            disabled={loading} 
            sx={{ 
              py: 2, 
              mt: 3, 
              borderRadius: '16px', 
              bgcolor: COLORS.SIDEBAR_BROWN, 
              fontWeight: 800, 
              '&:hover': { bgcolor: COLORS.BROWN_DARK } 
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'שמור בשרת'}
          </Button>
        </Stack>
      </Paper>

      {/* הודעת הצלחה/שגיאה בצד שמאל למעלה */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ mt: 2, ml: 2 }} // ריווח קל מהפינה
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity as any} 
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AudioUploader;