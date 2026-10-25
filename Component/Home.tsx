import React, { useRef,useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import LessonThumb, { youtubeThumbSources } from './shared/LessonThumb';

import LecturesGrid from './LecturesGrid';
import AppButton from './shared/AppButton';
import RabbiSchedule from './shared/RabbiSchedule';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import { cardHoverSx } from './shared/cardHover';
import CarouselProgress, { carouselArrowSx } from "./shared/CarouselProgress";
import { useCarousel } from './shared/useCarousel';
import HeroVideo from './HeroVideo';
import LessonPlayer from './LessonPlayer'; // ייבוא הנגן
import BooksCarousel from './BooksCarousel'; // ודאי שהנתיב לקובץ נכון
import { Crown } from './Header';
import founderContent from './founderContent.json';
import { site } from '../src/content/site';
import { withHonorific } from '../src/utils/rabbiName';
import weeklyLesson from './weeklyLesson.json';

const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;

// --- 1. הגדרות רוחב וצבעים ---

const rabbiVideos = [
  { youtubeId: 'FWJGuXlBQ88', name: 'הראשון לציון הרב מרדכי אליהו זצ"ל', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'elWVs7nSbCs', name: 'המקובל הרב דוד שלום זצ"ל ראש ישיבת השלום', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: '1-aGtlCP4Kk', name: 'הראשון לציון הרב דוד יוסף שליט"א', date: 'הילולת הרש"ש י\' שבט תשפ"ה ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { youtubeId: '-Wd4It5Ap_k', name: 'הרב בן ציון מוצפי שליט״א', date: '' },
  { youtubeId: 'Y-nZHTds7Tw', name: 'הרב יצחק מאיר מורגנשטרן שליט"א', thumbnail: `${MEDIA_BASE_URL}/צילום מסך 2026-06-22 110957.png`, date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'QV2Bgb3L7Ug', name: 'הרב אליהו מנצור שליט״א', date: '' },
  { youtubeId: '2zOk_8o2J-I', name: 'רבה של ירושלים הרב שלום משאש זצ"ל', date: '2026' },
  { youtubeId: 'jmjeweAHdxs', name: 'הרב בניהו שמואלי שליט"א', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'BsKWj2CjOYA', name: 'הרב בניהו שמואלי שליט"א', date: '2026' },
  { youtubeId: 'yH6uFOh7Wgc', name: 'ביקור ראש הישיבה אצל הרבי מחב"ד', date: '1989' },
  { youtubeId: 'DXDKQXaw_lM', name: 'הילולת הרש"ש י\' שבט תשפ"ה', date: 'ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { youtubeId: '8kWZWx7W010', name: 'תדמית הישיבה', date: '2026' },
];

function LazyYouTube({ youtubeId, thumbnail, caption, alt }: { youtubeId: string; thumbnail?: string; caption?: string; alt?: string }) {
  const [active, setActive] = useState(false);
  if (active) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        style={{ display: 'block', border: 'none' }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }
  return (
    <Box onClick={() => setActive(true)} sx={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}>
      <LessonThumb
        src={thumbnail ? [thumbnail] : youtubeThumbSources(youtubeId)}
        alt={alt ?? caption ?? ''}
        imagePosition={caption ? '60% center' : 'center'}
        playSize={52}
        crownWidth={64}
        sx={{ width: '100%', height: '100%' }}
      />
      {caption && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: '24px 16px 12px', pointerEvents: 'none', textAlign: 'center', background: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--ink) 80%, transparent) 100%)` }}>
          <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--t4)', color: 'var(--gold-light)' }}>{caption}</Typography>
        </Box>
      )}
    </Box>
  );
}

// --- 2. קומפוננטת דף הבית ---
const Home: React.FC = () => {
 
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null); // הוספת המצב לשיעור נבחר

  const hasFetchedRabbis = useRef(false);
  // const handleCentralSearch = (event: React.FormEvent) => {
  //   event.preventDefault();
  // };

  const [rabbiCardsData, setRabbiCardsData] = useState<any[]>([]);
  const [rabbiLatestLessons, setRabbiLatestLessons] = useState<Record<number, any>>({});
  const rabbisInRow = rabbiCardsData.filter((r) => !r.name.includes('מרדכי עטי'));
  const sagesCarousel = useCarousel(rabbiVideos.length);
  const rabbisCarousel = useCarousel(rabbisInRow.length);
 useEffect(() => {
  if (hasFetchedRabbis.current) return;
  hasFetchedRabbis.current = true;

  fetch(`${import.meta.env.VITE_API_URL}/api/rabbis?populate=photo_url&sort[0]=Priority:asc`)
    .then(r => r.json())
    .then(async (rabbisData) => {
      if (!rabbisData?.data) {
        setRabbiCardsData([]);
        return;
      }

      const formatted = rabbisData.data.map((r: any) => {
        const attr = r.attributes ? r.attributes : r;

        let title = '';
        if (attr.note && Array.isArray(attr.note) && attr.note.length > 0) {
          const block = attr.note[0];
          if (block.children && block.children.length > 0) {
            title = block.children[0].text || '';
          }
        }

        let imageSrc = '/placeholder.png';
        const photoData = attr.photo_url;
        if (photoData && photoData.length > 0) {
          const photo = photoData[0];
          // הכרטיס מוצג בקטן — טוענים את הגרסה המוקטנת (small, 500px) שסטרפי יוצר, ולא את המקור
          const url = photo.formats?.small?.url || photo.url || photo.attributes?.url;
          if (url) {
            imageSrc = `${import.meta.env.VITE_API_URL}${url}`;
          }
        }

        return {
          id: r.id,
          name: attr.name || 'ללא שם',
          title,
          imageSrc,
          priority: Number(attr.Priority) ?? 999,
          schedule: attr.schedule || [],
          phoneOnly: Boolean(attr.phoneOnly),
        };
      });

      setRabbiCardsData([...formatted].sort((a, b) => a.priority - b.priority));

      const lessonRequests = rabbisData.data.map((r: any) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/lessons?filters[rabbi][id][$eq]=${r.id}&sort=lesson_date_gregorian:desc&pagination[limit]=1`)
          .then(res => res.json())
          .then(data => ({ rabbiId: r.id, lesson: data?.data?.[0] ?? null }))
      );

      const lessonsResults = await Promise.all(lessonRequests);
      const lessonsMap: Record<number, any> = {};
      lessonsResults.forEach(({ rabbiId, lesson }) => {
        if (lesson) lessonsMap[rabbiId] = lesson;
      });
      setRabbiLatestLessons(lessonsMap);
    })
    .catch((err) => console.error('Error fetching data:', err));
}, []);

 
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
     

    <Box sx={{ 
   // תואם ל-maxWidth של הכותרת אם הגדרת
  mx: 'auto', 
  // px: {  md: 1 }, // שוליים זהים בדיוק לאלו של הכותרת (שורות 83-90)
  width: '100%' 
}}> 
{/* --- אזור פתיחה (Hero Section) --- */}
<Box sx={{
  position: 'relative',
  width: '100%',
  height: { xs: '80vh', md: '90vh' },
  overflow: 'hidden',
  direction: 'rtl',
  bgcolor: 'var(--surface)',
}}>
  {/* סרטון רקע — פרוס על כל השטח. בנייד מוגשת תמונה סטטית במקומו (HeroVideo.tsx) */}
  <HeroVideo
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
    }}
  />

  {/* צעיף קרם בהיר על כל הסרטון */}
  <Box sx={{
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none',
    background: `linear-gradient(180deg, color-mix(in srgb, var(--surface) 83.137%, transparent) 0%, color-mix(in srgb, var(--parchment) 76.863%, transparent) 45%, color-mix(in srgb, var(--sand) 80%, transparent) 100%)`,
  }} />

  {/* מסגרת הקשת — שני פסי זהב דקים מעל הסרטון */}
  <Box sx={{
    position: 'absolute',
    inset: { xs: '12px', md: '26px' },
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: 'var(--radius-arch)',
    border: `1px solid color-mix(in srgb, var(--gold-deep) 65.098%, transparent)`,
  }} />
  <Box sx={{
    position: 'absolute',
    inset: { xs: '19px', md: '36px' },
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: 'var(--radius-arch)',
    border: `1px solid color-mix(in srgb, var(--gold-deep) 36.078%, transparent)`,
  }} />

  {/* כיתוב מעל הסרטון */}
  <Box sx={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    pt: { xs: '14vh', md: '16vh' },
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 3,
    px: 2,
  }}>
    {/* הכתר — אותה קומפוננטת Crown של ההאדר */}
    <Box sx={{
      mb: { xs: 1.5, md: 2 },
      '& svg': { width: { xs: '72px', md: '110px' }, height: 'auto' },
    }}>
      <Crown width={110} height={93} />
    </Box>

    <Typography sx={{
      fontFamily: 'var(--font-heading)',
      fontSize: { xs: '11px', md: 'var(--t2)' },
      fontWeight: 400,
      color: `color-mix(in srgb, var(--wine) 85.098%, transparent)`,
      letterSpacing: { xs: '0.5em', md: '0.75em' },
      textIndent: { xs: '0.5em', md: '0.75em' },
      mb: { xs: 0.5, md: 1 },
    }}>
      ישיבת
    </Typography>

    <Typography component="h1" sx={{
      fontFamily: 'var(--font-heading-ornate)',
      fontSize: 'clamp(2.75rem, 7.5vw, 6rem)',
      fontWeight: 400,
      color: 'var(--wine)',
      lineHeight: 1.05,
      letterSpacing: '0.02em',
      textAlign: 'center',
    }}>
      עטרת מרדכי
    </Typography>

    {/* קו מפריד עם מעוינים */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: { xs: 2, md: 2.5 } }}>
      <Box sx={{ width: { xs: '55px', md: '105px' }, height: '1px', background: `linear-gradient(90deg, transparent 0%, var(--gold-deep) 100%)` }} />
      <Box sx={{ width: '5px', height: '5px', transform: 'rotate(45deg)', bgcolor: 'var(--gold)' }} />
      <Box sx={{ width: '4px', height: '4px', transform: 'rotate(45deg)', bgcolor: 'var(--gold-deep)', opacity: 0.6 }} />
      <Box sx={{ width: '5px', height: '5px', transform: 'rotate(45deg)', bgcolor: 'var(--gold)' }} />
      <Box sx={{ width: { xs: '55px', md: '105px' }, height: '1px', background: `linear-gradient(90deg, var(--gold-deep) 0%, transparent 100%)` }} />
    </Box>

    <Typography sx={{
      fontFamily: 'var(--font-heading)',
      fontSize: { xs: 'var(--t3)', md: 'var(--t4)' },
      fontWeight: 400,
      color: 'var(--wine)',
      lineHeight: 1.5,
      letterSpacing: '0.03em',
    }}>
      ישיבה ללימוד הקבלה והפשט
    </Typography>

    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: { xs: 'var(--t1)', md: 'var(--t2)' },
      fontWeight: 400,
      color: `color-mix(in srgb, var(--wine) 72.157%, transparent)`,
      letterSpacing: '0.05em',
      mt: { xs: 0.5, md: 1 },
    }}>
      עפ"י תורת האר"י ז"ל
    </Typography>

    {/* שני הכפתורים */}
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: { xs: 1.5, md: 2 },
      mt: { xs: 3.5, md: 5 },
    }}>
      <AppButton onClick={() => navigate('/About')}>
        אודות הישיבה
      </AppButton>

      <AppButton variant="outline" onClick={() => navigate('/AllLessons')} sx={{ bgcolor: 'rgba(255,252,244,0.85)', '&:hover': { bgcolor: '#FFFCF4' } }}>
        ארכיון השיעורים
      </AppButton>
    </Box>
  </Box>
