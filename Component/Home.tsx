// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   InputBase, 
//   IconButton, 
//   Stack,
//   Paper, // נשתמש ב-Paper לכרטיסים (Cards)
//   Button,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import Header from './Header'; // ודא שהנתיב נכון

// // --- 1. הגדרות רוחב וצבעים ---
// const COLORS = {
//   mainBg: '#922b2b', // הצבע האדום כהה של הכפתורים וה-Header
//   inputTextColor: 'black',
//   contentMaxWidth: '1280px', 
//   searchBg: 'white',
//   searchBtnBg: 'black',
//   borderRadius: '8px',
// };

// // --- 2. קומפוננטת דף הבית ---
// const Home: React.FC = () => {
//   const [centralSearchTerm, setCentralSearchTerm] = useState<string>('');

//   const handleCentralSearch = (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log('חיפוש מרכזי:', centralSearchTerm);
//   };

//   const cardActions = [
//     { label: 'הוצאות ספרים', onClick: () => console.log('לחץ: הוצאות ספרים') },
//     { label: 'שיעורי קבלה', onClick: () => console.log('לחץ: שיעורי קבלה') },
//     { label: 'כללי דינאות', onClick: () => console.log('לחץ: כללי דינאות') },
//   ];

//   return (
//     <Box 
//       sx={{
//         direction: 'rtl',
//         minHeight: '100vh',
//         backgroundColor: 'white', // רקע הדף לבן
//       }}
//     >
      
//       {/* 1. ה-HEADER */}
//       <Header />
      
//       {/* 2. קונטיינר התוכן המרכזי */}
//       <Box
//         sx={{
//           maxWidth: COLORS.contentMaxWidth,
//           width: '100%',
//           margin: '0 auto',
//           padding: { xs: 2, md: 5 },
//           textAlign: 'center',
//         }}
//       >
        
//         {/* --- אזור כותרת וחיפוש עליון --- */}
//         <Box sx={{ marginY: { xs: 4, md: 8 } }}>
//           <Typography
//             variant="h1"
//             component="h1"
//             sx={{
//               fontWeight: 900,
//               fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
//               color: COLORS.inputTextColor,
//               lineHeight: 1.1,
//             }}
//           >
//             עטרת מרדכי
//           </Typography>
//           <Typography
//             variant="body1"
//             sx={{
//               marginTop: 1,
//               fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
//               color: COLORS.inputTextColor,
//               fontWeight: 500,
//             }}
//           >
//             ישיבה ללימוד קבלה, נב"י ותורת האריז"ל
//           </Typography>
//         </Box>

//         {/* תיבת חיפוש מרכזית גדולה */}
//         <Box
//           component="form"
//           onSubmit={handleCentralSearch}
//           sx={{
//             display: 'flex',
//             alignItems: 'stretch',
//             justifyContent: 'center',
//             marginTop: { xs: 5, md: 8 },
//             marginBottom: 5,
//           }}
//         >
//           <Stack
//             direction="row"
//             sx={{
//               width: { xs: '100%', sm: '80%', md: '600px' },
//               overflow: 'hidden',
//               borderRadius: COLORS.borderRadius,
//               border: '1px solid black',
//               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             {/* שדה טקסט לחיפוש */}
//             <InputBase
//               type="text"
//               placeholder="חפש שיעור"
//               value={centralSearchTerm}
//               onChange={(e) => setCentralSearchTerm(e.target.value)}
//               aria-label="הזן מילות חיפוש בדף הבית"
//               sx={{
//                 flexGrow: 1,
//                 padding: '12px 20px',
//                 fontSize: { xs: '16px', sm: '18px' },
//                 backgroundColor: COLORS.searchBg,
//                 color: COLORS.inputTextColor,
//                 direction: 'rtl',
//                 textAlign: 'right',
//                 '& .MuiInputBase-input': { padding: 0 }
//               }}
//             />
//             {/* כפתור חיפוש שחור */}
//             <IconButton
//               type="submit"
//               aria-label="לחץ לחיפוש"
//               sx={{
//                 backgroundColor: COLORS.searchBtnBg,
//                 color: COLORS.searchBg,
//                 width: '55px',
//                 height: 'auto',
//                 borderRadius: '0', 
//                 '&:hover': { backgroundColor: COLORS.searchBtnBg }
//               }}
//             >
//               <SearchIcon sx={{ width: '28px', height: '28px', fill: COLORS.searchBg }} />
//             </IconButton>
//           </Stack>
//         </Box>
        
