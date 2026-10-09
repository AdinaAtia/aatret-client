
import React, { useState, useEffect } from 'react';
import { 
  TableRow, TableCell, Collapse, Box, Table, TableBody, 
  Typography, IconButton, Stack, CircularProgress, DialogTitle,
  DialogContent, Dialog, MenuItem, DialogActions, Button, TextField,
  Popover 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#000', 
  BROWN_DARK: colors.gold,    
  BROWN_LIGHT: colors.gold,   
  BG_CREAM: '#fff',
  TEXT_GRAY: '#5f6368'
};


const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    direction: 'rtl' as const,
    borderRadius: '4px',
    '& fieldset': { textAlign: 'right' as const },
    '&.Mui-focused fieldset': { borderColor: colors.gold },
  },
  '& .MuiInputLabel-root': {
    right: 28, left: 'auto', transformOrigin: 'right',
    '&.Mui-focused': { color: colors.gold },
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(0, -9px) scale(0.75)',
    right: 10,
  }
};

interface SubCategoryTableProps {
  open: boolean;
  parentDocId: string;
  isParentSub?: boolean; // האם האבא הוא סאב-קטגוריה או ראשית
  level?: number;        // לצורך הזזה ויזואלית
}

const SubCategoryTable = ({ open, parentDocId, isParentSub = false, level = 1 }: SubCategoryTableProps) => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [openChildId, setOpenChildId] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [subToDelete, setSubToDelete] = useState<any>(null);

  const [lecturers, setLecturers] = useState<any[]>([]);
