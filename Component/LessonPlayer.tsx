import React from 'react';
import { Box, Typography, Stack, Button, Chip, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'; 
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'; 
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'; 
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

interface LessonPlayerProps {
  lesson: any;
  onBack: () => void;
}

const LessonPlayer = ({ lesson, onBack }: LessonPlayerProps) => {
  if (!lesson) return null;

  const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi } = lesson;
  const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
  
  const COLORS = {
    BROWN_DARK: '#9c6644',
    BROWN_LIGHT: '#b48a66',
    BG_CREAM: '#fdfbe7',
    BLACK: '#000000'
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: 4, px: 2, direction: 'rtl' }}>
      
      {/* כפתור סגירה */}
      <Box sx={{ maxWidth: '850px', mx: 'auto', display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
        <IconButton onClick={onBack} sx={{ color: '#000' }}><CloseIcon fontSize="large" /></IconButton>
      </Box>

      {/* הכרטיס המרכזי */}
      <Box sx={{ 
        maxWidth: '850px', 
        mx: 'auto',
        backgroundColor: COLORS.BG_CREAM, 
        borderRadius: '45px', 
        p: { xs: 3, md: 5 }, 
        textAlign: 'center',
      }}>
        
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontSize: '1.7rem' }}>
          {title || "כוונות האכילה של אברהם אבינו ע\"ה"}
        </Typography>

        <Chip 
          label="כוונות הסעודה" 
          sx={{ bgcolor: COLORS.BLACK, color: 'white', mb: 4, height: '24px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px' }} 
        />

        {/* נגן וידאו */}
        <Box sx={{ 
          position: 'relative', pt: '56.25%', borderRadius: '30px', overflow: 'hidden', mb: 4,
          boxShadow: '0 12px 35px rgba(0,0,0,0.1)'
        }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            src={`https://www.youtube.com/embed/${youtube_id}`}
            title={title}
          ></iframe>
        </Box>

        {/* שורות נתונים - מופרדות לשתי שורות */}
        <Box sx={{ mb: 5, opacity: 0.8 }}>
          {/* שורה 1: רב ומספר שיעור */}
          <Stack 
            direction="row" 
            justifyContent="center" 
            spacing={4} 
            sx={{ mb: 1.5 }}
          >
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>רב: {rabbiName}</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>מס' שיעור: 13</Typography>
          </Stack>

          {/* שורה 2: תאריכים וזמן - אייקונים בימין, טקסט בשמאל */}
          {/* שורה 2: תאריכים וזמן - האייקון ראשון בקוד = מופיע מימין */}
  <Stack 
    direction="row" 
    justifyContent="center" 
    alignItems="center"
    spacing={4} // רווח שווה בדיוק בין שלושת הקבוצות
  >
    {/* תאריך עברי */}
    <Stack direction="row" spacing={1} alignItems="center">
      <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem' }} />
      <Typography sx={{ fontSize: '0.95rem' }}>{lesson_date_hebrew}</Typography>
    </Stack>

    {/* תאריך לועזי */}
    <Stack direction="row" spacing={1} alignItems="center">
      <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem' }} />
      <Typography sx={{ fontSize: '0.95rem' }}>{lesson_date_gregorian}</Typography>
    </Stack>

    {/* זמן */}
    <Stack direction="row" spacing={1} alignItems="center">
      <AccessTimeOutlinedIcon sx={{ fontSize: '1.1rem' }} />
      <Typography sx={{ fontSize: '0.95rem' }}>01:03:05</Typography>
    </Stack>
  </Stack>
        </Box>

        {/* כפתורי פעולה - אייקון בימין, טקסט בשמאל */}
        <Stack 
          direction="row" 
          spacing={1.5} 
          justifyContent="center"
          sx={{ flexWrap: 'wrap', gap: 1.5 }}
        >
          <Button 
            variant="contained" 
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{ bgcolor: COLORS.BROWN_DARK, borderRadius: '10px', px: 2.5, py: 1, gap: 1, '&:hover': { bgcolor: '#865639' } }}
          >
            הורדת השיעור
          </Button>

          <Button 
            variant="contained" 
            startIcon={<PictureAsPdfOutlinedIcon />}
            sx={{ bgcolor: COLORS.BROWN_LIGHT, borderRadius: '10px', px: 2.5, py: 1, gap: 1, '&:hover': { bgcolor: COLORS.BROWN_DARK } }}
          >
            הורדת PDF
          </Button>

          <Button 
            variant="contained" 
            startIcon={<CardGiftcardOutlinedIcon />}
            sx={{ bgcolor: COLORS.BLACK, borderRadius: '10px', px: 2.5, py: 1, gap: 1 }}
          >
            הקדש שיעור זה
          </Button>

          <Button 
            variant="contained" 
            startIcon={<ChatBubbleOutlineOutlinedIcon />}
            sx={{ bgcolor: COLORS.BLACK, borderRadius: '10px', px: 2.5, py: 1, gap: 1 }}
          >
            הגב על השיעור
          </Button>

          <Button 
            variant="contained" 
            startIcon={<ReplyOutlinedIcon sx={{ transform: 'scaleX(-1)' }} />} 
            sx={{ bgcolor: COLORS.BLACK, borderRadius: '10px', px: 2.5, py: 1, gap: 1 }}
          >
            שיתוף
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LessonPlayer;