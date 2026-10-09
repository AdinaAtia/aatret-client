
import { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper, CircularProgress,
  MenuItem, Stack, Divider, FormControlLabel, Switch, Badge,
  Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import { PlusCircle, Layers, Send, FileEdit, ChevronRight, ChevronLeft } from 'lucide-react';

import { colors } from '../src/theme/tokens';
const GOLD = colors.gold;

const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': { borderColor: GOLD },
    '&.Mui-focused fieldset': { borderColor: GOLD },
  },
  '& .MuiInputLabel-root': {
    right: 22,
    left: 'auto',
    transformOrigin: 'top right',
  },
  '& .MuiInputLabel-shrink': {
    transformOrigin: 'top right',
    transform: 'translate(0, -9px) scale(0.75)',
    right: 14,
    left: 'auto',
  },
  '& legend': { textAlign: 'right' },
  '& .MuiInputLabel-root.Mui-focused': { color: GOLD },
};

const AddNewCategory = () => {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [childSubs, setChildSubs] = useState<any[]>([]);
  const [level4Subs, setLevel4Subs] = useState<any[]>([]);

  const [selectedRabbi, setSelectedRabbi] = useState('');
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedChild, setSelectedChild] = useState('');

  const [categoryName, setCategoryName] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis`).then(res => {
      const data: any[] = res.data.data || [];
      setLecturers(data.sort((a, b) => {
        const na = a.name || a.attributes?.name || '';
        const nb = b.name || b.attributes?.name || '';
        if (na.includes('מרדכי עטייה')) return -1;
        if (nb.includes('מרדכי עטייה')) return 1;
        return na.localeCompare(nb, 'he');
      }));
    });
  }, []);

  useEffect(() => {
    if (!selectedRabbi) { setMainCategories([]); return; }
    setFetching(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[rabbi][documentId][$eq]=${selectedRabbi}&sort=Priority:asc&populate[subs][count]=true`)
      .then(res => { setMainCategories((res.data.data || []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'he'))); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedRabbi, refreshKey]);

  useEffect(() => {
    if (!selectedMain) { setSubCategories([]); return; }
    setFetching(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[main_category][documentId][$eq]=${selectedMain}&filters[parent_sub][documentId][$null]=true&sort=Priority:asc&populate[child_subs][count]=true`)
      .then(res => { setSubCategories((res.data.data || []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'he'))); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedMain, refreshKey]);

  useEffect(() => {
    if (!selectedSub) { setChildSubs([]); return; }
    setFetching(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${selectedSub}&sort=Priority:asc&populate[child_subs][count]=true`)
      .then(res => { setChildSubs((res.data.data || []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'he'))); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedSub, refreshKey]);

  useEffect(() => {
    if (!selectedChild) { setLevel4Subs([]); return; }
    setFetching(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[parent_sub][documentId][$eq]=${selectedChild}&sort=Priority:asc`)
      .then(res => { setLevel4Subs((res.data.data || []).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'he'))); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedChild, refreshKey]);

  const handleSave = async () => {
    if (!categoryName || !selectedRabbi) {
      setSnackbar({ open: true, message: 'חובה למלא שם ולבחור רב', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const isSubTable = selectedMain !== '';
      const baseUrl = isSubTable ? `${import.meta.env.VITE_API_URL}/api/categories-subs` : `${import.meta.env.VITE_API_URL}/api/categories-mains`;
      const url = isPublished ? baseUrl : `${baseUrl}?status=draft`;

      const postData: any = {
        name: categoryName,
        Priority: Number(priority),
      };

      if (selectedChild) { postData.parent_sub = selectedChild; postData.main_category = selectedMain; }
      else if (selectedSub) { postData.parent_sub = selectedSub; postData.main_category = selectedMain; }
      else if (selectedMain) { postData.main_category = selectedMain; }
      else { postData.rabbi = selectedRabbi; }

      await axios.post(url, { data: postData });
      setSnackbar({ open: true, message: 'הקטגוריה נוספה בהצלחה!', severity: 'success' });
      setCategoryName('');
      setRefreshKey(k => k + 1);

    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בתהליך השמירה', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getChildCount = (item: any) => {
    const count = item.subs?.count ?? item.child_subs?.count ?? 0;
    return count;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, p: 4, direction: 'rtl', fontFamily: 'system-ui' }}>

      <Box sx={{ flex: 1.2 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: '24px', bgcolor: '#fff', border: '1px solid #eee' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, color: colors.gold, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PlusCircle size={28} color="#000" /> ניהול קטגוריות
          </Typography>

          <Stack spacing={3}>
            <TextField select label="בחר רב" value={selectedRabbi} onChange={(e) => {setSelectedRabbi(e.target.value); setSelectedMain(''); setSelectedSub(''); setSelectedChild('');}} fullWidth sx={fieldStyle}>
              {lecturers.map((r) => <MenuItem key={r.documentId} value={r.documentId}>{r.name}</MenuItem>)}
            </TextField>

            {selectedRabbi && (
              <TextField select label="שיוך לקטגוריה ראשית" value={selectedMain} onChange={(e) => {setSelectedMain(e.target.value); setSelectedSub(''); setSelectedChild('');}} fullWidth sx={fieldStyle}>
                <MenuItem value="">-- ללא (צור קטגוריה ראשית חדשה) --</MenuItem>
                {mainCategories.map((m) => <MenuItem key={m.documentId} value={m.documentId}>{m.name}</MenuItem>)}
              </TextField>
            )}

            {selectedMain && (
              <TextField select label="שיוך לקטגוריה משנית (רמה 2)" value={selectedSub} onChange={(e) => {setSelectedSub(e.target.value); setSelectedChild('');}} fullWidth sx={fieldStyle}>
                <MenuItem value="">-- ללא (צור רמה 2 חדשה) --</MenuItem>
                {subCategories.map((s) => <MenuItem key={s.documentId} value={s.documentId}>{s.name}</MenuItem>)}
              </TextField>
            )}

            {selectedSub && (
              <TextField select label="שיוך לרמה 3" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} fullWidth sx={fieldStyle}>
                <MenuItem value="">-- ללא (צור רמה 3 חדשה) --</MenuItem>
                {childSubs.map((c) => <MenuItem key={c.documentId} value={c.documentId}>{c.name}</MenuItem>)}
              </TextField>
            )}

            <Divider />

            <TextField label="שם הקטגוריה החדשה" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} fullWidth sx={fieldStyle} />
            <TextField type="number" label="קדימות בתצוגה (Priority)" value={priority} onChange={(e) => setPriority(Number(e.target.value))} fullWidth helperText="מספר נמוך מופיע ראשון" sx={fieldStyle} />

            <Box sx={{ p: 2, bgcolor: 'transparent', borderRadius: '12px', border: `1px dashed ${isPublished ? GOLD : '#ccc'}` }}>
              <FormControlLabel
                control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD },
                }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isPublished ? <Send size={18} color={GOLD} /> : <FileEdit size={18} color="gray" />}
                    <Typography sx={{ fontWeight: 600 }}>{isPublished ? 'פרסום מיידי לאתר' : 'שמור כטיוטה בלבד'}</Typography>
                  </Box>
                }
              />
            </Box>

            <Button variant="contained" onClick={handleSave} disabled={loading} fullWidth sx={{ py: 2, bgcolor: '#000', color: colors.gold, borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, '&:hover': { bgcolor: colors.gold, color: '#000' } }}>
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : (selectedChild ? 'הוסף לרמה 4' : selectedSub ? 'הוסף לרמה 3' : selectedMain ? 'הוסף רמה 2' : 'הוסף קטגוריה ראשית')}
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: '24px', minHeight: '500px', bgcolor: '#fbfbfb', border: '1px solid #eee' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Layers size={22} color={colors.gold} />
              {selectedChild ? 'ילדים קיימים (רמה 4)' : selectedSub ? 'ילדים קיימים (רמה 3)' : selectedMain ? 'משניות קיימות (רמה 2)' : 'ראשיות קיימות'}
            </Typography>
            {(selectedMain || selectedSub || selectedChild) && (
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  if(selectedChild) setSelectedChild('');
                  else if(selectedSub) setSelectedSub('');
                  else setSelectedMain('');
                }}
                sx={{ color: colors.gold, fontWeight: 700 }}
                startIcon={<ChevronRight size={16} />}
              >
                חזור אחורה
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {fetching ? (
              <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress color="inherit" sx={{ opacity: 0.3 }} /></Box>
            ) : (
              (selectedChild ? level4Subs : selectedSub ? childSubs : selectedMain ? subCategories : mainCategories).map((item: any) => {
                const count = getChildCount(item);
                const canDiveIn = !selectedChild;

                return (
                  <Box
                    key={item.documentId}
                    onClick={() => {
                      if (!canDiveIn) return;
                      if (!selectedMain) setSelectedMain(item.documentId);
                      else if (!selectedSub) setSelectedSub(item.documentId);
                      else if (!selectedChild) setSelectedChild(item.documentId);
                    }}
                    sx={{
                      p: 2.5,
                      bgcolor: '#fff',
                      borderRadius: '16px',
                      border: '1px solid #eaeaea',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      cursor: canDiveIn ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      '&:hover': canDiveIn ? {
                        borderColor: colors.gold,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(197, 160, 89, 0.15)'
                      } : {}
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{
                        width: 28, height: 28,
                        bgcolor: '#000', color: colors.gold,
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 800
                      }}>
                        {item.Priority || 0}
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {!selectedChild && (
                        <Badge
                          badgeContent={count}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: count > 0 ? colors.gold : '#ccc',
                              color: '#fff',
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <Layers size={18} color={count > 0 ? colors.gold : '#ddd'} />
                        </Badge>
                      )}
                      {canDiveIn && (
                        <ChevronLeft size={18} color={colors.gold} opacity={0.5} />
                      )}
                    </Box>
                  </Box>
                );
              })
            )}

            {!fetching && (selectedChild ? level4Subs : selectedSub ? childSubs : selectedMain ? subCategories : mainCategories).length === 0 && (
              <Typography sx={{ textAlign: 'center', py: 4, color: '#999', fontStyle: 'italic' }}>
                אין קטגוריות ברמה זו
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '20% !important', transform: 'translateY(-50%)' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          variant="filled"
          icon={false}
          sx={{
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
            bgcolor: snackbar.severity === 'success' ? '#000' : undefined,
            color: snackbar.severity === 'success' ? colors.gold : undefined,
            '& .MuiAlert-action': { color: colors.gold, alignItems: 'center', paddingLeft: '0' },
            '& .MuiAlert-message': { paddingLeft: '20px' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddNewCategory;