</Box>
  </Box>

{/* --- פס השיעור השבועי ---
    כל המידות נמדדו מקובץ העיצוב ואומתו מול צילום המסך. ראה weeklyBar ב-tokens.ts.
    דסקטופ: שורה אחת ממורכזת, gap 40px, גובה 103px.
    נייד: עמודה מיושרת לימין, גובה 234px, בלי המפרידים האנכיים. */}
<Box sx={{
  width: '100%',
  boxSizing: 'border-box',
  bgcolor: 'var(--sand)',
  borderTop: `var(--weekly-bar-rule-width) solid var(--gold)`,
  borderBottom: `var(--weekly-bar-rule-width) solid var(--gold)`,
  height: { xs: 'auto', lg: `var(--weekly-bar-height-desktop)` },
  minHeight: { xs: `var(--weekly-bar-height-mobile)`, md: 'unset' },
  py: { xs: 0, md: 2, lg: 0 },
  px: { xs: '20px', md: 3 },
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'stretch', md: 'center' },
  justifyContent: 'center',
  direction: 'rtl',
  overflow: 'hidden',
  pb: { xs: '30px', md: 0 },
  gap: { xs: 0, md: '20px', lg: `var(--weekly-bar-gap)` },
}}>
  {/* ימין: מעוין + כותרת הפס */}
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: `var(--weekly-bar-diamond-gap)`,
    justifyContent: 'flex-start',
    mt: { xs: '30px', md: 0 },
  }}>
    {/* המעוין — ריבוע מסובב, 13px באלכסון (מדויק יותר מתו גופן) */}
    <Box sx={{
      width: `calc(var(--weekly-bar-diamond-diagonal) / ${Math.SQRT2})`,
      height: `calc(var(--weekly-bar-diamond-diagonal) / ${Math.SQRT2})`,
      bgcolor: 'var(--wine)',
      transform: 'rotate(45deg)',
      flexShrink: 0,
    }} />
    <Typography sx={{
      fontFamily: 'var(--font-heading)',
      fontSize: { xs: `var(--weekly-bar-title-mobile)`, lg: `var(--weekly-bar-title-desktop)` },
      fontWeight: 400,
      color: 'var(--wine)',
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    }}>{weeklyLesson.title}</Typography>
  </Box>

  <Box sx={{
    display: { xs: 'none', md: 'block' },
    width: `var(--weekly-bar-divider-w)`,
    height: `var(--weekly-bar-divider-h)`,
    bgcolor: 'var(--gold)',
    flexShrink: 0,
  }} />

  {/* אמצע: יום ושעה + הכתובית — מיושר לימין, לא למרכז */}
  <Box sx={{ textAlign: 'right', mt: { xs: '22px', md: 0 }, minWidth: 0, flex: { md: '0 1 auto' } }}>
    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: `var(--weekly-bar-time-size)`,
      fontWeight: 700,
      color: 'var(--gold-text)',
      lineHeight: 'var(--weekly-bar-time-line-height)',
      whiteSpace: 'nowrap',
    }}>{weeklyLesson.schedule}</Typography>
    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: `var(--weekly-bar-subtitle-size)`,
      color: 'var(--weekly-bar-subtitle-color)',
      lineHeight: 1.5,
    }}>{weeklyLesson.subtitle}</Typography>
  </Box>

  <Box sx={{
    display: { xs: 'none', md: 'block' },
    width: `var(--weekly-bar-divider-w)`,
    height: `var(--weekly-bar-divider-h)`,
    bgcolor: 'var(--gold)',
    flexShrink: 0,
  }} />

  {/* מיקום — האייקון מימין לטקסט */}
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '8px',
    justifyContent: 'flex-start',
    mt: { xs: '10px', md: 0 },
    minWidth: 0,
    flex: { md: '0 1 auto' },
  }}>
    <PlaceOutlinedIcon sx={{ display: { xs: 'none', md: 'inline-block' }, fontSize: 'var(--weekly-bar-pin-size)', color: 'var(--gold-deep)', flexShrink: 0 }} />
    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: { xs: `var(--weekly-bar-place-mobile)`, lg: `var(--weekly-bar-place-desktop)` },
      color: { xs: 'var(--weekly-bar-subtitle-color)', lg: 'var(--body)' },
      lineHeight: 1.5,
    }}>{weeklyLesson.location} · {weeklyLesson.address}</Typography>
  </Box>

  {/* שמאל: כפתור — מסגרת בלבד. הטקסט והניווט ללא שינוי. */}
  <AppButton
    variant="outline"
    onClick={() => {
      const roshHayeshiva = rabbiCardsData.find((r) => r.name.includes('מרדכי עטי'));
      navigate('/AllLessons', { state: { rabbiId: roshHayeshiva?.id } });
    }}
    sx={{
      alignSelf: { xs: 'stretch', md: 'auto' },
      width: { xs: '100%', md: 'auto' },
      maxWidth: { xs: '100%', md: 'none' },
      mt: { xs: '26px', md: 0 },
      flexShrink: 0,
    }}
  >{weeklyLesson.buttonText}</AppButton>
</Box>

 <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} />

{/* --- אזור ראש הישיבה --- */}
{/* עיצוב לפי ateret-mordechai-design.pdf · נמדד מצילום העיצוב:
    רקע #F0E9D2 · קווי זהב 1px · גובה 650px · קשת 387x512 · תמונה 361x482 · רווח 14px */}
<Box sx={{
  width: '100%',
  boxSizing: 'border-box',
  bgcolor: 'var(--section-bg)',
  borderTop: `1px solid var(--gold)`,
  borderBottom: `1px solid var(--gold)`,
  minHeight: { xs: 'auto', md: 650 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: { xs: 'column', md: 'row' },
  direction: 'rtl',
  px: { xs: 2, md: 5, lg: 10 },
  gap: { xs: 4, md: 6, lg: 10 },
  py: { xs: 6, md: 5 },
}}>
  {/* קשת ארון הקודש + תמונה — צד ימין */}
  <Box sx={{
    position: 'relative',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: { xs: 258, sm: 310, md: 340, lg: 387 },
    height: { xs: 341, sm: 410, md: 450, lg: 512 },
    border: `1px solid var(--gold)`,
    borderRadius: { xs: '129px 129px 6px 6px', sm: '155px 155px 6px 6px', md: '170px 170px 8px 8px', lg: '193px 193px 8px 8px' },
    p: { xs: '9px', sm: '11px', lg: '13px' },
  }}>
    {/* מילוי הקשת — זהב אחיד מאחורי הדמות. נמדד #C5A258 */}
    <Box sx={{
      width: '100%',
      height: '100%',
      bgcolor: 'var(--gold)',
      overflow: 'hidden',
      borderRadius: { xs: '120px 120px 4px 4px', sm: '144px 144px 4px 4px', md: '159px 159px 4px 4px', lg: '180px 180px 4px 4px' },
    }}>
      <Box
        component="img"
        loading="lazy"
        decoding="async"
        src={`${MEDIA_BASE_URL}/דד (1) (1).webp`}
        alt="ראש הישיבה הרב מרדכי עטייה שליט״א"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />
    </Box>
  </Box>

  {/* כיתוב ותיאור — צד שמאל */}
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', md: 'flex-start' },
    textAlign: { xs: 'center', md: 'right' },
    width: '100%',
    maxWidth: 600,
  }}>
    {/* כותרת־על */}
    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--t1)',
      fontWeight: 500,
      letterSpacing: '0.35em',
      color: 'var(--gold-deep)',
      mb: 2,
    }}>ראש הישיבה</Typography>

    {/* השם */}
    <Typography component="h2" sx={{
      fontFamily: 'var(--font-heading)',
      fontSize: { xs: 'var(--t5)', md: '40px', lg: '56px' }, /* PDF: 56px */
      fontWeight: 400,
      lineHeight: 1.15,
      color: 'var(--wine)',
    }}>הרב מרדכי עטייה</Typography>

    <Typography sx={{
      fontFamily: 'var(--font-heading)',
      fontSize: { xs: 'var(--t3)', md: 'var(--t4)', lg: '30px' }, /* PDF: 30px */
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'var(--muted)', /* PDF: #6E6152, גופן רגיל */
      mt: 0.5,
    }}>שליט״א</Typography>

    {/* קו מפריד עם מעוין — הרכיב המשותף */}
    <Box sx={{ width: '100%' }}>
      <SectionFlourish mt="8px" mb="24px" justify={{ xs: 'center', md: 'flex-start' }} />
    </Box>

    {/* טקסט תיאור */}
    <Typography sx={{
      fontFamily: 'var(--font-body)',
      fontSize: { xs: 'var(--t2)', md: 'var(--t3)', lg: '18px' }, /* PDF: 18px */
      lineHeight: 1.95,
      color: `color-mix(in srgb, var(--ink) 87.843%, transparent)`,
    }}>{founderContent.newSectionDescription}</Typography>

    {/* כפתורים */}
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mt: 5,
      width: { xs: '100%', sm: 'auto' },
      justifyContent: { xs: 'center', md: 'flex-start' },
    }}>
      <AppButton
        onClick={() => {
          const roshHayeshiva = rabbiCardsData.find((r) => r.name.includes('מרדכי עטי'));
          navigate('/AllLessons', { state: { rabbiId: roshHayeshiva?.id } });
        }}
        sx={{ width: { xs: '100%', sm: 201 } }}
      >לשיעורי ראש הישיבה</AppButton>

      <AppButton
        variant="outline"
        onClick={() => navigate('/About')}
        sx={{ width: { xs: '100%', sm: 165 } }}
      >אודות הישיבה</AppButton>
    </Box>
  </Box>
</Box>

      {/* --- רבני הישיבה --- */}
      <Box id="rabbis-section" sx={{ width: '100%', bgcolor: 'var(--parchment)', py: { xs: '48px', md: '80px' }, direction: 'rtl', scrollMarginTop: '80px' }}>
        <Box sx={{
          width: '100%',
          maxWidth: `min(calc(var(--rabbi-card-width) * ${Math.max(rabbisInRow.length, 5)} + var(--rabbi-card-gap) * ${Math.max(rabbisInRow.length, 5) - 1} + 48px), 1440px)`,
          mx: 'auto',
          px: { xs: '16px', md: '24px' },
          boxSizing: 'border-box',
        }}>

          {/* כותרת הקטע */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '48px' } }}>
            <SectionArch mb="16px" />

            <Typography component="h2" sx={{
              fontFamily: 'var(--font-heading-ornate)',
              fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--wine)',
            }}>
              רבני הישיבה
            </Typography>

            <SectionFlourish mt="24px" />
          </Box>

          {/* כל הכרטיסים בשורה אחת: בדסקטופ עמודה לכל כרטיס, בנייד גלילה אופקית */}
          <Box sx={{ position: 'relative' }}>
          <Box
            ref={rabbisCarousel.ref}
            onScroll={rabbisCarousel.onScroll}
            sx={{
            display: { xs: 'flex', md: 'grid' },
            gridTemplateColumns: { md: `repeat(${Math.max(rabbisInRow.length, 1)}, minmax(0, 1fr))` },
            gap: { xs: '16px', md: `var(--rabbi-card-gap)` },
            overflowX: { xs: 'auto', md: 'visible' },
            scrollSnapType: { xs: 'x proximity', md: 'none' },
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            pb: { xs: '12px', md: 0 },
            mx: { xs: '-16px', md: 0 },
            px: { xs: '16px', md: 0 },
            scrollPaddingInline: { xs: '16px', md: 0 },
            maskImage: { xs: 'linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent)', md: 'none' },
            '& > *': { flex: { xs: '0 0 calc((100% - 16px) / 2)', md: 'initial' }, scrollSnapAlign: 'start' },
          }}>
            {rabbisInRow.map((rabbi) => {
              const lesson = rabbiLatestLessons[rabbi.id];
              const hasPhoto = Boolean(rabbi.imageSrc) && !rabbi.imageSrc.includes('placeholder');

              return (
                <Box
                  key={rabbi.id}
                  onClick={() => lesson && setSelectedLesson(lesson)}
                  sx={{
                    cursor: lesson ? 'pointer' : 'default',
                    display: 'flex',
                    boxSizing: 'border-box',
                    bgcolor: 'var(--surface)',
                    border: `1px solid var(--gold)`,
                    borderRadius: `var(--book-card-radius)`,
                    p: '8px',
                    height: 'var(--home-card-height)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    ...cardHoverSx,
                  }}
                >
                  {/* מסגרת פנימית דקה — כמו בכרטיס הספר */}
                  <Box sx={{
                    flex: 1,
                    minWidth: 0,
                    border: `1px solid var(--book-card-inner-border)`,
                    borderRadius: `var(--book-card-inner-radius)`,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* קשת ארון הקודש — ריבוע בעיצוב, ולכן aspect-ratio 1 */}
                    <Box sx={{
                      width: '100%',
                      height: 'var(--rabbi-card-photo-height, 100px)',
                      flexShrink: 0,
                      bgcolor: 'var(--rabbi-card-arch-fill)',
                      borderRadius: 'var(--radius-arch)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {hasPhoto ? (
                        <Box
                          component="img"
                          src={rabbi.imageSrc}
                          alt={rabbi.name}
                          loading="lazy"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        />
                      ) : (
                        <Crown width="var(--rabbi-card-crown-w)" height="var(--rabbi-card-crown-h)" />
                      )}
                    </Box>

                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      pt: `var(--rabbi-card-pad-top)`,
                      px: '12px',
                      pb: `var(--rabbi-card-pad-bottom)`,
                    }}>
                      <Typography sx={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: `var(--rabbi-card-name-size)`,
                        fontWeight: 'var(--rabbi-card-name-weight)',
                        lineHeight: 1.2,
                        color: 'var(--ink-wine)',
                      }}>
                        {withHonorific(rabbi.name)}
                      </Typography>

                      <Box sx={{
                        width: `var(--rabbi-card-rule-w)`,
                        height: `var(--rabbi-card-rule-h)`,
                        bgcolor: 'var(--gold-button-border)',
                        mt: `var(--rabbi-card-pad-rule-top)`,
                      }} />

                      <RabbiSchedule slots={rabbi.schedule} />

                      <Box sx={{ flexGrow: 1, minHeight: `var(--rabbi-card-pad-rule-bottom)` }} />

                      {/* הכפתור: מסגרת 1px זהב ללא מילוי, רדיוס 6px */}
                      {rabbi.phoneOnly ? (
                        // רב במרחב הקולי בלבד — אין לו שיעורים באתר, לכן חיוג לקו
                        <AppButton
                          href={`tel:+972${site.phones.lessonsArchive.replace(/^0/, '').replace(/-/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ width: '100%', flexShrink: 0, minWidth: 0 }}
                        >
                          למרחב הקולי
                        </AppButton>
                      ) : (
                        <AppButton
                          onClick={(e) => { e.stopPropagation(); navigate('/AllLessons', { state: { rabbiId: rabbi.id } }); }}
                          sx={{ width: '100%', flexShrink: 0, minWidth: 0 }}
                        >
                          לשיעורי הרב
                        </AppButton>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
          </Box>

          <CarouselProgress progress={rabbisCarousel.progress} onSeek={rabbisCarousel.seek} hideOnDesktop />
        </Box>
      </Box>

      {/* <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /> */}

      {/* <Box sx={{ my: { xs: 4, md: 7.5 } }} /> */}
      <BooksCarousel />

{/* --- דברי גדולי ישראל על הישיבה --- */}
<Box sx={{
  width: '100%',
  position: 'relative',
  bgcolor: 'var(--parchment)',
  py: { xs: '48px', md: '80px' },
  direction: 'rtl',
}}>
  <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: '16px', md: '24px', lg: '56px' }, boxSizing: 'border-box' }}>

    {/* כותרת הקטע — אותו מבנה כמו "רבני הישיבה": קשת, כותרת, קישוט */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '48px' } }}>
      <SectionArch mb="16px" />

      <Typography component="h2" sx={{
        fontFamily: 'var(--font-heading-ornate)',
        fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
        fontWeight: 400,
        lineHeight: 1.2,
        textAlign: 'center',
        color: 'var(--wine)',
      }}>
        דברי גדולי ישראל על הישיבה
      </Typography>

      <SectionFlourish mt="24px" />
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '4px', md: '16px' } }}>
      <IconButton
        aria-label="הקודם"
        disabled={!sagesCarousel.canPrev}
        onClick={() => sagesCarousel.scrollPage('prev')}
        sx={carouselArrowSx}
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </IconButton>

      <Box
        ref={sagesCarousel.ref}
        onScroll={sagesCarousel.onScroll}
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          gap: { xs: '16px', md: '24px' },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          py: '12px',
          // בנייד: הקרוסלה גולשת עד קצה המסך, והכרטיס החתוך מתעמעם בעדינות
          mx: { xs: '-16px', md: 0 },
          px: { xs: '16px', md: 0 },
          scrollPaddingInline: { xs: '16px', md: 0 },
          maskImage: { xs: 'linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent)', md: 'none' },
        }}
      >
        {rabbiVideos.map((v, i) => {
          // תאריך שהוא רק שנה ("2026") אינו מידע אמיתי — לא מציגים אותו
          const caption = v.date && !/^\d{4}$/.test(v.date.trim()) ? v.date : '';
          return (
            <Box key={i} sx={{
              flexShrink: 0,
              width: {
                xs: 'calc((100% - 16px) / 2)',
                sm: 'calc((100% - 16px) / 2)',
                md: 'calc(33.33% - 16px)',
                lg: 'calc(25% - 18px)',
              },
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              height: 'var(--home-card-height)',
              boxSizing: 'border-box',
              bgcolor: 'var(--surface)',
              border: `1px solid var(--gold)`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--lesson-card-shadow)',
              ...cardHoverSx,
            }}>
              {/* מסגרת פנימית כפולה, כמו כריכת הספר */}
              <Box sx={{ p: '10px 10px 0' }}>
                <Box sx={{
                  width: '100%',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  borderRadius: '7px',
                  border: `1px solid var(--gold)`,
                  bgcolor: 'var(--ink)',
                }}>
                  <LazyYouTube youtubeId={v.youtubeId} thumbnail={(v as any).thumbnail} alt={v.name} />
                </Box>
              </Box>

              <Box sx={{
                px: '16px',
                pt: '18px',
                pb: '22px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <Typography sx={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: { xs: 'var(--t3)', md: 'var(--t4)' },
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: 'var(--ink-wine)',
                  minHeight: '2.6em',
                  display: 'flex',
                  alignItems: 'center',
                }}>{v.name}</Typography>

                {caption && (
                  <>
                    <Box sx={{ width: `var(--rabbi-card-rule-w)`, height: '1px', bgcolor: 'var(--gold-button-border)', my: '14px' }} />
                    <Typography sx={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--t2)',
                      lineHeight: 1.6,
                      color: 'var(--muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>{caption}</Typography>
                  </>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <IconButton
        aria-label="הבא"
        disabled={!sagesCarousel.canNext}
        onClick={() => sagesCarousel.scrollPage('next')}
        sx={carouselArrowSx}
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </IconButton>
    </Box>

    {/* פס התקדמות — מראה איפה בקרוסלה אנחנו */}
    <CarouselProgress progress={sagesCarousel.progress} onSeek={sagesCarousel.seek} />
  </Box>
</Box>

{/* --- החזקת התורה + מכתב "עץ חיים היא למחזיקים בה" ---
    מידות מ-donationSection ב-tokens.ts (נמדד מ-ateret-mordechai-design.pdf עמ' 1).
    הסרטון תופס את מקום שורת "נוסח המכתב המלא". */}
<Box sx={{
  width: '100%',
  boxSizing: 'border-box',
  background: `linear-gradient(180deg, var(--section-bg) 0%, var(--surface) 18%)`,
  borderTop: `1px solid var(--gold)`,
  direction: 'rtl',
  py: { xs: '48px', md: `var(--donation-section-pad-y)` },
  px: { xs: '16px', md: '24px' },
}}>
  <Box sx={{
    maxWidth: 'var(--donation-section-max-width)',
    mx: 'auto',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'stretch',
    /* מלבן אחד גדול: מסגרת זהב ופינות פעם אחת, והיין והבהיר מתחלקים בתוכו */
    border: `1px solid var(--gold)`,
    borderRadius: `var(--donation-section-radius)`,
    overflow: 'hidden',
  }}>
    {/* החלק היין */}
    <Box sx={{
      flexShrink: 0,
      width: { xs: '100%', md: 'var(--donation-section-card-wine-width)' },
      boxSizing: 'border-box',
      bgcolor: 'var(--wine)',
      p: { xs: '32px 24px', md: `var(--donation-section-wine-pad)` },
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    }}>
      <Typography sx={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--donation-section-wine-eyebrow-size)',
        fontWeight: 700,
        letterSpacing: 'var(--donation-section-wine-eyebrow-letter-spacing)',
        color: 'var(--gold)',
        mb: `var(--s3)`,
      }}>שותפות נצח</Typography>

      <Typography component="h2" sx={{
        fontFamily: 'var(--font-heading-ornate)',
        fontSize: 'var(--donation-section-wine-title-size)',
        fontWeight: 400,
        lineHeight: 1.2,
        background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
      }}>החזקת התורה</Typography>

      <Typography sx={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--donation-section-wine-subtitle-size)',
        color: 'var(--gold-light)',
        mt: `var(--s4)`,
      }}>בחרו סכום, או קבעו הוראת קבע חודשית</Typography>

      <Box sx={{ flexGrow: 1, minHeight: `var(--s5)` }} />

      <AppButton onClick={() => navigate('/DonateLetter')} sx={{ width: '100%' }}>
        אני רוצה להיות שותף
      </AppButton>
    </Box>

    {/* החלק הבהיר — המכתב */}
    <Box sx={{
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      bgcolor: 'var(--surface)',
      p: `var(--donation-section-letter-inner-inset)`,
    }}>
      <Box sx={{
        height: '100%',
        boxSizing: 'border-box',
        border: `1px solid color-mix(in srgb, var(--gold) 34.902%, transparent)`,
        borderRadius: `var(--donation-section-letter-inner-radius)`,
        p: { xs: '24px 16px', md: 'var(--donation-section-letter-pad)' },
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '48px' } }}>
          <SectionArch mb="16px" />
          <Typography component="h2" sx={{
            fontFamily: 'var(--font-heading-ornate)',
            fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
            fontWeight: 400,
            lineHeight: 1.2,
            textAlign: 'center',
            color: 'var(--wine)',
          }}>עץ חיים היא למחזיקים בה</Typography>
          <SectionFlourish mt="24px" />
        </Box>

        <Typography sx={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--donation-section-letter-text-size)',
          lineHeight: 'var(--donation-section-letter-text-line-height)',
          color: 'var(--body)',
        }}>
          בזכות לימוד קדוש זה נזכה לקרב את הגאולה ולאוקמא שכינתא מעפרא. פונים אנו בבקשה קדושה לכל מי שיכול להרים תרומה, קטנה או גדולה, להמשך תורת הקבלה בעולם כולו.
        </Typography>

        {/* הסרטון — במקום "נוסח המכתב המלא" */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: `var(--s3)` }}>
          <Box sx={{
            width: '100%',
            maxWidth: 'var(--donation-section-video-max-width)',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: `var(--donation-section-video-radius)`,
            border: `1px solid var(--gold)`,
            bgcolor: 'var(--ink)',
          }}>
            <LazyYouTube youtubeId="7YVDVwYOM3E" thumbnail="/video-poster.jpg" caption="דברי ראש הישיבה" />
          </Box>
        </Box>

        <Box sx={{ borderTop: `1px solid var(--rule-soft)`, pt: `var(--s2)`, display: 'flex', alignItems: 'baseline', gap: `var(--s2)` }}>
          <Typography sx={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--donation-section-letter-name-size)',
            fontWeight: 400,
            color: 'var(--ink-wine)',
          }}>הרב מרדכי עטייה שליט״א</Typography>
          <Typography sx={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--donation-section-letter-role-size)',
            color: 'var(--muted)',
          }}>· ראש הישיבה</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
</Box>

    </Box>
  );
};

export default Home;