//         {/* קו הפרדה */}
//         <Box sx={{ borderBottom: '1px solid #ccc', marginY: 5 }} />

//         {/* --- אזור ספרי הישיבה --- */}
//         <Box sx={{ marginTop: 8, marginBottom: 5 }}>
          
//           {/* כותרת: "ספרי הישיבה" */}
//           <Typography
//             variant="h4"
//             component="h2"
//             sx={{
//               fontWeight: 700,
//               fontSize: { xs: '1.5rem', md: '2rem' },
//               color: COLORS.inputTextColor,
//               marginBottom: 4,
//             }}
//           >
//             ספרי הישיבה
//           </Typography>

//           {/* מלבן תוכן גדול (כאן יבואו תמונות או רשימת ספרים) */}
//           <Paper
//             elevation={0} // בלי צל כפי שנראה בתמונה
//             sx={{
//               width: '100%',
//               minHeight: '400px', // גובה גדול כפי שנראה בתמונה
//               border: '1px solid #ccc',
//               marginBottom: 5,
//               backgroundColor: 'white',
//             }}
//           >
//             {/* תוכן המלבן הלבן */}
//           </Paper>

//           {/* שורת הכפתורים/כרטיסים האדומים */}
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={3}
//             justifyContent="center"
//             alignItems="stretch"
//           >
//             {cardActions.map((action, index) => (
//               <Button
//                 key={index}
//                 variant="contained"
//                 onClick={action.onClick}
//                 sx={{
//                   backgroundColor: COLORS.mainBg,
//                   color: COLORS.searchBg, // טקסט לבן
//                   fontWeight: 'bold',
//                   textTransform: 'none', // ללא אותיות גדולות
//                   padding: { xs: '15px 10px', sm: '20px 10px' },
//                   fontSize: '1.1rem',
//                   borderRadius: COLORS.borderRadius,
//                   flexGrow: 1, // גורם לכרטיסים לתפוס רוחב שווה
//                   minHeight: '120px', // גובה קבוע כפי שנראה בתמונה
//                   '&:hover': {
//                     backgroundColor: '#7a2222', // צל מעט כהה יותר ברפרוף
//                   }
//                 }}
//               >
//                 {action.label}
//               </Button>
//             ))}
//           </Stack>

//         </Box>
        
//       </Box>
//     </Box>
//   );
// };

