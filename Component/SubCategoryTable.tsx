import React, { useState, useEffect } from 'react';
import { 
  TableRow, TableCell, Collapse, Box, Table, TableBody, 
  Typography, IconButton, Stack,  CircularProgress, DialogTitle,
  DialogContent, Dialog, MenuItem, DialogActions, Button, TextField,
  Popover } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import InventoryIcon from '@mui/icons-material/Inventory'; // אייקון לטיוטה
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // אייקון למחיקה
// ... (הגדרות COLORS ו-editFieldStyle נשארות אותו דבר)
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  BG_CREAM: '#fdfbe7',
  TEXT_GRAY: '#5f6368'
};

const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: COLORS.BROWN_LIGHT },
    '&.Mui-focused fieldset': { borderColor: COLORS.SIDEBAR_BROWN },
  }
};

interface SubCategoryTableProps {
  open: boolean;
  parentDocId: string;
  onEditSub: (sub: any) => void;
}

const SubCategoryTable = ({ open, parentDocId, onEditSub }: SubCategoryTableProps) => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  // --- States לניהול ה-Popover של המחיקה ---
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [subToDelete, setSubToDelete] = useState<any>(null);

  // --- States קיימים לניהול בחירת רב וקטגוריות ---
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [filteredMains, setFilteredMains] = useState<any[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');

  // 1. שליפת רשימת כל הרבנים
  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/rabbis?fields[0]=name');
      setLecturers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
  };

  // 2. שליפת קטגוריות ראשיות לפי הרב שנבחר
  const fetchMainsByLecturer = async (lecturerId: string) => {
    if (!lecturerId) return;
    try {
      const res = await axios.get(`http://localhost:1337/api/categories-mains?filters[rabbi][documentId][$eq]=${lecturerId}`);
      setFilteredMains(res.data.data || []);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  };

  // 3. פתיחת הדיאלוג וטעינת נתוני הפתיחה
  const handleEditClick = (sub: any) => {
    const attr = sub.attributes || sub;
    const currentLecturerId = attr.main_category?.data?.attributes?.rabbi?.data?.documentId || 
                              attr.main_category?.rabbi?.documentId || '';
    const currentMainId = attr.main_category?.data?.documentId || attr.main_category?.documentId || '';

    setSelectedSub({
      documentId: sub.documentId || sub.id,
      name: attr.name,
      Priority: attr.Priority,
      parentMainId: currentMainId,
      lessons: attr.lessons?.data || attr.lessons || []
    });

    setSelectedLecturerId(currentLecturerId);
    if (currentLecturerId) fetchMainsByLecturer(currentLecturerId);
    setOpenEdit(true);
  };

  // 4. עדכון
  const handleUpdateSub = async () => {
    try {
      const payload = {
        data: {
          name: selectedSub.name,
          Priority: Number(selectedSub.Priority),
          main_category: selectedSub.parentMainId 
        }
      };
      await axios.put(`http://localhost:1337/api/categories-subs/${selectedSub.documentId}?status=published`, payload);
      
      if (selectedSub.lessons?.length > 0) {
        const updatePromises = selectedSub.lessons.map((lesson: any) => {
          const lessonId = lesson.documentId || lesson.id;
          return axios.put(`http://localhost:1337/api/lessons/${lessonId}`, {
            data: { main_category: selectedSub.parentMainId }
          });
        });
        await Promise.all(updatePromises);
      }
      setOpenEdit(false);
      window.location.reload(); 
    } catch (error) { console.error("Update error:", error); }
  };

  // --- לוגיקת Popover מחיקה ---
  const handleDeleteOpen = (event: React.MouseEvent<HTMLButtonElement>, sub: any) => {
    setAnchorEl(event.currentTarget);
    setSubToDelete(sub);
  };

  const handleDeleteClose = () => {
    setAnchorEl(null);
    setSubToDelete(null);
  };

  const confirmDelete = async () => {
    if (!subToDelete) return;
    try {
      const docId = subToDelete.documentId || subToDelete.id;
      await axios.delete(`http://localhost:1337/api/categories-subs/${docId}`);
      handleDeleteClose();
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
      handleDeleteClose();
    }
  };

  const openDeletePopover = Boolean(anchorEl);

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!open || !parentDocId) return;
      try {
        setLoading(true);
        const url = `http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${parentDocId}&populate[lessons]=*&populate[main_category][populate][rabbi]=*&sort[0]=Priority:asc`;
        const response = await axios.get(url);
        setSubCategories(response.data.data || []);
      } catch (error) { console.error("Error fetching sub-categories:", error);
      } finally { setLoading(false); }
    };
    fetchSubs();
  }, [open, parentDocId]);

  return (
    <>
      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 0.5, bgcolor: '#fdfdfd', borderRight: `4px solid ${COLORS.BROWN_LIGHT}`, width: '100%' }}>
              {loading ? (
                <Stack alignItems="center" py={2}><CircularProgress size={20} /></Stack>
              ) : (
                <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableBody>
                    {subCategories.map((sub) => {
                      const attr = sub.attributes || sub;
                      const lessonCount = Array.isArray(attr.lessons) ? attr.lessons.length : (attr.lessons?.data?.length || 0);  
                      return (
                        <TableRow key={sub.id} sx={{ '& td': { border: 'none' }, '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell sx={{ width: '50px' }}></TableCell>
                          <TableCell sx={{ textAlign: 'justify' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{attr.name || 'ללא שם'}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#999' }}>{sub.id}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontSize: '0.875rem', color: COLORS.TEXT_GRAY }}>
                              {attr.main_category?.data?.attributes?.rabbi?.data?.attributes?.name || 
                               attr.main_category?.rabbi?.name || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                             <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{lessonCount}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK, fontSize: '0.875rem' }}>{attr.Priority || 0}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ 
           // Padding Right
    pl: 5         // Padding Left - תוודאי שזה תואם לטבלה למעלה
  }}>
                            <Stack direction="row" justifyContent="center" spacing={2}>
                              <IconButton size="small" onClick={() => handleEditClick(sub)} sx={{ color: COLORS.SIDEBAR_BROWN }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              
                              {/* כפתור מחיקה שפותח Popover */}
                              <IconButton 
                                size="small" 
                                onClick={(e) => handleDeleteOpen(e, sub)} 
                                sx={{ color: '#d32f2f' }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Popover אישור מחיקה */}

<Popover
  open={openDeletePopover}
  anchorEl={anchorEl}
  onClose={handleDeleteClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  PaperProps={{ 
    sx: { 
      borderRadius: '24px', // פינות מעוגלות מאוד כמו בעיצוב
      p: 2.5, 
      width: '280px',
      boxShadow: '0px 8px 30px rgba(0,0,0,0.15)',
      border: '1px solid #eee'
    } 
  }}
>
  <Box dir="rtl">
    {/* כותרת קטנה ושאלה */}
    <Typography sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, fontSize: '1rem', mb: 0.5, textAlign: 'center' }}>
      ניהול סטטוס קטגוריה
    </Typography>
    <Typography sx={{ fontSize: '0.85rem', color: '#666', mb: 2, textAlign: 'center' }}>
      מה תרצה לעשות עם <strong>"{subToDelete?.attributes?.name || subToDelete?.name}"</strong>?
    </Typography>

    <Stack spacing={1.5}>
      {/* כפתור העבר לטיוטה - חום מעוגל */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<InventoryIcon sx={{ fontSize: '1.1rem !important' }} />}
        onClick={() => { /* לוגיקת טיוטה */ }}
        sx={{
          bgcolor: COLORS.SIDEBAR_BROWN,
          borderRadius: '12px',
          fontWeight: 'bold',
          py: 1,
          '&:hover': { bgcolor: COLORS.BROWN_DARK },
          textTransform: 'none',
          boxShadow: 'none'
        }}
      >
        העבר לטיוטה (DRAFT)
      </Button>

      {/* כפתור מחיקה - טקסט אדום עם אייקון */}
      <Button
        variant="text"
        fullWidth
        startIcon={<DeleteForeverIcon />}
        onClick={confirmDelete}
        sx={{
          color: '#d32f2f',
          fontWeight: '700',
          py: 0.5,
          '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.05)' }
        }}
      >
        מחק לצמיתות מהמערכת
      </Button>

      {/* כפתור ביטול */}
      <Button
        fullWidth
        onClick={handleDeleteClose}
        sx={{ color: '#999', fontSize: '0.85rem', fontWeight: 500 }}
      >
        ביטול
      </Button>
    </Stack>
  </Box>
</Popover>
      {/* דיאלוג עריכה (נשאר כרגיל) */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)} 
        dir="rtl"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        {/* ... (כל תוכן ה-Dialog נשאר בדיוק כפי שהיה בקוד שלך) ... */}
        <DialogTitle sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, fontSize: '1.5rem', textAlign: 'center', pb: 1 }}>
          עריכת תת קטגוריה
        </DialogTitle>
        <DialogContent>
           <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="שם תת הקטגוריה"
              value={selectedSub?.name || ''}
              onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, name: e.target.value }))}
              sx={editFieldStyle}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ color: COLORS.SIDEBAR_BROWN, fontWeight: 'bold', mb: 1 }}>שיוך היררכי:</Typography>
              <Stack spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="1. בחר רב"
                  value={selectedLecturerId || ''}
                  onChange={(e) => {
                    const rabbiId = e.target.value;
                    setSelectedLecturerId(rabbiId);
                    fetchMainsByLecturer(rabbiId);
                    setSelectedSub((prev: any) => ({ ...prev, parentMainId: '' }));
                  }}
                  sx={editFieldStyle}
                >
                  {lecturers.map((lec) => (
                    <MenuItem key={lec.id} value={lec.documentId || lec.id}>{lec.attributes?.name || lec.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="2. שיוך לקטגוריה ראשית"
                  disabled={!selectedLecturerId}
                  value={selectedSub?.parentMainId || ''}
                  onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, parentMainId: e.target.value }))}
                  sx={editFieldStyle}
                >
                  {filteredMains.map((main) => (
                    <MenuItem key={main.id} value={main.documentId || main.id}>{main.attributes?.name || main.name}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>
            <TextField
              fullWidth
              label="קדימות בתצוגה"
              type="number"
              value={selectedSub?.Priority || 0}
              onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, Priority: e.target.value }))}
              sx={editFieldStyle}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined">ביטול</Button>
          <Button onClick={handleUpdateSub} variant="contained" disabled={!selectedSub?.parentMainId} sx={{ bgcolor: COLORS.SIDEBAR_BROWN }}>שמור שינויים</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubCategoryTable;