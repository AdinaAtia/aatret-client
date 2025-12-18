

// import React, { useState } from 'react'; 
// import { 
//   Box, 
//   Typography, 
//   InputBase, 
//   IconButton, 
//   Stack,
//   Paper, 
//   Button,
//   Grid, 
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

// // ודא שהנתיב ל-Header נכון
// import Header from './Header'; 
// // בתוך אזור האימפורטים בראש הקובץ
// import LatestLessonCard from './LatestLessonCard';
// // --- 1. הגדרות רוחב וצבעים ---
// const COLORS = {
//   mainBg: '#922b2b', 
//   inputTextColor: 'black',
//   contentMaxWidth: '95%px', // רוחב קבוע
//   searchBg: 'white',
//   searchBtnBg: 'black',
//   borderRadius: '8px',
//   rabbiBg: 'white', 
  
// };

// // --- קומפוננטת כרטיס רב ---
// interface RabbiCardProps {
//     name: string;
//     title: string;
//     imageSrc: string;
// }

// const RabbiCard: React.FC<RabbiCardProps> = ({ name, title, imageSrc }) => (
//     <Paper 
//       elevation={1} 
//       sx={{ 
//         textAlign: 'right', 
//         padding: 2, 
//         borderRadius: COLORS.borderRadius,
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%',
//       }}
//     >
//       <Stack direction="row" spacing={2} alignItems="center">
//         <Box 
//           sx={{ 
//             width: '100px', 
//             height: '100px', 
//             backgroundColor: COLORS.rabbiBg, 
//             borderRadius: '4px',
//             backgroundImage: `url(${imageSrc})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />
        
//         <Box>
//           <Typography variant="h6" fontWeight="bold">
//             {name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {title}
//           </Typography>
//         </Box>
//       </Stack>
      
//       <Button 
//         variant="contained" 
//         size="small"
//         sx={{ 
//           backgroundColor: COLORS.mainBg, 
//           color: 'white',
//           marginTop: 2,
//           alignSelf: 'flex-start',
//           '&:hover': { backgroundColor: '#7a2222' }
//         }}
//       >
//         לשיעורי הרב
//       </Button>
//     </Paper>
// );

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
  
//   const rabbiCardsData = [
//     { name: 'הרב יואל בלומנפלד שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+1' },
//     { name: 'הרב בנימין עובדיה שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+2' },
//     { name: 'הרב ירחמיאל ביסמוט שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+3' },
//     { name: 'הרב יואל חזקן שליט"א', title: 'לימוד איסופום דולור סיט אמט, קונסקטטור אדיפיסינג אליט', imageSrc: 'https://via.placeholder.com/100?text=רב+4' },
//   ];


//   return (
//     <Box 
//       sx={{
//         direction: 'rtl',
//         minHeight: '100vh',
//         backgroundColor: 'white',
//       }}
//     >
      
//       {/* 1. ה-HEADER */}
//       {/* <Header /> */}
    
//       {/* 2. קונטיינר התוכן העליון (כותרת וחיפוש) */}
//       <Box
//         sx={{
//           maxWidth: COLORS.contentMaxWidth,
//           width: '100%',
//           margin: '0 auto',
//           padding: { xs: 2, md: 5 }, 
//           paddingBottom: 0, // איפוס פאדינג תחתון
//           textAlign: 'center',
//         }}
//       >
        
//         {/* --- אזור כותרת עליון --- */}
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
//             ישיבה ללימוד קבלה עפ"י תורת האר"י ז"ל
//           </Typography>
//         </Box>

        
//       </Box>
      
//       {/* 3. קו הפרדה ברוחב מלא עם מרווח גדול (80px) */}
//       <Box 
//         sx={{ 
//           borderBottom: '3px solid black', 
//           width: '100%',
//           marginTop: { xs: 5, md: 8 }, // מרווח עליון
//           marginBottom: 10, // מרווח תחתון גדול (80px)
//         }} 
//       />
//   <LatestLessonCard />
//      <Box
//   sx={{
//     maxWidth: COLORS.contentMaxWidth,
//     width: '100%',
//     margin: '0 auto',
//     padding: { xs: 2, md: 5 }, 
//     paddingTop: 0, 
//     textAlign: 'center',
//   }}
// >
  
// <Box sx={{ marginTop: 8, marginBottom: 5 }}>
//   {/* כותרת */}
//   <Typography 
//     variant="h4" 
//     component="h2" 
//     sx={{ 
//       fontWeight: 700, 
//       fontSize: { xs: '2.5rem', md: '3rem' },
//       color: COLORS.inputTextColor, 
//       marginBottom: 4, 
//       fontFamily: 'Arial',
//       textAlign: 'center'
//     }}
//   >
//     ספרי הישיבה
//   </Typography>

//   {/* המלבן הלבן הגדול (Paper) - מעוצב ומרובע יותר */}
//   <Paper 
//     elevation={0} 
//     sx={{ 
//       width: '100%', 
//       maxWidth: '1000px', 
//       margin: '0 auto',
//       minHeight: '400px', 
//       border: '1px solid #ccc', 
//       marginBottom: 6, 
//       backgroundColor: COLORS.searchBg, 
//       borderRadius: COLORS.borderRadius, 
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     }}
//   >
//     {/* תוכן המלבן הלבן */}
//   </Paper>
  
//   {/* רשת הכפתורים (3 עמודות) */}
//   <Grid 
//     container 
//     spacing={5} // מרווח גדול יותר בין כפתורים
//     justifyContent="center"
//     alignItems="stretch"
//     sx={{ width: '100%', margin: '0 auto' }} 
//   >
//     {cardActions.map((action, index) => (
//       <Grid 
//         item 
//         xs={12} // רוחב מלא במובייל
//         sm={4} // 3 עמודות בטאבלט ומעלה (12/3=4)
//         key={index}
//       >
//         {/* Paper עוטף את הלחצן, ומגדיר את יחס הגובה-רוחב 1:1 */}
//         <Paper
//           elevation={0}
//           sx={{
//             width: '100%',
//             position: 'relative',
//             paddingTop: '100%', // **הופך את ה-Paper לריבוע** (גובה=רוחב)
//             borderRadius: COLORS.borderRadius,
//             overflow: 'hidden', 
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={action.onClick}
//             sx={{
//               // ממלא את הריבוע שיצר ה-Paper
//               position: 'absolute', 
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
              
//               // עיצוב:
//               backgroundColor: COLORS.mainBg,
//               color: COLORS.searchBg, 
//               fontWeight: 700,
//               textTransform: 'none', 
//               fontSize: '1.4rem', // פונט גדול יותר להדגשה
//               padding: '10px', 
//               borderRadius: COLORS.borderRadius,
//               whiteSpace: 'normal', 
//               lineHeight: 1.3,
//               '&:hover': { backgroundColor: '#7a2222' }
//             }}
//           >
//             {action.label}
//           </Button>
//         </Paper>
//       </Grid>
//     ))}
//   </Grid>
// </Box>

//         {/* --- אזור מרן ראש הישיבה --- */}
//         <Box sx={{ marginY: 8, backgroundColor: COLORS.rabbiBg, padding: 4, borderRadius: COLORS.borderRadius, textAlign: 'right' }}>
            
//             <Grid container spacing={4} alignItems="stretch"> 
                
//                 {/* עמודה 1: תמונה גדולה */}
//                 <Box 
//                     sx={{ 
//                         width: { xs: '100%', md: 'calc((8 / 12) * 100% - 16px)' }, 
//                         marginBottom: { xs: 4, md: 0 }, 
//                         // marginRight: { xs: 0, md: '16px' } 
//                     }} 
//                 >
//    <Box
//     sx={{
//         // flexShrink: 0,
//         // *** 1. לוודא שהרוחב הוא 100% מתוך ה-Grid item (md={6}) ***
//         // width: '100%', 
        
