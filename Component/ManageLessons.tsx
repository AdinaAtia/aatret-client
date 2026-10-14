
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton, Tooltip,
  Stack, Button, MenuItem, Pagination, Checkbox, Select, Snackbar, Alert, Chip, CircularProgress
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import EditLessonDialog, { type ConvertState } from './EditLessonDialog';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteActionPopover from './DeleteActionPopover';
import { getPdfList } from './shared/pdfFiles';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#000', 
  BROWN_DARK: colors.gold,    
  BROWN_LIGHT: colors.gold,   
  BG_CREAM: '#fff',
  TEXT_GRAY: '#5f6368'
};

const ManageLessons = () => {
     const [lecturers, setLecturers] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(30);
 const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
const [selectedLesson, setSelectedLesson] = React.useState<any>(null);
const [openEdit, setOpenEdit] = useState(false);//אחראי על הדילוג
const handleEditClick = (lesson: any) => {
  const attributes = lesson.attributes || lesson;

  const rabbiName = attributes.rabbi?.data?.attributes?.name || attributes.rabbi?.name;
  const matchedLecturer = lecturers.find(
    l => (l.name || l.attributes?.name) === rabbiName
  );

  const enrichedRabbi = matchedLecturer
    ? { ...attributes.rabbi, documentId: matchedLecturer.documentId }
    : attributes.rabbi;

  setSelectedLesson({
    ...attributes,
    rabbi: enrichedRabbi,
    id: lesson.documentId || lesson.id
  });
  setOpenEdit(true);
};
const [isSyncing, setIsSyncing] = useState(false);
const [isSyncingViews, setIsSyncingViews] = useState(false);
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
const [playingAudio, setPlayingAudio] = useState<{ url: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rabbiSelectValue, setRabbiSelectValue] = useState('');
  const [selectedRabbiDocId, setSelectedRabbiDocId] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // המרות שרצות ברקע, לפי documentId של השיעור — מוצגות כתגית בשורה
  const [conversions, setConversions] = useState<Record<string, ConvertState>>({});
  const refreshRef = useRef<() => void>(() => {});
  refreshRef.current = () => fetchLessons(currentPage, searchQuery, selectedRabbiDocId);

  const dismissConversion = (docId: string) =>
    setConversions(prev => { const next = { ...prev }; delete next[docId]; return next; });

  const handleConvertChange = (docId: string, state: ConvertState) => {
    setConversions(prev => ({ ...prev, [docId]: state }));
    if (state.status === 'running') return;

    if (state.status === 'done') {
      setSnackbar({ open: true, message: 'ההמרה הסתיימה בהצלחה', severity: 'success' });
      refreshRef.current();
      setTimeout(() => dismissConversion(docId), 6000);
    } else if (state.status === 'failed') {
      setSnackbar({ open: true, message: `ההמרה נכשלה: ${state.error || 'שגיאה לא ידועה'}`, severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'ההמרה עדיין רצה בשרת — בדקי בעוד כמה דקות', severity: 'success' });
    }
  };

  const handleRabbiFilter = (rabbiDocId: string) => {
    setSelectedRabbiDocId(rabbiDocId);
    fetchLessons(1, searchQuery, rabbiDocId);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchLessons(1, searchQuery, selectedRabbiDocId, newSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
const handleSync = async () => {
  // הפעלת מצב טעינה בכפתור
  setIsSyncing(true);
  
  try {
    // שליחת בקשה לשרת לביצוע סנכרון מול יוטיוב
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/sync`);
    console.log("response",response);
    
    
    // רענן את הטבלה לאחר הסנכרון
    await fetchLessons(currentPage);
    
    alert(`הנתונים עודכנו בהצלחה! נוספו ${response.data.added} שיעורים, דולגו ${response.data.skipped}`);
  } catch (error) {
    console.error('Sync error:', error);
    alert('שגיאה בעדכון הנתונים.');
  } finally {
    // כיבוי מצב הטעינה בסיום (גם במקרה של הצלחה וגם בשגיאה)
    setIsSyncing(false);
  }
};
const handleSyncViews = async () => {
  setIsSyncingViews(true);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/sync-views`);
    const missing: string[] = response.data.missing || [];
    alert(
      `עדכון צפיות הסתיים! עודכנו ${response.data.updated} מתוך ${response.data.total} סרטונים` +
      (response.data.baselined ? `\n${response.data.baselined} סרטונים נשמרו כבסיס — הצפיות שלהם יתעדכנו מהסנכרון הבא` : '') +
      (missing.length ? `\nלא עודכנו (נמחקו/פרטיים/צפיות מוסתרות): ${missing.join(', ')}` : '')
    );
  } catch (error) {
    console.error('Sync views error:', error);
    alert('שגיאה בעדכון הצפיות.');
  } finally {
    setIsSyncingViews(false);
  }
};

const getAudioUrl = (attr: any) => {
  const cleanDir = (attr.AudioDir || '').startsWith('/')
    ? attr.AudioDir.slice(1)
    : (attr.AudioDir || '');
  return `/api/lessons/download-file?audioDir=${encodeURIComponent(cleanDir)}&audioFileName=${encodeURIComponent(attr.AudioFileName)}`;
};

const getPdfUrl = (attr: any, fileName: string) => {
  const cleanDir = (attr.PdfDir || '').startsWith('/')
    ? attr.PdfDir.slice(1)
    : (attr.PdfDir || '');
  return `/api/lessons/download-file?audioDir=${encodeURIComponent(cleanDir)}&audioFileName=${encodeURIComponent(fileName)}`;
};

const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, lesson: any) => {
  setAnchorEl(event.currentTarget);
  setSelectedLesson(lesson);
};

const handleClosePopover = () => {
  setAnchorEl(null);
  setSelectedLesson(null);
};

const downloadLesson = (attr: any) => {
  const cleanDir = (attr.AudioDir || '').replace(/^\/+|\/+$/g, '');
  const file = `${cleanDir}/${attr.AudioFileName}`;
  const params = new URLSearchParams({ key: 'ATERET_DL_2026', file, title: attr.title || attr.AudioFileName });
  const a = document.createElement('a');
  a.href = `https://ateretmordechaifiles.com/download.php?${params}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleBulkDownload = () => {
  const toDownload = lessons.filter(lesson => {
    const id = lesson.documentId || String(lesson.id);
    const attr = lesson.attributes || lesson;
    return selectedIds.includes(id) && attr.AudioFileName;
  });
  toDownload.forEach((lesson, index) => {
    setTimeout(() => downloadLesson(lesson.attributes || lesson), index * 3000);
  });
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
    fetchLessons(currentPage);
  } catch (error) {
    console.error('שגיאה במחיקה מרובה:', error);
    alert('חלה שגיאה במחיקה. נסי שוב.');
  }
};

 const fetchLessons = async (page: number, query = searchQuery, rabbiId = selectedRabbiDocId, size = pageSize) => {
  try {
    setLoadingLessons(true);
    const searchParam = query ? `&search=${encodeURIComponent(query)}` : '';
    const rabbiFilter = rabbiId ? `&rabbiDocId=${rabbiId}` : '';
    const url = `${import.meta.env.VITE_API_URL}/api/lessons/fast?page=${page}&pageSize=${size}${rabbiFilter}${searchParam}`;
    const response = await axios.get(url);
    const lessonsData = response.data.data || [];
    setLessons(lessonsData);
    const pagination = response.data.meta?.pagination;
    if (pagination) {
      setTotalPages(pagination.pageCount);
      setCurrentPage(page);
    }
  } catch (error) {
    console.error('שגיאה בשליפת שיעורים:', error);
  } finally {
    setLoadingLessons(false);
  }
};
const getCategoryDisplay = (row: any) => {
  const attr = row?.attributes || row;
  if (!attr) return "ללא נתונים";

  const names: string[] = [];

  if (attr.main_category?.data?.attributes?.name) {
    names.push(attr.main_category.data.attributes.name);
  }

  const collectSubNames = (subData: any) => {
    const currentAttr = subData?.attributes;
    if (!currentAttr) return;
    if (currentAttr.parent_sub?.data) {
      collectSubNames(currentAttr.parent_sub.data);
    }
    if (currentAttr.name) {
      names.push(currentAttr.name);
    }
  };

  collectSubNames(attr.sub_category?.data);

  const uniqueNames = names.filter((name, index) => names.indexOf(name) === index);

  return uniqueNames.length > 0 ? uniqueNames.join(" » ") : "ללא קטגוריה";
};

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

  return (
  <>
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
    <Box sx={{ width: '100%', maxWidth: '100%' }}>  
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#000', mb: 0.5 }}>
          ניהול שיעורים
        </Typography>
        <Typography variant="body2" sx={{ color: '#5f6368' }}>
          הוספה, עריכה וניהול של השיעורים באתר
        </Typography>
      </Box>

      <Stack direction="row" gap={2} sx={{ mb: 2, width: '100%' }}>
        <Box sx={{ width: '50%', display: 'flex', bgcolor: 'white', borderRadius: '8px', height: '35px', overflow: 'hidden', border: '1px solid #eee' }}>
          <input
            type="text"
            placeholder="חפש שיעור..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchLessons(1, e.target.value, selectedRabbiDocId);
            }}
            style={{ flex: 1, border: 'none', outline: 'none', padding: '0 16px', fontSize: '0.9rem', direction: 'rtl', fontFamily: 'inherit', background: 'transparent' }}
          />
          <Box sx={{ width: '35px', height: '35px', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', flexShrink: 0 }}>
            <SearchIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
        </Box>

        <TextField
          select
          size="small"
          value={rabbiSelectValue}
          onChange={(e) => { setRabbiSelectValue(e.target.value); handleRabbiFilter(e.target.value); }}
          label="סנן לפי רב"
          sx={{
            width: '25%', bgcolor: 'white', borderRadius: '8px',
            '& .MuiOutlinedInput-root': { borderRadius: '8px', height: '35px', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } },
            '& .MuiInputLabel-root': { right: 14, left: 'auto', transformOrigin: 'right', color: '#000', '&.Mui-focused': { color: colors.gold } },
            '& .MuiInputLabel-shrink': { right: 14, left: 'auto', transform: 'translate(0, -9px) scale(0.75)' },
            '& .MuiSelect-icon': { left: 7, right: 'auto' },
            '& .MuiSelect-select': { paddingRight: '16px !important', paddingLeft: '32px !important', textAlign: 'right', display: 'flex', alignItems: 'center' },
          }}
        >
          <MenuItem value="">כל הרבנים</MenuItem>
          {lecturers.map((l) => (
            <MenuItem key={l.id} value={l.documentId || l.id}>{l.name || l.attributes?.name}</MenuItem>
          ))}
        </TextField>

        <Button
          onClick={() => { setSelectedRabbiDocId(''); setRabbiSelectValue(''); setSearchQuery(''); fetchLessons(1, '', ''); }}
          variant="outlined"
          sx={{ height: '35px', borderColor: colors.gold, color: colors.gold, borderRadius: '8px', whiteSpace: 'nowrap', '&:hover': { bgcolor: colors.gold, color: '#000' } }}
        >
          נקה סינון
        </Button>

        <Button
          variant="contained"
          onClick={handleSync}
          disabled={isSyncing}
          sx={{
            bgcolor: '#000',
            color: colors.gold,
            borderRadius: '8px',
            height: '35px',
            px: 4,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
            transition: '0.3s',
            '&.Mui-disabled': { backgroundColor: '#666', color: '#ccc' }
          }}
        >
          {isSyncing ? 'מעדכן מיוטיוב...' : 'עדכן שיעורים'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleSyncViews}
          disabled={isSyncingViews}
          sx={{
            borderColor: colors.gold,
            color: colors.gold,
            borderRadius: '8px',
            height: '35px',
            px: 3,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: colors.gold, color: '#000' },
            transition: '0.3s',
            '&.Mui-disabled': { borderColor: '#666', color: '#666' }
          }}
        >
          {isSyncingViews ? 'מעדכן צפיות...' : 'עדכן צפיות יוטיוב'}
        </Button>

      </Stack>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center', gap: 1 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Tooltip title={selectedIds.length > 0 ? `מחק ${selectedIds.length} שיעורים נבחרים` : 'מחק נבחרים'}>
      <IconButton onClick={() => selectedIds.length > 0 && setConfirmBulkDelete(true)} sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}>
        <DeleteOutlineIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title={selectedIds.length > 0 ? `הורד ${selectedIds.length} שיעורים נבחרים` : 'הורד נבחרים'}>
      <IconButton onClick={handleBulkDownload} sx={{ color: colors.gold, '&:hover': { bgcolor: 'rgba(197,160,89,0.1)' } }}>
        <FileDownloadOutlinedIcon />
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
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    if (e.target.checked) {
                      setSelectedIds(lessons.map(l => l.documentId || String(l.id)));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פרטי השיעור</TableCell>
              <TableCell align="center"  sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>תאריכים</TableCell>
             <TableCell align="right" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 , textAlign: 'center' }}>קטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>משך</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700, textAlign: 'center' }}>צפיות</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>סוגים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700, textAlign: 'center' }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingLessons ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>טוען נתונים...</TableCell></TableRow>
            ) : (
              lessons.map((lesson) => {
               const attr = lesson.attributes || lesson;
               const realDbId = lesson.id;
const { rabbi } = attr;   const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "";
                // חילוץ נתוני הרב כפי שעשית בקוד ה-AllLessons
// console.log(`Original ID: ${lesson.id}, Title: ${attr.title}`);
                return (
                  <TableRow key={lesson.id} id={`row-${lesson.id}`} hover onClick={() => handleEditClick(lesson)} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ width: 40, py: 0 }}>
                      <Checkbox
                        size="small"
                        sx={{ p: 0, color: colors.gold, '&.Mui-checked': { color: colors.gold } }}
                        checked={selectedIds.includes(lesson.documentId || String(lesson.id))}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const id = lesson.documentId || String(lesson.id);
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, id]);
                          } else {
                            setSelectedIds(prev => prev.filter(x => x !== id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'justify', py: 0 }}>
                      <Typography variant="body2" alignItems="center" sx={{textAlign: 'justify',fontWeight: 700 }}>{attr.title || `שיעור ${lesson.id}`}</Typography>
                      <Typography variant="caption" sx={{textAlign: 'justify', color: COLORS.BROWN_LIGHT, fontWeight: 600 }}>
                        {rabbiName ? `${rabbiName} | ` : ''}ID: {realDbId}
                      </Typography>
                      {(() => {
                        const conv = conversions[lesson.documentId];
                        if (!conv) return null;
                        const running = conv.status === 'running';
                        const done = conv.status === 'done';
                        const failed = conv.status === 'failed';
                        const label = running
                          ? `ממיר ברקע${conv.stage ? ` · ${conv.stage}` : ''}…`
                          : done ? '✓ ההמרה הסתיימה'
                          : failed ? 'ההמרה נכשלה'
                          : 'ההמרה עדיין רצה בשרת';
                        return (
                          <Box sx={{ mt: 0.5, mb: 0.5 }} onClick={(e) => e.stopPropagation()}>
                            <Tooltip title={failed ? (conv.error || '') : ''}>
                              <Chip
                                size="small"
                                icon={running ? <CircularProgress size={12} sx={{ color: `${colors.gold} !important` }} /> : undefined}
                                label={label}
                                onDelete={running ? undefined : () => dismissConversion(lesson.documentId)}
                                sx={{
                                  height: 22,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  bgcolor: failed ? '#fdecea' : '#000',
                                  color: failed ? '#c62828' : colors.gold,
                                  border: failed ? '1px solid #e57373' : 'none',
                                  '& .MuiChip-deleteIcon': { color: 'inherit', fontSize: 16 },
                                }}
                              />
                            </Tooltip>
                          </Box>
                        );
                      })()}
                    </TableCell>
<TableCell sx={{ py: 0 }}> {/* צמצום הגובה של כל השורה בטבלה */}
  <Stack spacing={1}>
    
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

                 <TableCell align="center">
  <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
    {attr.youtube_id && (
      <Tooltip title="פתח ביוטיוב">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(`https://youtube.com/watch?v=${attr.youtube_id}`, '_blank'); }}>
          <YouTubeIcon sx={{ color: '#FF0000', fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    )}
    {attr.AudioFileName && (
      <Tooltip title="נגן שמע">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPlayingAudio({ url: getAudioUrl(attr), title: attr.title || 'שיעור' }); }}>
          <VolumeUpIcon sx={{ color: '#333', fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    )}
    {getPdfList(attr).map((pdfName) => (
      <Tooltip key={pdfName} title={`פתח PDF: ${pdfName}`}>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(getPdfUrl(attr, pdfName), '_blank'); }}>
          <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    ))}
  </Stack>
