import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip, 
DialogTitle,
  DialogContent,
  Dialog,MenuItem,
  DialogActions,  InputAdornment, Stack, Button, Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add'; // במידה וגם הוא חסר
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// תוסיפי את השורה הזו (סביב שורה 20)
import SubCategoryTable from './SubCategoryTable';
import CategoryIcon from '@mui/icons-material/Category';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Pagination } from '@mui/material';
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  BG_CREAM: '#fdfbe7',
  TEXT_GRAY: '#5f6368'
};

const CategoryManager = () => {
  // נתוני דמו (Mock Data) רק כדי לראות את העיצוב
const [openRowId, setOpenRowId] = useState<string | number | null>(null);    const [mainCategories,setMainCategories ] = useState<any[]>([]);
    const [loadingMainCategories, setLoadingMainCategories] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 30;
    
    const handleToggleRow = (id: string) => {
  // אם לחצנו על שורה שכבר פתוחה - נסגור אותה. אם לא - נפתח את החדשה.
  setOpenRowId(prev => (prev === id ? null : id));
};
   const fetchMainCategories = async (page: number) => {
    try {
      setLoadingMainCategories(true);
      // שימוש ב-populate=* כפי שמופיע בקוד שלך כדי למשוך את נתוני הרב והתאריכים
// שליפת קטגוריות ראשיות בלבד (אלו שאין להן אבא)
// שימוש בנקודה (.) כדי לגשת לשדה בתוך הקשר
let url = `http://localhost:1337/api/categories-mains?populate=*&sort[0]=rabbi.Priority:asc&sort[1]=Priority:asc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`; 
 const response = await axios.get(url);
      setMainCategories(response.data.data || []);
console.log("mainCategories",
        response.data.data 
      );
      
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    
    } finally {
        console.log("mainCategories",
mainCategories      );
      setLoadingMainCategories(false);
    }
  };
  const [openEdit, setOpenEdit] = useState(false);//אחראי על הדילוג
  const [selectedMainCategories, setSelectedMainCategories] = useState<any>(null);//שומר את הפרטים של הקטגוריות
  const handleEditClick = (lesson: any) => {
  const attributes = lesson.attributes || lesson;
  
  setSelectedMainCategories({
    ...attributes,
    // חשוב: ב-Strapi 5 המזהה לעדכון נמצא בשדה documentId
    id: lesson.documentId || lesson.id 
  });
  setOpenEdit(true);
};
const handleUpdateMainCategories = async () => {
  try {
    const docId = selectedMainCategories?.documentId;
    if (!docId) {
      alert("שגיאה: לא נמצא documentId");
      return;
    }

    const dataPayload = {
      data: {
        name: selectedMainCategories.name,
        Priority: selectedMainCategories.Priority ? Number(selectedMainCategories.Priority) : 0,
        rabbi: selectedMainCategories.rabbi?.documentId || null,
        
        // תיקון ה-map עם :any כדי להעלים את הקווים האדומים
        lessons: Array.isArray(selectedMainCategories.lessons) 
          ? selectedMainCategories.lessons.map((l: any) => l.documentId)
          : [],

        subs: Array.isArray(selectedMainCategories.subs)
          ? selectedMainCategories.subs.map((s: any) => s.documentId)
          : []
      }
    };

    // שליחה לסטרפי עם פרמטר פרסום אוטומטי
    const response = await axios.put(
      `http://localhost:1337/api/categories-mains/${docId}?status=published`, 
      dataPayload
    );

    if (response.status === 200 || response.status === 204) {
      setOpenEdit(false);
      if (typeof fetchMainCategories === 'function') {
        fetchMainCategories(currentPage);
      }
    }

  } catch (error: any) { // תיקון ה-error עם :any
    console.error('שגיאה בעדכון:', error.response?.data || error.message);
    const msg = error.response?.data?.error?.message || "שגיאה בתקשורת עם השרת";
  }
};
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
     const [lecturers, setLecturers] = useState<any[]>([]);

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
    fetchMainCategories(1);
fetchLecturers()
  }, []);
 return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* כותרת עליונה */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, mb: 0.5 }}>
            ניהול קטגוריות
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY }}>
            הוספה, עריכה וארגון של קטגוריות השיעורים באתר
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon sx={{ ml: 1, mr: 0 }} />}
          sx={{ 
            bgcolor: COLORS.SIDEBAR_BROWN, 
            borderRadius: '12px',
            px: 3,
            fontWeight: 700,
            '&:hover': { bgcolor: COLORS.BROWN_DARK }
          }}
        >
          קטגוריה חדשה
        </Button>
      </Stack>
      {/* שורת חיפוש */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: COLORS.BG_CREAM }}>
        <TextField 
          fullWidth
          placeholder="חפשי קטגוריה..."
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

      {/* טבלת קטגוריות */}
      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