//         // *** 2. הקטנת יחס הגובה/רוחב ל-35% (יהפוך את התמונה לרחבה ונמוכה יותר) ***
//         paddingTop: '30%', 
//         // position: 'relative', 
        
//         backgroundImage: 'url(./public/DSC_5195.JPG)',
        
//         // *** 3. שומרים על 'contain' להצגת כל התמונה ***
//         backgroundSize: 'contain', 
//         backgroundRepeat: 'no-repeat', 
        
//         // backgroundPosition: 'center',
//         // borderRadius: '8px',
//         // boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//         order: { xs: 2, md: 1 
          
//         },
//     }}
// />
//                 </Box>
                
//                 {/* עמודה 2: טקסט וכפתור */}
//                 <Box 
//                     sx={{ 
//                         width: { xs: '100%', md: 'calc((4 / 12) * 100% - 16px)' }, 
//                         marginLeft: { xs: 0, md: '16px' }
//                     }}
//                 >
//                     <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between', paddingLeft: { md: 2 } }}>
                        
//                         <Box>
//                             <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: COLORS.inputTextColor, marginBottom: 1 }}>
//                                 מרן ראש הישיבה
//                             </Typography>
//                             <Typography variant="h6" component="h3" sx={{ fontWeight: 500, color: COLORS.inputTextColor, marginBottom: 2 }}>
//                                 הרה"ג הרב מרדכי עטייה שליט"א
//                             </Typography>
//                             <Typography variant="body1" color="text.secondary">
//                                 מרן ראש הישיבה הרב מרדכי עטייה שיבדל"א היה מגדולי המתמידים בישיבה בדור הקודם, וכאן הקבלה בדרכו, מקים "ישיבת עטרת מרדכי" ללימודי דינאות והכשרת רבנים.
//                             </Typography>
//                         </Box>

//                         <Button 
//                             variant="contained" 
//                             sx={{ 
//                                 backgroundColor: COLORS.mainBg, 
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 textTransform: 'none',
//                                 alignSelf: 'flex-start',
//                                 padding: '10px 20px',
//                                 marginTop: 3,
//                                 '&:hover': { backgroundColor: '#7a2222' }
//                             }}
//                         >
//                             לשיעורי הרב
//                         </Button>
//                     </Stack>
//                 </Box>
                
//             </Grid>

//         </Box>
//          {/* 3. קו הפרדה ברוחב מלא עם מרווח גדול (80px) */}
//       <Box 
//         sx={{ 
//           borderBottom: '3px solid black', 
//           width: '100%',
//           marginTop: { xs: 5, md: 8 }, // מרווח עליון
//           marginBottom: 10, // מרווח תחתון גדול (80px)
//         }} 
//       />

//         {/* --- אזור רשת הרבנים (2X2 Grid) --- */}
//         <Box sx={{ marginY: 8 }}>
            
//             <Grid container spacing={4}> 
//                 {rabbiCardsData.map((rabbi, index) => (
//                     <Box 
//                         key={index} 
//                         // xs: 100% רוחב; sm: 50% רוחב (2 עמודות)
//                         sx={{
//                             width: { xs: '100%', sm: 'calc(50% - 16px)' }, 
//                             marginBottom: { xs: 4, sm: 0 },
//                             marginLeft: { xs: 0, sm: '16px' }
//                         }}
//                     > 
//                         <RabbiCard {...rabbi} />
//                     </Box>
//                 ))}
//             </Grid>

//         </Box>
        
//       </Box>
//     </Box>
//   );
// };

// export default Home;
import React, { useState ,useEffect} from 'react'; 
import { 
  Box, 
  Typography, 
  Stack,
  Paper, 
  Button,
  Grid, 
} from '@mui/material';
import LatestLessonCard from './LatestLessonCard';

// --- 1. הגדרות רוחב וצבעים ---
const COLORS = {
  mainBg: '#922b2b', 
  inputTextColor: 'black',
  contentMaxWidth: '95%px',
  rabbiBg: 'white', 
  borderRadius: '8px',
};

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
  
const [rabbiCardsData, setRabbiCardsData] = useState<any[]>([]);
useEffect(() => {
  fetch('http://localhost:1337/api/rabbis?populate=photo_url')
    .then(res => res.json())
    .then(data => {
      if (!data?.data) {
        console.error('No data returned from API');
        return;
      }

      const formatted = data.data
        .filter((r: any) => r?.attributes) // מסנן ערכים ללא attributes
        .map((r: any) => ({
          name: r.attributes.name || 'No name',
          title: r.attributes.note?.[0]?.content?.[0]?.text || '',
          imageSrc: r.attributes.photo_url?.data?.[0]?.attributes?.url
            ? `http://localhost:1337${r.attributes.photo_url.data[0].attributes.url}`
            : '/placeholder.png',
        }));

      console.log('Formatted rabbis:', formatted);
      setRabbiCardsData(formatted);
    })
    .catch(err => console.error('Error fetching rabbis:', err));
}, []);


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
          padding: { xs: 2, md: 5 }, 
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

      {/* --- LatestLessonCard מובנה בתוך Home --- */}
       <LatestLessonCard />

      {/* --- אזור ספרי הישיבה --- */}
      <Box
        sx={{
          maxWidth: COLORS.contentMaxWidth,
          width: '100%',
          margin: '0 auto',
          padding: { xs: 2, md: 5 }, 
          paddingTop: 0,
          textAlign: 'center',
        }}
      >
        <Box sx={{ marginTop: 8, marginBottom: 5 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '3rem', md: '3rem' }, color: COLORS.inputTextColor, marginBottom: 4, fontFamily: 'Arial' }}>ספרי הישיבה</Typography>
          <Paper elevation={0} sx={{ width: '95%', minHeight: '400px', border: '1px solid #ccc', marginBottom: 5, backgroundColor: 'white',}}></Paper>
          
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
                  color: 'white', 
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

        <Box 
          sx={{ 
            borderBottom: '3px solid black', 
            width: '100%',
            marginTop: { xs: 5, md: 8 },
            marginBottom: 10,
          }} 
        />

        {/* --- אזור מרן ראש הישיבה --- */}
        <Box sx={{ marginY: 8, backgroundColor: COLORS.rabbiBg, padding: 4, borderRadius: COLORS.borderRadius, textAlign: 'right' }}>
          <Grid container spacing={4} alignItems="stretch"> 
            <Box sx={{ width: { xs: '100%', md: 'calc((8 / 12) * 100% - 16px)' }, marginBottom: { xs: 4, md: 0 } }}> 
              <Box
                sx={{
                  paddingTop: '30%',
                  backgroundImage: 'url(./public/DSC_5195.JPG)',
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat', 
                  order: { xs: 2, md: 1 },
                }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: 'calc((4 / 12) * 100% - 16px)' }, marginLeft: { xs: 0, md: '16px' } }}>
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

        <Box 
          sx={{ 
            borderBottom: '3px solid black', 
            width: '100%',
            marginTop: { xs: 5, md: 8 },
            marginBottom: 10,
          }} 
        />

        {/* --- אזור רשת הרבנים (2X2 Grid) --- */}
        <Box sx={{ marginY: 8 }}>
          <Grid container spacing={4}> 
            {rabbiCardsData.map((rabbi, index) => (
              <Box 
                key={index} 
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 16px)' }, 
                  marginBottom: { xs: 4, sm: 0 },
                  marginLeft: { xs: 0, sm: '16px' }
                }}
              > 
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
                        backgroundImage: `url(${rabbi.imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {rabbi.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rabbi.title}
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
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
