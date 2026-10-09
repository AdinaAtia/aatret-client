import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton,
  DialogTitle, DialogContent, Dialog, MenuItem, DialogActions,
  Stack, Button, Popover, Autocomplete, CircularProgress, Pagination, Select
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SubCategoryTable from './SubCategoryTable';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#000', 
  BROWN_DARK: colors.gold,    
  BROWN_LIGHT: colors.gold,   
  BG_CREAM: '#fff',
  TEXT_GRAY: '#5f6368'
};

const CategoryManager = () => {
  const [openRowId, setOpenRowId] = useState<string | number | null>(null);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [, setLoadingMainCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(30);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const fetchMainCategories = async (page: number, size = pageSize) => {
    try {
      setLoadingMainCategories(true);
      const url = `${import.meta.env.VITE_API_URL}/api/categories-mains?populate=*&sort[0]=rabbi.Priority:asc&sort[1]=name:asc&pagination[page]=${page}&pagination[pageSize]=${size}`;
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

  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRabbiDocId, setSelectedRabbiDocId] = useState('');
  const [rabbiSelectValue, setRabbiSelectValue] = useState('');
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const handleSearch = async (query: string) => {
    if (query.length < 2) return setSearchOptions([]);
    setSearchLoading(true);
    try {
      const q = encodeURIComponent(query);
      const rabbiFilter = selectedRabbiDocId ? `&filters[rabbi][documentId][$eq]=${selectedRabbiDocId}` : '';
      const rabbiFilterSub = selectedRabbiDocId ? `&filters[main_category][rabbi][documentId][$eq]=${selectedRabbiDocId}` : '';
      const [mainsRes, subsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[name][$contains]=${q}${rabbiFilter}&fields[0]=name&fields[1]=documentId&populate[rabbi][fields][0]=name&pagination[pageSize]=10`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[name][$contains]=${q}${rabbiFilterSub}&fields[0]=name&fields[1]=documentId&populate[main_category][fields][0]=name&populate[main_category][fields][1]=documentId&populate[main_category][populate][rabbi][fields][0]=name&pagination[pageSize]=10`)
      ]);
      const mains = (mainsRes.data.data || []).map((c: any) => ({ ...c, _type: 'main' }));
      const subs  = (subsRes.data.data  || []).map((c: any) => ({ ...c, _type: 'sub'  }));
      setSearchOptions([...mains, ...subs]);
    } catch (e) { console.error(e); }
    finally { setSearchLoading(false); }
  };

  const handleSelectResult = async (item: any) => {
    if (!item) return;
    const isSub = item._type === 'sub';
    const targetDocId = isSub
      ? (item.main_category?.documentId || item.main_category?.data?.documentId)
      : (item.documentId || item.id);
    if (!targetDocId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories-mains?filters[documentId][$eq]=${targetDocId}&populate=*`
      );
      const result = res.data.data?.[0];
      if (!result) return;
      setMainCategories([result]);
      setTotalPages(1);
      setCurrentPage(1);
      if (isSub) setOpenRowId(result.id);
      setSearchInput('');
      setSearchOptions([]);
      setTimeout(() => {
        document.getElementById(`row-${result.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } catch (e) { console.error(e); }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchMainCategories(1, newSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRabbiFilter = async (rabbiDocId: string) => {
    setSelectedRabbiDocId(rabbiDocId);
    if (!rabbiDocId) { fetchMainCategories(1); return; }
    try {
      setLoadingMainCategories(true);
      const url = `${import.meta.env.VITE_API_URL}/api/categories-mains?populate=*&filters[rabbi][documentId][$eq]=${rabbiDocId}&sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=${pageSize}`;
      const response = await axios.get(url);
      setMainCategories(response.data.data || []);
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      setCurrentPage(1);
    } catch (e) { console.error(e); }
    finally { setLoadingMainCategories(false); }
  };

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
        `${import.meta.env.VITE_API_URL}/api/categories-mains/${docId}`, 
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

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, category: any) => {
    setAnchorEl(event.currentTarget);
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    try {
      const docId = categoryToDelete.documentId || categoryToDelete.id;
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories-mains/${docId}`);
      setAnchorEl(null); 
      fetchMainCategories(currentPage);
    } catch (error) { console.error(error); }
  };

  const handleMoveToDraft = async () => {
    try {
      const docId = categoryToDelete.documentId || categoryToDelete.id;
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories-mains/${docId}/unpublish`);
      setAnchorEl(null);
      fetchMainCategories(currentPage);
    } catch (error) { console.error(error); }
  };

  const editFieldStyle = {
    '& .MuiOutlinedInput-root': {
      direction: 'rtl' as const,
      borderRadius: '4px',
      '& fieldset': { textAlign: 'right' as const },
      '&.Mui-focused fieldset': { borderColor: colors.gold },
    },
    '& .MuiInputLabel-root': {
      right: 16, left: 'auto', transformOrigin: 'right',
      '&.Mui-focused': { color: colors.gold },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0, -9px) scale(0.75)',
      right: 10,
    }
  };

  const [lecturers, setLecturers] = useState<any[]>([]);
  const fetchLecturers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name`);
      const data: any[] = response.data.data || [];
      setLecturers(data.sort((a, b) => {
        const na = a.name || a.attributes?.name || '';
        const nb = b.name || b.attributes?.name || '';
        if (na.includes('מרדכי עטייה')) return -1;
        if (nb.includes('מרדכי עטייה')) return 1;
        return na.localeCompare(nb, 'he');
      }));
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
      </Stack>

      <Stack direction="row" gap={2} sx={{ mb: 2, width: '100%' }}>
        <Box sx={{ width: '50%' }}>
          <Autocomplete
            key={autocompleteKey}
            sx={{ width: '100%' }}
            options={searchOptions}
            loading={searchLoading}
            inputValue={searchInput}
            filterOptions={(x) => x}
            getOptionLabel={(opt) => opt.name || ''}
            onInputChange={(_, val) => { setSearchInput(val); handleSearch(val); }}
            onChange={(_, val) => handleSelectResult(val)}
            noOptionsText="לא נמצאו תוצאות"
            groupBy={(opt) => opt._type === 'main' ? 'קטגוריות ראשיות' : 'תת קטגוריות'}
            renderOption={(props, option) => {
              const isMain = option._type === 'main';
              const rabbiName = isMain ? (option.rabbi?.name || '') : (option.main_category?.rabbi?.name || '');
              const parentName = !isMain ? (option.main_category?.name || '') : null;
              return (
                <Box component="li" {...props} sx={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{option.name}</Typography>
                    {(rabbiName || parentName) && (
                      <Typography variant="caption" sx={{ color: colors.gold }}>
                        {rabbiName}{parentName && ` ← ${parentName}`}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            }}
            renderInput={(params) => (
              <Box ref={params.InputProps.ref} sx={{ display: 'flex', bgcolor: 'white', borderRadius: '8px', height: '35px', width: '100%', overflow: 'hidden' }}>
                <TextField
                  {...params}
                  placeholder="חפש קטגוריה..."
                  variant="standard"
                  InputProps={{ ...params.InputProps, disableUnderline: true, sx: { px: 2, height: '100%', fontSize: '0.9rem', '& input': { padding: '0 !important' } }, endAdornment: null }}
                  sx={{ flex: 1 }}
                />
                <IconButton size="small" sx={{ bgcolor: 'black', color: 'white', width: '45px', borderRadius: '8px', '&:hover': { bgcolor: '#333' } }}>
                  {searchLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon fontSize="small" />}
                </IconButton>
              </Box>
            )}
          />
        </Box>

        <TextField
          select
          size="small"
          sx={{
            width: '25%',
            bgcolor: 'white',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              height: '35px',
              '& fieldset': { borderColor: 'transparent', textAlign: 'right' },
              '&:hover fieldset': { borderColor: colors.gold },
              '&.Mui-focused fieldset': { borderColor: colors.gold },
            },
            '& .MuiInputLabel-root': {
              right: 14, left: 'auto', transformOrigin: 'right',
              color: '#000',
              '&.Mui-focused': { color: colors.gold },
            },
            '& .MuiInputLabel-shrink': {
              right: 14, left: 'auto',
              transform: 'translate(0, -9px) scale(0.75)',
            },
            '& .MuiSelect-icon': { left: 7, right: 'auto' },
            '& .MuiSelect-select': { paddingRight: '16px !important', paddingLeft: '32px !important', textAlign: 'right', display: 'flex', alignItems: 'center' },
          }}
          label="סנן לפי רב"
          value={rabbiSelectValue}
          onChange={(e) => { setRabbiSelectValue(e.target.value); handleRabbiFilter(e.target.value); }}
        >
          <MenuItem value="" sx={{ '&.Mui-selected': { bgcolor: '#f5f5f5' }, '&.Mui-selected:hover': { bgcolor: '#eeeeee' } }}>כל הרבנים</MenuItem>
          {lecturers.map((l) => (
            <MenuItem key={l.id} value={l.documentId || l.id}>{l.name || l.attributes?.name}</MenuItem>
          ))}
        </TextField>

        <Button
          onClick={() => { setSelectedRabbiDocId(''); setRabbiSelectValue(''); setSearchInput(''); setSearchOptions([]); setAutocompleteKey(k => k + 1); fetchMainCategories(1); }}
          variant="outlined"
          sx={{ height: '35px', borderColor: colors.gold, color: colors.gold, borderRadius: '8px', whiteSpace: 'nowrap', '&:hover': { bgcolor: colors.gold, color: '#000' } }}
        >
          נקה סינון
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography sx={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>שיעורים בעמוד:</Typography>
        <Select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          size="small"
          sx={{
            fontSize: '0.78rem',
            height: '28px',
            color: colors.gold,
            fontWeight: 700,
            '.MuiOutlinedInput-notchedOutline': { borderColor: colors.gold },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.gold },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.gold },
            '.MuiSvgIcon-root': { color: colors.gold },
          }}
        >
          {[10, 20, 30, 50, 100].map(n => (
            <MenuItem key={n} value={n} sx={{ fontSize: '0.78rem' }}>{n}</MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ bgcolor: colors.gold, width: '50px' }} />
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מזהה (Slug)</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>הרב</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מס שיעורים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>קדימות הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainCategories.map((cat, index) => {
              const attr = cat.attributes || cat;
              const realDbId = cat.id;
              const docId = cat.documentId || cat.id;
              const { name, lessons, Priority, rabbi } = attr;
              const lessonCount = Array.isArray(lessons) ? lessons.length : (lessons?.data?.length || 0);
              const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "---";
              const subCount = Array.isArray(attr.subs) ? attr.subs.length : (attr.subs?.data?.length || 0);
              const nextCat = mainCategories[index + 1];
              const nextAttr = nextCat ? (nextCat.attributes || nextCat) : null;
              const nextRabbiName = nextAttr ? (nextAttr.rabbi?.data?.attributes?.name || nextAttr.rabbi?.name || "---") : null;
              const showDivider = nextRabbiName !== null && nextRabbiName !== rabbiName;

              return (
                <React.Fragment key={realDbId}>
                  <TableRow id={`row-${realDbId}`} hover sx={{ '& td': { py: 2 } }}>
                    <TableCell align="center" />
                    <TableCell sx={{ textAlign: 'justify' }}>
                      <Stack direction="row">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{name || 'ללא שם'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{textAlign: 'center'}}><Typography variant="body2" sx={{ fontWeight: 600 }}>{realDbId}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{rabbiName}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{lessonCount}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{Priority || 0}</Typography></TableCell>
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
                    <SubCategoryTable open={true} parentDocId={docId} />
                  )}
                  {showDivider && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                        <Box sx={{ height: '3px', bgcolor: colors.gold, mx: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { borderRadius: '20px', width: '280px', boxShadow: '0px 8px 24px rgba(0,0,0,0.15)', p: 0.5 } }}
      >
        <Box sx={{ p: 2, textAlign: 'center', dir: 'rtl' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colors.gold, mb: 0.5 }}>
            ניהול סטטוס קטגוריה
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY, mb: 2 }}>
            מה ברצונך לעשות עם הקטגוריה<br />
            <strong>"{categoryToDelete?.attributes?.name || categoryToDelete?.name}"</strong>?
          </Typography>
          <Box sx={{ bgcolor: 'rgba(197,160,89,0.08)', p: 1.5, borderRadius: '10px', mb: 2.5, display: 'flex', gap: 1, border: '1px solid rgba(197,160,89,0.3)' }}>
            <Typography variant="caption" sx={{ fontSize: '11px', textAlign: 'right', color: colors.gold, lineHeight: 1.4 }}>
              העברה לטיוטה תסיר את הקטגוריה מהאתר אך תשמור אותה במערכת.
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Button fullWidth variant="contained" onClick={handleMoveToDraft}
              sx={{ bgcolor: '#000', color: colors.gold, fontWeight: 'bold', borderRadius: '8px', py: 1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>
              העבר לטיוטה (DRAFT)
            </Button>
            <Button fullWidth variant="contained" onClick={confirmDelete}
              sx={{ bgcolor: '#000', color: colors.gold, fontWeight: 800, borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>
              מחק לצמיתות
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setAnchorEl(null)}
              sx={{ color: '#000', borderColor: '#000', borderRadius: '8px', fontSize: '0.75rem' }}>
              ביטול וחזרה
            </Button>
          </Stack>
        </Box>
      </Popover>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, fontSize: '1.5rem', textAlign: 'center', pb: 1, pt: 3 }}>עריכת פרטי הקטגוריה</DialogTitle>
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
          <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>ביטול</Button>
          <Button onClick={handleUpdateMainCategories} variant="contained" sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold', '&:hover': { bgcolor: colors.gold, color: '#000' } }}>שמור שינויים</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: COLORS.TEXT_GRAY, textAlign: 'center' }}>
        סה"כ קטגוריות מוגדרות: {mainCategories.length}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, direction: 'ltr' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_e, value) => {
            fetchMainCategories(value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sx={{
            '& .MuiPaginationItem-root': { color: '#000000', fontWeight: 'bold' },
            '& .Mui-selected': { backgroundColor: `${colors.gold} !important`, color: '#fff !important' },
            '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(197,160,89,0.1)' }
          }}
        />
      </Box>
    </Box>
  );
}

export default CategoryManager;
