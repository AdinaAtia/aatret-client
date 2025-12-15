import React from 'react';                                          // ייבוא ספריית React.
import { Box, Button, Paper, Stack } from '@mui/material';      // ייבוא קומפוננטות MUI למבנה ועיצוב.
import DownloadIcon from '@mui/icons-material/GetApp';          // ייבוא אייקון ההורדה.
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline'; // ייבוא אייקון הצפייה.

// --- הגדרות עיצוב קבועות ---
const CARD_COLORS = {                                             // אובייקט עם צבעים וערכי עיצוב קבועים.
    mainBg: '#922b2b',                                          // צבע רקע ראשי (חום כהה) לכפתור הצפייה.
    lightGrayBg: '#f0f0f0',                                    // צבע רקע אפור בהיר לכרטיס הראשי (Paper).
    borderRadius: '12px',                                      // רדיוס קימורי פינות ברירת מחדל.
    textColor: 'black',                                        // צבע טקסט ראשי.
};

// --- נתונים ופונקציות קבועים ---
const handleWatch = () => console.log('התחלת צפייה בשיעור אחרון'); // פונקציה המטפלת בלחיצה על כפתור צפייה.
const handleDownload = () => console.log('הורדת שיעור אחרון');   // פונקציה המטפלת בלחיצה על כפתור הורדה.

const LATEST_LESSON_DATA = {                                      // אובייקט שמחזיק את נתוני התמונה.
    imageSrc: '/DSC_5195.JPG',                                 // נתיב לתמונת הרב (יש להחליף לנתיב אמיתי).
};
// -----------------------------


const LatestLessonCard: React.FC = () => (                        // הגדרת הקומפוננטה הפונקציונלית.
    <Box                                                          // קונטיינר עוטף חיצוני.
        sx={{
            direction: 'rtl',                                    // כיווניות מימין לשמאל (RTL).
            maxWidth: '1280px',                                  // רוחב מקסימלי לקונטיינר.
            width: '100%',                                       // תופס את כל הרוחב הזמין.
            margin: '0 auto',                                    // ממקם את הקונטיינר במרכז הדף.
            padding: { xs: 2, md: 5 },                           // פאדינג מהצדדים.
            paddingTop: 0,                                       // ביטול פאדינג עליון.
        }}
    >
        <Paper                                                     // קומפוננטת הכרטיס הראשי (עם צל).
            elevation={4}                                        // הוספת צל רמה 4.
            sx={{
                borderRadius: CARD_COLORS.borderRadius,          // פינות מעוגלות.
                backgroundColor: CARD_COLORS.lightGrayBg,        // צבע רקע אפור בהיר.
                padding: 4,                                      // פאדינג פנימי בתוך הכרטיס.
                display: 'flex',                                 // הפיכה למכולת Flex.
                flexDirection: { xs: 'column', md: 'row' },      // סידור: עמודה במובייל, שורה במחשב.
                gap: 4,                                          // רווח בין האלמנטים הפנימיים.
                alignItems: 'center',                              // יישור האלמנטים אנכית למרכז.
                minHeight: { xs: '85%', md: '450px' }            // גובה מינימלי לכרטיס.
            }}
        >
            
            {/* 1. תמונת הרב (צד שמאל) */}
            <Box
                sx={{
                    flexShrink: 0,                               // מונע מהתמונה להתכווץ.
                    width: { xs: '100%', md: '50%' },             // רוחב התמונה (50% במחשב).
                    height: { xs: '200px', md: '300px' },         // גובה התמונה.
                    backgroundImage: `url(${LATEST_LESSON_DATA.imageSrc})`, // טעינת התמונה.
                    backgroundSize: 'cover',                       // התאמת גודל התמונה לכיסוי מלא.
                    backgroundPosition: 'center',                  // מיקום התמונה במרכז.
                    borderRadius: '8px',                           // פינות מעוגלות לתמונה.
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',        // צל עדין לתמונה.
                    order: { xs: 2, md: 1 },                       // סדר הצגה: שני במובייל, ראשון במחשב.
                }}
            />

            {/* 2. אזור הכפתורים (צד ימין) */}
            <Box
                sx={{
                    flexGrow: 1,                                   // תופס את כל הרוחב הנותר.
                    textAlign: 'right',                              // יישור תוכן לימין.
                    order: { xs: 1, md: 2 },                       // סדר הצגה: ראשון במובייל, שני במחשב.
                    display: 'flex',                                 // הפיכה למכולת Flex.
                    flexDirection: 'column',                         // סידור אנכי (עמודה).
                    justifyContent: 'flex-end',                     // **דוחף את הכפתורים לתחתית** האזור.
                    height: { xs: 'auto', md: '300px' },             // גובה זהה לתמונה לשמירת יישור.
                }}
            >
                
                {/* פה היה כל הטקסט - הוסר! */}
                
                {/* כפתורי פעולה */}
              <Box 
                    sx={{
                        display: 'flex',                   // הופך למכולת Flex
                        flexDirection: 'row',              // סידור בשורה
                        justifyContent: 'flex-end',        // יישור לימין
                        gap: 4,                            // *** זה הרווח הנדרש (4 יחידות MUI) ***
                    }}
                >
                    
                    {/* כפתור צפייה (הכפתור הראשי) */}
                    <Button
                        variant="contained"
                        onClick={handleWatch}
                        startIcon={<PlayCircleIcon />}
                        sx={{
                            backgroundColor: CARD_COLORS.mainBg,
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '5px 38px',
                            borderRadius: '10px', // הוספת עיגול פינות
                            
                            // *** הוספת שורות אלה ליצירת רווח בין הטקסט לאייקון ***
                            '& .MuiButton-startIcon': {
                                marginLeft: '8px', // מגדיר רווח של 8 פיקסלים משמאל לאייקון (בכיוון RTL)
                            },
                            // ************************************************

                            '&:hover': { backgroundColor: '#7a2222' }
                        }}
                    >
                        לצפייה
                    </Button>
                    
                    {/* כפתור הורדה */}
                   <Button
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<DownloadIcon />}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                         padding: '5px 38px',
                            borderRadius: '10px', // הוספת עיגול פינות
                            // *** הוספת שורות אלה ליצירת רווח בין הטקסט לאייקון ***
                            '& .MuiButton-startIcon': {
                                marginLeft: '8px', // מגדיר רווח של 8 פיקסלים משמאל לאייקון (בכיוון RTL)
                            },
                            // ************************************************

                            '&:hover': { backgroundColor: '#222222' }
                        }}
                    >
                        הורדה
                    </Button>
                </Box>
            </Box>
        </Paper>
    </Box>
);

export default LatestLessonCard;