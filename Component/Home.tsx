

import React, { useState } from 'react'; 
import { 
  Box, 
  Typography, 
  InputBase, 
  IconButton, 
  Stack,
  Paper, 
  Button,
  Grid, 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// ודא שהנתיב ל-Header נכון
import Header from './Header'; 
// בתוך אזור האימפורטים בראש הקובץ
import LatestLessonCard from './LatestLessonCard';
// --- 1. הגדרות רוחב וצבעים ---
const COLORS = {
  mainBg: '#922b2b', 
  inputTextColor: 'black',
  contentMaxWidth: '95%px', // רוחב קבוע
  searchBg: 'white',
  searchBtnBg: 'black',
  borderRadius: '8px',
  rabbiBg: 'white', 
  
};

// --- קומפוננטת כרטיס רב ---
interface RabbiCardProps {
    name: string;
    title: string;
    imageSrc: string;
}

const RabbiCard: React.FC<RabbiCardProps> = ({ name, title, imageSrc }) => (
    <Paper 
      elevation={1} 
      sx={{ 
        textAlign: 'right', 
        padding: 2, 
        borderRadius: COLORS.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box 
          sx={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: COLORS.rabbiBg, 
            borderRadius: '4px',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
      
      <Button 
        variant="contained" 
        size="small"
        sx={{ 
          backgroundColor: COLORS.mainBg, 
          color: 'white',
          marginTop: 2,
          alignSelf: 'flex-start',
          '&:hover': { backgroundColor: '#7a2222' }
        }}
      >
        לשיעורי הרב
      </Button>
    </Paper>
);

// --- 2. קומפוננטת דף הבית ---
const Home: React.FC = () => {
  const [centralSearchTerm, setCentralSearchTerm] = useState<string>('');

  const handleCentralSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('חיפוש מרכזי:', centralSearchTerm);
  };

  const cardActions = [
    { label: 'הוצאות ספרים', onClick: () => console.log('לחץ: הוצאות ספרים') },
    { label: 'שיעורי קבלה', onClick: () => console.log('לחץ: שיעורי קבלה') },
    { label: 'כללי דינאות', onClick: () => console.log('לחץ: כללי דינאות') },
  ];
  
  const rabbiCardsData = [
    { name: 'הרב יואל בלומנפלד שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+1' },
    { name: 'הרב בנימין עובדיה שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+2' },
    { name: 'הרב ירחמיאל ביסמוט שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+3' },
    { name: 'הרב יואל חזקן שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+4' },
  ];


  return (
    <Box 
      sx={{
        direction: 'rtl',
        minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      
      {/* 1. ה-HEADER */}
      {/* <Header /> */}
    
      {/* 2. קונטיינר התוכן העליון (כותרת וחיפוש) */}
      <Box
        sx={{
          maxWidth: COLORS.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          padding: { xs: 2, md: 5 }, 
          paddingBottom: 0, // איפוס פאדינג תחתון
          textAlign: 'center',
        }}
      >
        
        {/* --- אזור כותרת עליון --- */}
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
      
      {/* 3. קו הפרדה ברוחב מלא עם מרווח גדול (80px) */}
      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 }, // מרווח עליון
          marginBottom: 10, // מרווח תחתון גדול (80px)
        }} 
      />
  <LatestLessonCard />
      {/* 4. קונטיינר התוכן התחתון (ספרי הישיבה ורבנים) */}
      <Box
        sx={{
          maxWidth: COLORS.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          padding: { xs: 2, md: 5 }, 
          paddingTop: 0, // איפוס פאדינג עליון
          textAlign: 'center',
        }}
      >
        
        {/* --- אזור ספרי הישיבה --- */}
        <Box sx={{ marginTop: 8, marginBottom: 5 }}>
         <Typography variant="h4" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '3rem', md: '3rem' }, color: COLORS.inputTextColor, marginBottom: 4, fontFamily: 'Arial' }}>ספרי הישיבה</Typography>
          <Paper elevation={0} sx={{ width: '95%', minHeight: '400px', border: '1px solid #ccc', marginBottom: 5, backgroundColor: 'white',}}>{/* תוכן המלבן הלבן */}</Paper>
          
          <Stack
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            justifyContent="space-between"
            alignItems="stretch"
            sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }} 
          >
            {cardActions.map((action, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={action.onClick}
                sx={{
                  backgroundColor: COLORS.mainBg,
                  color: COLORS.searchBg, 
                  fontWeight: 'bold',
                  textTransform: 'none', 
                  padding: { xs: '15px 10px', sm: '20px 10px' },
                  fontSize: '1.1rem',
                  borderRadius: COLORS.borderRadius,
                  flexGrow: 1, 
                  minHeight: '120px',
                  minWidth: { xs: '100%', sm: '200px' }, 
                  '&:hover': { backgroundColor: '#7a2222' }
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Box>
        
        
        {/* 3. קו הפרדה ברוחב מלא עם מרווח גדול (80px) */}
      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 }, // מרווח עליון
          marginBottom: 10, // מרווח תחתון גדול (80px)
        }} 
      />


        {/* --- אזור מרן ראש הישיבה --- */}
        <Box sx={{ marginY: 8, backgroundColor: COLORS.rabbiBg, padding: 4, borderRadius: COLORS.borderRadius, textAlign: 'right' }}>
            
            <Grid container spacing={4} alignItems="stretch"> 
                
                {/* עמודה 1: תמונה גדולה */}
                <Box 
                    sx={{ 
                        width: { xs: '100%', md: 'calc((8 / 12) * 100% - 16px)' }, 
                        marginBottom: { xs: 4, md: 0 }, 
                        // marginRight: { xs: 0, md: '16px' } 
                    }} 
                >
   <Box
    sx={{
        // flexShrink: 0,
        // *** 1. לוודא שהרוחב הוא 100% מתוך ה-Grid item (md={6}) ***
        // width: '100%', 
        
        // *** 2. הקטנת יחס הגובה/רוחב ל-35% (יהפוך את התמונה לרחבה ונמוכה יותר) ***
        paddingTop: '30%', 
        // position: 'relative', 
        
        backgroundImage: 'url(./public/DSC_5195.JPG)',
        
        // *** 3. שומרים על 'contain' להצגת כל התמונה ***
        backgroundSize: 'contain', 
        backgroundRepeat: 'no-repeat', 
        
        // backgroundPosition: 'center',
        // borderRadius: '8px',
        // boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        order: { xs: 2, md: 1 
          
        },
    }}
/>
                </Box>
                
                {/* עמודה 2: טקסט וכפתור */}
                <Box 
                    sx={{ 
                        width: { xs: '100%', md: 'calc((4 / 12) * 100% - 16px)' }, 
                        marginLeft: { xs: 0, md: '16px' }
                    }}
                >
                    <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between', paddingLeft: { md: 2 } }}>
                        
                        <Box>
                            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: COLORS.inputTextColor, marginBottom: 1 }}>
                                מרן ראש הישיבה
                            </Typography>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 500, color: COLORS.inputTextColor, marginBottom: 2 }}>
                                הרה"ג הרב מרדכי עטייה שליט"א
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                מרן ראש הישיבה הרב מרדכי עטייה שיבדל"א היה מגדולי המתמידים בישיבה בדור הקודם, וכאן הקבלה בדרכו, מקים "ישיבת עטרת מרדכי" ללימודי דינאות והכשרת רבנים.
                            </Typography>
                        </Box>

                        <Button 
                            variant="contained" 
                            sx={{ 
                                backgroundColor: COLORS.mainBg, 
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                alignSelf: 'flex-start',
                                padding: '10px 20px',
                                marginTop: 3,
                                '&:hover': { backgroundColor: '#7a2222' }
                            }}
                        >
                            לשיעורי הרב
                        </Button>
                    </Stack>
                </Box>
                
            </Grid>

        </Box>
         {/* 3. קו הפרדה ברוחב מלא עם מרווח גדול (80px) */}
      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 }, // מרווח עליון
          marginBottom: 10, // מרווח תחתון גדול (80px)
        }} 
      />

        {/* --- אזור רשת הרבנים (2X2 Grid) --- */}
        <Box sx={{ marginY: 8 }}>
            
            <Grid container spacing={4}> 
                {rabbiCardsData.map((rabbi, index) => (
                    <Box 
                        key={index} 
                        // xs: 100% רוחב; sm: 50% רוחב (2 עמודות)
                        sx={{
                            width: { xs: '100%', sm: 'calc(50% - 16px)' }, 
                            marginBottom: { xs: 4, sm: 0 },
                            marginLeft: { xs: 0, sm: '16px' }
                        }}
                    > 
                        <RabbiCard {...rabbi} />
                    </Box>
                ))}
            </Grid>

        </Box>
        
      </Box>
    </Box>
  );
};

export default Home;