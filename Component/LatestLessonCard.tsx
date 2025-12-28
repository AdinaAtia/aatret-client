import React from 'react';
import { Box, Button, Paper, Typography, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/GetApp';
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline';
import { Clock, Calendar } from 'lucide-react'; 

const CARD_COLORS = {
    mainBrown: '#9c6644', 
    creamBg: '#fdfbe7', 
    borderRadius: '24px', 
};

const LATEST_LESSON_DATA = {
    imageSrc: '/DSC_5195.JPG',
    title: 'שיעור אחרון',
    subTitle: 'כוונות העמידה דרוש ב׳',
    lessonNum: "מס' 003",
    category: 'מטבע ברכה',
    dateHebrew: "כ\"ו חשוון תשפ\"ה",
    dateGregorian: '25/04/25',
    time: '01:03:05'
};

const LatestLessonCard: React.FC = () => (
    <Box
        sx={{
            direction: 'rtl',
            width: '100%',
            maxWidth: '1400px',
            margin: '60px auto 20px', 
            px: { xs: 3, sm: 5, md: 8, lg: 12 }, 
            boxSizing: 'border-box',
            position: 'relative'
        }}
    >
        {/* כותרת "שיעור אחרון" */}
        <Box sx={{
            position: 'absolute',
            top: '-25px',
            right: { xs: '30px', sm: '50px', md: '100px', lg: '140px' },
            backgroundColor: CARD_COLORS.mainBrown,
            color: 'white',
            px: 5,
            py: 1.2,
            borderRadius: '20px',
            zIndex: 10,
        }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem' }}>
                {LATEST_LESSON_DATA.title}
            </Typography>
        </Box>

        <Paper
            elevation={0}
            sx={{
                borderRadius: CARD_COLORS.borderRadius,
                backgroundColor: CARD_COLORS.creamBg, 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row-reverse' }, 
                overflow: 'visible',
                minHeight: { md: '450px' },
                alignItems: 'stretch',
                width: '100%',
            }}
        >
            {/* תמונת הרב */}
            <Box
                sx={{
                    width: { xs: 'calc(100% - 40px)', md: '50%' },
                    minHeight: { xs: '250px', md: 'auto' },
                    backgroundImage: `url(${LATEST_LESSON_DATA.imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '25px',
                    borderRadius: '25px',
                    flexShrink: 0
                }}
            />

            {/* אזור תוכן */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: { xs: '40px 20px', md: '40px 60px 40px 0' }, 
                    textAlign: 'right',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: 'black', fontSize: '2.2rem' }}>
                    {LATEST_LESSON_DATA.subTitle}
                </Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#333', opacity: 0.8 }}>
                    {LATEST_LESSON_DATA.lessonNum}
                </Typography>

                <Box sx={{ 
                    backgroundColor: 'black', 
                    color: 'white', 
                    px: 2, py: 0.5, 
                    borderRadius: '8px',
                    width: 'fit-content',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    mb: 5
                }}>
                    {LATEST_LESSON_DATA.category}
                </Box>

                {/* --- התיקון כאן: ריווח מוגדל בין התאריכים --- */}
               <Stack 
    direction="row" 
    sx={{ 
        mb: 5, 
        color: '#333', 
        display: 'flex',
        flexWrap: 'wrap', // מאפשר לאלמנטים לרדת שורה בטלפון במקום להידחס
        rowGap: 2,        // ריווח אנכי במידה והם יורדים שורה (בנייד)
        columnGap: { xs: 4, md: 7 }, // ריווח אופקי שוויוני ומדויק בין הקבוצות
        justifyContent: 'flex-start',
        alignItems: 'center'
    }}
>
    {/* תאריך עברי */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
        <Calendar size={20} strokeWidth={1.5} />
        <Typography sx={{ fontWeight: 700 }}>{LATEST_LESSON_DATA.dateHebrew}</Typography>
    </Box>

    {/* תאריך לועזי */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
        <Calendar size={20} strokeWidth={1.5} />
        <Typography sx={{ fontWeight: 700 }}>{LATEST_LESSON_DATA.dateGregorian}</Typography>
    </Box>

    {/* שעה */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
        <Clock size={20} strokeWidth={1.5} />
        <Typography sx={{ fontWeight: 700 }}>{LATEST_LESSON_DATA.time}</Typography>
    </Box>
</Stack>

                {/* כפתורי פעולה */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 5, py: 1.2,
                            borderRadius: '12px',
                            display: 'flex',
                            gap: 1,
                            '&:hover': { backgroundColor: '#222' }
                        }}
                    >
                        <DownloadIcon />
                        הורדה
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: CARD_COLORS.mainBrown,
                            color: 'white',
                            fontWeight: 'bold',
                            px: 5, py: 1.2,
                            borderRadius: '12px',
                            display: 'flex',
                            gap: 1,
                            '&:hover': { backgroundColor: '#7d5236' }
                        }}
                    >
                        <PlayCircleIcon />
                        לצפייה
                    </Button>
                </Box>
            </Box>
        </Paper>
    </Box>
);

export default LatestLessonCard;