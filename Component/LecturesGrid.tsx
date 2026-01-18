// import React, { useState, useEffect, useRef } from 'react'; 
// // ייבוא Grid2 - חובה כדי שה-size={{ lg: 2.4 }} יעבוד
// import Grid from '@mui/material/Grid'; 
// import { 
//   Card, 
//   CardMedia, 
//   CardContent, 
//   Typography, 
//   IconButton, 
//   Box, 
//   Stack, 
//   Button, 
//   CircularProgress 
// } from "@mui/material";
// import { Download, Play, Clock, Calendar, RefreshCw } from 'lucide-react'; 
// import axios from 'axios';

// interface LecturesGridProps {
//   onLessonSelect: (lesson: any) => void;
// }

// const LecturesGrid = ({ onLessonSelect }: LecturesGridProps) => {
//   const [lectures, setLectures] = useState<any[]>([]);
//   const [isSyncing, setIsSyncing] = useState(false);
  
//   // המנעול (Guard) - מבטיח קריאה אחת בלבד לשרת
//   const hasFetched = useRef(false); 
  
//   const MAIN_BROWN = '#9c6644'; 

//   // פונקציה לשליפת נתונים מה-DB
//   // פונקציה לשליפת נתונים מה-DB עם סינון מובנה בשרת
// // פונקציה לשליפת נתונים מה-DB עם סינון מדויק לפי השם בתמונה
//   const fetchLectures = async () => {
//     try {
//       const response = await axios.get('http://localhost:1337/api/lessons', {
//         params: {
//           populate: '*',
//           sort: 'lesson_date_gregorian:desc',
//           // שינוי השם לערך המדויק שמופיע אצלך ב-Rabbi Content Type
//           'filters[rabbi][name][$eq]': 'הרב מרדכי עטייה' 
//         }
//       });
//       setLectures(response.data.data || []);
//       hasFetched.current = true;
//     } catch (error) {
//       console.error('Error fetching lectures:', error);
//     }
//   };
//   // הרצה רק בטעינה ראשונה עם הגנה מה-Ref
//   useEffect(() => {
//     if (!hasFetched.current) {
//       fetchLectures();
//     }
//   }, []); 
// const [filter, setFilter] = useState('הכל'); // ניהול הטאב הנבחר
// const LIGHT_BEIGE = '#fdfbe7'; // צבע הרקע מהתמונה
// const filterOptions = ['חדשים', 'תדמית הישיבה', 'נבחרים', 'קצרים']; // האפשרויות מהתמונה  // פונקציית הסנכרון הידני
//   const handleSync = async () => {
//     setIsSyncing(true);
//     try {
//       // שליחת POST לכתובת הסנכרון שיצרנו בסטראפי
//       await axios.post('http://localhost:1337/api/lessons/sync');
//       // רענון הרשימה מה-DB לאחר שהסנכרון הסתיים
//       await fetchLectures(); 
//       alert('השיעורים עודכנו בהצלחה מיוטיוב!');
//     } catch (error) {
//       console.error('Sync error:', error);
//       alert('שגיאה בסנכרון. וודא שהרשאות ה-sync מוגדרות בסטראפי (Public).');
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   return (
//     <Box sx={{ 
//       width: '100%', 
//       direction: 'rtl', 
//       boxSizing: 'border-box',
//       px: { xs: 2, sm: 3, md: 4, lg: 8 }, 
//       py: 6 
//     }}>
//       {/* שורת סינון ועדכון */}
// <Stack 
//   direction={{ xs: 'column', md: 'row' }} 
// justifyContent="center"  alignItems="center" 
//   spacing={2} 
//   sx={{ 
//     mb: 8, // הגדלת המרווח מהגריד שמתחת
//     width: '100%' 
//   }}
// >
//   {/* קומפוננטת הטאבים מהצילום מסך */}
//   <Box sx={{ 
//     backgroundColor: LIGHT_BEIGE, 
//     borderRadius: '50px', 
//   p: 0.8, // הגדלת הריפוד הפנימי של המחסנית
//     display: 'flex', 
//    gap: 1.5, // רווח גדול יותר בין הכפתורים
//     boxShadow: '0 4px 10px rgba(0,0,0,0.08)' // צל מעט בולט יותר
//   }}>
//     {filterOptions.map((option) => (
//       <Button
//         key={option}
//         onClick={() => setFilter(option)}
//         sx={{
//           borderRadius: '50px',
//           px: 5,
//           py: 1,
//           fontSize: '1rem',
//           fontWeight: 700,
//           color: filter === option ? 'white' : 'black',
//           backgroundColor: filter === option ? MAIN_BROWN : 'transparent',
//           '&:hover': {
//             backgroundColor: filter === option ? MAIN_BROWN : 'rgba(156, 102, 68, 0.1)',
//           },
//           textTransform: 'none',
//           minWidth: '100px'
//         }}
//       >
//         {option}
//       </Button>
//     ))}
//   </Box>

//   {/* כפתור עדכון (נשאר בצד שמאל) */}
//   {/* <Button
//     variant="contained"
//     onClick={handleSync}
//     disabled={isSyncing}
//     startIcon={isSyncing ? <CircularProgress size={18} color="inherit" /> : <RefreshCw size={18} />}
//     sx={{
//       backgroundColor: 'black',
//       color: 'white',
//       borderRadius: '10px',
//       px: 3,
//       height: '45px',
//       fontWeight: 700,
//       '&:hover': { backgroundColor: '#333' }
//     }}
//   >
//     {isSyncing ? 'מעדכן...' : 'עדכן שיעורים'}
//   </Button> */}
// </Stack>
//       {/* כפתור עדכון בראש העמוד */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
//         <Button
//           variant="contained"
//           onClick={handleSync}
//           disabled={isSyncing}
//           startIcon={isSyncing ? <CircularProgress size={18} color="inherit" /> : <RefreshCw size={18} />}
//           sx={{
//             backgroundColor: 'black',
//             color: 'white',
//             borderRadius: '10px',
//             px: 3,
//             fontWeight: 700,
//             '&:hover': { backgroundColor: '#333' },
//             '&.Mui-disabled': { backgroundColor: '#666', color: '#ccc' }
//           }}
//         >
//           {isSyncing ? 'מעדכן מיוטיוב...' : 'עדכן שיעורים'}
//         </Button>
//       </Box>

//       {/* גריד הכרטיסים - 5 בשורה */}
//       <Grid 
//         container 
//         spacing={3} 
//         sx={{ 
//           rowGap: { xs: 8, md: 10 }, 
//           margin: 0, 
//           width: '100%' 
//         }}
//         justifyContent="center"
//       > 
//         {lectures.map((lecture) => {
//           const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi,duration } = lecture;
//           const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
//           const thumbnailUrl = `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`;

//           return (
//             <Grid 
//               key={lecture.id} 
//               size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} // חישוב של 12/5 = 2.4
//               sx={{ display: 'flex', justifyContent: 'center' }}
//             >
//               <Card 
//                 elevation={0}
//                 sx={{ 
//                   width: '100%', 
//                   borderRadius: '1rem', 
//                   backgroundColor: '#fdfbe7', 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   position: 'relative', 
//                   overflow: 'visible', 
//                   minHeight: '280px'
//                 }}
//               >
//                 {/* תמונת השיעור */}
//                 <Box sx={{ 
//                   position: 'relative', 
//                   width: '100%', 
//                   borderTopLeftRadius: '1rem', 
//                   borderTopRightRadius: '1rem', 
//                   overflow: 'hidden' 
//                 }}>
//                   <CardMedia 
//                     component="img" 
//                     sx={{ aspectRatio: '16/9', objectFit: 'cover' }} 
//                     image={thumbnailUrl} 
//                   />
//                 </Box>

//                 {/* תוכן הכרטיס */}
//                 <CardContent sx={{ 
//                   pt: 2, 
//                   pb: 6, 
//                   px: 1.5, 
//                   textAlign: 'center', 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   flexGrow: 1 
//                 }}>
//                   <Typography variant="body1" sx={{ fontWeight: 900, mb: 1, fontSize: '0.9rem', color: 'black', lineHeight: 1.2 }}>
//                     {title}
//                   </Typography>
                  
//                   <Typography variant="caption" sx={{ color: 'black', fontWeight: 600, display: 'block', mb: 'auto', opacity: 0.7 }}>
//                     {rabbiName}
//                   </Typography>

//                   {/* <Stack 
//                     direction="row" 
//                     justifyContent="center" 
//                     alignItems="center" 
//                     spacing={1} 
//                     sx={{ color: '#555', mt: 1.5 }}
//                   >
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
//                        <Clock size={12} />
//                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>01:03:05</Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
//                        <Calendar size={12} />
//                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{lesson_date_gregorian}</Typography>
//                     </Box>
//                   </Stack> */}
//                   <Stack 
//   direction="row" 
//   justifyContent="center" 
//   alignItems="center" 
//   spacing={1} 
//   sx={{ color: '#555', mt: 1.5 }}
// >
//   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
//      <Clock size={12} />
//      <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
//        {duration || '00:00'}
//      </Typography>
//   </Box>
//   <Typography sx={{ fontSize: '0.55rem', opacity: 0.5 }}>|</Typography>

//   {/* תאריך עברי */}
//   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
//      <Calendar size={12} />
//      <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
//        {lesson_date_hebrew || '---'} 
//      </Typography>
//   </Box>

//   {/* מפריד קטן בין התאריכים */}
//   <Typography sx={{ fontSize: '0.55rem', opacity: 0.5 }}>|</Typography>

//   {/* תאריך לועזי */}
//   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
//      <Calendar size={12} />
//      <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
//        {lesson_date_gregorian}
//      </Typography>
//   </Box>
// </Stack>
//                 </CardContent>

//                 {/* כפתורי פעולה צפים (Play & Download) */}
//                 <Box sx={{ 
//                   position: 'absolute', 
//                   bottom: '-22px', 
//                   left: '50%', 
//                   transform: 'translateX(-50%)', 
//                   display: 'flex', 
//                   gap: 1.5, 
//                   zIndex: 2 
//                 }}>
//                   <IconButton 
//                     onClick={() => onLessonSelect(lecture)} 
//                     sx={{ 
//                       borderRadius: '10px', 
//                       backgroundColor: MAIN_BROWN, 
//                       color: 'white', 
//                       width: 42, 
//                       height: 42, 
//                       '&:hover': { backgroundColor: '#7d5236' } 
//                     }}
//                   >
//                     <Play size={16} fill="white" />
//                   </IconButton>

//                   <IconButton 
//                     sx={{ 
//                       borderRadius: '10px', 
//                       backgroundColor: 'black', 
//                       color: 'white', 
//                       width: 42, 
//                       height: 42, 
//                       '&:hover': { backgroundColor: '#222' } 
//                     }}
//                   >
//                     <Download size={18} />
//                   </IconButton>
//                 </Box>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };

// export default LecturesGrid;
import React, { useState, useEffect, useRef } from 'react'; 
// ייבוא Grid2 - חובה כדי שה-size={{ lg: 2.4 }} יעבוד
import Grid from '@mui/material/Grid'; 
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Stack, 
  Button, 
  CircularProgress 
} from "@mui/material";
import { Download, Play, Clock, Calendar, RefreshCw } from 'lucide-react'; 
import axios from 'axios';

