import React, { useState, useEffect } from 'react'; 
import { 
  Box, 
  Typography, 
  Stack,
  Paper, 
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // שימוש ב-Grid2 החדש
import LatestLessonCard from './LatestLessonCard';
import LecturesGrid from './LecturesGrid';
import LessonPlayer from './LessonPlayer'; // ייבוא הנגן
import BooksCarousel from './BooksCarousel'; // ודאי שהנתיב לקובץ נכון

// --- 1. הגדרות רוחב וצבעים ---
const COLORS = {
  mainBg: '#9c6644', 
  inputTextColor: 'black',
  contentMaxWidth: '100%',
  rabbiBg: 'white', 
  borderRadius: '8px',
};

// --- 2. קומפוננטת דף הבית ---
const Home: React.FC = () => {
  const [centralSearchTerm, setCentralSearchTerm] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null); // הוספת המצב לשיעור נבחר
  
  const handleCentralSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('חיפוש מרכזי:', centralSearchTerm);
  };

  const [rabbiCardsData, setRabbiCardsData] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:1337/api/rabbis?populate=photo_url')
      .then(res => res.json())
      .then(data => {
        if (!data?.data) {
          setRabbiCardsData([]);
          return;
        }

        const formatted = data.data.map((r: any) => {
          let title = '';
          if (r.note && r.note.length > 0) {
            const block = r.note[0];
            if (block.children && block.children.length > 0) {
              title = block.children[0].text || '';
            }
          }

          let imageSrc = '/placeholder.png';
          if (r.photo_url && r.photo_url.length > 0) {
            const photo = r.photo_url[0];
            if (photo && photo.url) {
              imageSrc = `http://localhost:1337${photo.url}`;
            } else if (photo?.attributes?.url) {
              imageSrc = `http://localhost:1337${photo.attributes.url}`;
            }
          }

          return {
            id: r.id,
            name: r.name || 'No name',
            title,
            imageSrc,
          };
        });
        setRabbiCardsData(formatted);
      })
      .catch(err => console.error('Error fetching rabbis:', err));
  }, []);

  // --- שינוי נדרש: אם נבחר שיעור, נציג רק את הנגן ---
  if (selectedLesson) {
    return (
      <LessonPlayer 
        lesson={selectedLesson} 
        onBack={() => setSelectedLesson(null)} 
      />
    );
  }

  return (
    <Box 
      sx={{
        direction: 'rtl',
        minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      {/* --- אזור כותרת עליון --- */}
      <Box
        sx={{
          maxWidth: COLORS.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          padding: { md: 1 }, 
          paddingBottom: 0,
          textAlign: 'center',
        }}
      >
        <Box sx={{ marginY: { xs: 4, md: 8 } }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
              color: COLORS.inputTextColor,
              lineHeight: 1.1,
            }}
          >
            עטרת מרדכי
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginTop: 1,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, 
              color: COLORS.inputTextColor,
              fontWeight: 500,
            }}
          >
            ישיבה ללימוד קבלה עפ"י תורת האר"י ז"ל
          </Typography>
        </Box>
      </Box>

      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 },
          marginBottom: 10,
        }} 
      />

      {/* --- LatestLessonCard --- */}
    
    <Box sx={{ 
   // תואם ל-maxWidth של הכותרת אם הגדרת
  mx: 'auto', 
  // px: {  md: 1 }, // שוליים זהים בדיוק לאלו של הכותרת (שורות 83-90)
  width: '100%' 
}}>  <LatestLessonCard /></Box>  
      <Box sx={{ my: { xs: 8, md: 15 } }} />

      {/* --- LecturesGrid עם פונקציית בחירה --- */}
 <Box sx={{ 
 // תואם ל-maxWidth של הכותרת אם הגדרת
  mx: 'auto', 
  // px: {  md: 1 }, // שוליים זהים בדיוק לאלו של הכותרת (שורות 83-90)
  width: '100%' 
}}>
 <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /></Box>  
      {/* <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /> */}

      <Box sx={{ my: { xs: 4, md: 7.5 } }} />
      <BooksCarousel />
     <Box sx={{ my: { xs: 4, md: 7.5 } }} />
     {/* --- אזור מרן ראש הישיבה --- */}
<Grid
  container
  spacing={0}
  alignItems="stretch"
  sx={{ 
    width: '100vw', // פריסה לכל רוחב המסך
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    minHeight: '56dvh',
    mb: { xs: 6, md: 10 },
    direction: 'rtl'
  }}
>
  <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' }, // תמונה משמאל ב-Desktop, מעל ב-Mobile
        width: '100%',
        minHeight: '100%',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#fdfbe7', // צבע הקרם העדין מהתמונה
        borderTop: '1px solid #000', 
        borderBottom: '1px solid #000',
      }}
    >
      {/* אזור הטקסט - שומר על הגדלים המקוריים שלך */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: '2rem', md: '3rem' },
          textAlign: 'right',
          minWidth: 0,
        }}
      >
        <Typography sx={{ fontWeight: 800, mb: '0.1rem', fontSize: { xs: '1.2rem', md: '1.8rem' }, fontFamily: 'serif' }}>
          מרן ראש הישיבה
        </Typography>
        <Typography sx={{ fontWeight: 600, mb: '1rem', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
          הרה"ג הרב מרדכי עטייה שליט"א
        </Typography>
        <Typography sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: { xs: '0.85rem', md: '0.95rem' }, maxWidth: '95%', mb: '1.5rem' }}>
          מרן ראש הישיבה הרב מרדכי עטייה היה מגדולי המחזירים בתשובה בדור הקודם, גאון הקבלה בדורנו, מקים ישיבת "עטרת מרדכי" ללימודי דיינות והכשרת רבנים.
        </Typography>
        
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black', // צבע שחור כמו בתמונה
            width: 'fit-content',
            px: 4, py: 1,
            borderRadius: '4px',
            alignSelf: 'flex-start',
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#222' },
          }}
        >
          לשיעורי הרב
        </Button>
      </Box>

      {/* אזור התמונה - בצד שמאל */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' }, // רחבה יותר כמו שביקשת קודם
          minHeight: { xs: '300px', md: 'auto' },
          backgroundImage: 'url(/DSC_5195.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }}
      />
    </Paper>
  </Grid>
</Grid>
      <Box sx={{ my: { xs: 8, md: 15 } }} />

      {/* --- אזור רשת המרצים --- */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, pb: 8 }}>
        <Grid container spacing={3} alignItems="stretch">
          {rabbiCardsData.map((rabbi, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
              <Paper
                elevation={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderRadius: '1rem', 
                  overflow: 'hidden',
                  width: '100%',
                  minHeight: { xs: 'auto', sm: '25vh' }, 
                  backgroundColor: '#ffffff',
                }}
              >
                <Box
                  sx={{
                    width: { xs: '45%', sm: '40%' },
                    backgroundImage: `url(${rabbi.imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box 
                  sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    p: '1.5rem', 
                    textAlign: 'right', 
                    minWidth: 0 
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: '0.5rem', fontSize: '1.1rem' }}>
                    {rabbi.name}
                  </Typography>
                  <Box sx={{ flex: 1 }}> 
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.85rem' }}>
                      {rabbi.title}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#9c6644', 
                      width: 'fit-content', 
                      mt: '1rem', 
                      borderRadius: '0.5rem', 
                      alignSelf: 'flex-start',
                      '&:hover': { backgroundColor: '9c6644' } 
                    }}
                  >
                    לשיעורי הרב
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;