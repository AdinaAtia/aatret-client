
// import { Box, Typography, Stack, Button, Chip, IconButton, Container } from "@mui/material";
// import CancelIcon from '@mui/icons-material/Cancel'; 
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'; 
// import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'; 
// import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'; 
// import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
// import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
// import React, { useRef,useState, useEffect } from 'react'; 

// interface LessonPlayerProps {
//   lesson: any;
//   onBack: () => void;
// }

// const LessonPlayer = ({ lesson, onBack }: LessonPlayerProps) => {
//   if (!lesson) return null;

//   const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi,duration } = lesson;
//   const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
  
//   // לוגיקה לחילוץ מספר שיעור: מחפש מספר בן 3 ספרות בכותרת, אם אין - לוקח 13 כברירת מחדל
//   const lessonNumberFromTitle = title.match(/\d{3}/)?.[0];
//   const lessonNumber = lessonNumberFromTitle || "13";

//   const COLORS = {
//     BROWN_DARK: '#9c6644',
//     BROWN_LIGHT: '#b48a66',
//     BG_CREAM: '#fdfbe7',
//     BLACK: '#000000',
//     ERROR_RED: '#9c6644' 
//   };
// useEffect(() => {
//   window.scrollTo({ top: 0, behavior: 'auto' });
// }, []);
//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: { xs: 2, md: 4 }, px: 2, direction: 'rtl' }}>
//       <Container maxWidth="md">
//         <Box sx={{ 
//           maxWidth: '800px', mx: 'auto', position: 'relative', 
//           backgroundColor: COLORS.BG_CREAM, borderRadius: { xs: '25px', md: '35px' }, 
//           p: { xs: 2.5, sm: 3, md: 4 }, textAlign: 'center',
//           boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
//         }}>
          
//           <IconButton 
//             onClick={onBack} 
//             sx={{ 
//               position: 'absolute', top: { xs: '-15px', md: '-20px' }, right: { xs: '-10px', md: '-15px' }, 
//               color: COLORS.ERROR_RED, bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//               zIndex: 10, p: 0.5, '&:hover': { bgcolor: '#fff', transform: 'scale(1.1) rotate(90deg)' },
//               '& .MuiSvgIcon-root': { fontSize: { xs: '2.2rem', md: '2.8rem' } }
//             }}
//           >
//             <CancelIcon />
//           </IconButton>

//           <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, mb: 1, fontSize: { xs: '1.2rem', md: '1.6rem' }, px: 5, lineHeight: 1.3 }}>
//             {title}
//           </Typography>

//           <Chip label="כוונות הסעודה" sx={{ bgcolor: COLORS.BLACK, color: 'white', mb: 3, height: '24px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px' }} />

//           <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: { xs: '15px', md: '25px' }, overflow: 'hidden', mb: 3, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', bgcolor: '#000' }}>
//             <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} src={`https://www.youtube.com/embed/${youtube_id}`} title={title} allowFullScreen></iframe>
//           </Box>

//           <Box sx={{ mb: 4 }}>
//             {/* שורת רב ומספר שיעור עם רווח גדול ביניהם */}
//         <Stack 
//               direction="row" 
//               justifyContent="center" 
//               alignItems="center" 
//               sx={{ mb: 2.5, gap: 4 }} // gap יוצר רווח פיזי בין האלמנטים
//             >
//               <Typography sx={{ fontSize: '1.05rem', fontWeight: 700 }}>רב: {rabbiName}</Typography>
//               <Typography sx={{ fontSize: '1.05rem', fontWeight: 700 }}>מס' שיעור: {lessonNumber}</Typography>
//             </Stack>

//             {/* שורת אייקונים של תאריך וזמן - גודל אחיד ורווח תקין מהמלל */}
//             <Stack 
//               direction={{ xs: 'column', sm: 'row' }} 
//               justifyContent="space-evenly" 
//               alignItems="center"
//               sx={{ width: '100%', maxWidth: '400px', mx: 'auto', gap:1.2 }}
//             >
//               <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
//                 <CalendarTodayOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
//                 <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{lesson_date_hebrew}</Typography>
//               </Stack>

//               <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
//                 <CalendarTodayOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
//                 <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{lesson_date_gregorian}</Typography>
//               </Stack>

//               <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
//                 <AccessTimeOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
//                 <Typography sx={{ fontWeight: 700 }}>
//                                               {duration || '00:00'}
//                                             </Typography>
//               </Stack>
//             </Stack>
//           </Box>

//           {/* כפתורי פעולה - תיקון גודל אייקונים אחיד ורווח מהמלל */}
//           <Stack 
//             direction="row" 
//             justifyContent="center"
//             sx={{ 
//               flexWrap: 'wrap', gap: 1.5,
//               '& .MuiButton-root': {
//                 borderRadius: '12px', fontSize: '0.85rem', py: 1.2, px: 2,
//                 boxShadow: 'none', fontWeight: 700,
//                 '& .MuiButton-startIcon': { marginLeft: '12px', marginRight: '-4px' },
//                 '& .MuiSvgIcon-root': { fontSize: '1.4rem !important' } 
//               }
//             }}
//           >
//             <Button variant="contained" startIcon={<FileDownloadOutlinedIcon />} sx={{ bgcolor: COLORS.BROWN_DARK }}>
//               הורדת שיעור
//             </Button>
//             <Button variant="contained" startIcon={<PictureAsPdfOutlinedIcon />} sx={{ bgcolor: COLORS.BROWN_LIGHT }}>
//               הורדת PDF
//             </Button>
//             <Button variant="contained" startIcon={<CardGiftcardOutlinedIcon />} sx={{ bgcolor: COLORS.BLACK }}>
//               הקדש שיעור זה
//             </Button>
//             <Button variant="contained" startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ bgcolor: COLORS.BLACK }}>
//               הגב על השיעור
//             </Button>
//             <Button variant="contained" startIcon={<ReplyOutlinedIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ bgcolor: COLORS.BLACK }}>
//               שיתוף
//             </Button>
//           </Stack>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default LessonPlayer;
import { Box, Typography, Stack, Button, Chip, IconButton, Container } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel'; 
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'; 
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'; 
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'; 
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import React, { useEffect } from 'react'; 

interface LessonPlayerProps {
  lesson: any;
  onBack: () => void;
}

const LessonPlayer = ({ lesson, onBack }: LessonPlayerProps) => {
  if (!lesson) return null;

  // שליפת כל השדות כולל החדשים
  const { 
    title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, 
    rabbi, duration, AudioDir, AudioFileName, PdfFileName 
  } = lesson;

  const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
  const lessonNumber = title.match(/\d{3}/)?.[0] || "13";

  // הגדרת בסיס הכתובת לקבצים החיצוניים
  const MEDIA_BASE_URL = "https://torah-files.com/media-files/";
  
  // בניית הכתובות המלאות
  const audioUrl = (AudioDir && AudioFileName) ? `${MEDIA_BASE_URL}${AudioDir}/${AudioFileName}` : null;
  const pdfUrl = (AudioDir && PdfFileName) ? `${MEDIA_BASE_URL}${AudioDir}/${PdfFileName}` : null;

  const COLORS = {
    BROWN_DARK: '#9c6644',
    BROWN_LIGHT: '#b48a66',
    BG_CREAM: '#fdfbe7',
    BLACK: '#000000',
    ERROR_RED: '#9c6644' 
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: { xs: 2, md: 4 }, px: 2, direction: 'rtl' }}>
      <Container maxWidth="md">
        <Box sx={{ 
          maxWidth: '800px', mx: 'auto', position: 'relative', 
          backgroundColor: COLORS.BG_CREAM, borderRadius: { xs: '25px', md: '35px' }, 
          p: { xs: 2.5, sm: 3, md: 4 }, textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          
          <IconButton 
            onClick={onBack} 
            sx={{ 
              position: 'absolute', top: { xs: '-15px', md: '-20px' }, right: { xs: '-10px', md: '-15px' }, 
              color: COLORS.ERROR_RED, bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10, p: 0.5, '&:hover': { bgcolor: '#fff', transform: 'scale(1.1) rotate(90deg)' },
              '& .MuiSvgIcon-root': { fontSize: { xs: '2.2rem', md: '2.8rem' } }
            }}
          >
            <CancelIcon />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, mb: 1, fontSize: { xs: '1.2rem', md: '1.6rem' }, px: 5, lineHeight: 1.3 }}>
            {title}
          </Typography>

          <Chip label="כוונות הסעודה" sx={{ bgcolor: COLORS.BLACK, color: 'white', mb: 3, height: '24px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px' }} />

          {/* וידאו יוטיוב - החזרתי את זה למקום! */}
          <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: { xs: '15px', md: '25px' }, overflow: 'hidden', mb: 3, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', bgcolor: '#000' }}>
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
              src={`https://www.youtube.com/embed/${youtube_id}`} 
              title={title} 
              allowFullScreen
            ></iframe>
          </Box>

          {/* נגן שמע - מופיע רק אם יש נתונים בשדות AudioDir ו-AudioFileName */}
          {audioUrl && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(156, 102, 68, 0.1)', borderRadius: '15px', border: `1px dashed ${COLORS.BROWN_DARK}` }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                    <HeadsetMicOutlinedIcon sx={{ color: COLORS.BROWN_DARK }} />
                    <Typography sx={{ fontWeight: 700, color: COLORS.BROWN_DARK }}>האזנה לשיעור:</Typography>
                </Stack>
                <audio controls style={{ width: '100%', height: '40px' }}>
                    <source src={audioUrl} type="audio/mpeg" />
                </audio>
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2.5, gap: 4 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700 }}>רב: {rabbiName}</Typography>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700 }}>מס' שיעור: {lessonNumber}</Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-evenly" alignItems="center" sx={{ width: '100%', maxWidth: '400px', mx: 'auto', gap:1.2 }}>
              <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{lesson_date_hebrew}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>{lesson_date_gregorian}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" sx={{ gap: 0.7 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
                <Typography sx={{ fontWeight: 700 }}>{duration || '00:00'}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* כפתורי פעולה */}
          <Stack 
            direction="row" 
            justifyContent="center"
            sx={{ 
              flexWrap: 'wrap', gap: 1.5,
              '& .MuiButton-root': {
                borderRadius: '12px', fontSize: '0.85rem', py: 1.2, px: 2,
                boxShadow: 'none', fontWeight: 700,
                '& .MuiButton-startIcon': { marginLeft: '12px', marginRight: '-4px' },
                '& .MuiSvgIcon-root': { fontSize: '1.4rem !important' } 
              }
            }}
          >
            <Button 
                variant="contained" 
                disabled={!audioUrl}
                onClick={() => window.open(audioUrl!, '_blank')}
                startIcon={<FileDownloadOutlinedIcon />} 
                sx={{ bgcolor: COLORS.BROWN_DARK }}
            >
              הורדת שיעור
            </Button>

            <Button 
                variant="contained" 
                disabled={!pdfUrl}
                onClick={() => window.open(pdfUrl!, '_blank')}
                startIcon={<PictureAsPdfOutlinedIcon />} 
                sx={{ bgcolor: COLORS.BROWN_LIGHT }}
            >
              הורדת PDF
            </Button>

            <Button variant="contained" startIcon={<CardGiftcardOutlinedIcon />} sx={{ bgcolor: COLORS.BLACK }}>
              הקדש שיעור זה
            </Button>
            <Button variant="contained" startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ bgcolor: COLORS.BLACK }}>
              הגב על השיעור
            </Button>
            <Button variant="contained" startIcon={<ReplyOutlinedIcon sx={{ transform: 'scaleX(-1)' }} />} sx={{ bgcolor: COLORS.BLACK }}>
              שיתוף
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LessonPlayer;