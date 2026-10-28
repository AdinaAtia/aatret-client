import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import {
  Typography,
  Box,
  Stack,
  CircularProgress
} from "@mui/material";
import { Search, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AppButton from './shared/AppButton';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import LessonCard from './shared/LessonCard';
import { formatHebrewDate } from '../src/utils/hebrewDate';

/** כמה כרטיסים מוצגים ברשת — לפי העיצוב: 4 שווים בשורה */
const VISIBLE_COUNT = 4;

interface LecturesGridProps {
  onLessonSelect: (lesson: any) => void;
}

/* ----------  קישוטי הקטע  ----------
 * "הקשת של ארון הקודש היא המוטיב החוזר — ... וכל כותרת קטע." (הערות העיצוב)
 */

const LecturesGrid = (_props: LecturesGridProps) => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/api/lessons?filters[rabbi][name][$contains]=${encodeURIComponent('מרדכי עטייה')}&sort=lesson_date_gregorian:desc&populate=*&pagination[pageSize]=9`;
      const response = await axios.get(url);
      setLectures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchLectures();
      hasFetched.current = true;
    }
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress sx={{ color: 'var(--gold)' }} /></Box>;

  /** השרת ממשיך להחזיר 9 — כאן רק נבחר כמה מהם מוצגים */
  const visibleLessons = lectures
    .filter((l) => {
      const a = l.attributes || l;
      return a.youtube_id && a.title?.trim();
    })
    .slice(0, VISIBLE_COUNT);

  const getLessonData = (lesson: any) => {
    const attrs = lesson.attributes || lesson;
    return {
      title: attrs.title,
      youtubeId: attrs.youtube_id,
      dateHebrew: formatHebrewDate(attrs.lesson_date_gregorian, attrs.lesson_date_hebrew),
      dateGregorian: attrs.lesson_date_gregorian,
      duration: attrs.duration || "00:00",
      rabbiName: attrs.rabbi?.data?.attributes?.name || attrs.rabbi?.name || "",
      audioFileName: attrs.AudioFileName || null,
      audioDir: attrs.AudioDir || '',
    };
  };

  const handleDownload = (audioDir: string, audioFileName: string, title?: string) => {
    const cleanDir = (audioDir || '').replace(/^\/+|\/+$/g, '');
    const file = `${cleanDir}/${audioFileName}`;
    const params = new URLSearchParams({ key: 'ATERET_DL_2026', file, title: title || audioFileName });
    const a = document.createElement('a');
    a.href = `https://ateretmordechaifiles.com/download.php?${params}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ width: '100%', direction: 'rtl', bgcolor: 'var(--parchment)', py: { xs: 6, md: 8 } }}>
      <Box sx={{
        width: '100%',
        maxWidth: '1550px',
        mx: 'auto',
        px: { xs: 2, md: 4, lg: 5 }
      }}>

        {/* ----------  כותרת הקטע  ---------- */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <SectionArch />
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-heading-ornate)',
              fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
              lineHeight: 1.2,
              fontWeight: 400,
              color: 'var(--wine)',
              m: 0,
            }}
          >
            שיעורים אחרונים
          </Typography>
          <SectionFlourish mt={1.5} />
        </Box>

        {/* ----------  רשת הכרטיסים  ---------- */}
        <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
          {visibleLessons.map((lecture) => {
            const data = getLessonData(lecture);
            const hasDuration = Boolean(data.duration) && data.duration !== "00:00";

            const goToLesson = () => navigate(`/AllLessons/${lecture.id}`);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={lecture.id} sx={{ display: 'flex' }}>
                <Box sx={{ width: '100%' }}>
                  <LessonCard
                    lesson={{
                      id: lecture.id,
                      title: data.title,
                      rabbiName: !data.rabbiName || data.rabbiName.includes('שליט"א') ? data.rabbiName : `${data.rabbiName} שליט"א`,
                      dateHebrew: data.dateHebrew,
                      youtubeId: data.youtubeId,
                      duration: hasDuration ? data.duration : undefined,
                    }}
                    onSelect={goToLesson}
                    onPlayVideo={data.youtubeId ? goToLesson : undefined}
                    onPlayAudio={data.audioFileName ? goToLesson : undefined}
                    onDownload={data.audioFileName ? () => handleDownload(data.audioDir, data.audioFileName, data.title) : undefined}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* ----------  חיפוש + ארכיון  ---------- */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={0}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: { xs: 4, md: 5 }, gap: '14px' }}
        >
          <AppButton
            variant="dark"
            onClick={() => navigate('/AllLessons', { state: { focusSearch: true } })}
            startIcon={<Search size={17} />}
            sx={{ width: { xs: '100%', sm: '202px' }, '& .MuiButton-startIcon': { ml: 1, mr: -0.25 } }}
          >
            חיפוש בשיעורים
          </AppButton>

          <AppButton
            variant="outline"
            onClick={() =>
              document.getElementById('rabbis-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            endIcon={<ChevronLeft size={17} />}
            sx={{ width: { xs: '100%', sm: '312px' }, '& .MuiButton-endIcon': { mr: 1, ml: -0.25 } }}
          >
            לשיעורי רבני הישיבה
          </AppButton>
        </Stack>

      </Box>
    </Box>
  );
};

export default LecturesGrid;
