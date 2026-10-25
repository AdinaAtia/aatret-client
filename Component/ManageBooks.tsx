import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip,
  Stack, Button, Avatar, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Autocomplete
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { colors } from '../src/theme/tokens';
import { compressImage } from '../src/utils/compressImage';
const API = import.meta.env.VITE_API_URL;

const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    direction: 'rtl' as const,
    '& fieldset': { textAlign: 'right' as const },
    '&.Mui-focused fieldset': { borderColor: colors.gold },
    '&:hover fieldset': { borderColor: colors.gold },
  },
  '& .MuiInputLabel-root': {
    right: 28, left: 'auto', transformOrigin: 'right',
    '&.Mui-focused': { color: '#9c6644' },
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(0, -9px) scale(0.75)',
    right: 10,
  }
};

const ManageBooks = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [rabbiNames, setRabbiNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBook, setEditBook] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [addBook, setAddBook] = useState<any | null>(null);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/api/rabbi-books?populate[image]=true&populate[book_categorie]=true&pagination[pageSize]=200&sort=Priority:asc`
      );
      setBooks(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/book-categories`);
      setCategories(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRabbis = async () => {
    try {
      const res = await axios.get(`${API}/api/rabbis?fields[0]=name&pagination[pageSize]=200`);
      const names = (res.data.data || [])
        .map((r: any) => r.name || r.attributes?.name)
        .filter(Boolean);
      setRabbiNames(Array.from(new Set<string>(names)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchRabbis();
  }, []);

  const getImageUrl = (attr: any): string | null => {
    const image = attr.image;
    if (!image) return null;
    // Strapi v5 flat format: image is array
    if (Array.isArray(image) && image.length > 0) {
      const url = image[0]?.url;
      return url ? `${API}${url}` : null;
    }
    // Strapi v4 format: image.data is array
    if (image?.data?.length > 0) {
      const url = image.data[0]?.attributes?.url;
      return url ? `${API}${url}` : null;
    }
    return null;
  };

  const getCategoryName = (attr: any): string => {
    const cat = attr.book_categorie;
    if (!cat) return '—';
    return cat.name || cat.data?.attributes?.name || '—';
  };

  const getCategoryId = (attr: any): number | string => {
    const cat = attr.book_categorie;
    if (!cat) return '';
    return cat.id || cat.data?.id || '';
  };

  const handleEditClick = (book: any) => {
    const attr = book.attributes || book;
    setEditBook({
      documentId: book.documentId,
      book_name: attr.book_name || '',
      rabbi: attr.rabbi || '',
      description: attr.description || '',
      Priority: attr.Priority ?? '',
      book_categorie: getCategoryId(attr),
      imageUrl: getImageUrl(attr),
    });
  };

  const handleSaveEdit = async () => {
    if (!editBook) return;
    setSaving(true);
    try {
      const payload: any = {
        book_name: editBook.book_name,
        rabbi: editBook.rabbi,
        description: editBook.description,
        Priority: Number(editBook.Priority) || 99,
      };
      if (editBook.book_categorie) {
        payload.book_categorie = editBook.book_categorie;
      }
      await axios.put(`${API}/api/rabbi-books/${editBook.documentId}`, { data: payload });
      await fetchBooks();
      setEditBook(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editBook) return;
    try {
      const formData = new FormData();
      formData.append('files', await compressImage(file));
      const uploadRes = await axios.post(`${API}/api/upload`, formData);
      const uploadedId = uploadRes.data[0]?.id;
      const uploadedUrl = uploadRes.data[0]?.url;
      if (!uploadedId) return;
      await axios.put(`${API}/api/rabbi-books/${editBook.documentId}`, {
        data: { image: [uploadedId] }
      });
      setEditBook((prev: any) => ({ ...prev, imageUrl: `${API}${uploadedUrl}` }));
      await fetchBooks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/api/rabbi-books/${deleteId}`);
      setDeleteId(null);
      await fetchBooks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setAddBook({ book_name: '', rabbi: '', description: '', Priority: '', book_categorie: '', imageUrl: null, imageId: null });
  };

  const handleAddImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', await compressImage(file));
      const uploadRes = await axios.post(`${API}/api/upload`, formData);
      const uploadedId = uploadRes.data[0]?.id;
      const uploadedUrl = uploadRes.data[0]?.url;
      if (!uploadedId) return;
      setAddBook((prev: any) => ({ ...prev, imageUrl: `${API}${uploadedUrl}`, imageId: uploadedId }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAdd = async () => {
    if (!addBook) return;
    setSaving(true);
    try {
      const payload: any = {
        book_name: addBook.book_name,
        rabbi: addBook.rabbi,
        description: addBook.description,
        Priority: Number(addBook.Priority) || 99,
      };
      if (addBook.book_categorie) payload.book_categorie = addBook.book_categorie;
      if (addBook.imageId) payload.image = [addBook.imageId];
      await axios.post(`${API}/api/rabbi-books`, { data: payload });
      await fetchBooks();
      setAddBook(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deletingBook = books.find(b => b.documentId === deleteId);
  const deletingBookName = (() => {
    if (!deletingBook) return '';
    const attr = deletingBook.attributes || deletingBook;
    return attr.book_name || '';
  })();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#000', mb: 0.5 }}>
            ניהול ספרים
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368' }}>
            עריכה וניהול של ספרי הרבנים באתר
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{
            bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 3, fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
            transition: '0.3s'
          }}
        >
          + הוסף ספר חדש
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>תמונה</TableCell>
              <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם הספר</TableCell>
              <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם הרב</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>קטגוריה</TableCell>
              <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>תיאור</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>עדיפות</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={7}><Skeleton variant="rectangular" height={60} /></TableCell>
                </TableRow>
              ))
            ) : books.map(book => {
              const attr = book.attributes || book;
              return (
                <TableRow key={book.id} hover>
                  <TableCell align="center">
                    <Avatar
                      src={getImageUrl(attr) || ''}
                      variant="rounded"
                      sx={{ width: 52, height: 64, mx: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={700}>{attr.book_name || '—'}</Typography>
                    <Typography variant="caption" sx={{ color: colors.gold }}>ID: {book.id}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{attr.rabbi || '—'}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{getCategoryName(attr)}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: 220 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: '#5f6368'
                      }}
                    >
                      {attr.description || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600}>{attr.Priority ?? '—'}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="ערוך">
                        <IconButton onClick={() => handleEditClick(book)} sx={{ color: '#000', '&:hover': { color: colors.gold } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק">
                        <IconButton onClick={() => setDeleteId(book.documentId)} sx={{ color: '#d32f2f', '&:hover': { color: '#b71c1c' } }}>
                          <DeleteOutlineIcon fontSize="small" />
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

      {/* דיאלוג עריכה */}
      <Dialog
        open={editBook !== null}
        onClose={() => setEditBook(null)}
        dir="rtl"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, textAlign: 'center', pt: 3 }}>
          עריכת פרטי ספר
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={editBook?.imageUrl || ''}
                variant="rounded"
                sx={{ width: 80, height: 100 }}
              />
              <Button
                size="small"
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: colors.gold, fontWeight: 700, '& .MuiButton-startIcon': { ml: 1.5 } }}
              >
                החלף תמונה
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
              />
            </Box>
            <TextField
              label="שם הספר"
              value={editBook?.book_name || ''}
              onChange={e => setEditBook((prev: any) => ({ ...prev, book_name: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
            <Autocomplete
              freeSolo
              options={rabbiNames}
              value={editBook?.rabbi || ''}
              onChange={(_, val) => setEditBook((prev: any) => ({ ...prev, rabbi: val || '' }))}
              onInputChange={(_, val) => setEditBook((prev: any) => ({ ...prev, rabbi: val }))}
              renderInput={params => <TextField {...params} label="שם הרב" sx={editFieldStyle} />}
              fullWidth
            />
            <TextField
              label="תיאור"
              value={editBook?.description || ''}
              onChange={e => setEditBook((prev: any) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              sx={editFieldStyle}
            />
            <TextField
              select
              label="קטגוריה"
              value={editBook?.book_categorie || ''}
              onChange={e => setEditBook((prev: any) => ({ ...prev, book_categorie: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            >
              <MenuItem value="">ללא קטגוריה</MenuItem>
              {categories.map(cat => {
                const name = cat.name || cat.attributes?.name;
                return <MenuItem key={cat.id} value={cat.id}>{name}</MenuItem>;
              })}
            </TextField>
            <TextField
              label="עדיפות (סדר הופעה)"
              type="number"
              value={editBook?.Priority || ''}
              onChange={e => setEditBook((prev: any) => ({ ...prev, Priority: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={() => setEditBook(null)}
            variant="outlined"
            sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleSaveEdit}
            disabled={saving}
            variant="contained"
            sx={{
              bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
              transition: '0.3s'
            }}
          >
            {saving ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג הוספת ספר חדש */}
      <Dialog
        open={addBook !== null}
        onClose={() => setAddBook(null)}
        dir="rtl"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, textAlign: 'center', pt: 3 }}>
          הוספת ספר חדש
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={addBook?.imageUrl || ''}
                variant="rounded"
                sx={{ width: 80, height: 100 }}
              />
              <Button
                size="small"
                startIcon={<PhotoCameraIcon />}
                onClick={() => addFileInputRef.current?.click()}
                sx={{ color: colors.gold, fontWeight: 700, '& .MuiButton-startIcon': { ml: 1.5 } }}
              >
                {addBook?.imageUrl ? 'החלף תמונה' : 'העלה תמונה'}
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={addFileInputRef}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleAddImageUpload(f); }}
              />
            </Box>
            <TextField
              label="שם הספר"
              value={addBook?.book_name || ''}
              onChange={e => setAddBook((prev: any) => ({ ...prev, book_name: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
            <Autocomplete
              freeSolo
              options={rabbiNames}
              value={addBook?.rabbi || ''}
              onChange={(_, val) => setAddBook((prev: any) => ({ ...prev, rabbi: val || '' }))}
              onInputChange={(_, val) => setAddBook((prev: any) => ({ ...prev, rabbi: val }))}
              renderInput={params => <TextField {...params} label="שם הרב" sx={editFieldStyle} />}
              fullWidth
            />
            <TextField
              label="תיאור"
              value={addBook?.description || ''}
              onChange={e => setAddBook((prev: any) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              sx={editFieldStyle}
            />
            <TextField
              select
              label="קטגוריה"
              value={addBook?.book_categorie || ''}
              onChange={e => setAddBook((prev: any) => ({ ...prev, book_categorie: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            >
              <MenuItem value="">ללא קטגוריה</MenuItem>
              {categories.map(cat => {
                const name = cat.name || cat.attributes?.name;
                return <MenuItem key={cat.id} value={cat.id}>{name}</MenuItem>;
              })}
            </TextField>
            <TextField
              label="עדיפות (סדר הופעה)"
              type="number"
              value={addBook?.Priority || ''}
              onChange={e => setAddBook((prev: any) => ({ ...prev, Priority: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={() => setAddBook(null)}
            variant="outlined"
            sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleSaveAdd}
            disabled={saving}
            variant="contained"
            sx={{
              bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
              transition: '0.3s'
            }}
          >
            {saving ? 'שומר...' : 'הוסף ספר'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '20px', width: '300px', p: 0.5 } }}
      >
        <Box sx={{ p: 2, textAlign: 'center', direction: 'rtl' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colors.gold, mb: 0.5 }}>
            מחיקת ספר
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 2 }}>
            האם את בטוחה שברצונך למחוק את<br />
            <strong>"{deletingBookName}"</strong>?
          </Typography>
          <Box sx={{ bgcolor: 'rgba(197,160,89,0.08)', p: 1.5, borderRadius: '10px', mb: 2.5, border: '1px solid rgba(197,160,89,0.3)' }}>
            <Typography variant="caption" sx={{ fontSize: '11px', color: colors.gold, lineHeight: 1.4 }}>
              פעולה זו אינה הפיכה. הספר יימחק לצמיתות מהמערכת.
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDelete}
              sx={{
                bgcolor: '#000', color: colors.gold, fontWeight: 'bold', borderRadius: '8px', py: 1,
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
                transition: '0.3s'
              }}
            >
              מחק לצמיתות
            </Button>
            <Button
              onClick={() => setDeleteId(null)}
              variant="outlined"
              sx={{ color: '#000', borderColor: '#000', borderRadius: '8px', fontSize: '0.75rem' }}
            >
              ביטול וחזרה
            </Button>
          </Stack>
        </Box>
      </Dialog>

    </Box>
  );
};

export default ManageBooks;
