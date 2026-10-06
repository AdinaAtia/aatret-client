import React, { useRef,useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { colors, fonts, fontSize, gradients, goldTextFill, rabbiCard, radius, weeklyBar } from '../src/theme/tokens';

import Grid from '@mui/material/Grid';
import LecturesGrid from './LecturesGrid';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import HeroVideo from './HeroVideo';
import LessonPlayer from './LessonPlayer'; // ייבוא הנגן
import BooksCarousel from './BooksCarousel'; // ודאי שהנתיב לקובץ נכון
import { Crown } from './Header';
import founderContent from './founderContent.json';
import weeklyLesson from './weeklyLesson.json';
import donationLetterContent from './donationLetterContent.json';

const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;

// --- 1. הגדרות רוחב וצבעים ---

interface LetterSegment {
  text: string;
  bold?: boolean;
  link?: string;
}
interface LetterParagraph {
  segments: LetterSegment[];
  sx?: Record<string, unknown>;
}

const donationLetterParagraphs: LetterParagraph[] = donationLetterContent.paragraphs as LetterParagraph[];

const donationLetterPlainText = donationLetterParagraphs
  .map((p) => p.segments.map((s) => s.text).join(''))
  .join('\n\n');

const CLOSING_START = 10;
const mainLetterLen = donationLetterParagraphs
  .slice(0, CLOSING_START)
  .reduce((acc, p) => acc + p.segments.map((s) => s.text).join('').length + 2, 0);

function renderClosingParagraphs(maxLen: number) {
  let consumed = 0;
  const nodes: React.ReactNode[] = [];
  for (let p = CLOSING_START; p < donationLetterParagraphs.length; p++) {
    if (consumed >= maxLen) break;
    const para = donationLetterParagraphs[p];
    const paraText = para.segments.map((s) => s.text).join('');
    const remaining = maxLen - consumed;
    const revealLen = Math.min(remaining, paraText.length);
    let segConsumed = 0;
    const segNodes: React.ReactNode[] = [];
    for (let s = 0; s < para.segments.length; s++) {
      if (segConsumed >= revealLen) break;
      const seg = para.segments[s];
      const segText = seg.text.length <= revealLen - segConsumed ? seg.text : seg.text.slice(0, revealLen - segConsumed);
      segNodes.push(seg.bold || seg.link ? (
        <Box key={s} component={seg.link ? 'a' : 'span'} href={seg.link} sx={{ fontWeight: 800, color: seg.link ? '#c5a059' : undefined }}>{segText}</Box>
      ) : segText);
      segConsumed += seg.text.length;
    }
    nodes.push(<Typography component="p" key={p} sx={{ mb: 0.08, fontFamily: "'Yetzira-Regular', sans-serif !important", ...(para.sx || {}) }}>{segNodes}</Typography>);
    consumed += paraText.length + 2;
    if (revealLen < paraText.length) break;
  }
  return nodes;
}

const rabbiVideos = [
  { youtubeId: 'FWJGuXlBQ88', name: 'הראשון לציון הרב מרדכי אליהו זצ"ל', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'elWVs7nSbCs', name: 'המקובל הרב דוד שלום שליט"א ראש ישיבת השלום', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
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

function renderDonationLetterUpTo(maxLen: number) {
  let consumed = 0;
  const nodes: React.ReactNode[] = [];
  for (let p = 0; p < donationLetterParagraphs.length; p++) {
    if (consumed >= maxLen) break;
    const para = donationLetterParagraphs[p];
    const paraText = para.segments.map((s) => s.text).join('');
    const remaining = maxLen - consumed;
    const revealLen = Math.min(remaining, paraText.length);

    let segConsumed = 0;
    const segNodes: React.ReactNode[] = [];
    for (let s = 0; s < para.segments.length; s++) {
      if (segConsumed >= revealLen) break;
      const seg = para.segments[s];
      const segRemaining = revealLen - segConsumed;
      const segText = seg.text.length <= segRemaining ? seg.text : seg.text.slice(0, segRemaining);
      segNodes.push(
        seg.bold || seg.link ? (
          <Box
            key={s}
            component={seg.link ? 'a' : 'span'}
            href={seg.link}
            sx={{ fontWeight: 800, color: seg.link ? '#c5a059' : undefined }}
          >
            {segText}
          </Box>
        ) : (
          segText
        )
      );
      segConsumed += seg.text.length;
    }

    nodes.push(
      <Typography component="p" key={p} sx={{ mb: 0.08, fontFamily: "'Yetzira-Regular', sans-serif !important", ...(para.sx || {}) }}>
        {segNodes}
      </Typography>
    );

    consumed += paraText.length + 2; // +2 = מפריד הפסקאות (\n\n)
    if (revealLen < paraText.length) break;
  }
  return nodes;
}

function LazyYouTube({ youtubeId, thumbnail }: { youtubeId: string; thumbnail?: string }) {
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
      <Box
        component="img"
        src={thumbnail || `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
        alt=""
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 48, height: 48,
        bgcolor: 'rgba(0,0,0,0.75)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '1.3rem',
        pointerEvents: 'none',
      }}>
        ▶
      </Box>
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

  const [videoHeight, setVideoHeight] = useState<string>('100vh');
  const [rabbiCardsData, setRabbiCardsData] = useState<any[]>([]);
  const [rabbiLatestLessons, setRabbiLatestLessons] = useState<Record<number, any>>({});
  const rabbisInRow = rabbiCardsData.filter((r) => !r.name.includes('מרדכי עטי'));
  const rabbiVideosScrollRef = useRef<HTMLDivElement>(null);
  const [donationLetterTypedLength, setDonationLetterTypedLength] = useState(0);
  const donationLetterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const letterContainerRef = useRef<HTMLDivElement>(null);
  const letterMeasureRef = useRef<HTMLDivElement>(null);
  const [letterFontSize, setLetterFontSize] = useState<number>(8.8);

  useLayoutEffect(() => {
    const container = letterContainerRef.current;
    const measure = letterMeasureRef.current;
    if (!container || !measure) return;

    const fitFontSize = () => {
      const maxFontSize = window.innerWidth >= 900 ? 12 : 10;
      const minFontSize = 4.5;
      let fontSize = maxFontSize;
      measure.style.fontSize = `${fontSize}px`;
      while (measure.scrollHeight > container.clientHeight && fontSize > minFontSize) {
        fontSize -= 0.2;
        measure.style.fontSize = `${fontSize}px`;
      }
      setLetterFontSize(fontSize);
    };

    fitFontSize();
    document.fonts?.ready?.then(fitFontSize).catch(() => {});
    window.addEventListener('resize', fitFontSize);
    return () => window.removeEventListener('resize', fitFontSize);
  }, []);

 useEffect(() => {
  const updateVideoHeight = () => {
    const headerEl = document.querySelector('[role="banner"]');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
    setVideoHeight(`calc(100vh - ${Math.round(headerHeight + 65)}px)`);
  };
  updateVideoHeight();
  window.addEventListener('resize', updateVideoHeight);
  return () => window.removeEventListener('resize', updateVideoHeight);
}, []);

 useEffect(() => {
  setDonationLetterTypedLength(0);
  let i = 0;
  donationLetterIntervalRef.current = setInterval(() => {
    if (i < donationLetterPlainText.length) {
      i++;
      setDonationLetterTypedLength(i);
    } else {
      clearInterval(donationLetterIntervalRef.current!);
    }
  }, 12);
  return () => clearInterval(donationLetterIntervalRef.current!);
}, []);

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
          const url = photo.url || photo.attributes?.url;
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
  bgcolor: colors.cream,
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
    background: `linear-gradient(180deg, ${colors.cream}D4 0%, ${colors.creamAlt}C4 45%, ${colors.sand}CC 100%)`,
  }} />

  {/* מסגרת הקשת — שני פסי זהב דקים מעל הסרטון */}
  <Box sx={{
    position: 'absolute',
    inset: { xs: '12px', md: '26px' },
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: radius.arch,
    border: `1px solid ${colors.goldDeep}A6`,
  }} />
  <Box sx={{
    position: 'absolute',
    inset: { xs: '19px', md: '36px' },
    zIndex: 2,
    pointerEvents: 'none',
    borderRadius: radius.arch,
    border: `1px solid ${colors.goldDeep}5C`,
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
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 3,
    px: 2,
  }}>
    {/* הכתר — אותה קומפוננטת Crown של ההאדר */}
    <Box sx={{
      mb: { xs: 1.5, md: 2 },
      '& svg': { width: { xs: '34px', md: '46px' }, height: 'auto' },
    }}>
      <Crown width={46} height={39} />
    </Box>

    <Typography sx={{
      fontFamily: fonts.heading,
      fontSize: { xs: '11px', md: fontSize.sm },
      fontWeight: 400,
      color: `${colors.wine}D9`,
      letterSpacing: { xs: '0.5em', md: '0.75em' },
      textIndent: { xs: '0.5em', md: '0.75em' },
      mb: { xs: 0.5, md: 1 },
    }}>
      ישיבת
    </Typography>

    <Typography sx={{
      fontFamily: fonts.headingOrnate,
      fontSize: 'clamp(2.75rem, 7.5vw, 6rem)',
      fontWeight: 400,
      color: colors.wine,
      lineHeight: 1.05,
      letterSpacing: '0.02em',
      textAlign: 'center',
    }}>
      עטרת מרדכי
    </Typography>

    {/* קו מפריד עם מעוינים */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: { xs: 2, md: 2.5 } }}>
      <Box sx={{ width: { xs: '55px', md: '105px' }, height: '1px', background: `linear-gradient(90deg, transparent 0%, ${colors.goldDeep} 100%)` }} />
      <Box sx={{ width: '5px', height: '5px', transform: 'rotate(45deg)', bgcolor: colors.gold }} />
      <Box sx={{ width: '4px', height: '4px', transform: 'rotate(45deg)', bgcolor: colors.goldDeep, opacity: 0.6 }} />
      <Box sx={{ width: '5px', height: '5px', transform: 'rotate(45deg)', bgcolor: colors.gold }} />
      <Box sx={{ width: { xs: '55px', md: '105px' }, height: '1px', background: `linear-gradient(90deg, ${colors.goldDeep} 0%, transparent 100%)` }} />
    </Box>

    <Typography sx={{
      fontFamily: fonts.heading,
      fontSize: { xs: fontSize.md, md: fontSize.lg },
      fontWeight: 400,
      color: colors.wine,
      lineHeight: 1.5,
      letterSpacing: '0.03em',
    }}>
      ישיבה ללימוד קבלה
    </Typography>

    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: { xs: fontSize.xs, md: fontSize.sm },
      fontWeight: 400,
      color: `${colors.wine}B8`,
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
      <Button
        onClick={() => navigate('/About')}
        sx={{
          fontFamily: fonts.body,
          fontSize: fontSize.md,
          fontWeight: 500,
          py: 1.3,
          px: { xs: 4, md: 5.5 },
          whiteSpace: 'nowrap',
          borderRadius: radius.sm,
          color: colors.wine,
          background: gradients.gold,
          border: `1px solid ${colors.goldDeep}`,
          boxShadow: '0 4px 12px rgba(138,101,34,0.28)',
          '&:hover': { background: gradients.gold, filter: 'brightness(1.07)' },
          transition: '0.3s',
        }}
      >
        אודות הישיבה
      </Button>

      <Button
        onClick={() => navigate('/AllLessons')}
        sx={{
          fontFamily: fonts.body,
          fontSize: fontSize.md,
          fontWeight: 500,
          py: 1.3,
          px: { xs: 4, md: 5.5 },
          whiteSpace: 'nowrap',
          borderRadius: radius.sm,
          color: colors.wine,
          backgroundColor: `${colors.cream}8C`,
          border: `1px solid ${colors.goldDeep}`,
          '&:hover': { backgroundColor: `${colors.cream}D9` },
          transition: '0.3s',
        }}
      >
        ארכיון השיעורים
      </Button>
    </Box>
  </Box>
</Box>
 {/* <LatestLessonCard onLessonSelect={(lesson) => setSelectedLesson(lesson)} /> */}
  </Box>

{/* --- פס השיעור השבועי ---
    כל המידות נמדדו מקובץ העיצוב ואומתו מול צילום המסך. ראה weeklyBar ב-tokens.ts.
    דסקטופ: שורה אחת ממורכזת, gap 40px, גובה 103px.
    נייד: עמודה מיושרת לימין, גובה 234px, בלי המפרידים האנכיים. */}
<Box sx={{
  width: '100%',
  boxSizing: 'border-box',
  bgcolor: weeklyBar.bg,
  borderTop: `${weeklyBar.ruleWidth}px solid ${weeklyBar.rule}`,
  borderBottom: `${weeklyBar.ruleWidth}px solid ${weeklyBar.rule}`,
  height: { xs: 'auto', lg: `${weeklyBar.height.desktop}px` },
  minHeight: { xs: `${weeklyBar.height.mobile}px`, md: 'unset' },
  py: { xs: 0, md: 2, lg: 0 },
  px: { xs: '20px', md: 3 },
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'center',
  direction: 'rtl',
  gap: { xs: 0, md: '20px', lg: `${weeklyBar.gap}px` },
}}>
  {/* ימין: מעוין + כותרת הפס */}
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: `${weeklyBar.diamond.gap}px`,
    mt: { xs: '30px', md: 0 },
  }}>
    {/* המעוין — ריבוע מסובב, 13px באלכסון (מדויק יותר מתו גופן) */}
    <Box sx={{
      width: weeklyBar.diamond.diagonal / Math.SQRT2,
      height: weeklyBar.diamond.diagonal / Math.SQRT2,
      bgcolor: weeklyBar.title.color,
      transform: 'rotate(45deg)',
      flexShrink: 0,
    }} />
    <Typography sx={{
      fontFamily: fonts.heading,
      fontSize: { xs: `${weeklyBar.title.mobile}px`, lg: `${weeklyBar.title.desktop}px` },
      fontWeight: 700,
      color: weeklyBar.title.color,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    }}>{weeklyLesson.title}</Typography>
  </Box>

  <Box sx={{
    display: { xs: 'none', md: 'block' },
    width: `${weeklyBar.divider.w}px`,
    height: `${weeklyBar.divider.h}px`,
    bgcolor: weeklyBar.rule,
    flexShrink: 0,
  }} />

  {/* אמצע: יום ושעה + הכתובית — מיושר לימין, לא למרכז */}
  <Box sx={{ textAlign: 'right', mt: { xs: '22px', md: 0 } }}>
    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: `${weeklyBar.time.size}px`,
      fontWeight: 700,
      color: weeklyBar.time.color,
      lineHeight: `${weeklyBar.timeLineHeight}px`,
      whiteSpace: 'nowrap',
    }}>{weeklyLesson.day} · {weeklyLesson.time}</Typography>
    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: `${weeklyBar.subtitle.size}px`,
      color: weeklyBar.subtitle.color,
      lineHeight: 1.5,
    }}>{weeklyLesson.subtitle}</Typography>
  </Box>

  <Box sx={{
    display: { xs: 'none', md: 'block' },
    width: `${weeklyBar.divider.w}px`,
    height: `${weeklyBar.divider.h}px`,
    bgcolor: weeklyBar.rule,
    flexShrink: 0,
  }} />

  {/* מיקום — האייקון מימין לטקסט */}
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: '8px',
    mt: { xs: '10px', md: 0 },
  }}>
    <PlaceOutlinedIcon sx={{ fontSize: weeklyBar.pin.size, color: weeklyBar.pin.color, flexShrink: 0 }} />
    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: { xs: `${weeklyBar.place.mobile}px`, lg: `${weeklyBar.place.desktop}px` },
      color: { xs: weeklyBar.subtitle.color, lg: weeklyBar.place.color },
      lineHeight: 1.5,
    }}>{weeklyLesson.location} · {weeklyLesson.address}</Typography>
  </Box>

  {/* שמאל: כפתור — מסגרת בלבד. הטקסט והניווט ללא שינוי. */}
  <Button
    onClick={() => {
      const roshHayeshiva = rabbiCardsData.find((r) => r.name.includes('מרדכי עטי'));
      navigate('/AllLessons', { state: { rabbiId: roshHayeshiva?.id } });
    }}
    sx={{
      alignSelf: { xs: 'center', md: 'auto' },
      mt: { xs: '26px', md: 0 },
      height: `${weeklyBar.button.h}px`,
      px: `${weeklyBar.button.px}px`,
      backgroundColor: 'transparent',
      color: weeklyBar.title.color,
      border: `1px solid ${weeklyBar.button.border}`,
      borderRadius: `${weeklyBar.button.radius}px`,
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: `${weeklyBar.button.size}px`,
      whiteSpace: 'nowrap',
      boxShadow: 'none',
      flexShrink: 0,
      '&:hover': { bgcolor: `${colors.gold}26`, borderColor: weeklyBar.button.border, boxShadow: 'none' },
      transition: '0.2s',
    }}
  >{weeklyLesson.buttonText}</Button>
</Box>

 <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} />

<Box sx={{ width: '100%', bgcolor: '#c5a059', height: '2px' }} />

{/* --- אזור ראש הישיבה --- */}
{/* עיצוב לפי ateret-mordechai-design.pdf · נמדד מצילום העיצוב:
    רקע #F0E9D2 · קווי זהב 1px · גובה 650px · קשת 387x512 · תמונה 361x482 · רווח 14px */}
<Box sx={{
  width: '100%',
  boxSizing: 'border-box',
  bgcolor: colors.sectionBg,
  borderTop: `1px solid ${colors.gold}`,
  borderBottom: `1px solid ${colors.gold}`,
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
    border: `1px solid ${colors.gold}`,
    borderRadius: { xs: '129px 129px 6px 6px', sm: '155px 155px 6px 6px', md: '170px 170px 8px 8px', lg: '193px 193px 8px 8px' },
    p: { xs: '9px', sm: '11px', lg: '13px' },
  }}>
    {/* מילוי הקשת — זהב אחיד מאחורי הדמות. נמדד #C5A258 */}
    <Box sx={{
      width: '100%',
      height: '100%',
      bgcolor: colors.gold,
      overflow: 'hidden',
      borderRadius: { xs: '120px 120px 4px 4px', sm: '144px 144px 4px 4px', md: '159px 159px 4px 4px', lg: '180px 180px 4px 4px' },
    }}>
      <Box
        component="img"
        loading="lazy"
        decoding="async"
        src={`${MEDIA_BASE_URL}/דד (1) (1).png`}
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
    maxWidth: 560,
  }}>
    {/* כותרת־על */}
    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: fontSize.xs,
      fontWeight: 500,
      letterSpacing: '0.35em',
      color: colors.goldDeep,
      mb: 2,
    }}>ראש הישיבה</Typography>

    {/* השם */}
    <Typography sx={{
      fontFamily: fonts.heading,
      fontSize: { xs: fontSize.xl, md: '34px', lg: fontSize.xxl },
      fontWeight: 400,
      lineHeight: 1.15,
      color: colors.wine,
    }}>הרב מרדכי עטייה</Typography>

    <Typography sx={{
      fontFamily: fonts.heading,
      fontSize: { xs: fontSize.md, md: fontSize.lg },
      fontWeight: 400,
      lineHeight: 1.4,
      color: `${colors.wine}A6`,
      mt: 0.5,
    }}>שליט״א</Typography>

    {/* קו מפריד עם מעוין — הרכיב המשותף */}
    <Box sx={{ width: '100%' }}>
      <SectionFlourish mt="8px" mb="24px" />
    </Box>

    {/* טקסט תיאור */}
    <Typography sx={{
      fontFamily: fonts.body,
      fontSize: { xs: fontSize.sm, md: fontSize.md },
      lineHeight: 2,
      color: `${colors.ink}E0`,
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
      <Button
        onClick={() => {
          const roshHayeshiva = rabbiCardsData.find((r) => r.name.includes('מרדכי עטי'));
          navigate('/AllLessons', { state: { rabbiId: roshHayeshiva?.id } });
        }}
        sx={{
          background: gradients.goldButton,
          color: colors.wine,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: fontSize.sm,
          borderRadius: radius.control,
          width: { xs: '100%', sm: 201 },
          height: 51,
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': { background: gradients.goldButton, filter: 'brightness(1.06)', boxShadow: 'none' },
          transition: '0.2s',
        }}
      >לשיעורי ראש הישיבה</Button>

      <Button
        onClick={() => navigate('/About')}
        sx={{
          backgroundColor: 'transparent',
          color: colors.wine,
          border: `1px solid ${colors.gold}`,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: fontSize.sm,
          borderRadius: radius.control,
          width: { xs: '100%', sm: 165 },
          height: 51,
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': { bgcolor: `${colors.gold}26`, borderColor: colors.goldDeep, boxShadow: 'none' },
          transition: '0.2s',
        }}
      >אודות הישיבה</Button>
    </Box>
  </Box>
</Box>

      {/* --- רבני הישיבה --- */}
      <Box id="rabbis-section" sx={{ width: '100%', bgcolor: colors.creamAlt, py: { xs: '48px', md: '80px' }, direction: 'rtl', scrollMarginTop: '80px' }}>
        <Box sx={{
          width: '100%',
          maxWidth: `${Math.min(rabbiCard.width * Math.max(rabbisInRow.length, 5) + rabbiCard.gap * (Math.max(rabbisInRow.length, 5) - 1) + 48, 1440)}px`,
          mx: 'auto',
          px: { xs: '16px', md: '24px' },
          boxSizing: 'border-box',
        }}>

          {/* כותרת הקטע */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '40px' } }}>
            <SectionArch mb="16px" />

            <Typography sx={{
              fontFamily: fonts.headingOrnate,
              fontSize: { xs: fontSize.xl, md: fontSize.xxl },
              fontWeight: 400,
              lineHeight: 1.2,
              color: rabbiCard.heading.color,
            }}>
              רבני הישיבה
            </Typography>

            <SectionFlourish mt="24px" />
          </Box>

          {/* כל הכרטיסים בשורה אחת: בדסקטופ עמודה לכל כרטיס, בנייד גלילה אופקית */}
          <Box sx={{
            display: { xs: 'flex', md: 'grid' },
            gridTemplateColumns: { md: `repeat(${Math.max(rabbisInRow.length, 1)}, minmax(0, 1fr))` },
            gap: { xs: '16px', md: `${rabbiCard.gap}px` },
            overflowX: { xs: 'auto', md: 'visible' },
            scrollSnapType: { xs: 'x proximity', md: 'none' },
            pb: { xs: '12px', md: 0 },
            mx: { xs: '-16px', md: 0 },
            px: { xs: '16px', md: 0 },
            '& > *': { flex: { xs: '0 0 200px', md: 'initial' }, scrollSnapAlign: 'start' },
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
                    transition: 'transform 0.25s ease, filter 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      filter: `drop-shadow(0 10px 20px ${colors.wine}26)`,
                    },
                  }}
                >
                  {/* הכרטיס: מסגרת 1px זהב, פינות מעוגלות 12px */}
                  <Box sx={{
                    height: '100%',
                    border: `1px solid ${rabbiCard.border}`,
                    borderRadius: `${rabbiCard.radius}px`,
                    bgcolor: rabbiCard.bg,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* קשת ארון הקודש — ריבוע בעיצוב, ולכן aspect-ratio 1 */}
                    <Box sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      flexShrink: 0,
                      bgcolor: rabbiCard.arch.fill,
                      borderRadius: radius.arch,
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
                        <Crown width={rabbiCard.crown.w} height={rabbiCard.crown.h} />
                      )}
                    </Box>

                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      pt: `${rabbiCard.pad.top}px`,
                      px: '12px',
                      pb: `${rabbiCard.pad.bottom}px`,
                    }}>
                      <Typography sx={{
                        fontFamily: fonts.heading,
                        fontSize: `${rabbiCard.name.size}px`,
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: rabbiCard.name.color,
                      }}>
                        {rabbi.name}
                      </Typography>

                      <Box sx={{
                        width: `${rabbiCard.rule.w}px`,
                        height: `${rabbiCard.rule.h}px`,
                        bgcolor: rabbiCard.rule.color,
                        mt: `${rabbiCard.pad.ruleTop}px`,
                      }} />

                      <Box sx={{ flexGrow: 1, minHeight: `${rabbiCard.pad.ruleBottom}px` }} />

                      {/* הכפתור: מסגרת 1px זהב ללא מילוי, רדיוס 6px */}
                      <Button
                        disableRipple
                        onClick={(e) => { e.stopPropagation(); navigate('/AllLessons', { state: { rabbiId: rabbi.id } }); }}
                        sx={{
                          width: `${rabbiCard.button.w}px`,
                          maxWidth: '100%',
                          height: `${rabbiCard.button.h}px`,
                          flexShrink: 0,
                          minWidth: 0,
                          p: 0,
                          boxSizing: 'border-box',
                          border: `1px solid ${rabbiCard.button.border}`,
                          borderRadius: `${rabbiCard.button.radius}px`,
                          bgcolor: 'transparent',
                          fontFamily: fonts.body,
                          fontSize: `${rabbiCard.button.size}px`,
                          fontWeight: 500,
                          color: rabbiCard.button.color,
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: rabbiCard.arch.fill },
                        }}
                      >
                        לשיעורי הרב
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

<Box sx={{ my: { xs: 8, md: 15 } }} />

      {/* <LecturesGrid onLessonSelect={(lesson) => setSelectedLesson(lesson)} /> */}

      {/* <Box sx={{ my: { xs: 4, md: 7.5 } }} /> */}
      <BooksCarousel />
     <Box sx={{ my: { xs: 4, md: 7.5 } }} />

{/* --- רבנים מדברים על הישיבה --- */}
<Box sx={{
  width: '100%',
  background: gradients.wine,
  py: { xs: 6, md: 10 },
  direction: 'rtl',
}}>
  <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 2, md: 4, lg: 7 } }}>

    {/* כותרת הקטע */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 4, md: 5 } }}>
      <Typography sx={{
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        fontWeight: 600,
        letterSpacing: '0.3em',
        color: colors.gold,
        mb: 1,
      }}>
        דברי הרבנים
      </Typography>

      <Typography sx={{
        fontFamily: fonts.headingOrnate,
        fontSize: { xs: fontSize.xl, md: fontSize.xxl },
        fontWeight: 400,
        lineHeight: 1.25,
        letterSpacing: '0.02em',
        textAlign: 'center',
        background: gradients.goldHorizontal,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}>
        דברי גדולי ישראל על הישיבה
      </Typography>

      <SectionFlourish mt={1.5} />
    </Box>

    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
      <IconButton
        onClick={() => rabbiVideosScrollRef.current?.scrollBy({ left: rabbiVideosScrollRef.current.clientWidth * 0.8, behavior: 'smooth' })}
        sx={{
          width: '44px',
          height: '44px',
          flexShrink: 0,
          zIndex: 2,
          color: colors.gold,
          border: `1px solid ${colors.gold}`,
          borderRadius: radius.pill,
          backgroundColor: 'transparent',
          transition: 'background-color 0.25s ease',
          '&:hover': { backgroundColor: `${colors.gold}26` },
        }}
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </IconButton>

      <Box
        ref={rabbiVideosScrollRef}
        sx={{
          display: 'flex',
          flex: 1,
          gap: { xs: 1.5, md: 2 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          py: 1,
        }}
      >
        {rabbiVideos.map((v, i) => (
          <Box key={i} sx={{
            flexShrink: 0,
            width: {
              xs: 'calc(50% - 6px)',
              sm: 'calc(33.33% - 11px)',
              md: 'calc(25% - 12px)',
            },
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: colors.ink,
            border: `1px solid ${colors.goldDeep}59`,
            borderRadius: radius.lg,
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.45)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              borderColor: colors.gold,
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            },
          }}>
            {/* התמונה בתוך מסגרת זהב */}
            <Box sx={{ p: '8px', pb: 0 }}>
              <Box sx={{
                width: '100%',
                aspectRatio: '16/9',
                overflow: 'hidden',
                borderRadius: radius.control,
                border: `1.5px solid ${colors.gold}`,
                bgcolor: colors.wine,
              }}>
                <LazyYouTube youtubeId={v.youtubeId} thumbnail={(v as any).thumbnail} />
              </Box>
            </Box>

            <Box sx={{
              px: { xs: 1.5, md: 2 },
              pt: 1.5,
              pb: 2.5,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <Typography sx={{
                fontFamily: fonts.heading,
                fontSize: { xs: fontSize.sm, md: fontSize.md },
                fontWeight: 400,
                lineHeight: 1.4,
                color: colors.sand,
              }}>{v.name}</Typography>

              {v.date && (
                <>
                  <Box sx={{ width: '40px', height: '1px', bgcolor: colors.gold, my: '10px' }} />
                  <Typography sx={{
                    fontFamily: fonts.body,
                    fontSize: fontSize.xs,
                    lineHeight: 1.6,
                    color: `${colors.gold}B3`,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{v.date}</Typography>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={() => rabbiVideosScrollRef.current?.scrollBy({ left: -rabbiVideosScrollRef.current.clientWidth * 0.8, behavior: 'smooth' })}
        sx={{
          width: '44px',
          height: '44px',
          flexShrink: 0,
          zIndex: 2,
          color: colors.gold,
          border: `1px solid ${colors.gold}`,
          borderRadius: radius.pill,
          backgroundColor: 'transparent',
          transition: 'background-color 0.25s ease',
          '&:hover': { backgroundColor: `${colors.gold}26` },
        }}
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </IconButton>
    </Box>
  </Box>
</Box>

    </Box>
  );
};

export default Home;