<Table sx={{ tableLayout: 'fixed' }}> {/* להוסיף את ה-sx הזה */}          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, width: '50px' }} />
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>שם הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>מזהה (Slug)</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>הרב</TableCell>
             <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>מס שיעורים</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>קדימות הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, color: '#ffffff', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainCategories.map((cat) => {
              // חילוץ נתונים בטוח לפי המבנה של הקומפוננטה השנייה שלך
              const attr = cat.attributes || cat;
              const realDbId = cat.id;
              const docId = cat.documentId || cat.id;
              const { name, lessons, Priority, rabbi } = attr;
const lessonCount = Array.isArray(lessons) 
    ? lessons.length 
    : (lessons?.data?.length || 0);              // חילוץ שם הרב בצורה גמישה
              const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "---";
const subCount = Array.isArray(cat.
subs) 
        ? cat.
subs.length 
        : (cat.
subs?.data?.length || 0);
              return (
           
  <React.Fragment key={realDbId}>
    

                <TableRow key={realDbId} hover>
                  <TableCell  align="center" >
                    <IconButton size=   "small">
                      {/* <AddIcon fontSize="small" sx={{ color: COLORS.BROWN_LIGHT }} /> */}
                    </IconButton>
                  </TableCell>
                  <TableCell  sx={{ textAlign: 'justify' }}>

                    <Stack direction="row" >
                      {/* <CategoryIcon sx={{ color: COLORS.BROWN_LIGHT }} /> */}
                      <Typography sx={{ fontWeight: 700 }}>{name || 'ללא שם'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{textAlign: 'center'}}>
                                        <Typography sx={{ fontWeight: 600 }}>{realDbId}</Typography>

                    {/* <Chip label={slug} size="small" sx={{ bgcolor: '#eee', fontWeight: 500 }} /> */}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600 }}>{rabbiName}</Typography>
                  </TableCell>
                   <TableCell align="center">
                    <Typography sx={{ fontWeight: 600 }}>{lessonCount}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{Priority || 0}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="עריכה">
                        <IconButton  onClick={() => {
handleEditClick(cat.attributes || cat)
    }} sx={{ color: COLORS.SIDEBAR_BROWN }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton sx={{ color: '#d32f2f' }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
<IconButton 
  size="small"
  // הכפתור יהיה מושבת אם אין תתי-קטגוריות
  disabled={subCount === 0} 
  onClick={() => setOpenRowId(openRowId === realDbId ? null : realDbId)} 
  sx={{ 
    transform: openRowId === realDbId ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: '0.3s',
    // שינוי צבע הדרגתי כדי שהמשתמש יבין שזה לא לחיץ
    color: subCount === 0 ? '#e0e0e0' : 'inherit' 
  }}
>
  <KeyboardArrowUpIcon />
</IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
{openRowId === realDbId && (
          <SubCategoryTable 
            open={openRowId === realDbId} 
            parentDocId={docId} 
            onEditSub={(sub) => {
              console.log("עריכת תת קטגוריה:", sub);
              // כאן תוכלי לקרוא ל-handleEditClick(sub) אם תרצי להשתמש באותו דיאלוג
            }} 
          />
        )}
    </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
    עריכת פרטי הקטגוריה
  </DialogTitle>

  <DialogContent>
    <Stack spacing={3} sx={{ mt: 2 }}>
      
      {/* כותרת השיעור */}
 <TextField
  fullWidth
  label="כותרת הקטגוריה"
  value={selectedMainCategories?.name || ''}
  onChange={(e) =>
    setSelectedMainCategories((prev: any) => ({
      ...prev,
      name: e.target.value,
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
    // אם אין רב משויך, הערך יהיה מחרוזת ריקה כדי להתאים ל-MenuItem של "ללא רב"
    value={selectedMainCategories?.rabbi?.documentId || selectedMainCategories?.rabbi?.id || ''}
    onChange={(e) => {
      const selectedId = e.target.value;

      if (!selectedId) {
        // במידה ונבחר "ללא רב" (ערך ריק)
        setSelectedMainCategories((prev: any) => ({
          ...prev,
          rabbi: null, // איפוס הרב
        }));
      } else {
        // מציאת המרצה הנבחר מתוך הרשימה
        const selectedLecturer = lecturers.find(
          (l) => (l.documentId || l.id) === selectedId
        );

        setSelectedMainCategories((prev: any) => ({
          ...prev,
          rabbi: {
            documentId: selectedId,
            id: selectedId,
            // שמירה על שם הרב לתצוגה זמנית בדיאלוג
            name: selectedLecturer?.attributes?.name || selectedLecturer?.name,
          },
        }));
      }
    }}
    sx={editFieldStyle}
  >
    {/* אופציה לבחירת "ללא רב" */}
    <MenuItem value="">
      <em style={{ color: COLORS.TEXT_GRAY }}>ללא רב (לא משויך)</em>
    </MenuItem>

    {lecturers.map((lecturer) => (
      <MenuItem key={lecturer.id} value={lecturer.documentId || lecturer.id}>
        {/* תמיכה במבנה נתונים של Strapi 4 ו-Strapi 5 */}
        {lecturer.attributes?.name || lecturer.name}
      </MenuItem>
    ))}
  </TextField>
</Stack>

      <Stack direction="row" spacing={2}>
      <TextField
  select
  fullWidth
  // מציג את ה-ID של השיעור הראשון או מחרוזת ריקה
  value="" 
  onChange={(e) => {
    // כאן אפשר להוסיף לוגיקה אם רוצים לנווט לשיעור או לערוך אותו
    console.log("Selected lesson ID:", e.target.value);
  }}
  SelectProps={{
    displayEmpty: true,
    renderValue: () => `שיעורי הקטגוריה (${selectedMainCategories?.lessons?.length || 0})`
  }}
  sx={editFieldStyle}
>
  {/* בדיקה אם יש שיעורים במערך והצגתם */}
  {selectedMainCategories?.lessons && selectedMainCategories.lessons.length > 0 ? (
    selectedMainCategories.lessons.map((lesson: any) => (
      <MenuItem key={lesson.id} value={lesson.id}>
        <Stack direction="column">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {lesson.title}
          </Typography>
 
        </Stack>
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>אין שיעורים משויכים לקטגוריה זו</MenuItem>
  )}
</TextField>

       {/* <TextField
  fullWidth
  type="date"
  InputLabelProps={{ shrink: true }}
  label="תאריך לועזי"
  value={selectedMainCategories?.lesson_date_gregorian || ''}
  onChange={(e) =>
    setSelectedMainCategories((prev: any) => ({
      ...prev,
      lesson_date_gregorian: e.target.value,
    }))
  }
  sx={editFieldStyle}
/> */}

      </Stack>

      {/* <Typography variant="subtitle2" sx={{ color: COLORS.BROWN_LIGHT, fontWeight: 'bold', mb: -1 }}>נתוני אודיו:</Typography> */}
      
      <Stack direction="row" spacing={2}>
       <TextField
  fullWidth
  label="קדימות הקטגוריה"
  value={selectedMainCategories?.Priority }
  onChange={(e) =>
    setSelectedMainCategories((prev: any) => ({
      ...prev,
      Priority: e.target.value,
    }))
  }
  sx={editFieldStyle}
/>

        {/* <TextField
  fullWidth
  label="שם קובץ"
  value={selectedMainCategories?.AudioFileName || ''}
  onChange={(e) =>
    setSelectedMainCategories((prev: any) => ({
      ...prev,
      AudioFileName: e.target.value,
    }))
  }
  sx={editFieldStyle}
/> */}

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
      onClick={handleUpdateMainCategories} 
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
      {/* הודעת סטטוס בתחתית */}
      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: COLORS.TEXT_GRAY, textAlign: 'center' }}>
        סה"כ קטגוריות מוגדרות: {mainCategories.length}
      </Typography>
<Stack direction="row" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 4 }}>
        <Button disabled={currentPage <= 1} onClick={() => fetchMainCategories(currentPage - 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הקודם</Button>
        <Typography fontWeight="bold">עמוד {currentPage} מתוך {totalPages}</Typography>
        <Button disabled={currentPage >= totalPages} onClick={() => fetchMainCategories(currentPage + 1)} variant="outlined" sx={{ color: COLORS.BROWN_DARK, borderColor: COLORS.BROWN_DARK }}>הבא</Button>
      </Stack>
    </Box>
  );
}
export default CategoryManager;