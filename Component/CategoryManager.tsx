import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip, 
  DialogTitle, DialogContent, Dialog, MenuItem, DialogActions, 
  InputAdornment, Stack, Button, Chip, Popover, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add'; 
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SubCategoryTable from './SubCategoryTable';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // אייקון לטיוטה
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
  const [openRowId, setOpenRowId] = useState<string | number | null>(null);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [loadingMainCategories, setLoadingMainCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 30;


const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleToggleRow = (id: string) => {
    setOpenRowId(prev => (prev === id ? null : id));
  };

  const fetchMainCategories = async (page: number) => {
    try {
      setLoadingMainCategories(true);
      let url = `http://localhost:1337/api/categories-mains?populate=*&sort[0]=rabbi.Priority:asc&sort[1]=Priority:asc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`; 
      const response = await axios.get(url);
      setMainCategories(response.data.data || []);
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingMainCategories(false);
    }
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMainCategories, setSelectedMainCategories] = useState<any>(null);

  const handleEditClick = (lesson: any) => {
    const attributes = lesson.attributes || lesson;
    setSelectedMainCategories({
      ...attributes,
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
          lessons: Array.isArray(selectedMainCategories.lessons) 
            ? selectedMainCategories.lessons.map((l: any) => l.documentId)
            : [],
          subs: Array.isArray(selectedMainCategories.subs)
            ? selectedMainCategories.subs.map((s: any) => s.documentId)
            : []
        }
      };

      const response = await axios.put(
        `http://localhost:1337/api/categories-mains/${docId}?status=published`, 
        dataPayload
      );

      if (response.status === 200 || response.status === 204) {
        setOpenEdit(false);
        fetchMainCategories(currentPage);
      }
    } catch (error: any) {
      console.error('שגיאה בעדכון:', error.response?.data || error.message);
    }
  };

  // פתיחת מודאל הניהול במקום Popover
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, category: any) => {
  setAnchorEl(event.currentTarget); // שומר את המיקום של הכפתור
  setCategoryToDelete(category);
};

  const confirmDelete = async () => {
    try {
      const docId = categoryToDelete.documentId || categoryToDelete.id;
      await axios.delete(`http://localhost:1337/api/categories-mains/${docId}`);
      setAnchorEl(null); 
     fetchMainCategories(currentPage);
    } catch (error) { console.error(error); }
  };

  const handleMoveToDraft = async () => {
    try {
      const docId = categoryToDelete.documentId || categoryToDelete.id;
      await axios.put(`http://localhost:1337/api/categories-mains/${docId}`, {
        data: { publishedAt: null } // בסטרפי העברה לטיוטה מתבצעת ע"י איפוס זמן הפרסום
      });
      setAnchorEl(null);
      fetchMainCategories(currentPage);
    } catch (error) { console.error(error); }
  };

  const editFieldStyle = {
    '& .MuiOutlinedInput-root': {
      direction: 'rtl' as const,
      '& fieldset': { textAlign: 'right' as const },
      '&.Mui-focused fieldset': { borderColor: COLORS.BROWN_DARK },
    },
    '& .MuiInputLabel-root': {
      right: 16, left: 'auto', transformOrigin: 'right',
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
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchMainCategories(1);
    fetchLecturers();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, mb: 0.5 }}>
            ניהול קטגוריות
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY }}>
            הוספה, עריכה וארגון של קטגוריות השיעורים באתר
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon sx={{ ml: 1, mr: 0 }} />} sx={{ bgcolor: COLORS.SIDEBAR_BROWN, borderRadius: '12px', px: 3, fontWeight: 700, '&:hover': { bgcolor: COLORS.BROWN_DARK } }}>
          קטגוריה חדשה
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: COLORS.BG_CREAM }}>
        <TextField fullWidth placeholder="חפשי קטגוריה..." InputProps={{ startAdornment: ( <InputAdornment position="start"><SearchIcon sx={{ color: COLORS.BROWN_DARK }} /></InputAdornment> ), sx: { borderRadius: '12px', bgcolor: '#fff' } }} />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
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
              const attr = cat.attributes || cat;
              const realDbId = cat.id;
              const docId = cat.documentId || cat.id;
              const { name, lessons, Priority, rabbi } = attr;
              const lessonCount = Array.isArray(lessons) ? lessons.length : (lessons?.data?.length || 0);
              const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "---";
              const subCount = Array.isArray(attr.subs) ? attr.subs.length : (attr.subs?.data?.length || 0);

              return (
                <React.Fragment key={realDbId}>
                  <TableRow hover>
                    <TableCell align="center" />
                    <TableCell sx={{ textAlign: 'justify' }}>
                      <Stack direction="row">
                        <Typography sx={{ fontWeight: 700 }}>{name || 'ללא שם'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{textAlign: 'center'}}><Typography sx={{ fontWeight: 600 }}>{realDbId}</Typography></TableCell>
                    <TableCell align="center"><Typography sx={{ fontWeight: 600 }}>{rabbiName}</Typography></TableCell>
                    <TableCell align="center"><Typography sx={{ fontWeight: 600 }}>{lessonCount}</Typography></TableCell>
                    <TableCell align="center"><Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{Priority || 0}</Typography></TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" spacing={1}>
                        <IconButton onClick={() => handleEditClick(cat)} sx={{ color: COLORS.SIDEBAR_BROWN }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton onClick={(e) => handleDeleteClick(e, cat)} sx={{ color: '#d32f2f' }}>
  <DeleteOutlineIcon fontSize="small" />
</IconButton>
                        <IconButton 
                          size="small"
                          disabled={subCount === 0} 
                          onClick={() => setOpenRowId(openRowId === realDbId ? null : realDbId)} 
                          sx={{ transform: openRowId === realDbId ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s', color: subCount === 0 ? '#e0e0e0' : 'inherit' }}
                        >
                          <KeyboardArrowUpIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  {openRowId === realDbId && (
                    <SubCategoryTable open={true} parentDocId={docId} onEditSub={(sub) => console.log(sub)} />
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- המודאל החדש והמעוצב לניהול מחיקה/טיוטה --- */}
      <Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
  PaperProps={{
    sx: { borderRadius: '24px', p: 1, maxWidth: '350px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
  }}
>
  {/* הכותרת בדיוק כמו בדיאלוג */}
  <Box sx={{ p: 2, textAlign: 'center' }}>
    <Typography sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, mb: 1, fontSize: '1.1rem' }}>
      ניהול סטטוס קטגוריה
    </Typography>

    {/* התוכן בדיוק כמו בדיאלוג */}
    <Typography variant="body2" sx={{ mb: 2 }}>
      מה ברצונך לעשות עם הקטגוריה <strong>"{categoryToDelete?.attributes?.name || categoryToDelete?.name}"</strong>?
    </Typography>
    
    <Typography variant="caption" sx={{ display: 'block', color: COLORS.TEXT_GRAY, bgcolor: COLORS.BG_CREAM, p: 1.5, borderRadius: '12px', mb: 2 }}>
      העברה לטיוטה תסיר את הקטגוריה מהאתר אך תשמור אותה במערכת.
    </Typography>

    {/* הכפתורים בדיוק כמו בדיאלוג */}
    <Stack spacing={1.5}>
      <Button 
        fullWidth 
        variant="contained" 
        startIcon={<Inventory2Icon />}
        onClick={handleMoveToDraft}
        sx={{ 
          bgcolor: COLORS.SIDEBAR_BROWN, 
          borderRadius: '12px', 
          fontWeight: 'bold',
          '&:hover': { bgcolor: COLORS.BROWN_DARK }
        }}
      >
        העבר לטיוטה (Draft)
      </Button>
      
      <Button 
        fullWidth 
        variant="text" 
        startIcon={<DeleteOutlineIcon />}
        onClick={confirmDelete}
        sx={{ 
          color: '#d32f2f', 
          fontWeight: '600',
          '&:hover': { bgcolor: '#fff5f5' } 
        }}
      >
        מחק לצמיתות מהמערכת
      </Button>

      <Button 
        fullWidth
        onClick={() => setAnchorEl(null)} 
        sx={{ color: COLORS.TEXT_GRAY, fontSize: '0.8rem' }}
      >
        ביטול
      </Button>
    </Stack>
  </Box>
</Popover>

      {/* הדיאלוג המקורי שלך לעריכה */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, fontSize: '1.5rem', textAlign: 'center', pb: 1 }}>עריכת פרטי הקטגוריה</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="כותרת הקטגוריה" value={selectedMainCategories?.name || ''} onChange={(e) => setSelectedMainCategories((prev: any) => ({ ...prev, name: e.target.value }))} sx={editFieldStyle} />
            <Stack direction="row" spacing={2}>
              <TextField select fullWidth label="בחר רב" value={selectedMainCategories?.rabbi?.documentId || selectedMainCategories?.rabbi?.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedLecturer = lecturers.find((l) => (l.documentId || l.id) === selectedId);
                  setSelectedMainCategories((prev: any) => ({
                    ...prev,
                    rabbi: selectedId ? { documentId: selectedId, id: selectedId, name: selectedLecturer?.attributes?.name || selectedLecturer?.name } : null,
                  }));
                }} sx={editFieldStyle}
              >
                <MenuItem value=""><em>ללא רב</em></MenuItem>
                {lecturers.map((l) => <MenuItem key={l.id} value={l.documentId || l.id}>{l.attributes?.name || l.name}</MenuItem>)}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField select fullWidth value="" SelectProps={{ displayEmpty: true, renderValue: () => `שיעורי הקטגוריה (${selectedMainCategories?.lessons?.length || 0})` }} sx={editFieldStyle}>
                {selectedMainCategories?.lessons?.map((lesson: any) => (
                  <MenuItem key={lesson.id} value={lesson.id}><Typography variant="body2" sx={{ fontWeight: 600 }}>{lesson.title}</Typography></MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="קדימות הקטגוריה" value={selectedMainCategories?.Priority || ''} onChange={(e) => setSelectedMainCategories((prev: any) => ({ ...prev, Priority: e.target.value }))} sx={editFieldStyle} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ color: COLORS.TEXT_GRAY, borderColor: COLORS.TEXT_GRAY, borderRadius: '10px' }}>ביטול</Button>
          <Button onClick={handleUpdateMainCategories} variant="contained" sx={{ bgcolor: COLORS.SIDEBAR_BROWN, px: 4, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: COLORS.BROWN_DARK } }}>שמור שינויים</Button>
        </DialogActions>
      </Dialog>

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