import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, CircularProgress, 
  MenuItem, Alert, Stack, Divider, FormControlLabel, Switch, Badge
} from '@mui/material';
import axios from 'axios';
import { PlusCircle, Layers, Send, FileEdit, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [status, setStatus] = useState({ text: '', type: '' });

  // טעינת רבנים
  useEffect(() => {
    axios.get('http://localhost:1337/api/rabbis').then(res => setLecturers(res.data.data || []));
  }, []);

  // טעינת קטגוריות ראשיות
  useEffect(() => {
    if (!selectedRabbi) { setMainCategories([]); return; }
    setFetching(true);
    axios.get(`http://localhost:1337/api/categories-mains?filters[rabbi][documentId][$eq]=${selectedRabbi}&sort=Priority:asc&populate[subs][count]=true`)
      .then(res => { setMainCategories(res.data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedRabbi]);

  // טעינת רמה 2
  useEffect(() => {
    if (!selectedMain) { setSubCategories([]); return; }
    setFetching(true);
    axios.get(`http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${selectedMain}&filters[parent_sub][documentId][$null]=true&sort=Priority:asc&populate[child_subs][count]=true`)
      .then(res => { setSubCategories(res.data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedMain]);

  // טעינת רמה 3
  useEffect(() => {
    if (!selectedSub) { setChildSubs([]); return; }
    setFetching(true);
    axios.get(`http://localhost:1337/api/categories-subs?filters[parent_sub][documentId][$eq]=${selectedSub}&sort=Priority:asc&populate[child_subs][count]=true`)
      .then(res => { setChildSubs(res.data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedSub]);

  // טעינת רמה 4
  useEffect(() => {
    if (!selectedChild) { setLevel4Subs([]); return; }
    setFetching(true);
    axios.get(`http://localhost:1337/api/categories-subs?filters[parent_sub][documentId][$eq]=${selectedChild}&sort=Priority:asc`)
      .then(res => { setLevel4Subs(res.data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [selectedChild]);

  const handleSave = async () => {
    if (!categoryName || !selectedRabbi) {
      setStatus({ text: "חובה למלא שם ולבחור רב", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const isSubTable = selectedMain !== '';
      const url = isSubTable ? 'http://localhost:1337/api/categories-subs' : 'http://localhost:1337/api/categories-mains';
      
      const postData: any = {
        name: categoryName,
        Priority: Number(priority),
        publishedAt: isPublished ? new Date() : null,
      };

      if (selectedChild) { postData.parent_sub = selectedChild; postData.main_category = selectedMain; }
      else if (selectedSub) { postData.parent_sub = selectedSub; postData.main_category = selectedMain; }
      else if (selectedMain) { postData.main_category = selectedMain; }
      else { postData.rabbi = selectedRabbi; }

      await axios.post(url, { data: postData });
      setStatus({ text: "הקטגוריה נוספה בהצלחה!", type: 'success' });
      setCategoryName('');
    } catch (err) {
      setStatus({ text: "שגיאה בתהליך השמירה", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getChildCount = (item: any) => item.subs?.count || item.child_subs?.count || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, p: 4, direction: 'rtl', fontFamily: 'system-ui' }}>
      
      {/* כרטיס ימני */}
      <Box sx={{ flex: 1.2 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: '24px', bgcolor: '#fff', border: '1px solid #eee' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, color: '#9c6644', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PlusCircle size={28} /> ניהול קטגוריות
          </Typography>

          <Stack spacing={3}>
            <TextField select label="בחר רב" value={selectedRabbi} onChange={(e) => {setSelectedRabbi(e.target.value); setSelectedMain(''); setSelectedSub(''); setSelectedChild('');}} fullWidth>
              {lecturers.map((r) => <MenuItem key={r.documentId} value={r.documentId}>{r.name}</MenuItem>)}
            </TextField>

            <TextField select label="שיוך לקטגוריה ראשית" value={selectedMain} onChange={(e) => {setSelectedMain(e.target.value); setSelectedSub(''); setSelectedChild('');}} fullWidth disabled={!selectedRabbi}>
              <MenuItem value="">-- ללא (צור קטגוריה ראשית חדשה) --</MenuItem>
              {mainCategories.map((m) => <MenuItem key={m.documentId} value={m.documentId}>{m.name}</MenuItem>)}
            </TextField>

            <TextField select label="שיוך לקטגוריה משנית (רמה 2)" value={selectedSub} onChange={(e) => {setSelectedSub(e.target.value); setSelectedChild('');}} fullWidth disabled={!selectedMain}>
              <MenuItem value="">-- ללא (צור רמה 2 חדשה) --</MenuItem>
              {subCategories.map((s) => <MenuItem key={s.documentId} value={s.documentId}>{s.name}</MenuItem>)}
            </TextField>

            <TextField select label="שיוך לילד (רמה 3)" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} fullWidth disabled={!selectedSub}>
              <MenuItem value="">-- ללא (צור רמה 3 חדשה) --</MenuItem>
              {childSubs.map((c) => <MenuItem key={c.documentId} value={c.documentId}>{c.name}</MenuItem>)}
            </TextField>

            <Divider />

            <TextField label="שם הקטגוריה החדשה" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} fullWidth />
            <TextField type="number" label="קדימות בתצוגה (Priority)" value={priority} onChange={(e) => setPriority(Number(e.target.value))} fullWidth helperText="מספר נמוך מופיע ראשון" />

            <Box sx={{ p: 2, bgcolor: isPublished ? '#f0f9ff' : '#f5f5f5', borderRadius: '12px', border: '1px dashed #ccc' }}>
              <FormControlLabel
                control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} color="success" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isPublished ? <Send size={18} color="green" /> : <FileEdit size={18} color="gray" />}
                    <Typography sx={{ fontWeight: 600 }}>{isPublished ? "פרסום מיידי לאתר" : "שמור כטיוטה בלבד"}</Typography>
                  </Box>
                }
              />
            </Box>

            {status.text && <Alert severity={status.type as any} variant="filled" sx={{ borderRadius: '10px' }}>{status.text}</Alert>}

            <Button variant="contained" onClick={handleSave} disabled={loading} fullWidth sx={{ py: 2, bgcolor: '#9c6644', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, '&:hover': { bgcolor: '#7f5539' } }}>
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : (selectedChild ? "הוסף לרמה 4" : selectedSub ? "הוסף לרמה 3" : selectedMain ? "הוסף רמה 2" : "הוסף קטגוריה ראשית")}
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* כרטיס שמאלי */}
      <Box sx={{ flex: 1 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: '24px', minHeight: '500px', bgcolor: '#fbfbfb', border: '1px solid #eee' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Layers size={22} color="#9c6644" />
              {selectedChild ? "ילדים קיימים (רמה 4)" : selectedSub ? "ילדים קיימים (רמה 3)" : selectedMain ? "משניות קיימות (רמה 2)" : "ראשיות קיימות"}
            </Typography>
            {(selectedMain || selectedSub || selectedChild) && (
              <Button size="small" variant="text" onClick={() => {
                if(selectedChild) setSelectedChild('');
                else if(selectedSub) setSelectedSub('');
                else setSelectedMain('');
              }} sx={{ color: '#9c6644', fontWeight: 700 }} startIcon={<ChevronRight size={16} />}>חזור אחורה</Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {fetching ? <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress color="inherit" sx={{ opacity: 0.3 }} /></Box> : 
            (selectedChild ? level4Subs : selectedSub ? childSubs : selectedMain ? subCategories : mainCategories).map((item: any) => {
              const count = getChildCount(item);
              return (
                <Box key={item.documentId} sx={{ p: 2.5, bgcolor: '#fff', borderRadius: '16px', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ width: 28, height: 28, bgcolor: '#9c6644', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {item.Priority || 0}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                  </Box>
                  {!selectedChild && (
                    <Badge badgeContent={count} color="primary" sx={{ '& .MuiBadge-badge': { bgcolor: count > 0 ? '#9c6644' : '#ccc', color: '#fff' } }}>
                      <Layers size={18} color={count > 0 ? '#9c6644' : '#ddd'} />
                    </Badge>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddNewCategory;