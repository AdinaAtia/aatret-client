import { useState } from 'react';
import { Popover, Box, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { 
  // DeleteForever as DeleteIcon, 
  // Archive as ArchiveIcon,
  InfoOutlined as InfoIcon 
} from '@mui/icons-material';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
const COLORS = {
  GOLD: colors.gold,
  DELETE_RED: '#d32f2f',
  TEXT_GRAY: '#5f6368',
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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/${documentId}/unpublish`);

      console.log("השיעור הועבר לטיוטה בהצלחה");
      onSuccess(); // מרענן את הטבלה באב
      onClose();   // סוגר את הפופאובר
    } catch (error: any) {
      const errData = error.response?.data;
      console.error("שגיאה בהעברה לטיוטה:", errData || error.message);
      alert(`שגיאה: ${error.response?.status} - ${JSON.stringify(errData?.error?.message || errData || error.message)}`);
    } finally {
      setLoading(null);
    }
  };

  // 2. פונקציית מחיקה לצמיתות
  const handleDelete = async () => {
    if (!documentId) return;
    
    const confirmDelete = window.confirm(`האם את בטוחה שברצונך למחוק לצמיתות את השיעור: "${lessonName}"?\nאם יש לו קובץ שמע, הוא יימחק גם משרת המדיה (אלא אם שיעור אחר משתמש בו).`);
    if (!confirmDelete) return;

    setLoading('delete');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/lessons/${documentId}`);
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
          borderRadius: '20px', 
          width: '280px', 
          boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
          p: 0.5
        } 
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', dir: 'rtl' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: COLORS.GOLD, mb: 0.5 }}>
          ניהול סטטוס שיעור
        </Typography>
        
        <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY, mb: 2 }}>
          מה ברצונך לעשות עם השיעור 
          <br />
          <strong>"{lessonName}"</strong>?
        </Typography>

        {/* תיבת הסבר */}
        <Box sx={{ 
          bgcolor: 'rgba(197,160,89,0.08)', 
          p: 1.5, 
          borderRadius: '10px', 
          mb: 2.5, 
          display: 'flex', 
          gap: 1,
          border: '1px solid rgba(197,160,89,0.3)'
        }}>
          <InfoIcon sx={{ fontSize: '18px', color: COLORS.GOLD, mt: 0.2 }} />
          <Typography variant="caption" sx={{ fontSize: '11px', textAlign: 'right', color: COLORS.GOLD, lineHeight: 1.4 }}>
            העברה לטיוטה תסיר את השיעור מהאתר הציבורי, אך הוא יישמר במערכת הניהול שלך.
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {/* כפתור טיוטה */}
          <Button
            fullWidth
            variant="contained"
            disabled={loading !== null}
            startIcon={loading === 'draft' ? <CircularProgress size={18} color="inherit" /> : null}
            onClick={handleDraft}
            sx={{ 
              bgcolor: '#000', 
              color: COLORS.GOLD,
              fontWeight: 'bold',
              borderRadius: '8px',
              py: 1,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: COLORS.GOLD, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
              transition: '0.3s'
            }}
          >
            {loading === 'draft' ? 'מעדכן...' : 'העבר לטיוטה (DRAFT)'}
          </Button>

          {/* כפתור מחיקה */}
          <Button
            fullWidth
            variant="contained"
            disabled={loading !== null}
            startIcon={loading === 'delete' ? <CircularProgress size={18} color="inherit" /> : null}
            onClick={handleDelete}
            sx={{ 
              bgcolor: '#000',
              color: COLORS.GOLD,
              fontSize: '0.85rem', 
              fontWeight: 800,
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: COLORS.GOLD, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197,160,89,0.4)' },
              transition: '0.3s'
            }}
          >
            {loading === 'delete' ? 'מוחק...' : 'מחק לצמיתות'}
          </Button>

          {/* ביטול */}
          <Button 
            onClick={onClose} 
            disabled={loading !== null}
            variant="outlined"
            sx={{ color: '#000', borderColor: '#000', borderRadius: '8px', fontSize: '0.75rem' }}
          >
            ביטול וחזרה
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
};

export default DeleteActionPopover;