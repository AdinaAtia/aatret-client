import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Stack, MenuItem, Typography, Divider, Zoom 
} from '@mui/material';
import axios from 'axios';

const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  TEXT_GRAY: '#5f6368'
};

const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    direction: 'rtl' as const,
    '& fieldset': { textAlign: 'right' as const, borderRadius: '12px' },
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

interface EditLessonDialogProps {
  open: boolean;
  onClose: () => void;
  lesson: any; // האובייקט הגולמי מהטבלה
  lecturers: any[];
  onSaveSuccess: () => void;
}

const EditLessonDialog = ({ open, onClose, lesson, lecturers, onSaveSuccess }: EditLessonDialogProps) => {
  const [editedLesson, setEditedLesson] = useState<any>(null);
  const [categoriesPath, setCategoriesPath] = useState<any[]>([]);

  useEffect(() => {
    if (lesson && open) {
      // חילוץ נתונים מסטרפי 5: הנתונים יכולים להיות ישירות באובייקט או תחת attributes
      const attrs = lesson.attributes || lesson;
      
      // חשוב: חילוץ ה-documentId לצורך עדכון
      const docId = lesson.documentId || lesson.id;

      setEditedLesson({ 
        ...attrs,
        documentId: docId,
        // נרמול שמות שדות האודיו (מונע בלבול בין AudioDir ל-audioDir)
        AudioDir: attrs.AudioDir || attrs.audioDir || '',
        AudioFileName: attrs.AudioFileName || attrs.audioFileName || ''
      });
      
      // טעינת קטגוריות לפי הרב המשויך
      const rabbiId = attrs.rabbi?.data?.documentId || attrs.rabbi?.documentId || attrs.rabbi?.id;
      if (rabbiId) {
        loadInitialCategories(rabbiId);
      }
    }
  }, [lesson, open]);

  const loadInitialCategories = async (rabbiId: string) => {
    try {
      const res = await axios.get(`http://localhost:1337/api/categories-mains?filters[rabbi][documentId][$eq]=${rabbiId}`);
      setCategoriesPath([{ level: 1, label: 'קטגוריה ראשית', options: res.data.data || [], selected: '' }]);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleRabbiChange = (rabbiId: string) => {
    setEditedLesson((prev: any) => ({ ...prev, rabbi: { documentId: rabbiId } }));
    setCategoriesPath([]);
    loadInitialCategories(rabbiId);
  };

  const handleCategoryChange = async (index: number, documentId: string) => {
    const updatedPath = [...categoriesPath];
    updatedPath[index].selected = documentId;
    const newPath = updatedPath.slice(0, index + 1);
    
    try {
      // חיפוש תתי קטגוריה (Sub-categories)
      const response = await axios.get(`http://localhost:1337/api/categories-subs?filters[parent_sub][documentId][$eq]=${documentId}`);
      let children = response.data.data;
      
      // מקרה קצה: אם זו קטגוריה ראשית ללא parent_sub
      if (index === 0 && (!children || children.length === 0)) {
        const subRes = await axios.get(`http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${documentId}&filters[parent_sub][documentId][$null]=true`);
        children = subRes.data.data;
      }
      
      if (children && children.length > 0) {
        newPath.push({ level: index + 2, label: `תת קטגוריה (רמה ${index + 2})`, options: children, selected: '' });
      }
    } catch (e) { console.error(e); }
    setCategoriesPath(newPath);
  };

  const handleUpdate = async () => {
    try {
      const docId = editedLesson.documentId;
      if (!docId) {
        alert("לא נמצא מזהה (documentId) לעדכון");
        return;
      }

      // חישוב מזהי קטגוריות לשליחה
      let mainCatId = editedLesson.main_category?.data?.documentId || editedLesson.main_category?.documentId || null;
      let subCatId = editedLesson.sub_category?.data?.documentId || editedLesson.sub_category?.documentId || null;

      if (categoriesPath.length > 0) {
        if (categoriesPath[0].selected) mainCatId = categoriesPath[0].selected;
        const lastSelectedSub = [...categoriesPath].slice(1).reverse().find(c => c.selected);
        if (lastSelectedSub) subCatId = lastSelectedSub.selected;
      }

      // בניית האובייקט בדיוק לפי דרישות ה-API
      const payload = {
        data: {
          title: editedLesson.title,
          duration: editedLesson.duration,
          lesson_date_hebrew: editedLesson.lesson_date_hebrew,
          lesson_date_gregorian: editedLesson.lesson_date_gregorian,
          AudioDir: editedLesson.AudioDir, 
          AudioFileName: editedLesson.AudioFileName,
          rabbi: editedLesson.rabbi?.documentId || editedLesson.rabbi?.id || null,
          main_category: mainCatId,
          sub_category: subCatId
        }
      };

      await axios.put(`http://localhost:1337/api/lessons/${docId}`, payload);
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error('Update Error:', error.response?.data || error);
      alert(`שגיאה בשמירה: ${error.response?.data?.error?.message || "בדקי את שדות החובה בסטרפי"}`);
    }
  };

  if (!editedLesson) return null;

  return (
    <Dialog open={open} onClose={onClose} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, textAlign: 'center', pt: 3 }}>
        עריכת פרטי שיעור
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="כותרת השיעור"
            value={editedLesson.title || ''}
            onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
            sx={editFieldStyle}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              label="תאריך לועזי"
              value={editedLesson.lesson_date_gregorian || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, lesson_date_gregorian: e.target.value })}
              sx={editFieldStyle}
            />
            <TextField
              fullWidth
              label="תאריך עברי"
              value={editedLesson.lesson_date_hebrew || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, lesson_date_hebrew: e.target.value })}
              sx={editFieldStyle}
            />
          </Stack>

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" sx={{ color: COLORS.BROWN_LIGHT, fontWeight: 'bold' }}>שיוך והיררכיה</Typography>
          </Divider>

          <TextField
            select
            fullWidth
            label="בחר רב"
            value={editedLesson.rabbi?.data?.documentId || editedLesson.rabbi?.documentId || editedLesson.rabbi?.id || ''}
            onChange={(e) => handleRabbiChange(e.target.value)}
            sx={editFieldStyle}
          >
            {lecturers.map((r) => (
              <MenuItem key={r.id} value={r.documentId || r.id}>
                {r.name || r.attributes?.name}
              </MenuItem>
            ))}
          </TextField>

          {categoriesPath.map((step, index) => (
            <Zoom in={true} key={index}>
              <TextField
                select
                fullWidth
                label={step.label}
                value={step.selected}
                sx={editFieldStyle}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
              >
                {step.options.map((opt: any) => (
                  <MenuItem key={opt.documentId} value={opt.documentId}>
                    {opt.name || opt.attributes?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Zoom>
          ))}

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" sx={{ color: COLORS.BROWN_LIGHT, fontWeight: 'bold' }}>נתוני קובץ אודיו</Typography>
          </Divider>

<Stack direction="row" spacing={3} sx={{ mt: 1, width: '100%' }}>
                <TextField
              fullWidth
              label="תיקייה"
              value={editedLesson.AudioDir || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, AudioDir: e.target.value })}
              sx={editFieldStyle}
            />
            <TextField
              fullWidth
              label="שם קובץ"
              value={editedLesson.AudioFileName || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, AudioFileName: e.target.value })}
              sx={editFieldStyle}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '12px', color: COLORS.TEXT_GRAY }}>
          ביטול
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          sx={{ 
            bgcolor: COLORS.SIDEBAR_BROWN, 
            borderRadius: '12px', 
            px: 4, 
            fontWeight: 'bold',
            '&:hover': { bgcolor: COLORS.BROWN_DARK }
          }}
        >
          שמור שינויים
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLessonDialog;