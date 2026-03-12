import React, { useRef,useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stack,
  Paper, 
  Button,
  Container
} from '@mui/material';

import Grid from '@mui/material/Grid';
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
  const navigate = useNavigate();
  const [centralSearchTerm, setCentralSearchTerm] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null); // הוספת המצב לשיעור נבחר
  const hasFetchedRabbis = useRef(false);
  const handleCentralSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('חיפוש מרכזי:', centralSearchTerm);
  };

  const [rabbiCardsData, setRabbiCardsData] = useState<any[]>([]);

 useEffect(() => {
  // מניעת כפילות בקריאות (StrictMode)
  if (hasFetchedRabbis.current) return;

  // שימוש ב-asc בשרת כדי לקבל מהקטן לגדול כבר מה-API
  fetch('http://localhost:1337/api/rabbis?populate=photo_url&sort[0]=Priority:asc')
    .then((res) => res.json())
    .then((data) => {
      if (!data?.data) {
        setRabbiCardsData([]);
        hasFetchedRabbis.current = true;
        return;
      }

      // 1. מיפוי הנתונים
      const formatted = data.data.map((r: any) => {
        const attr = r.attributes ? r.attributes : r;
        
        // בדיקה בקונסול - לוודא שהמספר באמת מגיע (שימי לב ל-P הגדולה)
        // חילוץ כותרת (Note) מהבלוקים של Strapi
        let title = '';
        if (attr.note && Array.isArray(attr.note) && attr.note.length > 0) {
          const block = attr.note[0];
          if (block.children && block.children.length > 0) {
            title = block.children[0].text || '';
          }
        }

        // חילוץ תמונה
        let imageSrc = '/placeholder.png';
        const photoData = attr.photo_url;
        if (photoData && photoData.length > 0) {
          const photo = photoData[0];
          const url = photo.url || photo.attributes?.url;
          if (url) {
            imageSrc = `http://localhost:1337${url}`;
          }
        }

        return {
          id: r.id,
          name: attr.name || 'ללא שם',
          title,
          imageSrc,
          // כאן קריטי להשתמש ב-Priority עם P גדולה!
          priority: Number(attr.Priority) ?? 999 
        };
      });

      // 2. מיון סופי בקליינט (מהקטן לגדול)
      const sortedRabbis = [...formatted].sort((a, b) => a.priority - b.priority);

      // הדפסה של הרשימה הסופית לבדיקה

      setRabbiCardsData(sortedRabbis);
      hasFetchedRabbis.current = true;
    })
    .catch((err) => {
      console.error('Error fetching rabbis:', err);
    });
}, []);
const videoRef = useRef<HTMLVideoElement>(null); // [2] יצירת הרפרנס לווידאו

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.load(); // [3] טעינה מחדש מחזירה את ה-Poster
    }}
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
        overflowX: 'hidden', // קריטי למניעת הפס למטה
        direction: 'rtl',
        // minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      {/* --- אזור כותרת עליון --- */}
     {/* --- אזור כותרת עליון מתוקן --- */}
<Box
  sx={{
    maxWidth: COLORS.contentMaxWidth,
    width: '100%',
    margin: '0 auto',
    padding: 0,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: { xs: '50px', md: '50px' },
  }}
>
  {/* האפקט השקוף ברקע */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url("/pyp.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.3,
      zIndex: 0,
      maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
    }}
  />

  {/* תוכן הטקסט והלוגואים */}
  <Box sx={{ py: { xs: 8, md: 12 }, zIndex: 1, position: 'relative' }}>
    
    {/* שורת הכותרת עם הלוגואים */}
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="center" 
        spacing={{ xs: 2, sm: 6, md: 12 }}

      // spacing={{ xs: 1, sm: 2, md: 4 }} // מרווח משתנה לפי גודל מסך
      sx={{ mb: 1 }}
    >
      {/* לוגו ימין */}
      {/* <Box
        component="img"
        src="/logo.jpg.jpg" // ודאי שזה השם המדויק בתיקיית public
        sx={{
          // height: { xs: '60px', sm: '100px', md: '140px' }, // גדל עם המסך
          // objectFit: 'contain'
          // height: { xs: '60px', sm: '100px', md: '140px' }, // הגדלתי משמעותית
        objectFit: 'contain',
        // השורה הבאה מעלימה רקע לבן אם קיים (עובד הכי טוב אם הלוגו שחור/כהה)
        mixBlendMode: 'multiply',
        }}
      /> */}

<Typography
  variant="h1"
  component="h1"
  sx={{
    fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
    fontWeight: 500,
    fontSize: { xs: '2.5rem', sm: '4.5rem', md: '5.5rem' },
    color: COLORS.inputTextColor || 'black',
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
    textAlign: 'center'
  }}
>
  עטרת מרדכי
</Typography>

      {/* לוגו שמאל */}
      {/* <Box
        component="img"
        src="/logo.jpg.jpg"
        sx={{
          height: { xs: '40px', sm: '60px', md: '90px' },
          objectFit: 'contain'
        }}
      /> */}
    </Stack>
    
    {/* הקו המפריד */}
    <Box sx={{ 
      width: '80px', 
      height: '3px', 
      backgroundColor: 'black', 
      margin: '0 auto', 
      mb: 2,
      opacity: 0.3 
    }} />

    {/* כותרת המשנה */}
    <Typography
      variant="body1"
      sx={{
            fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS

        marginTop: 1,
        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
        color: COLORS.inputTextColor || 'black',
        fontWeight: 400,
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      ישיבה ללימוד קבלה עפ"י תורת האר"י ז"ל
    </Typography>
  </Box>
</Box>

{/* הפס המבדיל - עכשיו התמונה נוגעת בו ישירות */}
<Box 
  sx={{ 
    borderBottom: '#444444', 
    marginTop: 0, // איפסתי מרג'ין כדי שהחיבור יהיה מושלם
    marginBottom: 10,
  }} 
/>
     

      {/* --- LatestLessonCard --- */}

    <Box sx={{ 
   // תואם ל-maxWidth של הכותרת אם הגדרת
  mx: 'auto', 
  // px: {  md: 1 }, // שוליים זהים בדיוק לאלו של הכותרת (שורות 83-90)
  width: '100%' 
}}>  <LatestLessonCard onLessonSelect={(lesson) => setSelectedLesson(lesson)} /></Box>  
      <Box sx={{ my: { xs: 8, md: 15 } }} />
<Box
  sx={{
    position: 'relative',
    overflow: 'hidden',
    pt: { xs: 1, md: 2 }, // צמצום משמעותי של הרווח העליון (Padding Top)
    pb: { xs: 2, md: 4 },
    direction: 'rtl',
  }}
>
  <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2} // צמצום הרווח בין המגילה לסרטון
      alignItems="stretch"
      justifyContent="center"
    >
      {/* צד ימין: המגילה - מקבלת חלק 1 מתוך 3 */}
      <Box 
        sx={{ 
          flex: 1, // פרופורציה של 1
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                px: { xs: 2, md: 4 },
                position: 'relative' // נדרש בשביל המיקום של הכפתור
              }}
            >
        <Box
          component="img"
          src="/megila.png"
          sx={{
            width: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
            filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.15))',
          }}
        />
      </Box>
 <Button
          onClick={() => navigate('/ModernScrollDonation')
}
          sx={{
            position: 'absolute',
            bottom: '17%', // מיקום יחסי מעל הטקסט במגילה
            left: '80%',
            transform: 'translateX(-50%)',
            width: '15%',  // רוחב האזור הלחיץ
            height: '8%',  // גובה האזור הלחיץ
         
            cursor: 'pointer',
            borderRadius: '4px',
           
          }}
        />
        </Box>
      {/* צד שמאל: הסרטון - מקבל 2 חלקים מתוך 3 */}
      <Box 
        sx={{ 
          flex: 1.5, // פרופורציה של 2 (פי 2 מהמגילה)
          width: '100%', 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          backgroundColor: '#000',
          display: 'flex'
        }}
      >
  <video
              ref={videoRef} // [4] חיבור הרפרנס
              onEnded={handleVideoEnd} // [5] הפעלת הפונקציה בסיום
              controls
              poster="/image (12).png"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block' 
              }}
            >
              <source src="/video-placeholder.mp4" type="video/mp4" />
            </video>
      </Box>
    </Stack>
  </Container>
</Box>

      {/* --- LecturesGrid עם פונקציית בחירה --- */}
 <Box sx={{ 
 // תואם ל-maxWidth של הכותרת אם הגדרת
  mx: 'auto', 
  // px: {  md: 1 }, // שוליים זהים בדיוק לאלו של הכותרת (שורות 83-90)
  width: '100%' 
}}>
 <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /></Box>  
      {/* <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /> */}

      {/* <Box sx={{ my: { xs: 4, md: 7.5 } }} /> */}
      <BooksCarousel />
     <Box sx={{ my: { xs: 4, md: 7.5 } }} />
  {/* --- אזור מרן ראש הישיבה --- */}
<Box sx={{ width: '100%', mb: { xs: 8, md: 12 } }}>
 <Grid 
    container 
    sx={{ 
      width: '100%', // הוספתי רוחב מלא כדי למנוע קפיצות
      backgroundColor: '#fdfbe7',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      borderBottom: '1px solid #9c6644',
      minHeight: { xs: 'auto', md: '65vh' },
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* אזור הטקסט */}
    <Grid 
      size={{ xs: 12, md: 7 }} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        p: { xs: 4, md: 10 },
        order: { xs: 2, md: 1 } 
      }}
    >
      <Box sx={{ maxWidth: '650px', textAlign: 'right' }}>
        {/* <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 30, height: 2, backgroundColor: '#9c6644' }} />
          <Typography sx={{ color: '#9c6644', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            ממשיך השושלת
          </Typography>
        </Stack> */}

        <Typography variant="h2" sx={{    fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
 fontWeight: 500, mb: 1, fontSize: { xs: '2.2rem', md: '4rem' }, color: '#9c6644' }}>
          מרן ראש הישיבה
        </Typography>

        <Typography variant="h5" sx={{    fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
 fontWeight: 500, mb: 4, color: '#9c6622', fontSize: { xs: '1.1rem', md: '1.6rem' } }}>
          הרה"ג הרב מרדכי עטייה שליט"א
        </Typography>

        <Typography sx={{ color: '#444', lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 5 }}>
הגאון המקובל רבי מרדכי עטייה שליט"א עומד בראשות ישיבת "החיים והשלום" בירושלים, שם הוא ממשיך את מורשת זקנו ומנחיל את תורת הסוד בשיעורים יומיים עמוקים. בשנים האחרונות ראו אור י"ב כרכי סדרת ספריו "עטרת מרדכי", אשר התקבלו באהדה עצומה בקרב לומדי הקבלה בשל שילובם הייחודי בין עומק לבהירות. לצד הנהגתו התורנית, משמש הרב כתובת לרבים הפוקדים את מעונו לעצה, ברכה והדרכה רוחנית. </Typography>

        <Button
        onClick={() => {
    // מציאת ה-ID באופן דינמי לפי השם מתוך הנתונים שמשכנו ב-useEffect
    const chiefRabbi = rabbiCardsData.find(r => r.name.includes('הרב מרדכי עטייה'));
    if (chiefRabbi) {
      navigate('/AllLessons', { state: { rabbiId: chiefRabbi.id } });
    } else {
      console.warn('הנתונים עדיין בטעינה...');
    }
  }}
  variant="contained"
          sx={{
            backgroundColor: '#9c6644',
            color: '#fff',
            px: 5, py: 1.8,
                                  borderRadius: '0.5rem', 

            fontWeight: 700,
            
            '&:hover': { backgroundColor: '#9c6644' }
          }}
        > לשיעורי הרב
        </Button>
      </Box>
    </Grid>

    {/* אזור התמונה */}
    <Grid 
      size={{ xs: 12, md: 5 }} 
      sx={{ 
        position: 'relative', 
        minHeight: { xs: '450px', md: 'auto' },
        order: { xs: 1, md: 2 } 
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
                                borderRadius: '0.5rem', 

          top: '10%', bottom: '10%', left: '10%', right: '10%',
          border: '1px solid #9c6644',
          zIndex: 1,
          display: { xs: 'none', md: 'block' }
        }} 
      />
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 0, md: '15%' },
          bottom: { xs: 0, md: '5%' },
          left: { xs: 0, md: '15%' },
          right: { xs: 0, md: '5%' },
          backgroundImage: 'url(/compressimage-io/GOOD/p8.webp)',
          backgroundSize: 'cover',
                                borderRadius: '0.5rem', 

          backgroundPosition: 'top center',
          zIndex: 2,
          boxShadow: '-20px 20px 40px rgba(0,0,0,0.15)',
        }}
      />
    </Grid>
  </Grid>
  
</Box>

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
                    onClick={() => {
    // שליחה לעמוד השיעורים עם ה-ID מוחבא בתוך ה-state
    navigate('/AllLessons', { state: { rabbiId: rabbi.id } });
  }}
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