interface LecturesGridProps {
  onLessonSelect: (lesson: any) => void;
}

const LecturesGrid = ({ onLessonSelect }: LecturesGridProps) => {
  const [lectures, setLectures] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filter, setFilter] = useState('חדשים'); 
  
  const hasFetched = useRef(false); 
  const MAIN_BROWN = '#9c6644'; 
  const LIGHT_BEIGE = '#fdfbe7';
  const filterOptions = ['חדשים', 'תדמית הישיבה', 'נבחרים', 'קצרים'];

  // 1. פונקציה לשליפת שיעורים לפי הרב (עבור טאב "חדשים")
 const fetchLecturesByRabbi = async () => {
  try {
    // אנחנו משתמשים בדיוק באותו פורמט URL שעובד בקומפוננטה השנייה
    // שימי לב שהורדתי את ה-pagination[limit]=1 כדי לקבל את כל השיעורים
const url = `http://localhost:1337/api/lessons?filters[rabbi][name][$eq]=${encodeURIComponent('הרב מרדכי עטייה')}&sort=lesson_date_gregorian:desc&populate=*&pagination[pageSize]=10`;    
    const response = await axios.get(url);

    if (response.data.data) {
      // מיפוי הנתונים בדיוק כפי שהגריד מצפה לקבל
      const formatted = response.data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        youtube_id: item.youtube_id,
        lesson_date_gregorian: item.lesson_date_gregorian,
        lesson_date_hebrew: item.lesson_date_hebrew,
        duration: item.duration,
        // חילוץ שם הרב מתוך ה-populate
        rabbi: item.rabbi 
      }));

      setLectures(formatted);
      hasFetched.current = true;
    }
  } catch (error) {
    console.error('Error fetching lectures:', error);
  }
};
  // 2. פונקציה לשליפה מטבלת קטגוריה ראשית (עבור טאב "תדמית הישיבה")
  const fetchByCategoryTable = async () => {
  try {
    const response = await axios.get('http://localhost:1337/api/categories-mains', {
      params: {
        'filters[name][$eq]': 'תדמית הישיבה',
        'populate[lessons][populate]': '*', 
        // הוספת המיון כאן:
        'populate[lessons][sort]': 'lesson_date_gregorian:desc', 
      }
    });

    const categoryLessons = response.data.data[0]?.lessons || [];
    
    // עדכון ה-State עם הרשימה הממוינת
    setLectures(categoryLessons);
  } catch (error) {
    console.error('Error fetching category lessons:', error);
  }
};
  // פונקציית ניהול הקליק על הטאבים
  const handleFilterChange = (option: string) => {
    setFilter(option);
    if (option === 'תדמית הישיבה') {
      fetchByCategoryTable();
    } else {
      // כרגע "חדשים", "נבחרים" ו"קצרים" יביאו את רשימת הרב הרגילה
      fetchLecturesByRabbi();
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchLecturesByRabbi();
    }
  }, []); 

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await axios.post('http://localhost:1337/api/lessons/sync');
      if (filter === 'תדמית הישיבה') fetchByCategoryTable();
      else fetchLecturesByRabbi();
      alert('השיעורים עודכנו בהצלחה מיוטיוב!');
    } catch (error) {
      console.error('Sync error:', error);
      alert('שגיאה בסנכרון.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      direction: 'rtl', 
      boxSizing: 'border-box',
      px: { xs: 2, sm: 3, md: 4, lg: 8 }, 
      py: 6 
    }}>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="center"  
        alignItems="center" 
        spacing={2} 
        sx={{ mb: 8, width: '100%' }}
      >
        <Box sx={{ 
          backgroundColor: LIGHT_BEIGE, 
          borderRadius: '20px', 
          p: 0.8, 
          display: 'flex', 
          gap: 1.5, 
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)' 
        }}>
          {filterOptions.map((option) => (
            <Button
              key={option}
              onClick={() => handleFilterChange(option)}
              sx={{
                borderRadius: '20px',
                px: 5,
                py: 1,
                fontSize: '1rem',
                fontWeight: 700,
                color: filter === option ? 'white' : 'black',
                backgroundColor: filter === option ? MAIN_BROWN : 'transparent',
                '&:hover': {
                  backgroundColor: filter === option ? MAIN_BROWN : 'rgba(156, 102, 68, 0.1)',
                },
                textTransform: 'none',
                minWidth: '100px'
              }}
            >
              {option}
            </Button>
          ))}
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
        <Button
          variant="contained"
          onClick={handleSync}
          disabled={isSyncing}
          startIcon={isSyncing ? <CircularProgress size={18} color="inherit" /> : <RefreshCw size={18} />}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '10px',
            px: 3,
            fontWeight: 700,
            '&:hover': { backgroundColor: '#333' },
            '&.Mui-disabled': { backgroundColor: '#666', color: '#ccc' }
          }}
        >
          {isSyncing ? 'מעדכן מיוטיוב...' : 'עדכן שיעורים'}
        </Button>
      </Box>

      <Grid 
        container 
        spacing={3} 
        sx={{ 
          rowGap: { xs: 8, md: 10 }, 
          margin: 0, 
          width: '100%' 
        }}
        justifyContent="center"
      > 
        {lectures.map((lecture) => {
          const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi, duration } = lecture;
          const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
          const thumbnailUrl = `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`;

          return (
            <Grid 
              key={lecture.id} 
              size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} 
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  width: '100%', 
                  borderRadius: '1rem', 
                  backgroundColor: '#fdfbe7', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative', 
                  overflow: 'visible', 
                  minHeight: '280px'
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
                  px: 1.5, 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexGrow: 1 
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, fontSize: '0.9rem', color: 'black', lineHeight: 1.2 }}>
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
                       <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
                         {duration || '00:00'}
                       </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.55rem', opacity: 0.5 }}>|</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                       <Calendar size={12} />
                       <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
                         {lesson_date_hebrew || '---'} 
                       </Typography>
                    </Box>

                    <Typography sx={{ fontSize: '0.55rem', opacity: 0.5 }}>|</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                       <Calendar size={12} />
                       <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
                         {lesson_date_gregorian}
                       </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Box sx={{ 
                  position: 'absolute', 
                  bottom: '-22px', 
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