// export default Home;
import React, { useState } from 'react'; 
import { 
  Box, 
  Typography, 
  InputBase, 
  IconButton, 
  Stack,
  Paper, 
  Button,
  Grid, // משמש כ-container בלבד
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// ודא שהנתיב ל-Header נכון
import Header from './Header'; 

// --- 1. הגדרות רוחב וצבעים ---
const COLORS = {
  mainBg: '#922b2b', 
  inputTextColor: 'black',
  contentMaxWidth: '1280px', 
  searchBg: 'white',
  searchBtnBg: 'black',
  borderRadius: '8px',
  // rabbiBg: '#e9e9e9', 
  rabbiBg: 'white', // שונה מ-'#e9e9e9' ל-'white'
};

// --- קומפוננטת כרטיס רב (לשימוש חוזר) ---
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
      <Header />
      
      {/* 2. קונטיינר התוכן המרכזי */}
      <Box
        sx={{
          maxWidth: COLORS.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          padding: { xs: 2, md: 5 }, 
          textAlign: 'center',
        }}
      >
        
        {/* --- אזור כותרת וחיפוש עליון --- */}
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
            ישיבה ללימוד קבלה, נב"י ותורת האריז"ל
          </Typography>
        </Box>

        {/* תיבת חיפוש מרכזית גדולה */}
        <Box
          component="form"
          onSubmit={handleCentralSearch}
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            marginTop: { xs: 5, md: 8 },
            marginBottom: 5,
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: { xs: '100%', sm: '80%', md: '600px' }, 
              overflow: 'hidden',
              borderRadius: COLORS.borderRadius,
              border: '1px solid black',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* שדה טקסט לחיפוש */}
            <InputBase
              type="text"
              placeholder="חפש שיעור"
              value={centralSearchTerm}
              onChange={(e) => setCentralSearchTerm(e.target.value)}
              aria-label="הזן מילות חיפוש בדף הבית"
              sx={{
                flexGrow: 1,
                padding: '12px 20px',
                fontSize: { xs: '16px', sm: '18px' },
                backgroundColor: COLORS.searchBg,
                color: COLORS.inputTextColor,
                direction: 'rtl',
                textAlign: 'right',
                '& .MuiInputBase-input': { padding: 0 }
              }}
            />
            {/* כפתור חיפוש שחור */}
            <IconButton
              type="submit"
              aria-label="לחץ לחיפוש"
              sx={{
                backgroundColor: COLORS.searchBtnBg,
                color: COLORS.searchBg,
                width: '55px',
                height: 'auto',
                borderRadius: '0', 
                '&:hover': { backgroundColor: COLORS.searchBtnBg }
              }}
            >
              <SearchIcon sx={{ width: '28px', height: '28px', fill: COLORS.searchBg }} />
            </IconButton>
          </Stack>
        </Box>
        
        {/* קו הפרדה */}
        <Box sx={{ borderBottom: '1px solid #ccc', marginY: 5 }} />

        {/* --- אזור ספרי הישיבה --- */}
        <Box sx={{ marginTop: 8, marginBottom: 5 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, color: COLORS.inputTextColor, marginBottom: 4,}}>ספרי הישיבה</Typography>
          <Paper elevation={0} sx={{ width: '100%', minHeight: '400px', border: '1px solid #ccc', marginBottom: 5, backgroundColor: 'white',}}>{/* תוכן המלבן הלבן */}</Paper>
          
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
        
        
        {/* --- קו הפרדה נוסף (בין ספרי הישיבה לראש הישיבה) --- */}
        <Box sx={{ borderBottom: '1px solid #ccc', marginY: 5 }} />


        {/* --- אזור מרן ראש הישיבה (מתוקן באמצעות Box) --- */}
        <Box sx={{ marginY: 8, backgroundColor: COLORS.rabbiBg, padding: 4, borderRadius: COLORS.borderRadius, textAlign: 'right' }}>
            
            {/* Grid container נשאר לניהול ה-spacing */}
            <Grid container spacing={4} alignItems="stretch"> 
                
                {/* עמודה 1: תמונה גדולה - משתמשים ב-Box במקום Grid item */}
                <Box 
                    // רוחב: 100% במובייל, 8/12 בדסקטופ (פחות רווח)
                    sx={{ 
                        width: { xs: '100%', md: 'calc((8 / 12) * 100% - 16px)' }, 
                        marginBottom: { xs: 4, md: 0 }, // רווח אנכי
                        marginLeft: { xs: 0, md: '16px' } // פיצוי על ה-spacing
                    }} 
                >
                    <Box 
                        sx={{ 
                            height: '100%',
                            minHeight: { xs: '250px', md: '400px' },
                            backgroundColor: 'white',
                            borderRadius: COLORS.borderRadius,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            backgroundImage: 'url(./public/DSC_5195.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }} 
                    />
                </Box>
                
                {/* עמודה 2: טקסט וכפתור - משתמשים ב-Box במקום Grid item */}
                <Box 
                    // רוחב: 100% במובייל, 4/12 בדסקטופ (פחות רווח)
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

        {/* --- אזור רשת הרבנים (2X2 Grid - מתוקן באמצעות Box) --- */}
        <Box sx={{ marginY: 8 }}>
            
            {/* Grid container נשאר לניהול ה-spacing */}
            <Grid container spacing={4}> 
                {rabbiCardsData.map((rabbi, index) => (
                    // משתמשים ב-Box עם מאפייני רוחב רספונסיביים ב-sx
                    <Box 
                        key={index} 
                        // xs: 100% רוחב; sm: 50% רוחב (2 עמודות)
                        sx={{
                            width: { xs: '100%', sm: 'calc(50% - 16px)' }, // 50% פחות חצי מרווח (כדי להתאים ל-spacing=4)
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