import React, { useState } from 'react';
import { Popover, Box, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { 
  DeleteForever as DeleteIcon, 
  Archive as ArchiveIcon,
  InfoOutlined as InfoIcon 
} from '@mui/icons-material';
import axios from 'axios';

const COLORS = {
  BROWN_DARK: '#9c6644',
  DELETE_RED: '#d32f2f',
  TEXT_GRAY: '#5f6368',
  BG_YELLOW: '#fffdea'
};

interface DeleteActionPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  lesson: any; 
  onSuccess: () => void; 
}

const DeleteActionPopover = ({ 
  open, anchorEl, onClose, lesson, onSuccess 
}: DeleteActionPopoverProps) => {
  const [loading, setLoading] = useState<'delete' | 'draft' | null>(null);

  // בסטרפי 5 המזהה הוא documentId והמבנה שטוח (ללא attributes)
  const documentId = lesson?.documentId || lesson?.id;
  const lessonName = lesson?.title || lesson?.attributes?.title || 'שיעור ללא שם';

  // 1. פונקציית העברה לטיוטה (Unpublish) - מותאם לסטרפי 5
  const handleDraft = async () => {
    if (!documentId) return;

    setLoading('draft');
    try {
      // בסטרפי 5, עדכון publishedAt ל-null הופך את הפריט לטיוטה
      // אנחנו משתמשים ב-PUT כי ראינו ב-Console שה-POST/unpublish חסום
      await axios.put(`http://localhost:1337/api/lessons/${documentId}`, {
        data: { 
          publishedAt: null 
        }
      });

      console.log("השיעור הועבר לטיוטה בהצלחה");
      onSuccess(); // מרענן את הטבלה באב
      onClose();   // סוגר את הפופאובר
    } catch (error: any) {
      console.error("שגיאה בהעברה לטיוטה:", error.response?.data || error.message);
      alert("לא הצלחנו לעדכן. ודאי שסימנת 'update' בהרשאות ה-Lesson בסטרפי ושמרת.");
    } finally {
      setLoading(null);
    }
  };

  // 2. פונקציית מחיקה לצמיתות
  const handleDelete = async () => {
    if (!documentId) return;
    
    const confirmDelete = window.confirm(`האם את בטוחה שברצונך למחוק לצמיתות את השיעור: "${lessonName}"?`);
    if (!confirmDelete) return;

    setLoading('delete');
    try {
      await axios.delete(`http://localhost:1337/api/lessons/${documentId}`);
      console.log("השיעור נמחק לצמיתות");
      onSuccess(); 
      onClose();   
    } catch (error: any) {
      console.error("מחיקת שיעור נכשלה:", error.response?.data || error.message);
      alert("חלה שגיאה במחיקה. ודאי שיש הרשאת 'delete' בסטרפי.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{ 
        sx: { 
          borderRadius: '16px', 
          width: '280px', 
          boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
          p: 0.5
        } 
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', dir: 'rtl' }}>
        {/* כותרת */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.BROWN_DARK, mb: 0.5 }}>
          ניהול סטטוס שיעור
        </Typography>
        
        <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY, mb: 2 }}>
          מה ברצונך לעשות עם השיעור 
          <br />
          <strong>"{lessonName}"</strong>?
        </Typography>

        {/* תיבת הסבר */}
        <Box sx={{ 
          bgcolor: COLORS.BG_YELLOW, 
          p: 1.5, 
          borderRadius: '10px', 
          mb: 2.5, 
          display: 'flex', 
          gap: 1,
          border: '1px solid #f0e68c'
        }}>
          <InfoIcon sx={{ fontSize: '18px', color: COLORS.BROWN_DARK, mt: 0.2 }} />
          <Typography variant="caption" sx={{ fontSize: '11px', textAlign: 'right', color: COLORS.BROWN_DARK, lineHeight: 1.4 }}>
            העברה לטיוטה תסיר את השיעור מהאתר הציבורי, אך הוא יישמר במערכת הניהול שלך.
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {/* כפתור טיוטה */}
          <Button
            fullWidth
            variant="contained"
            disabled={loading !== null}
            startIcon={loading === 'draft' ? <CircularProgress size={18} color="inherit" /> : <ArchiveIcon />}
            onClick={handleDraft}
            sx={{ 
              bgcolor: COLORS.BROWN_DARK, 
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '10px',
              py: 1,
              '&:hover': { bgcolor: '#7d5236' } 
            }}
          >
            {loading === 'draft' ? 'מעדכן...' : 'העבר לטיוטה (DRAFT)'}
          </Button>

          {/* כפתור מחיקה */}
          <Button
            fullWidth
            variant="text"
            disabled={loading !== null}
            startIcon={loading === 'delete' ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
            onClick={handleDelete}
            sx={{ 
              color: COLORS.DELETE_RED, 
              fontSize: '0.85rem', 
              fontWeight: 800,
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.05)' }
            }}
          >
            {loading === 'delete' ? 'מוחק...' : 'מחק לצמיתות'}
          </Button>

          {/* ביטול */}
          <Button 
            onClick={onClose} 
            disabled={loading !== null} 
            sx={{ color: COLORS.TEXT_GRAY, fontSize: '0.75rem', mt: 1 }}
          >
            ביטול וחזרה
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
};

export default DeleteActionPopover;