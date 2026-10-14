import { useState, useEffect, useRef } from 'react';
import { useRabbis } from '../src/context/RabbisContext';
import axios from 'axios';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip,
  Stack, Button, Avatar, Skeleton, Dialog, DialogTitle,
  DialogContent, DialogActions, Checkbox, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';

import { colors } from '../src/theme/tokens';
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

const DAYS = [
  { value: 'sunday', label: 'יום א׳' },
  { value: 'monday', label: 'יום ב׳' },
  { value: 'tuesday', label: 'יום ג׳' },
  { value: 'wednesday', label: 'יום ד׳' },
  { value: 'thursday', label: 'יום ה׳' },
  { value: 'friday', label: 'יום ו׳' },
  { value: 'saturday', label: 'שבת' },
];

interface ScheduleRow { day: string; startTime: string; endTime: string; topic: string }

const emptyRow = (): ScheduleRow => ({ day: 'monday', startTime: '', endTime: '', topic: '' });

// Strapi שומר "HH:mm:ss.SSS", שדה input מצפה ל-"HH:mm"
const toInputTime = (t?: string | null) => (t ? t.slice(0, 5) : '');
const toApiTime = (t: string) => (t ? `${t}:00.000` : null);

// הקלדה חופשית של ספרות בלבד; הנקודתיים נוספות אוטומטית: 1945 -> 19:45
const formatTimeInput = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
};

const isValidTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

const validateSchedule = (rows: ScheduleRow[]): string | null => {
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const n = i + 1;
    if (!r.startTime) return `שיעור ${n}: חסרה שעת התחלה`;
    if (!isValidTime(r.startTime)) return `שיעור ${n}: שעת ההתחלה לא תקינה (כתבו למשל 19:45)`;
    if (r.endTime && !isValidTime(r.endTime)) return `שיעור ${n}: שעת הסיום לא תקינה (כתבו למשל 21:00)`;
    if (!r.topic.trim()) return `שיעור ${n}: חסר נושא`;
    if (r.endTime && r.endTime <= r.startTime) return `שיעור ${n}: שעת הסיום חייבת להיות אחרי שעת ההתחלה`;
  }
  return null;
};