</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <Tooltip title="מחיקת שיעור">
 <IconButton onClick={(e) => { e.stopPropagation(); handleOpenPopover(e, lesson); }}>
  <DeleteOutlineIcon sx={{ color: '#d32f2f' }} />
</IconButton>
</Tooltip>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); attr.youtube_id && window.open(`https://youtube.com/watch?v=${attr.youtube_id}`, '_blank'); }}
                          disabled={!attr.youtube_id}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                        <Tooltip title="הורד שמע">
  <IconButton
    disabled={!attr.AudioFileName}
    onClick={(e) => { e.stopPropagation(); downloadLesson(attr); }}
    sx={{ color: attr.AudioFileName ? colors.gold : '#ccc' }}
  >
    <FileDownloadOutlinedIcon fontSize="small" />
  </IconButton>
</Tooltip>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, direction: 'ltr' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_e, value) => {
            fetchLessons(value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sx={{
            '& .MuiPaginationItem-root': { color: '#000000', fontWeight: 'bold' },
            '& .Mui-selected': { backgroundColor: `${colors.gold} !important`, color: '#fff !important' },
            '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(197,160,89,0.1)' }
          }}
        />
      </Box>
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
  onConvertChange={handleConvertChange} // התקדמות ההמרה ברקע — תגית בשורה
/>
    </Box>

    {playingAudio && (
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        bgcolor: '#000', color: colors.gold,
        px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        direction: 'rtl'
      }}>
        <VolumeUpIcon sx={{ color: colors.gold, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ color: colors.gold, fontWeight: 700, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {playingAudio.title}
        </Typography>
        <audio
          key={playingAudio.url}
          autoPlay
          controls
          style={{ flex: 2, minWidth: 200, height: 36, direction: 'ltr' }}
          src={playingAudio.url}
        />
        <IconButton size="small" onClick={() => setPlayingAudio(null)} sx={{ color: colors.gold, ml: 1 }}>
          ✕
        </IconButton>
      </Box>
    )}

    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        variant="filled"
        icon={false}
        sx={{
          boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
          bgcolor: '#000',
          color: colors.gold,
          '& .MuiAlert-action': { color: colors.gold, alignItems: 'center', paddingLeft: '0' },
          '& .MuiAlert-message': { paddingLeft: '20px' }
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
  );
};

export default ManageLessons;