const [_filteredMains, setFilteredMains] = useState<any[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');

  // שליפת נתונים רק כשבאמת צריכים לערוך (חוסך כפילויות)
  const prepareEditData = async (sub: any) => {
    try {
      const resLec = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name`);
      setLecturers(resLec.data.data || []);
      
      const attr = sub.attributes || sub;
      const rabbiId = attr.main_category?.data?.attributes?.rabbi?.data?.documentId || 
                      attr.main_category?.rabbi?.documentId || '';
      
      if (rabbiId) {
        setSelectedLecturerId(rabbiId);
        const resMain = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[rabbi][documentId][$eq]=${rabbiId}`);
        setFilteredMains(resMain.data.data || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleEditClick = (sub: any) => {
    const attr = sub.attributes || sub;
    setSelectedSub({
      documentId: sub.documentId || sub.id,
      name: attr.name,
      Priority: attr.Priority,
      parentMainId: attr.main_category?.data?.documentId || attr.main_category?.documentId || '',
      lessons: attr.lessons?.data || attr.lessons || []
    });
    prepareEditData(sub);
    setOpenEdit(true);
  };

  const handleUpdateSub = async () => {
    try {
      const payload = { data: { name: selectedSub.name, Priority: Number(selectedSub.Priority), main_category: selectedSub.parentMainId } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/categories-subs/${selectedSub.documentId}`, payload);
      window.location.reload(); 
    } catch (error) { console.error(error); }
  };

  const handleDeleteOpen = (event: React.MouseEvent<HTMLButtonElement>, sub: any) => {
    setAnchorEl(event.currentTarget);
    setSubToDelete(sub);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories-subs/${subToDelete.documentId || subToDelete.id}`);
      window.location.reload();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const fetchSubs = async () => {
      if (!open || !parentDocId) return;
      try {
        setLoading(true);
        // הלוגיקה החדשה: בודק אם לסנן לפי main_category או לפי parent_sub
        const filterField = isParentSub ? 'parent_sub' : 'main_category';
        const parentFilter = isParentSub ? '' : '&filters[parent_sub][documentId][$null]=true';
        
        const url = `${import.meta.env.VITE_API_URL}/api/categories-subs?filters[${filterField}][documentId][$eq]=${parentDocId}${parentFilter}&populate[child_subs][count]=true&populate[lessons]=*&populate[main_category][populate][rabbi]=*&sort[0]=name:asc`;
        
        const response = await axios.get(url);
        setSubCategories(response.data.data || []);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchSubs();
  }, [open, parentDocId, isParentSub]);

  return (
    <>
      <TableRow sx={{ display: open ? 'table-row' : 'none' }}>
        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 0.5, bgcolor: level > 1 ? '#f9f9f9' : '#fdfdfd', width: '100%', borderTop: '1px solid #f0e8dc', borderBottom: '1px solid #f0e8dc' }}>
              {loading ? (
                <Stack alignItems="center" py={2}><CircularProgress size={20} /></Stack>
              ) : (
                <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableBody>
                    {subCategories.map((sub) => {
                      const attr = sub.attributes || sub;
                      const docId = sub.documentId || sub.id;
                      const lessonCount = attr.lessons?.length || attr.lessons?.data?.length || 0;
                      const childCount = attr.child_subs?.count || 0;

                      return (
                        <React.Fragment key={docId}>
                          <TableRow sx={{ '& td': { border: 'none' }, '&:hover': { bgcolor: '#f5f5f5' } }}>
                            <TableCell sx={{ width: '50px' }}></TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', direction: 'rtl', pr: `${(level - 1) * 20}px`, gap: 1 }}>
                                {level > 1 && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLORS.BROWN_LIGHT, flexShrink: 0 }} />}
                                <Typography sx={{ 
                                  fontWeight: level === 1 ? 600 : 400, 
                                  fontSize: level === 1 ? '0.875rem' : '0.8rem', 
                                  color: level === 1 ? 'inherit' : COLORS.TEXT_GRAY 
                                }}>
                                  {attr.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}><Typography sx={{ color: '#999' }}>{sub.id}</Typography></TableCell>
                            <TableCell align="center">
                              <Typography sx={{ fontSize: '0.875rem' }}>
                                {attr.main_category?.data?.attributes?.rabbi?.data?.attributes?.name || attr.main_category?.rabbi?.name || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center"><Typography sx={{ fontWeight: 600 }}>{lessonCount}</Typography></TableCell>
                            <TableCell align="center"><Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{attr.Priority || 0}</Typography></TableCell>
                            <TableCell align="center" sx={{ pl: 5 }}>
                              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                <IconButton size="small" onClick={() => handleEditClick(sub)} sx={{ color: COLORS.SIDEBAR_BROWN }}><EditIcon fontSize="small" /></IconButton>
                                <IconButton size="small" onClick={(e) => handleDeleteOpen(e, sub)} sx={{ color: '#d32f2f' }}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => childCount > 0 && setOpenChildId(openChildId === docId ? null : docId)}
                                  sx={{ color: COLORS.BROWN_DARK, visibility: childCount > 0 ? 'visible' : 'hidden' }}
                                >
                                  {openChildId === docId ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                          
                          {/* קריאה רקורסיבית לילדים */}
                          {openChildId === docId && (
                            <SubCategoryTable 
                              open={true} 
                              parentDocId={docId} 
                              isParentSub={true} 
                              level={level + 1} 
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Popover ודיאלוג נשארים כאן (הם יופיעו רק במופע הקיים) */}
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} transformOrigin={{ vertical: 'bottom', horizontal: 'center' }} PaperProps={{ sx: { borderRadius: '20px', width: '280px', boxShadow: '0px 8px 24px rgba(0,0,0,0.15)', p: 0.5 } }}>
        <Box sx={{ p: 2, textAlign: 'center', dir: 'rtl' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colors.gold, mb: 0.5 }}>ניהול סטטוס קטגוריה</Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY, mb: 2 }}>
            מה ברצונך לעשות עם הקטגוריה<br />
            <strong>"{subToDelete?.attributes?.name || subToDelete?.name}"</strong>?
          </Typography>
          <Box sx={{ bgcolor: 'rgba(197,160,89,0.08)', p: 1.5, borderRadius: '10px', mb: 2.5, display: 'flex', gap: 1, border: '1px solid rgba(197,160,89,0.3)' }}>
            <Typography variant="caption" sx={{ fontSize: '11px', textAlign: 'right', color: colors.gold, lineHeight: 1.4 }}>
              העברה לטיוטה תסיר את הקטגוריה מהאתר אך תשמור אותה במערכת.
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Button fullWidth variant="contained" sx={{ bgcolor: '#000', color: colors.gold, fontWeight: 'bold', borderRadius: '8px', py: 1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>העבר לטיוטה (DRAFT)</Button>
            <Button fullWidth variant="contained" onClick={confirmDelete} sx={{ bgcolor: '#000', color: colors.gold, fontWeight: 800, borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>מחק לצמיתות</Button>
            <Button fullWidth variant="outlined" onClick={() => setAnchorEl(null)} sx={{ color: '#000', borderColor: '#000', borderRadius: '8px', fontSize: '0.75rem' }}>ביטול וחזרה</Button>
          </Stack>
        </Box>
      </Popover>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, textAlign: 'center', pt: 3 }}>עריכת קטגוריה</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="שם הקטגוריה" value={selectedSub?.name || ''} onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, name: e.target.value }))} sx={editFieldStyle} />
            <TextField select fullWidth label="שיוך לרב" value={selectedLecturerId} onChange={(e) => { setSelectedLecturerId(e.target.value); prepareEditData(selectedSub); }} sx={editFieldStyle}>
              {lecturers.map((lec) => <MenuItem key={lec.id} value={lec.documentId || lec.id}>{lec.name || lec.attributes?.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="קדימות" type="number" value={selectedSub?.Priority || 0} onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, Priority: e.target.value }))} sx={editFieldStyle} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>ביטול</Button>
          <Button onClick={handleUpdateSub} variant="contained" sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold', '&:hover': { bgcolor: colors.gold, color: '#000' } }}>שמור שינויים</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubCategoryTable;