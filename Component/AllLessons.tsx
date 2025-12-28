import React from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { 
  Box, Typography, Grid, Paper, IconButton, 
  Accordion, AccordionSummary, AccordionDetails, Stack, Button 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AllLessons = () => {
  const lessonData = Array(5).fill({
    title: "כוונות העמידה דרוש ב'",
    speaker: "הרב מרדכי עטייה",
    category: "מטבע ברכה",
    date: "25/04/25",
    hebrewDate: "כ\"ו חשוון תשפ\"ה",
    time: "01:03:05",
    image: "/DSC_5195.JPG" 
  });

  return (
    <Box sx={{ direction: 'rtl', maxWidth: '1200px', mx: 'auto', p: 4, backgroundColor: '#fff' }}>
      
      {/* טאבים עליונים */}
      {/* <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
        {['תורת מרדכי עטייה', 'קבלה', 'כוונות וייחודים'].map((text, i) => (
          <Button key={i} variant="contained" 
            sx={{ 
              bgcolor: '#922b2b', 
              borderRadius: '10px', 
              fontSize: '0.9rem', 
              px: 3, 
              boxShadow: 'none',
              '&:hover': { bgcolor: '#7a2222' }
            }}>
            {text}
          </Button>
        ))}
      </Stack> */}

      <Grid container spacing={3}>
        
        {/* סרגל צדי */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ p: 1, bgcolor: '#fdfbe6', borderRadius: '20px', border: '1px solid #f0edcf' }}>
            {['הרב המוסר', 'קבלה', 'חגים ומועדים'].map((label) => (
              <Accordion key={label} elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontSize="1rem">{label}</Typography>
                </AccordionSummary>
              </Accordion>
            ))}
            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontSize="1rem" fontWeight="bold">פרשת שבוע</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {['בראשית', 'נח', 'לך לך', 'וירא', 'חיי שרה'].map(item => (
                  <Typography key={item} sx={{ fontSize: '0.9rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 5, height: 5, border: '1px solid #ccc', transform: 'rotate(45deg)' }} /> {item}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* רשימת שיעורים */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={2}>
            {lessonData.map((lesson, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', // ב-RTL זה שם את האלמנט הראשון בימין
                  borderRadius: '25px', 
                  bgcolor: '#fdfbe6', 
                  p: '15px', 
                  alignItems: 'center',
                  gap: 3,
                  border: '1px solid #f0edcf',
                  position: 'relative',
                  minHeight: '160px'
                }}
              >
                {/* 1. תמונה - עכשיו היא תהיה בצד ימין (ראשונה ב-RTL) */}
                <Box 
                  sx={{ 
                    width: '220px', 
                    height: '140px', 
                    backgroundImage: `url(${lesson.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    borderRadius: '18px',
                    flexShrink: 0
                  }} 
                />

                {/* 2. תוכן טקסטואלי - משמאל לתמונה */}
                <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    bgcolor: '#000', color: '#fff', px: 1.2, py: 0.3, 
                    borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', 
                    width: 'fit-content', mb: 1
                  }}>
                    {lesson.category}
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: '800', fontSize: '1.2rem', mb: 0.2 }}>
                    {lesson.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.95rem', color: '#666', mb: 1.5 }}>
                    {lesson.speaker}
                  </Typography>
                  
                  {/* שורת נתונים תחתונה */}
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ color: '#000', fontSize: '0.85rem' }}>
                     <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography fontSize="inherit">{lesson.time}</Typography>
                     </Stack>
                     <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        <Typography fontSize="inherit">{lesson.date}</Typography>
                     </Stack>
                     <Typography fontSize="inherit">{lesson.hebrewDate}</Typography>
                  </Stack>
                </Box>

                {/* 3. כפתורי פעולה - בפינה השמאלית התחתונה */}
                <Stack 
                  direction="row" 
                  gap={2}
                  spacing={1} 
                  sx={{ 
                    position: 'absolute', 
                    left: '20px', 
                    bottom: '15px' 
                    
                  }}
                >
                  <IconButton sx={{ 
                    
                    bgcolor: '#922b2b', color: '#fff', 
                    width: '40px', height: '40px', 
                    borderRadius: '10px', 
                    '&:hover': { bgcolor: '#7a2222' }
                  }}>
                   <PlayCircleOutlineIcon sx={{ fontSize: '1.8rem' }} />
                  </IconButton>

                  <IconButton sx={{ 
                    bgcolor: '#922b2b', color: '#fff', 
                    width: '40px', height: '40px', 
                    borderRadius: '10px', 
                    '&:hover': { bgcolor: '#7a2222' }
                  }}>
                   <FileDownloadOutlinedIcon sx={{ fontSize: '1.6rem' }} />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllLessons;