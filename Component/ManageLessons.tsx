
import React, { useState, useEffect  } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip, 
  InputAdornment,  Stack, Button, 

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import EditLessonDialog from './EditLessonDialog';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // הגרסה עם הקווי מתאר, דומה מאוד לצילום
import DeleteActionPopover from './DeleteActionPopover';
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
 const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
const [openEdit, setOpenEdit] = useState(false);//אחראי על הדילוג
const handleEditClick = (lesson: any) => {
  console.log("נתוני השיעור שנלחץ:", lesson); // תבדקי בקונסול מה השם של השדה (id, id_מספר, documentId?)
  const attributes = lesson.attributes || lesson;
  
  setSelectedLesson({
    ...attributes,
    // חשוב: ב-Strapi 5 המזהה לעדכון נמצא בשדה documentId
    id: lesson.documentId || lesson.id 
  });
  setOpenEdit(true);
};

const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, lesson: any) => {
  setAnchorEl(event.currentTarget);
  setSelectedLesson(lesson);
};

const handleClosePopover = () => {
  setAnchorEl(null);
  setSelectedLesson(null);
};

 const fetchLessons = async (page: number) => {
  try {
    setLoadingLessons(true);

    // 1. קריאה ל-Endpoint המהיר עם פרמטרים של עמוד וגודל עמוד
    // ה-URL כעת קצר ונקי משמעותית
    const url = `http://localhost:1337/api/lessons/fast?page=${page}&pageSize=${pageSize}`;
    
    const response = await axios.get(url);

    // 2. עדכון רשימת השיעורים
    // מכיוון שה-Controller מחזיר עכשיו { data: [...] }, אנחנו ניגשים ל-response.data.data
    // האובייקטים כאן הם "שטוחים" (ללא attributes), למשל: lesson.title
    const lessonsData = response.data.data || [];
    setLessons(lessonsData);

    // 3. עדכון מערכת הדיפדוף (Pagination)
    // ה-Controller מחזיר אובייקט meta זהה למבנה של סטרפי
    const pagination = response.data.meta?.pagination;
    if (pagination) {
      setTotalPages(pagination.pageCount); // סך כל הדפים
      setCurrentPage(page);                // העמוד הנוכחי
    }

    console.log("נתוני SQL מהירים שהתקבלו:", lessonsData);
    console.log("מידע על דיפדוף:", pagination);

  } catch (error) {
    console.error('שגיאה בשליפת שיעורים מה-SQL המהיר:', error);
  } finally {
    setLoadingLessons(false);
  }
};
const getCategoryDisplay = (row: any) => {
  const attr = row?.attributes || row;
  if (!attr) return "ללא נתונים";

  const names: string[] = [];

  // 1. הוספת הקטגוריה הראשית (השורש)
  if (attr.main_category?.data?.attributes?.name) {
    names.push(attr.main_category.data.attributes.name);
  }

  // 2. פונקציה פנימית לאיסוף שמות מהתת-קטגוריות (אבא, סבא וכו')
  const collectSubNames = (subData: any) => {
    const currentAttr = subData?.attributes;
    if (!currentAttr) return;

    // אם יש הורה (Parent), נלך אליו קודם כדי לשמור על סדר היררכי
    if (currentAttr.parent_sub?.data) {
      collectSubNames(currentAttr.parent_sub.data);
    }
    
    // הוספת השם של הקטגוריה הנוכחית
    if (currentAttr.name) {
      names.push(currentAttr.name);
    }
  };

  // הפעלת האיסוף מהתת-קטגוריה שמשויכת לשיעור
  collectSubNames(attr.sub_category?.data);

  // 3. ניקוי כפילויות (במקרה ששם ה"ראשית" זהה לשם ה"אבא") וחיבור בחיצים
  const uniqueNames = names.filter((name, index) => names.indexOf(name) === index);

  return uniqueNames.length > 0 ? uniqueNames.join(" » ") : "ללא קטגוריה";
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
//   const getCategoryPath = (category: any): string => {
//   if (!category || (!category.data && !category.attributes)) return "ללא קטגוריה";
  
//   const data = category.data || category;
//   const attr = data.attributes || data;
//   const name = attr?.name || "";
//   const parent = attr?.parent;

//   if (parent && parent.data) {
//     return `${getCategoryPath(parent.data)} / ${name}`;
//   }
  
//   return name;
// };
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
  <Box sx={{ 
    p: { xs: 2, md: 4 }, 
    direction: 'rtl', 
    bgcolor: '#f8f9fa', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center' // ממרכז את התוכן
  }}>
    
    {/* קונטיינר פנימי שמגביל את הרוחב המקסימלי ויוצר רווחים בצדדים */}
    <Box sx={{ width: '100%', maxWidth: '1400px' }}>  
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
<TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 1000 }}> {/* מבטיח שהטבלה לא תימחץ מדי */}
   
          <TableHead>
            <TableRow >
              {/* שינוי צבע הכתב ללבן (#ffffff) כדי שתראי את הכותרות */}
              <TableCell align="center"   sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>פרטי השיעור</TableCell>
              <TableCell align="center"  sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>תאריכים</TableCell>
             <TableCell align="right" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 , textAlign: 'center' }}>קטגוריה</TableCell>
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
<TableCell align="center">
  {getCategoryDisplay(attr)}
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
  InputProps={{
    readOnly: true,
  }}
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
  InputProps={{
    readOnly: true,
  }}
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
<TextField 
  size="small" 
  label="קובץ PDF" 
  defaultValue={attr.AudioFileName || ''} 
  InputProps={{
    readOnly: true,
  }}
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
                      <Tooltip title="מחיקת שיעור">
 <IconButton onClick={(e) => handleOpenPopover(e, lesson)}>
  <DeleteOutlineIcon sx={{ color: '#d32f2f' }} />
</IconButton>
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
handleEditClick(lesson)
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

      {/* פייג'ינציה */}
      {/* ... הקוד הקיים ... */}
    </Box>

      {/* כפתורי ניווט (Pagination) - כדי שתוכלי לעבור בין 14,000 השיעורים */}
      <Stack direction="row" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 4 }}>
        <Button disabled={currentPage <= 1} onClick={() => fetchLessons(currentPage - 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הקודם</Button>
        <Typography fontWeight="bold">עמוד {currentPage} מתוך {totalPages}</Typography>
        <Button disabled={currentPage >= totalPages} onClick={() => fetchLessons(currentPage + 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הבא</Button>
      </Stack>
  <DeleteActionPopover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={handleClosePopover}
  lesson={selectedLesson} // מעבירים את כל האובייקט
  onSuccess={() => fetchLessons(currentPage)} // פשוט מרעננים את הטבלה
/>
   <EditLessonDialog 
  open={openEdit}                // מעביר את מצב הפתיחה/סגירה
  onClose={() => setOpenEdit(false)} // מעביר פונקציה שסוגרת את הדיאלוג
  lesson={selectedLesson}        // מעביר את נתוני השיעור שנבחר
  lecturers={lecturers}          // מעביר את רשימת הרבנים
  onSaveSuccess={() => fetchLessons(currentPage)} // מעביר פונקציה שמרעננת את הטבלה אחרי שמירה
/>
    </Box>
  );
};

export default ManageLessons;