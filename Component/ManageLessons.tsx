
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip, 
  InputAdornment, Chip, Stack, Button, 
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  BG_CREAM: '#fdfbe7',
  TEXT_GRAY: '#5f6368'
};

const ManageLessons = () => {
     const [lecturers, setLecturers] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 30;
const [openEdit, setOpenEdit] = useState(false);//אחראי על הדילוג
const [selectedLesson, setSelectedLesson] = useState<any>(null);//שומר את הפרטים של השיעור
const handleEditClick = (lesson: any) => {
  const attributes = lesson.attributes || lesson;
  
  setSelectedLesson({
    ...attributes,
    // חשוב: ב-Strapi 5 המזהה לעדכון נמצא בשדה documentId
    id: lesson.documentId || lesson.id 
  });
  setOpenEdit(true);
};


// פונקציית השליפה המדויקת מהקוד שצירפת

  const fetchLessons = async (page: number) => {
    try {
      setLoadingLessons(true);
      // שימוש ב-populate=* כפי שמופיע בקוד שלך כדי למשוך את נתוני הרב והתאריכים
      let url = `http://localhost:1337/api/lessons?populate=*&sort=lesson_date_gregorian:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      
      const response = await axios.get(url);
      setLessons(response.data.data || []);
      console.log("hhhhhhhhhhhhhhhhh",lessons);
      
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };
const handleUpdateLesson = async()=>{
    try {
const docId = selectedLesson.id; // עכשיו זה מכיל את ה-documentIdconsole.log("lessonId",lessonId);

    if (!docId) {
      alert("שגיאה: לא נמצא מזהה לשיעור");
      return;
    }

    const updatedData = {
      data: {
        title: selectedLesson.title,
        duration: selectedLesson.duration,
        lesson_date_hebrew: selectedLesson.lesson_date_hebrew,
        lesson_date_gregorian: selectedLesson.lesson_date_gregorian,
        AudioDir: selectedLesson.AudioDir,
       rabbi: selectedLesson.rabbi?.documentId || selectedLesson.rabbi?.id || null,
        AudioFileName: selectedLesson.AudioFileName,
        // הערה: אם את רוצה לעדכן גם את הרב, צריך לשלוח את ה-ID שלו
      }
    };
await axios.put(`http://localhost:1337/api/lessons/${docId}`, updatedData);   setOpenEdit(false);      // סגירת החלון המוקפץ
    fetchLessons(currentPage); // רענון הטבלה כדי להציג את הנתונים החדשים
    
    // אופציונלי: הודעת אישור קטנה
    console.log("השיעור עודכן בהצלחה!");

  } catch (error) {
    // אם הייתה שגיאה (למשל השרת כבוי או הנתונים לא תקינים)
    console.error('שגיאה בעדכון השיעור:', error);
    alert('חלה שגיאה בשמירת הנתונים');
  }
};
const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/rabbis?fields[0]=name');
      setLecturers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchLessons(1);
    fetchLecturers()
  }, []);
const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    direction: 'rtl' as const,
    '& fieldset': { textAlign: 'right' as const },
    '&.Mui-focused fieldset': { borderColor: COLORS.BROWN_DARK },
  },
  '& .MuiInputLabel-root': {
    right: 16,
    left: 'auto',
    transformOrigin: 'right',
    '&.Mui-focused': { color: COLORS.BROWN_DARK },
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(0, -9px) scale(0.75)',
    right: 10,
  }
};
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      
      <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, mb: 4 }}>
        ניהול שיעורים
      </Typography>

      {/* שורת חיפוש עם מרווח */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: COLORS.BG_CREAM }}>
        <TextField 
          fullWidth
          placeholder="חפשי לפי כותרת או רב..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: COLORS.BROWN_DARK }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: '#fff' }
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow >
              {/* שינוי צבע הכתב ללבן (#ffffff) כדי שתראי את הכותרות */}
              <TableCell align="center"   sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>פרטי השיעור</TableCell>
              <TableCell align="center"  sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>תאריכים</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>משך</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700, textAlign: 'center' }}>צפיות</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>נתוני אודיו</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700, textAlign: 'center' }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingLessons ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>טוען נתונים...</TableCell></TableRow>
            ) : (
              lessons.map((lesson) => {
               const attr = lesson.attributes || lesson;
               const realDbId = lesson.id;
                const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi,duration } = attr;
   const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "הרב מרדכי עטייה";
                // חילוץ נתוני הרב כפי שעשית בקוד ה-AllLessons
// console.log(`Original ID: ${lesson.id}, Title: ${attr.title}`);
                return (
                  <TableRow key={lesson.id} hover>
                    <TableCell  sx={{textAlign: 'justify'}}>
                      <Typography alignItems="center" sx={{textAlign: 'justify',fontWeight: 700 }}>{attr.title || `שיעור ${lesson.id}`}</Typography>
                      <Typography variant="caption" sx={{textAlign: 'justify', color: COLORS.BROWN_LIGHT, fontWeight: 600 }}>
                        {rabbiName} | ID: {realDbId}
                      </Typography>
                    </TableCell>
<TableCell sx={{ py: 2 }}> {/* צמצום הגובה של כל השורה בטבלה */}
  <Stack spacing={0.8}> {/* ריווח כמעט אפסי בין שתי שורות התאריכים */}
    
    {/* שורה 1: תאריך עברי */}
    <Stack direction="row"  alignItems="center" gap={1}>
      <CalendarTodayIcon sx={{ fontSize: 14, color: '#000' }} />
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#000', 
          lineHeight: 1, // מבטל את הרווח הלבן מעל ומתחת לטקסט
          display: 'inline-block', // שינוי מ-block ל-inline-block
      whiteSpace: 'nowrap'    // מונע מהטקסט לרדת שורה גם אם אין מקום
        }}
      >
        {attr.lesson_date_hebrew || '-'}
      </Typography>
    </Stack>

    {/* שורה 2: תאריך לועזי */}
    <Stack direction="row" alignItems="center" gap={1}>
      <CalendarTodayIcon sx={{ fontSize: 14, color: 'gray' }} />
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary', 
          lineHeight: 1, 
          display: 'block' 
        }}
      >
        {attr.lesson_date_gregorian || '-'}
      </Typography>
    </Stack>
    
  </Stack>
</TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="body2">{attr.duration || '00:00'}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{attr.views || 0}</Typography>
                    </TableCell>

                 <TableCell sx={{ textAlign: 'justify' }}>
  <Stack spacing={1}>
<TextField 
  size="small" 
  label="תיקייה" 
  defaultValue={attr.AudioDir || ''} 
  sx={{ 
    width: 130,
    // הגדרות עבור תיבת הקלט והמסגרת
    '& .MuiOutlinedInput-root': {
      direction: 'rtl', // קריטי כדי שהחיתוך במסגרת יהיה בצד ימין
      '& input': {
        textAlign: 'right', // יישור הטקסט שבפנים לימין
      },
      '& fieldset': {
        textAlign: 'right', // הצמדת החיתוך (החור) במסגרת לימין
      },
      '&.Mui-focused fieldset': {
        borderColor: COLORS.BROWN_DARK, // צבע חום בפוקוס
      },
    },
    // הגדרות עבור הלייבל (המילה "תיקייה")
    '& .MuiInputLabel-root': {
      right: 20, // מיקום התחלתי בצד ימין
      left: 'auto',
      transformOrigin: 'right', // האנימציה תתכווץ לימין
    //   fontSize: '0.85rem',
      '&.Mui-focused': {
        color: COLORS.BROWN_DARK,
      },
    },
    // תיקון מיקום הלייבל כשהוא במצב "מכווץ" (למעלה)
    '& .MuiInputLabel-shrink': {
      right: 20, 
      transform: 'translate(0, -9px) scale(0.75)', // מוודא שהוא יושב בדיוק בתוך החיתוך
    },
  }} 
/>
<TextField 
  size="small" 
  label="קובץ" 
  defaultValue={attr.AudioFileName || ''} 
  //dir="rtl" // חשוב מאוד ליישור ראשוני
  sx={{ 
    width: 130,
    '& .MuiOutlinedInput-root': {
      direction: 'rtl', // מעביר את כל הרכיב למצב ימין לשמאל
      '& fieldset': {
        textAlign: 'right', // מעביר את ה"חור" במסגרת לצד ימין
      },
      '&.Mui-focused fieldset': {
        borderColor: COLORS.BROWN_DARK,
      },
    },
    '& .MuiInputLabel-root': {
      right: 20, // מיקום התחלתי של המילה בימין
      left: 'auto',
      transformOrigin: 'right', // מבטיח שהאנימציה תהיה לכיוון ימין
      '&.Mui-focused': {
        color: COLORS.BROWN_DARK,
      },
    },
    '& .MuiInputLabel-shrink': {
      // תיקון המיקום כשהמילה למעלה כדי שלא תתנגש בקו
      transform: 'translate(0, -9px) scale(0.75)', 
      right: 10,
    }
  }} 
/>
  </Stack>
</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                        <Tooltip title="שמור שינויים">
                          <IconButton sx={{ color: COLORS.BROWN_DARK }}><SaveIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <IconButton 
                          onClick={() => attr.youtube_id && window.open(`https://youtube.com/watch?v=${attr.youtube_id}`, '_blank')}
                          disabled={!attr.youtube_id}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                        <Tooltip title="ערוך פרטים">
  <IconButton 
  onClick={() => {
handleEditClick(lesson.attributes || lesson)
    }}
    sx={{ color: COLORS.SIDEBAR_BROWN }}
  >
    <EditIcon fontSize="small" />
  </IconButton>
</Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* כפתורי ניווט (Pagination) - כדי שתוכלי לעבור בין 14,000 השיעורים */}
      <Stack direction="row" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 4 }}>
        <Button disabled={currentPage <= 1} onClick={() => fetchLessons(currentPage - 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הקודם</Button>
        <Typography fontWeight="bold">עמוד {currentPage} מתוך {totalPages}</Typography>
        <Button disabled={currentPage >= totalPages} onClick={() => fetchLessons(currentPage + 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הבא</Button>
      </Stack>
     <Dialog 
  open={openEdit} 
  onClose={() => setOpenEdit(false)} 
  dir="rtl"
  fullWidth
  maxWidth="sm"
  PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
>
  <DialogTitle sx={{ 
    fontWeight: 900, 
    color: COLORS.SIDEBAR_BROWN, 
    fontSize: '1.5rem',
    textAlign: 'center',
    pb: 1
  }}>
    עריכת פרטי שיעור
  </DialogTitle>

  <DialogContent>
    <Stack spacing={3} sx={{ mt: 2 }}>
      
      {/* כותרת השיעור */}
 <TextField
  fullWidth
  label="כותרת השיעור"
  value={selectedLesson?.title || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any) => ({
      ...prev,
      title: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>




      <Stack direction="row" spacing={2}>
        {/* שם הרב */}
   <TextField
  select
  fullWidth
  label="בחר רב"
  // אנחנו בודקים את ה-documentId של הרב המשויך לשיעור
  value={selectedLesson?.rabbi?.documentId || selectedLesson?.rabbi?.id || ''}
  onChange={(e) => {
    const selectedId = e.target.value;
    // מציאת המרצה הנבחר מתוך הרשימה שמשכנו
    const selectedLecturer = lecturers.find(l => (l.documentId || l.id) === selectedId);
    
    setSelectedLesson((prev: any) => ({
      ...prev,
      rabbi: {
        documentId: selectedId,
        id: selectedId,
        // מעדכנים את השם לתצוגה זמנית בדיאלוג
        name: selectedLecturer?.attributes?.name || selectedLecturer?.name 
      }
    }));
  }}
  sx={editFieldStyle}
>
  {lecturers.map((lecturer) => (
    <MenuItem key={lecturer.id} value={lecturer.documentId || lecturer.id}>
      {/* בסטרפי 5 לפעמים זה ב-attributes ולפעמים ישירות בתוך האובייקט */}
      {lecturer.attributes?.name || lecturer.name}
    </MenuItem>
  ))}
</TextField>

        {/* משך זמן */}
      <TextField
  label="משך (HH:MM)"
  value={selectedLesson?.duration || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any)=> ({
      ...prev,
      duration: e.target.value,
    }))
  }
  sx={{ ...editFieldStyle, width: '150px' }}
/>

      </Stack>

      <Stack direction="row" spacing={2}>
        {/* תאריך עברי */}
       <TextField
  fullWidth
  label="תאריך עברי"
  value={selectedLesson?.lesson_date_hebrew || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any) => ({
      ...prev,
      lesson_date_hebrew: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>

        {/* תאריך לועזי */}
       <TextField
  fullWidth
  type="date"
  InputLabelProps={{ shrink: true }}
  label="תאריך לועזי"
  value={selectedLesson?.lesson_date_gregorian || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any) => ({
      ...prev,
      lesson_date_gregorian: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>

      </Stack>

      <Typography variant="subtitle2" sx={{ color: COLORS.BROWN_LIGHT, fontWeight: 'bold', mb: -1 }}>נתוני אודיו:</Typography>
      
      <Stack direction="row" spacing={2}>
       <TextField
  fullWidth
  label="תיקייה"
  value={selectedLesson?.AudioDir || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any) => ({
      ...prev,
      AudioDir: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>

        <TextField
  fullWidth
  label="שם קובץ"
  value={selectedLesson?.AudioFileName || ''}
  onChange={(e) =>
    setSelectedLesson((prev: any) => ({
      ...prev,
      AudioFileName: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>

      </Stack>
    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
    <Button 
      onClick={() => setOpenEdit(false)} 
      variant="outlined"
      sx={{ color: COLORS.TEXT_GRAY, borderColor: COLORS.TEXT_GRAY, borderRadius: '10px' }}
    >
      ביטול
    </Button>
    <Button 
      onClick={handleUpdateLesson} 
      variant="contained" 
      sx={{ 
        bgcolor: COLORS.SIDEBAR_BROWN, 
        px: 4,
        borderRadius: '10px',
        fontWeight: 'bold',
        '&:hover': { bgcolor: COLORS.BROWN_DARK } 
      }}
    >
      שמור שינויים
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default ManageLessons;