const ManageRabbis = () => {
  const { refreshRabbis } = useRabbis();
  const [rabbis, setRabbis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneOnly, setNewPhoneOnly] = useState(false);
  const [editRabbi, setEditRabbi] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [touchedTimes, setTouchedTimes] = useState<Record<string, boolean>>({});
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState<'publish' | 'unpublish' | 'delete' | null>(null);
  const [confirmBulk, setConfirmBulk] = useState<'publish' | 'unpublish' | 'delete' | null>(null);

  const fetchRabbis = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/rabbis/admin/all`);
      setRabbis((res.data.data || []).map((r: any) => {
        const firstPhoto = r.photo_url?.[0] || null;
        const photoPath = firstPhoto?.url || null;
        return {
          id: r.id,
          documentId: r.documentId,
          name: r.name || '',
          priority: r.Priority ?? '',
          email: r.email || '',
          phoneOnly: Boolean(r.phoneOnly),
          publishedAt: r.publishedAt || null,
          photoUrl: photoPath ? `${API}${photoPath}` : null,
          totalLessons: r.totalLessons ?? 0,
          totalViews: r.totalViews ?? 0,
          viewedLessons: r.viewedLessons ?? 0,
          schedule: (r.schedule || []).map((s: any): ScheduleRow => ({
            day: s.day,
            startTime: toInputTime(s.startTime),
            endTime: toInputTime(s.endTime),
            topic: s.topic || '',
          })),
        };
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRabbis(); }, []);

  const handleBulkPublish = async () => {
    setBulkLoading('publish');
    try {
      await Promise.all(selectedIds.map(docId =>
        axios.post(`${API}/api/rabbis/${docId}/publish`)
      ));
      setSelectedIds([]);
      setConfirmBulk(null);
      await fetchRabbis();
      await refreshRabbis();
    } catch (e) {
      console.error(e);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleBulkUnpublish = async () => {
    setBulkLoading('unpublish');
    try {
      await Promise.all(selectedIds.map(docId =>
        axios.post(`${API}/api/rabbis/${docId}/unpublish`)
      ));
      setSelectedIds([]);
      setConfirmBulk(null);
      await fetchRabbis();
      await refreshRabbis();
    } catch (e) {
      console.error(e);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading('delete');
    try {
      await Promise.all(selectedIds.map(docId =>
        axios.delete(`${API}/api/rabbis/${docId}`)
      ));
      setSelectedIds([]);
      setConfirmBulk(null);
      await fetchRabbis();
      await refreshRabbis();
    } catch (e) {
      console.error(e);
    } finally {
      setBulkLoading(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editRabbi) return;
    const err = validateSchedule(editRabbi.schedule || []);
    if (err) { setScheduleError(err); return; }
    setScheduleError(null);
    setSaving(true);
    try {
      await axios.put(`${API}/api/rabbis/${editRabbi.documentId}`, {
        data: {
          name: editRabbi.name,
          Priority: Number(editRabbi.priority),
          email: editRabbi.email?.trim() || null,
          phoneOnly: Boolean(editRabbi.phoneOnly),
          schedule: (editRabbi.schedule || []).map((s: ScheduleRow) => ({
            day: s.day,
            startTime: toApiTime(s.startTime),
            endTime: toApiTime(s.endTime),
            topic: s.topic.trim(),
          })),
        }
      });
      await fetchRabbis();
      await refreshRabbis();
      setEditRabbi(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const rabbiToDelete = rabbis.find(r => r.id === deleteId);
      await axios.delete(`${API}/api/rabbis/${rabbiToDelete?.documentId || deleteId}`);
      setRabbis(prev => prev.filter(r => r.id !== deleteId));
      await refreshRabbis();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteId(null);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!editRabbi) return;
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadRes = await axios.post(`${API}/api/upload`, formData);
      const uploadedId = uploadRes.data[0]?.id;
      const uploadedUrl = uploadRes.data[0]?.url;
      if (!uploadedId) return;
      await axios.put(`${API}/api/rabbis/${editRabbi.documentId}`, {
        data: { photo_url: [uploadedId] }
      });
      setEditRabbi((prev: any) => ({ ...prev, photoUrl: `${API}${uploadedUrl}` }));
      fetchRabbis();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      let photoId: number | null = null;
      if (newPhotoFile) {
        const formData = new FormData();
        formData.append('files', newPhotoFile);
        const uploadRes = await axios.post(`${API}/api/upload`, formData);
        photoId = uploadRes.data[0]?.id ?? null;
      }
      await axios.post(`${API}/api/rabbis`, {
        data: {
          name: newName.trim(),
          Priority: Number(newPriority) || 99,
          ...(newEmail.trim() ? { email: newEmail.trim() } : {}),
          phoneOnly: newPhoneOnly,
          ...(photoId ? { photo_url: [photoId] } : {})
        }
      });
      setAddOpen(false);
      setNewName('');
      setNewPriority('');
      setNewEmail('');
      setNewPhoneOnly(false);
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      fetchRabbis();
      refreshRabbis();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (rabbi: any) => {
    setScheduleError(null);
    setTouchedTimes({});
    setEditRabbi({ ...rabbi });
  };

  // שגיאת ולידציה חיה לשדה שעה: מוצגת בסיום הקלדה (5 תווים) או ביציאה מהשדה
  const timeError = (i: number, field: 'startTime' | 'endTime', row: ScheduleRow): string | null => {
    const v = row[field];
    if (!v) return null;
    const done = v.length === 5 || touchedTimes[`${i}-${field}`];
    if (!done) return null;
    if (!isValidTime(v)) return 'שעה לא תקינה';
    if (field === 'endTime' && isValidTime(row.startTime) && v <= row.startTime) return 'חייבת להיות אחרי שעת ההתחלה';
    return null;
  };
  const touchTime = (i: number, field: 'startTime' | 'endTime') =>
    setTouchedTimes(prev => ({ ...prev, [`${i}-${field}`]: true }));

  const updateRow = (index: number, patch: Partial<ScheduleRow>) =>
    setEditRabbi((prev: any) => ({
      ...prev,
      schedule: prev.schedule.map((r: ScheduleRow, i: number) => (i === index ? { ...r, ...patch } : r)),
    }));
  const addRow = () =>
    setEditRabbi((prev: any) => ({ ...prev, schedule: [...(prev.schedule || []), emptyRow()] }));
  const removeRow = (index: number) =>
    setEditRabbi((prev: any) => ({ ...prev, schedule: prev.schedule.filter((_: ScheduleRow, i: number) => i !== index) }));

  const allSelected = rabbis.length > 0 && selectedIds.length === rabbis.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < rabbis.length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#000', mb: 0.5 }}>
            ניהול רבנים
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368' }}>
            הוספה, עריכה וניהול של הרבנים באתר
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', height: '45px', px: 3, fontWeight: 'bold', '&:hover': { bgcolor: colors.gold, color: '#000' } }}
        >
          הוסף רב
        </Button>
      </Stack>

      {/* כפתורי פעולה מרובה */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Tooltip title={selectedIds.length > 0 ? `פרסם ${selectedIds.length} נבחרים` : 'פרסם נבחרים'}>
          <IconButton
            onClick={() => selectedIds.length > 0 && setConfirmBulk('publish')}
            sx={{ color: colors.gold, '&:hover': { bgcolor: 'rgba(197,160,89,0.1)' } }}
          >
            <PublishIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={selectedIds.length > 0 ? `העבר ${selectedIds.length} לטיוטה` : 'העבר לטיוטה'}>
          <IconButton
            onClick={() => selectedIds.length > 0 && setConfirmBulk('unpublish')}
            sx={{ color: colors.gold, '&:hover': { bgcolor: 'rgba(197,160,89,0.1)' } }}
          >
            <UnpublishedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={selectedIds.length > 0 ? `מחק ${selectedIds.length} נבחרים` : 'מחק נבחרים'}>
          <IconButton
            onClick={() => selectedIds.length > 0 && setConfirmBulk('delete')}
            sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
        {selectedIds.length > 0 && !confirmBulk && (
          <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 600 }}>
            {selectedIds.length} נבחרו
          </Typography>
        )}
        {confirmBulk && (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="caption" sx={{ color: confirmBulk === 'delete' ? '#d32f2f' : colors.gold, fontWeight: 700 }}>
              {confirmBulk === 'publish' ? `לפרסם ${selectedIds.length} רבנים?` : confirmBulk === 'unpublish' ? `להעביר ${selectedIds.length} לטיוטה?` : `למחוק ${selectedIds.length} רבנים לצמיתות?`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              disabled={bulkLoading !== null}
              onClick={confirmBulk === 'publish' ? handleBulkPublish : confirmBulk === 'unpublish' ? handleBulkUnpublish : handleBulkDelete}
              sx={{ bgcolor: '#000', color: colors.gold, fontSize: '0.7rem', px: 1, py: 0.3, minWidth: 0, '&:hover': { bgcolor: colors.gold, color: '#000' } }}
            >
              {bulkLoading ? <CircularProgress size={14} color="inherit" /> : 'כן'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setConfirmBulk(null)}
              sx={{ color: '#000', borderColor: '#000', fontSize: '0.7rem', px: 1, py: 0.3, minWidth: 0 }}
            >
              ביטול
            </Button>
          </Stack>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: colors.gold, width: 40 }}>
                <Checkbox
                  size="small"
                  sx={{ color: '#000', '&.Mui-checked': { color: '#000' }, '&.MuiCheckbox-indeterminate': { color: '#000' }, p: 0 }}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(rabbis.map(r => r.documentId));
                    else setSelectedIds([]);
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>תמונה</TableCell>
              <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם</TableCell>
              <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>כתובת מייל</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>עדיפות</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שיעורים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>כניסות</TableCell>
<TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>hits per lesson</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פרסום</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={10}><Skeleton variant="rectangular" height={60} /></TableCell>
                </TableRow>
              ))
            ) : rabbis.map(rabbi => (
              <TableRow key={rabbi.id} hover onClick={() => openEdit(rabbi)} sx={{ cursor: 'pointer' }}>
                <TableCell sx={{ width: 40, py: 0 }} onClick={e => e.stopPropagation()}>
                  <Checkbox
                    size="small"
                    sx={{ p: 0, color: colors.gold, '&.Mui-checked': { color: colors.gold } }}
                    checked={selectedIds.includes(rabbi.documentId)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(prev => [...prev, rabbi.documentId]);
                      else setSelectedIds(prev => prev.filter(x => x !== rabbi.documentId));
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Avatar src={rabbi.photoUrl || ''} sx={{ width: 52, height: 52, mx: 'auto' }} />
                </TableCell>

                <TableCell align="right">
                  <Typography fontWeight={700}>{rabbi.name}</Typography>
                  <Typography variant="caption" sx={{ color: colors.gold }}>ID: {rabbi.id}</Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: rabbi.email ? '#000' : '#bdbdbd', direction: 'ltr', textAlign: 'right' }}>
                    {rabbi.email || 'לא הוגדר'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography fontWeight={600}>{rabbi.priority}</Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography fontWeight={600}>{rabbi.totalLessons}</Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography fontWeight={600}>{rabbi.totalViews.toLocaleString()}</Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography fontWeight={600}>
                    {rabbi.totalLessons > 0 ? Math.round(rabbi.totalViews / rabbi.totalLessons).toLocaleString() : 0}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {rabbi.publishedAt
                    ? <CheckCircleIcon sx={{ color: colors.gold, fontSize: 22 }} />
                    : <RemoveCircleOutlineIcon sx={{ color: '#bdbdbd', fontSize: 22 }} />
                  }
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <Tooltip title="ערוך פרטים">
                      <IconButton onClick={() => openEdit(rabbi)} sx={{ color: '#000', '&:hover': { color: colors.gold } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחק">
                      <IconButton onClick={(e) => { e.stopPropagation(); setDeleteId(rabbi.id); }} sx={{ color: '#d32f2f', '&:hover': { color: '#b71c1c' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג עריכה */}
      <Dialog open={editRabbi !== null} onClose={() => setEditRabbi(null)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 900, color: colors.gold, textAlign: 'center', pt: 3 }}>
          עריכת פרטי רב
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar src={editRabbi?.photoUrl || ''} sx={{ width: 80, height: 80 }} />
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
                onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
              />
            </Box>
            <TextField
              label="שם הרב"
              value={editRabbi?.name || ''}
              onChange={e => setEditRabbi((prev: any) => ({ ...prev, name: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
            <TextField
              label="עדיפות (סדר הופעה)"
              type="number"
              value={editRabbi?.priority || ''}
              onChange={e => setEditRabbi((prev: any) => ({ ...prev, priority: e.target.value }))}
              fullWidth
              sx={editFieldStyle}
            />
            <TextField
              label="כתובת מייל (לקבלת שאלות ותגובות)"
              type="email"
              value={editRabbi?.email || ''}
              onChange={e => setEditRabbi((prev: any) => ({ ...prev, email: e.target.value }))}
              fullWidth
              inputProps={{ dir: 'ltr', style: { textAlign: 'right' } }}
              sx={editFieldStyle}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(editRabbi?.phoneOnly)}
                  onChange={e => setEditRabbi((prev: any) => ({ ...prev, phoneOnly: e.target.checked }))}
                  sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }}
                />
              }
              label="מרחב קולי בלבד (שיעורים בקו הטלפוני, אין שיעורים באתר)"
              sx={{ mx: 0 }}
            />

            <Box>
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>זמני לימוד ונושאים</Typography>
              <Typography variant="caption" sx={{ color: '#5f6368', display: 'block', mb: 1.5 }}>
                כל שורה היא שיעור אחד. אפשר להוסיף כמה שיעורים באותו יום. שעת סיום אינה חובה.
              </Typography>
              <Stack spacing={1.5}>
                {(editRabbi?.schedule || []).map((row: ScheduleRow, i: number) => (
                  <Box key={i} sx={{ border: '1px solid rgba(197,160,89,0.4)', borderRadius: '10px', p: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <TextField
                        select
                        SelectProps={{ native: true }}
                        label="יום"
                        size="small"
                        value={row.day}
                        onChange={e => updateRow(i, { day: e.target.value })}
                        sx={{ ...editFieldStyle, minWidth: 100 }}
                        InputLabelProps={{ shrink: true }}
                      >
                        {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </TextField>
                      <TextField
                        label="משעה"
                        placeholder="19:45"
                        size="small"
                        value={row.startTime}
                        onChange={e => updateRow(i, { startTime: formatTimeInput(e.target.value) })}
                        onBlur={() => touchTime(i, 'startTime')}
                        error={!!timeError(i, 'startTime', row)}
                        helperText={timeError(i, 'startTime', row) || ' '}
                        FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'nowrap', textAlign: 'center' } }}
                        inputProps={{ inputMode: 'numeric', maxLength: 5, dir: 'ltr', style: { textAlign: 'center' } }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ ...editFieldStyle, width: 100 }}
                      />
                      <TextField
                        label="עד שעה"
                        placeholder="21:00"
                        size="small"
                        value={row.endTime}
                        onChange={e => updateRow(i, { endTime: formatTimeInput(e.target.value) })}
                        onBlur={() => touchTime(i, 'endTime')}
                        error={!!timeError(i, 'endTime', row)}
                        helperText={timeError(i, 'endTime', row) || ' '}
                        FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'nowrap', textAlign: 'center' } }}
                        inputProps={{ inputMode: 'numeric', maxLength: 5, dir: 'ltr', style: { textAlign: 'center' } }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ ...editFieldStyle, width: 100 }}
                      />
                      <Tooltip title="מחק שיעור">
                        <IconButton onClick={() => removeRow(i)} sx={{ color: '#d32f2f' }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                      <TextField
                        label="נושא"
                        size="small"
                        fullWidth
                        value={row.topic}
                        onChange={e => updateRow(i, { topic: e.target.value })}
                        sx={editFieldStyle}
                      />
                    </Stack>
                  </Box>
                ))}
                {scheduleError && (
                  <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 700 }}>{scheduleError}</Typography>
                )}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addRow}
                  sx={{ alignSelf: 'flex-start', color: colors.gold, fontWeight: 700, '& .MuiButton-startIcon': { ml: 1.5 } }}
                >
                  הוסף שיעור
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setEditRabbi(null)} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>
            ביטול
          </Button>
          <Button
            onClick={handleSaveEdit}
            disabled={saving}
            variant="contained"
            sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}
          >
            {saving ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג אישור מחיקה */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '20px', width: '300px', p: 0.5 } }}>
        <Box sx={{ p: 2, textAlign: 'center', direction: 'rtl' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colors.gold, mb: 0.5 }}>
            מחיקת רב
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 2 }}>
            האם את בטוחה שברצונך למחוק את<br />
            <strong>"{rabbis.find(r => r.id === deleteId)?.name}"</strong>?
          </Typography>
          <Box sx={{ bgcolor: 'rgba(197,160,89,0.08)', p: 1.5, borderRadius: '10px', mb: 2.5, border: '1px solid rgba(197,160,89,0.3)' }}>
            <Typography variant="caption" sx={{ fontSize: '11px', color: colors.gold, lineHeight: 1.4 }}>
              פעולה זו אינה הפיכה. הרב יימחק לצמיתות מהמערכת.
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Button fullWidth variant="contained" onClick={handleDelete}
              sx={{ bgcolor: '#000', color: colors.gold, fontWeight: 'bold', borderRadius: '8px', py: 1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>
              מחק לצמיתות
            </Button>
            <Button onClick={() => setDeleteId(null)} variant="outlined"
              sx={{ color: '#000', borderColor: '#000', borderRadius: '8px', fontSize: '0.75rem' }}>
              ביטול וחזרה
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {/* דיאלוג הוספת רב */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle sx={{ direction: 'rtl', color: colors.gold, fontWeight: 900, textAlign: 'center' }}>הוספת רב חדש</DialogTitle>
        <DialogContent sx={{ direction: 'rtl', pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar src={newPhotoPreview || ''} sx={{ width: 80, height: 80 }} />
              <Button
                size="small"
                startIcon={<PhotoCameraIcon />}
                onClick={() => addFileInputRef.current?.click()}
                sx={{ color: colors.gold, fontWeight: 700, '& .MuiButton-startIcon': { ml: 1.5 } }}
              >
                העלה תמונה
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={addFileInputRef}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setNewPhotoFile(f); setNewPhotoPreview(URL.createObjectURL(f)); }
                }}
              />
            </Box>
            <TextField label="שם הרב" value={newName} onChange={e => setNewName(e.target.value)} fullWidth autoFocus sx={editFieldStyle} />
            <TextField label="עדיפות (סדר הופעה)" type="number" value={newPriority} onChange={e => setNewPriority(e.target.value)} fullWidth sx={editFieldStyle} />
            <TextField label="כתובת מייל (לקבלת שאלות ותגובות)" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} fullWidth inputProps={{ dir: 'ltr', style: { textAlign: 'right' } }} sx={editFieldStyle} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newPhoneOnly}
                  onChange={e => setNewPhoneOnly(e.target.checked)}
                  sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }}
                />
              }
              label="מרחב קולי בלבד (שיעורים בקו הטלפוני, אין שיעורים באתר)"
              sx={{ mx: 0 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setAddOpen(false)} variant="outlined" sx={{ borderRadius: '8px', color: '#000', borderColor: '#000' }}>ביטול</Button>
          <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: '#000', color: colors.gold, borderRadius: '8px', px: 4, fontWeight: 'bold', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' }, transition: '0.3s' }}>שמור</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ManageRabbis;
