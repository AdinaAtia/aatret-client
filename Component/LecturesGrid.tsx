import React, { useState, useEffect } from 'react'; 
import Grid from '@mui/material/Grid'; 
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Stack } from "@mui/material";
import { Download, Play, Clock, Calendar } from 'lucide-react'; 
import axios from 'axios';

interface LecturesGridProps {
  onLessonSelect: (lesson: any) => void;
}

const LecturesGrid = ({ onLessonSelect }: LecturesGridProps) => {
  const [lectures, setLectures] = useState<any[]>([]);
  const MAIN_BROWN = '#9c6644'; 

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/lessons?populate=*');
        setLectures(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchLectures();
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      direction: 'rtl', 
      boxSizing: 'border-box',
      // --- הקטנת השוליים בצדדים כדי לתת ל-5 כרטיסים מקום לנשום ---
      px: { xs: 2, sm: 3, md: 4, lg: 8 }, 
      py: 6 
    }}>
      
      <Grid 
        container 
        spacing={3} // ריווח מאוזן בין הכרטיסים
        sx={{ 
          rowGap: { xs: 8, md: 10 }, 
          margin: 0, 
          width: '100%' 
        }}
        justifyContent="center"
      > 
        {lectures.map((lecture) => {
          const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi } = lecture;
          const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
          const thumbnailUrl = `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`;

          return (
            <Grid 
              key={lecture.id} 
              // --- חזרה ל-5 כרטיסים בשורה (12 / 2.4 = 5) ---
              size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} 
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  width: '100%', 
                  // הסרתי maxWidth קשיח כדי שינצל את כל המרחב של ה-2.4
                  borderRadius: '1rem', 
                  backgroundColor: '#fdfbe7', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative', 
                  overflow: 'visible', 
                  minHeight: '280px' // שומר על המראה הלא-ארוך שביקשת
                }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  borderTopLeftRadius: '1rem', 
                  borderTopRightRadius: '1rem', 
                  overflow: 'hidden' 
                }}>
                  <CardMedia 
                    component="img" 
                    sx={{ aspectRatio: '16/9', objectFit: 'cover' }} 
                    image={thumbnailUrl} 
                  />
                </Box>

                <CardContent sx={{ 
                  pt: 2, 
                  pb: 6, 
                  px: 1.5, // הקטנת פדינג פנימי לטובת רוחב הטקסט
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexGrow: 1 
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 900, mb: 1, fontSize: '0.9rem', color: 'black', lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ color: 'black', fontWeight: 600, display: 'block', mb: 'auto', opacity: 0.7 }}>
                    {rabbiName}
                  </Typography>

                  <Stack 
                    direction="row" 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={1} 
                    sx={{ color: '#555', mt: 1.5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                       <Clock size={12} />
                       <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>01:03:05</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                       <Calendar size={12} />
                       <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{lesson_date_gregorian}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                       <Calendar size={12} />
                       <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{lesson_date_hebrew}</Typography>
                    </Box>
                  </Stack>
                </CardContent>

                {/* כפתורים צפים */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: '-24px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  display: 'flex', 
                  gap: 1.5, 
                  zIndex: 2 
                }}>
                  <IconButton 
                    onClick={() => onLessonSelect(lecture)} 
                    sx={{ 
                      borderRadius: '10px', 
                      backgroundColor: MAIN_BROWN, 
                      color: 'white', 
                      width: 42, 
                      height: 42, 
                      '&:hover': { backgroundColor: '#7d5236' } 
                    }}
                  >
                    <Play size={16} fill="white" />
                  </IconButton>

                  <IconButton 
                    sx={{ 
                      borderRadius: '10px', 
                      backgroundColor: 'black', 
                      color: 'white', 
                      width: 42, 
                      height: 42, 
                      '&:hover': { backgroundColor: '#222' } 
                    }}
                  >
                    <Download size={18} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LecturesGrid;