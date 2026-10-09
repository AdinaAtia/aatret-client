import { memo } from 'react';
import { Box, useMediaQuery, useTheme, type SxProps, type Theme } from '@mui/material';

/**
 * סרטון הרקע של ההירו — קטע "הרבה אנשים" (האולם) מתוך VID-20260715-WA0084.
 * 16.7 שניות, 848x478, mp4 בלבד (ה-hero.webm הישן הוסר כדי שלא יקבל עדיפות על החדש).
 *
 * קבועים מחוץ לקומפוננטה כדי שזהות ה-src לא תשתנה בכל render
 * (זו הייתה הסיבה שהסרטון נטען שוב ושוב — ראו CODEMAP.md §5).
 */
const MEDIA_BASE = `${import.meta.env.VITE_MEDIA_URL}/About`;
const VIDEO_SRC_MP4 = `${MEDIA_BASE}/VID-20260715-WA0084_crowd-only.mp4`;

/**
 * פריים ראשון מתוך הסרטון — כך המעבר מהתמונה הסטטית לווידאו חלק,
 * בלי "קפיצה" חזותית. נשמר מקומי ב-public/ כדי שיעלה מיד, בלי תלות בשרת המדיה.
 * גם התחליף המלא לווידאו בנייד.
 */
const POSTER_SRC = '/hero-poster.jpg';

interface HeroVideoProps {
  /** sx שמוחל הן על ה-<video> והן על חלופת ה-<img> בנייד — בד"כ מיקום/גודל */
  sx?: SxProps<Theme>;
}

/**
 * סרטון רקע ההירו, משותף לדף הבית ול-About.
 * בנייד (עד 768px) לא בונה את אלמנט ה-video בכלל — מגיש את POSTER_SRC כתמונה סטטית.
 * זה לא הסתרה ב-CSS: הרכיב לא מתווסף ל-DOM, אז אין בקשת רשת לווידאו כלל.
 */
function HeroVideoInner({ sx }: HeroVideoProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box
        component="img"
        src={POSTER_SRC}
        alt=""
        loading="eager"
        sx={{ objectFit: 'cover', ...sx }}
      />
    );
  }

  return (
    <Box
      component="video"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      poster={POSTER_SRC}
      sx={{ objectFit: 'cover', ...sx }}
    >
      <source src={VIDEO_SRC_MP4} type="video/mp4" />
    </Box>
  );
}

/** memo — לא מתרנדר מחדש כשההורה משתנה מסיבות שלא קשורות לווידאו עצמו */
const HeroVideo = memo(HeroVideoInner);
export default HeroVideo;
