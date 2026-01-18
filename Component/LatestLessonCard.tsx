import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Paper, Typography, Stack, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/GetApp';
import PlayCircleIcon from '@mui/icons-material/PlayCircleOutline';
import { Clock, Calendar } from 'lucide-react'; 
import axios from 'axios';

const CARD_COLORS = {
    mainBrown: '#9c6644', 
    creamBg: '#fdfbe7', 
    borderRadius: '24px', 
};
interface LatestLessonCardProps {
  onLessonSelect: (lesson: any) => void;
}

const LatestLessonCard= ({ onLessonSelect }: LatestLessonCardProps) => {
    const [lesson, setLesson] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        const fetchLatestLesson = async () => {
            try {
                // שאילתה שמביאה את השיעור הכי חדש של הרב מרדכי עטייה
                // אנחנו ממיינים לפי תאריך יורד ולוקחים רק את הראשון (limit=1)
                const response = await axios.get(
                    'http://localhost:1337/api/lessons?filters[rabbi][name][$eq]=הרב מרדכי עטייה&sort=lesson_date_gregorian:desc&pagination[limit]=1&populate=*'
                );

                if (response.data.data && response.data.data.length > 0) {
                    setLesson(response.data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching latest lesson:', error);
            } finally {
                setLoading(false);
                hasFetched.current = true;
            }
        };

        fetchLatestLesson();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                <CircularProgress sx={{ color: CARD_COLORS.mainBrown }} />
            </Box>
        );
    }

    if (!lesson) return null;

    // חילוץ הנתונים מהאובייקט של סטראפי
    const { 
        title, 
        lesson_date_gregorian, 
        lesson_date_hebrew, 
        youtube_id,
        category ,
        duration
    } = lesson;

    // שימוש בתמונת יוטיוב כברירת מחדל (או תמונה מה-DB אם תרצי בהמשך)
    const imageSrc = `https://img.youtube.com/vi/${youtube_id}/maxresdefault.jpg`;
    // const categoryName = category?.name || 'שיעור כללי';

    return (
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
            {/* כותרת "שיעור אחרון" - עיצוב מקורי */}
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
                    שיעור אחרון
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
                {/* תמונת השיעור (מיוטיוב) */}
                <Box
                    sx={{
                        width: { xs: 'calc(100% - 40px)', md: '50%' },
                        minHeight: { xs: '250px', md: 'auto' },
                        backgroundImage: `url(${imageSrc})`,
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
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, color: 'black', fontSize: '2.2rem' }}>
                        {title}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#333', opacity: 0.8 }}>
                        {/* כאן אפשר להוסיף מספר שיעור אם קיים ב-DB */}
                    </Typography>

                    {/* <Box sx={{ 
                        backgroundColor: 'black', 
                        color: 'white', 
                        px: 2, py: 0.5, 
                        borderRadius: '8px',
                        width: 'fit-content',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        mb: 5
                    }}>
                        {categoryName}
                    </Box> */}

                    <Stack 
                        direction="row" 
                        sx={{ 
                            mb: 5, 
                            color: '#333', 
                            display: 'flex',
                            flexWrap: 'wrap',
                            rowGap: 2,
                            columnGap: { xs: 4, md: 7 },
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
                            <Calendar size={20} strokeWidth={1.5} />
                            <Typography sx={{ fontWeight: 700 }}>{lesson_date_hebrew}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
                            <Calendar size={20} strokeWidth={1.5} />
                            <Typography sx={{ fontWeight: 700 }}>{lesson_date_gregorian}</Typography>
                        </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
                            <Clock size={12} />
                            <Typography sx={{ fontWeight: 700 }}>
                              {duration || '00:00'}
                            </Typography>
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
                                            onClick={() => onLessonSelect(lesson)} 

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
};

export default LatestLessonCard;
