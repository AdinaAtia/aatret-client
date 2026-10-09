import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip,
  Stack, Button, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Pagination, Checkbox
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import EditLessonDialog from './EditLessonDialog';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#000',
  BROWN_DARK: colors.gold,
  BG_CREAM: '#fff',
};

const DraftLessons = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);
  const pageSize = 30;

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currentPageCategories, setCurrentPageCategories] = useState(1);
  const [totalPagesCategories, setTotalPagesCategories] = useState(0);
  const [publishingCategoryId, setPublishingCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [openEditCategory, setOpenEditCategory] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const fetchDrafts = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/drafts?page=${page}&pageSize=${pageSize}`
      );
      setLessons(res.data.data || []);
      const pagination = res.data.meta?.pagination;
      if (pagination) {
        setTotalPages(pagination.pageCount);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('שגיאה בשליפת טיוטות:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name`);
      const data: any[] = res.data.data || [];
      setLecturers(data.sort((a, b) => {
        const na = a.name || a.attributes?.name || '';
        const nb = b.name || b.attributes?.name || '';
        if (na.includes('מרדכי עטייה')) return -1;
        if (nb.includes('מרדכי עטייה')) return 1;
        return na.localeCompare(nb, 'he');
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async (documentId: string) => {
    setPublishingId(documentId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/publish/${documentId}`);
      await fetchDrafts(currentPage);
    } catch (err: any) {
      alert(`שגיאה בפרסום: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  const fetchDraftCategories = async (page: number) => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories-mains/drafts?page=${page}&pageSize=${pageSize}`
      );
      setCategories(res.data.data || []);
      const pagination = res.data.meta?.pagination;
      if (pagination) {
        setTotalPagesCategories(pagination.pageCount);
        setCurrentPageCategories(page);
      }
    } catch (err) {
      console.error('שגיאה בשליפת טיוטות קטגוריות:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map(id =>
          axios.delete(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`)
        )
      );
      setSelectedIds([]);
      setConfirmBulkDelete(false);
      fetchDrafts(currentPage);
    } catch (error) {
      console.error('שגיאה במחיקה מרובה:', error);
      alert('חלה שגיאה במחיקה. נסי שוב.');
    }
  };

  const handlePublishCategory = async (documentId: string) => {
    setPublishingCategoryId(documentId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories-mains/publish/${documentId}`);
      await fetchDraftCategories(currentPageCategories);
    } catch (err: any) {
      alert(`שגיאה בפרסום: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setPublishingCategoryId(null);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const docId = selectedCategory?.documentId;
      if (!docId) return;
      
      const rabbiDocId = selectedCategory?.rabbiDocumentId || selectedCategory?.rabbi?.documentId || null;
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/categories-mains/${docId}?status=draft`,
        {
          data: {
            name: selectedCategory.name,
            Priority: selectedCategory.Priority ? Number(selectedCategory.Priority) : 0,
            rabbi: rabbiDocId,
          }
        }
      );
      setOpenEditCategory(false);
      fetchDraftCategories(currentPageCategories);
    } catch (error: any) {
      console.error('שגיאה בעדכון:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchDrafts(1);
    fetchLecturers();
    fetchDraftCategories(1);
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#000', mb: 0.5 }}>
          טיוטות שיעורים
        </Typography>
        <Typography variant="body2" sx={{ color: '#5f6368' }}>
          צפייה וניהול של שיעורי הטיוטות באתר
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1, alignItems: 'center', gap: 1 }}>
        <Tooltip title={selectedIds.length > 0 ? `מחק ${selectedIds.length} שיעורים נבחרים` : 'מחק נבחרים'}>
          <IconButton onClick={() => selectedIds.length > 0 && setConfirmBulkDelete(true)} sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
        {selectedIds.length > 0 && !confirmBulkDelete && (
          <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 600 }}>
            {selectedIds.length} נבחרו
          </Typography>
        )}
        {confirmBulkDelete && (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 700 }}>
              למחוק {selectedIds.length} שיעורים?
            </Typography>
            <Button size="small" variant="contained" onClick={handleBulkDelete}
              sx={{ bgcolor: '#000', color: colors.gold, fontSize: '0.7rem', px: 1, py: 0.3, minWidth: 0, '&:hover': { bgcolor: colors.gold, color: '#000' } }}>
              כן
            </Button>
            <Button size="small" variant="outlined" onClick={() => setConfirmBulkDelete(false)}
              sx={{ color: '#000', borderColor: '#000', fontSize: '0.7rem', px: 1, py: 0.3, minWidth: 0 }}>
              ביטול
            </Button>
          </Stack>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: colors.gold, width: 40 }}>
                <Checkbox
                  size="small"
                  sx={{ color: '#000', '&.Mui-checked': { color: '#000' }, '&.MuiCheckbox-indeterminate': { color: '#000' }, p: 0 }}
                  checked={lessons.length > 0 && selectedIds.length === lessons.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < lessons.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(lessons.map(l => l.documentId || String(l.id)));
                    else setSelectedIds([]);
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פרטי השיעור</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>תאריכים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>משך</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>צפיות</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>טוען נתונים...</TableCell></TableRow>
            ) : lessons.map((lesson) => {
              const attr = lesson.attributes || lesson;
              const rabbiName = attr.rabbiName || attr.rabbi?.data?.attributes?.name || attr.rabbi?.name || '';
              return (
                <TableRow key={lesson.id} hover sx={{ '& td': { py: 2 } }}>
                  <TableCell sx={{ width: 40, py: 0 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0, color: colors.gold, '&.Mui-checked': { color: colors.gold } }}
                      checked={selectedIds.includes(lesson.documentId || String(lesson.id))}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const id = lesson.documentId || String(lesson.id);
                        if (e.target.checked) setSelectedIds(prev => [...prev, id]);
                        else setSelectedIds(prev => prev.filter(x => x !== id));
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'justify' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{attr.title || `שיעור ${lesson.id}`}</Typography>
                    <Typography variant="caption" sx={{ color: COLORS.BROWN_DARK, fontWeight: 600 }}>
                      {rabbiName} | ID: {lesson.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.8}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: '#000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000', whiteSpace: 'nowrap' }}>
                          {attr.lesson_date_hebrew || '-'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: 'gray' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
                    <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{attr.views || 0}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <Tooltip title="פרסם שיעור">
                        <IconButton
                          onClick={() => handlePublish(lesson.documentId)}
                          disabled={publishingId === lesson.documentId}
                          sx={{ color: colors.gold }}
                        >
                          {publishingId === lesson.documentId
                            ? <CircularProgress size={18} />
                            : <PublishIcon />}
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
                          onClick={() => { setSelectedLesson(lesson); setOpenEdit(true); }}
                          sx={{ color: COLORS.SIDEBAR_BROWN }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, direction: 'ltr' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_e, value) => { fetchDrafts(value); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          sx={{
            '& .MuiPaginationItem-root': { color: '#000000', fontWeight: 'bold' },
            '& .Mui-selected': { backgroundColor: `${colors.gold} !important`, color: '#fff !important' },
            '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(197,160,89,0.1)' }
          }}
        />
      </Box>

      <EditLessonDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        lesson={selectedLesson}
        lecturers={lecturers}
        onSaveSuccess={() => fetchDrafts(currentPage)}
        isDraft={true}
      />

      <Typography variant="h4" sx={{ fontWeight: 500, fontSize: '2rem', color: COLORS.SIDEBAR_BROWN, mb: 4, mt: 6, fontFamily: "'Yetzira-Regular', sans-serif" }}>
        טיוטות קטגוריות
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מזהה (Slug)</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>הרב</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מס שיעורים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>קדימות הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingCategories ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>טוען נתונים...</TableCell></TableRow>
            ) : categories.map((category) => (
              <TableRow key={category.id} hover sx={{ '& td': { py: 2 } }}>
                <TableCell sx={{ textAlign: 'justify' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{category.name || 'ללא שם'}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.id}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.rabbiName || '---'}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.lessonCount || 0}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{category.Priority || 0}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    <Tooltip title="פרסם קטגוריה">
                      <IconButton
                        onClick={() => handlePublishCategory(category.documentId)}
                        disabled={publishingCategoryId === category.documentId}
                        sx={{ color: colors.gold }}
                      >
                        {publishingCategoryId === category.documentId
                          ? <CircularProgress size={18} />
                          : <PublishIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ערוך פרטים">
                      <IconButton sx={{ color: COLORS.SIDEBAR_BROWN }} onClick={() => { setSelectedCategory(category); setOpenEditCategory(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, direction: 'ltr' }}>
        <Pagination
          count={totalPagesCategories}
          page={currentPageCategories}
          onChange={(_e, value) => { fetchDraftCategories(value); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          sx={{
            '& .MuiPaginationItem-root': { color: '#000000', fontWeight: 'bold' },
            '& .Mui-selected': { backgroundColor: `${colors.gold} !important`, color: '#fff !important' },
            '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(197,160,89,0.1)' }
          }}
        />
      </Box>

      <Dialog open={openEditCategory} onClose={() => setOpenEditCategory(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, fontSize: '1.5rem', textAlign: 'center', pb: 1, pt: 3 }}>עריכת פרטי הקטגוריה</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="כותרת הקטגוריה"
              value={selectedCategory?.name || ''}
              onChange={(e) => setSelectedCategory((prev: any) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              select fullWidth label="בחר רב"
              value={selectedCategory?.rabbiDocumentId || ''}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedLecturer = lecturers.find((l) => (l.documentId || l.id) === selectedId);
                setSelectedCategory((prev: any) => ({
                  ...prev,
                  rabbiDocumentId: selectedId,
                  rabbiName: selectedLecturer?.name || selectedLecturer?.attributes?.name,
                  rabbi: { documentId: selectedId }
                }));
              }}
            >
              <MenuItem value=""><em>ללא רב</em></MenuItem>
              {lecturers.map((l) => <MenuItem key={l.id} value={l.documentId || l.id}>{l.attributes?.name || l.name}</MenuItem>)}
            </TextField>
            <TextField
              fullWidth
              label="קדימות הקטגוריה"
              value={selectedCategory?.Priority || ''}
              onChange={(e) => setSelectedCategory((prev: any) => ({ ...prev, Priority: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenEditCategory(false)} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>ביטול</Button>
          <Button onClick={handleUpdateCategory} variant="contained" sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold', '&:hover': { bgcolor: colors.gold, color: '#000' } }}>שמור שינויים</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DraftLessons;
