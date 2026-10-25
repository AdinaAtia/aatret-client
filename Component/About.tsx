import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayBadge from './shared/PlayBadge';
import LessonThumb, { youtubeThumbSources } from './shared/LessonThumb';
import founderContent from './founderContent.json';
import kdoshimContent from './לקדושים אשר בארץ.json';
import HeroVideo from './HeroVideo';
import { useVideoPlayback, VideoToggleButton } from './VideoToggle';
import { Crown } from './Header';
import AppButton from './shared/AppButton';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import { cardHoverSx } from './shared/cardHover';
import mahaImg1 from '../src/assets/about/maha-1.webp';
import mahaImg2 from '../src/assets/about/maha-2.webp';
import mahaImg3 from '../src/assets/about/maha-3.webp';
import mahaImg4 from '../src/assets/about/maha-4.webp';
import mahaImg5 from '../src/assets/about/maha-5.webp';
import { cssNumber } from '../src/styles/cssVar';

const GOLD = 'var(--gold)';
const DARK = 'var(--ink)';
const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;
const ARCH = '50% 50% 0 0 / 34% 34% 0 0';
// נמדד מ-ateret-mordechai-about.pdf: כפתורי כרטיס המייסד

// ביוגרפיית המייסד: הפסקה השנייה מתחילה ב"אליהו חצני הלוי…"
const founderFull: string = kdoshimContent.text;
const SPLIT_MARK = 'אליהו חצני הלוי';
const splitAt = founderFull.indexOf(SPLIT_MARK);
const founderFirst = founderFull.slice(0, splitAt).trim();
const founderSecond = founderFull.slice(splitAt).trim();

const FOUNDER_ARCH_W = { xs: 230, md: 240, lg: 320 };
const FOUNDER_ARCH_H ={ xs: 304, md: 470, lg: 460 };

const LOCAL_THUMB_MORGENSTERN = `${MEDIA_BASE_URL}/צילום מסך 2026-06-22 110957.png`;

const allVideos = [
  { youtubeId: 'FWJGuXlBQ88', name: 'הראשון לציון הרב מרדכי אליהו זצ"ל', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'elWVs7nSbCs', name: 'המקובל הרב דוד שלום זצ"ל ראש ישיבת השלום', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: '1-aGtlCP4Kk', name: 'הראשון לציון הרב דוד יוסף שליט"א', date: 'הילולת הרש"ש י\' שבט תשפ"ה ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { youtubeId: '-Wd4It5Ap_k', name: 'הרב בן ציון מוצפי שליט״א', date: '' },
  { youtubeId: 'Y-nZHTds7Tw', name: 'הרב יצחק מאיר מורגנשטרן שליט"א', thumbnail: LOCAL_THUMB_MORGENSTERN, date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'QV2Bgb3L7Ug', name: 'הרב אליהו מנצור שליט״א רב קהילת אדמונד ג\'. ספרא (EDMOND J. SAFRA)', date: '' },
  { youtubeId: '2zOk_8o2J-I', name: 'רבה של ירושלים הרב שלום משאש זצ"ל', date: '2026' },
  { youtubeId: 'jmjeweAHdxs', name: 'הרב בניהו שמואלי שליט"א', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'BsKWj2CjOYA', name: 'הרב בניהו שמואלי שליט"א', date: '2026' },
  { youtubeId: 'yH6uFOh7Wgc', name: 'ביקור ראש הישיבה אצל הרבי מחב"ד', date: '1989' },
  { youtubeId: 'DXDKQXaw_lM', name: 'הילולת הרש"ש י\' שבט תשפ"ה', date: 'ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { youtubeId: '8kWZWx7W010', name: 'תדמית הישיבה', date: '2026' },
];

type Video = (typeof allVideos)[number] & { thumbnail?: string };

const testimonyVideos = allVideos.slice(0, 3);
const carouselVideos = allVideos.slice(3);
const mahaVideos = allVideos.slice(0, 5);

// תמונות מהנעשה בישיבה — מיובאות דרך הבילד (src/assets/about) ולא מנתיב יחסי של האפליקציה
const mahaNaaseImages = [mahaImg1, mahaImg2, mahaImg3, mahaImg4, mahaImg5];

const archImages: { src: string; label: string; sub?: string }[] = [
  { src: `${MEDIA_BASE_URL}/חשוב מורגנשטין.webp`, label: 'הוצאת הספר עטרת מרדכי על פורים בביתו של כבוד קדושת האדמור מתולדות אהרן' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-14 125657 (1).webp`, label: 'הילולת הרש"ש י\' שבט תשפ"ה', sub: 'ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-26 102933 (1).png`, label: 'הרב אליהו מנצור שליט"א רב קהילת אדמונד ג\'. ספרא (EDMOND J. SAFRA)' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-26 131432 (1).png`, label: 'הרב שמעון אלוף רב קהילת אהבה ואחוה ברוקלין' },
];

/** תמונה ממוזערת מיוטיוב לפי מזהה: maxres → sd → hq (ל־hq יש פסים שחורים, לכן cover ב־16/9) */
const YtThumb = ({ video, alt = '', playSize }: { video: Video; alt?: string; playSize: number }) => (
  <LessonThumb
    src={video.thumbnail ? [video.thumbnail] : youtubeThumbSources(video.youtubeId)}
    alt={alt}
    playSize={playSize}
    sx={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
  />
);

const PlayMark = PlayBadge;

/** מירכאות מוזהבות: 54px לפי ה-PDF, בגופן הגוף (Heebo) ולא בגופן שלישי. open = פותחות */
const QuoteMark = ({ open = false }: { open?: boolean }) => (
  <Typography aria-hidden sx={{ fontFamily: 'var(--font-body)', fontSize: '60px', lineHeight: 0.7, textAlign: 'center', background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>{open ? '“' : '”'}</Typography>
);

/** כפתור סרטון עדין: מסגרת זהב דקה, עיגול נגן זהב כמו בשאר הסרטונים, ושם הרב */
const FounderVideoLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Box
    component="button" type="button" onClick={onClick} aria-label={`${label} — צפייה בסרטון`}
    sx={{
      all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', height: `var(--rabbi-card-button-h)`,
      display: 'flex', alignItems: 'center', gap: '12px', px: '12px', direction: 'rtl',
      border: `1px solid var(--gold)`, borderRadius: `var(--rabbi-card-button-radius)`,
      transition: 'background-color 0.2s ease', '&:hover': { bgcolor: 'var(--rabbi-card-arch-fill)' },
      '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
    }}
  >
    <Box sx={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
      <PlayMark size={28} />
    </Box>
    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 500, color: 'var(--gold-text)' }}>{label}</Typography>
  </Box>
);

/** כרטיס סרטון: תמונה ממוזערת, סמן נגן, וכיתוב (שם + שנה/שורת משנה) */
// נמדד מ-ateret-mordechai-about.pdf (דסקטופ 1440px): כרטיס סרטון במדור "מהנעשה והנשמע"
const MAHA_CARD = { radius: 10, border: 1, playSize: 40, titleSize: 14, titleLine: 18 };

const VideoCard = ({ video, onPlay, showDate = true, small = false, maha = false }: { video: Video; onPlay: () => void; showDate?: boolean; small?: boolean; maha?: boolean }) => {
  if (!maha) {
    return (
      <Box
        component="button"
        type="button"
        onClick={onPlay}
        aria-label={video.name}
        sx={{
          all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%',
          overflow: 'hidden', bgcolor: 'var(--video-card-bg)', borderRadius: `var(--video-card-radius)`,
          border: `1px solid var(--video-card-border)`, transition: 'border-color .25s, box-shadow .25s',
          '&:hover, &:focus-visible': { borderColor: 'var(--gold-light)', boxShadow: `inset 0 0 0 1px var(--gold-light)` },
          '&:hover .vc-caption, &:focus-visible .vc-caption': { bgcolor: 'var(--video-card-hover-bg)' },
          '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: `var(--video-card-radius)`, bgcolor: '#000' }}>
          <YtThumb video={video} alt={video.name} playSize={small ? 32 : cssNumber('--video-card-play-size')} />
        </Box>
        <Box
          className="vc-caption"
          sx={{
            direction: 'rtl', textAlign: small ? 'center' : 'right', px: '12px', py: small ? '10px' : '12px',
            minHeight: small ? 0 : 'var(--video-card-caption-min-height)', borderRadius: `0 0 var(--video-card-radius) var(--video-card-radius)`,
            transition: 'background-color .25s',
          }}
        >
          <Typography sx={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: { xs: '14px', md: '16px' }, lineHeight: { xs: 1.4, md: `var(--video-card-title-line)` }, color: 'var(--gold-light)' }}>{video.name}</Typography>
          {showDate && video.date && (
            <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '12px', md: '14px' }, color: 'var(--video-card-sub-color)', lineHeight: 1.5, mt: '4px' }}>{video.date}</Typography>
          )}
        </Box>
      </Box>
    );
  }
  return (
  <Box
    component="button"
    type="button"
    onClick={onPlay}
    aria-label={video.name}
    sx={{
      all: 'unset', boxSizing: 'border-box', cursor: 'pointer', position: 'relative', display: 'block',
      width: '100%', aspectRatio: '16/9', overflow: 'hidden',
      borderRadius: maha ? { xs: '6px', md: `${MAHA_CARD.radius}px` } : '6px',
      border: maha ? { xs: `1.5px solid ${GOLD}`, md: `${MAHA_CARD.border}px solid ${GOLD}` } : `1.5px solid ${GOLD}`,
      bgcolor: '#000',
      ...cardHoverSx,
      '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
    }}
  >
    <YtThumb video={video} alt={video.name} playSize={maha ? MAHA_CARD.playSize : small ? 32 : 44} />
    <Box sx={maha
      ? { position: 'absolute', bottom: 0, left: 0, right: 0, px: '12px', pt: '8px', pb: '9px', direction: 'rtl', textAlign: 'center', background: 'linear-gradient(to top, rgba(12,6,7,0.92), rgba(12,6,7,0.55))' }
      : { position: 'absolute', bottom: 0, left: 0, right: 0, px: 1, py: 0.6, direction: 'rtl', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(18,9,11,0.92) 55%)' }}>
      <Typography sx={maha
        ? { fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: `${MAHA_CARD.titleSize}px`, color: 'var(--gold-light)', lineHeight: `${MAHA_CARD.titleLine}px` }
        : { fontFamily: 'var(--font-heading)', fontSize: small ? { xs: '12px', md: '14px' } : { xs: '0.8rem', md: '15px' }, color: 'var(--gold-light)', lineHeight: 1.3 }}>{video.name}</Typography>
      {showDate && video.date && (
        <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '12px', md: '14px' }, color: 'rgba(235,213,154,0.75)', lineHeight: 1.3 }}>{video.date}</Typography>
      )}
    </Box>
  </Box>
  );
};

const goldNameSx = {
  fontFamily: 'var(--font-heading-ornate)',
  fontWeight: 400,
  lineHeight: 0.95,
  textAlign: 'center' as const,
  // צבע אחיד ולא גרדיאנט: השמות על רקע קלף, והגרדיאנט נותן 1.3–1.7:1 בחלקו העליון. זהב מטאלי רק על רקע כהה.
  color: 'var(--gold-text)',
};

/* מסגרת הקשת — זהה לזו של "ראש הישיבה" בדף הבית: מסגרת זהב 1px, ריפוד פנימי, מילוי זהב, וחצי עיגול למעלה */
type Resp = number | Record<string, number>;
const mapResp = (v: Resp, f: (n: number) => string): string | Record<string, string> =>
  typeof v === 'number' ? f(v) : Object.fromEntries(Object.entries(v).map(([k, n]) => [k, f(n)]));
const archPad = (w: number) => (w >= 380 ? 13 : w >= 330 ? 11 : 9);
// קשת לפי המוקאפ: אליפסה למעלה (רדיוס אנכי 34% מהגובה), פינות תחתונות ישרות
const archOuter = () => ARCH;
const archInner = () => ARCH;
const archFrameSx = (width: Resp) => ({
  width, flexShrink: 0, boxSizing: 'border-box' as const, position: 'relative' as const,
  border: `1px solid ${GOLD}`, borderRadius: mapResp(width, archOuter), p: mapResp(width, (w) => `${archPad(w)}px`),
});
const HOME_ARCH_W = { xs: 258, sm: 310, md: 340, lg: 387 };
const HOME_ARCH_H = { xs: 341, sm: 410, md: 450, lg: 512 };
// תמונת הגאון הרב אליהו עטייה זצ"ל — להכניס כאן את הנתיב כשהתמונה תתקבל
const ELIYAHU_IMG = '';

const ArchPortrait = ({ src, alt, width, height, grayscale = false, priority = false }: { src: string; alt: string; width: Resp; height: Resp; grayscale?: boolean; priority?: boolean }) => (
  <Box sx={{ ...archFrameSx(width), height }}>
    <Box sx={{ width: '100%', height: '100%', bgcolor: GOLD, overflow: 'hidden', borderRadius: mapResp(width, archInner) }}>
      <Box component="img" src={src} alt={alt} {...(priority ? { fetchPriority: 'high' } : {})}
        sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: grayscale ? 'grayscale(100%)' : 'none' }} />
    </Box>
  </Box>
);

const About = () => {
  const navigate = useNavigate();
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null);
  // הכרטיס בגודל קבוע; "קרא עוד" מחליף את הטקסט המוצג בקטע הבא (עמוד אחר עמוד), ובסוף חוזר להתחלה
  const [founderPos, setFounderPos] = useState(0);
  const [founderAtEnd, setFounderAtEnd] = useState(false);
  const founderTextRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const apply = () => {
      const el = founderTextRef.current;
      if (!el) return;
      el.scrollTop = founderPos;
      setFounderAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [founderPos]);
  const nextFounderPage = () => {
    const el = founderTextRef.current;
    if (!el) return;
    if (founderAtEnd) { setFounderPos(0); return; }
    const first = el.firstElementChild as HTMLElement | null;
    const lineH = first ? parseFloat(getComputedStyle(first).lineHeight) || 24 : 24;
    const step = Math.max(lineH, Math.floor(el.clientHeight / lineH) * lineH);
    setFounderPos(el.scrollTop + step);
  };
  const archVideo = useVideoPlayback();
  const play = (id: string) => setOpenVideoUrl(`https://www.youtube.com/embed/${id}?autoplay=1`);

  return (
    <>
      {/* ───────────── 1. הירו ───────────── */}
      <Box component="header" sx={{ position: 'relative', width: '100%', height: { xs: '80vh', md: '90vh' }, overflow: 'hidden', direction: 'rtl', bgcolor: 'var(--surface)' }}>
        <HeroVideo sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `linear-gradient(180deg, color-mix(in srgb, var(--surface) 83.137%, transparent) 0%, color-mix(in srgb, var(--parchment) 76.863%, transparent) 45%, color-mix(in srgb, var(--sand) 80%, transparent) 100%)` }} />
        <Box sx={{ position: 'absolute', inset: { xs: '12px', md: '26px' }, zIndex: 2, pointerEvents: 'none', borderRadius: 'var(--radius-arch)', border: `1px solid color-mix(in srgb, var(--gold-deep) 65.098%, transparent)` }} />
        <Box sx={{ position: 'absolute', inset: { xs: '19px', md: '36px' }, zIndex: 2, pointerEvents: 'none', borderRadius: 'var(--radius-arch)', border: `1px solid color-mix(in srgb, var(--gold-deep) 36.078%, transparent)` }} />

        <Box sx={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', pt: { xs: '14vh', md: '16vh' }, alignItems: 'center', textAlign: 'center', px: 2 }}>
          <Box sx={{ mb: { xs: 1.5, md: 2 }, '& svg': { width: { xs: '72px', md: '110px' }, height: 'auto' } }}>
            <Crown width={110} height={93} />
          </Box>
          <Typography component="h1" sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '30px', md: '60px' }, fontWeight: 400, color: 'var(--wine)', lineHeight: 1.15, m: 0 }}>
            ישיבת עטרת מרדכי
          </Typography>
          <SectionFlourish mt="18px" mb="0px" />
        </Box>

        <Box
          component="button"
          type="button"
          aria-label="גלילה לתוכן העמוד"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          sx={{
            all: 'unset', boxSizing: 'border-box', position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 3,
            cursor: 'pointer', textAlign: 'center', p: '6px 10px', borderRadius: 'var(--radius-sm)',
            '&:focus-visible': { outline: '2px solid var(--gold)', outlineOffset: 3 },
          }}
        >
          <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 400, color: 'var(--gold-deep)', letterSpacing: 1 }}>גלול למטה</Typography>
          <Box
            component="svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            sx={{
              display: 'block', mx: 'auto', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 }, color: 'var(--gold-deep)',
              animation: 'scrollHintBounce 1.6s ease-in-out infinite',
              '@keyframes scrollHintBounce': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(8px)' } },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            <path d="M5 4l7 7 7-7M5 11l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Box>
        </Box>
      </Box>

      {/* ───────────── 2. ביוגרפיית המייסד ───────────── */}
      <Box component="section" sx={{ bgcolor: 'var(--parchment)', py: { xs: 5, md: 9 }, px: { xs: 2, md: 6 }, direction: 'rtl' }}>
        <Box sx={{ maxWidth: 1180, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', gap: { xs: 4, md: 6 } }}>

          {/* כרטיס הקלף בצורת קשת */}
          <Box sx={{ width: FOUNDER_ARCH_W, flexShrink: 0, order: { xs: 2, md: 0 } }}>
            <Box sx={{
              bgcolor: 'var(--surface)', border: `1px solid ${GOLD}`, // רדיוס אנכי קבוע (34% מגובה הקשת הסגורה) — באחוזים הקשת הייתה מתארכת לחוד כשהכרטיס נפתח והטקסט יוצא מהמסגרת
              borderRadius: {
                xs: `50% 50% 0 0 / ${Math.round(FOUNDER_ARCH_H.xs * 0.34)}px ${Math.round(FOUNDER_ARCH_H.xs * 0.34)}px 0 0`,
                md: `50% 50% 0 0 / ${Math.round(FOUNDER_ARCH_H.md * 0.34)}px ${Math.round(FOUNDER_ARCH_H.md * 0.34)}px 0 0`,
                lg: `50% 50% 0 0 / ${Math.round(FOUNDER_ARCH_H.lg * 0.34)}px ${Math.round(FOUNDER_ARCH_H.lg * 0.34)}px 0 0`,
              },
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              // תמיד בגודל קשת התמונה בדיוק
              height: { xs: `${FOUNDER_ARCH_H.xs}px`, md: `${FOUNDER_ARCH_H.md}px`, lg: `${FOUNDER_ARCH_H.lg}px` },
              px: { xs: '26px', md: '20px', lg: '30px' }, pt: { xs: '70px', md: '60px', lg: '64px' }, pb: 3, direction: 'rtl', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              {/* הטקסט כולו קיים; אזור הקריאה מוגבל בגובה והכרטיס מתארך טיפה בכל לחיצה */}
              <Box ref={founderTextRef} sx={{
                width: '100%', direction: 'rtl', flex: 1, minHeight: 0, overflow: 'hidden',
                ...(founderAtEnd ? {} : {
                  maskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
                }),
              }}>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '14px', md: '12px', lg: '16px' }, lineHeight: { xs: 1.75, md: 1.6, lg: 1.95 }, color: 'var(--body)', textAlign: 'right', whiteSpace: 'pre-line' }}>
                  {founderFirst}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '14px', md: '12px', lg: '16px' }, lineHeight: { xs: 1.75, md: 1.6, lg: 1.95 }, color: 'var(--body)', textAlign: 'right', whiteSpace: 'pre-line', mt: 1 }}>
                  {founderSecond}
                </Typography>
              </Box>
              <AppButton
                variant="outline"
                onClick={nextFounderPage}
              >
                {founderAtEnd ? 'חזרה להתחלה' : 'קרא עוד'}
              </AppButton>
            </Box>
          </Box>

          {/* עמודת האמצע: שם המייסד במרכז, וקישורי הסרטונים למטה בקו תחתית הקשתות */}
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: { xs: 'center', md: 'stretch' }, justifyContent: 'space-between',
            gap: { xs: 4, md: 0 }, order: { xs: 0, md: 1 }, minWidth: { md: 0 },
          }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, height: 1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>הגאון המקובל רבי</Typography>
              <Typography component="h2" sx={{ ...goldNameSx, fontSize: { xs: '40px', md: '40px', lg: '60px' }, m: 0 }}>מרדכי עטיה</Typography>
              <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>זצ"ל</Typography>
            </Box>
            <Box sx={{ width: '100%', maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 400, color: 'var(--gold-text)', lineHeight: 1.2 }}>דברי הרבנים על הגאון</Typography>
              <Box sx={{ width: 34, height: '1px', bgcolor: 'var(--gold-button-border)', my: '10px' }} />
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FounderVideoLink label='לדברי הרב יצחק בן זכרי שליט"א' onClick={() => setOpenVideoUrl('https://www.youtube.com/embed/J0oyTQ12TRA?autoplay=1')} />
                <FounderVideoLink label='לדברי הרב יעקב הלל שליט"א' onClick={() => setOpenVideoUrl('https://www.youtube.com/embed/iGNYFMQXWzc?autoplay=1')} />
              </Box>
            </Box>
          </Box>

          {/* דיוקן בקשת */}
          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <ArchPortrait src={`${MEDIA_BASE_URL}/מייסד (2).webp`} alt="הגאון המקובל רבי מרדכי עטיה זצ״ל" width={FOUNDER_ARCH_W} height={FOUNDER_ARCH_H} grayscale priority />
          </Box>
        </Box>
      </Box>

      {/* ───────────── 3א. הגאון המקובל הרב אליהו עטייה זצ"ל — זהה לסעיף ראש הישיבה, בלי כתוב ביוגרפי ───────────── */}
      <Box component="section" sx={{
        bgcolor: 'var(--parchment-2)', direction: 'rtl', py: { xs: 5, md: '63px' }, px: { xs: 2, md: 6 },
        borderTop: `1px solid ${GOLD}`,
        background: `radial-gradient(ellipse 60% 80% at 22% 50%, rgba(235,213,154,0.55), transparent 70%), var(--parchment-2)`,
      }}>
        <Box sx={{ maxWidth: 1306, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { md: 'flex-start' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: { xs: 3, md: '43px' } }}>
          <Box sx={{ flexShrink: 0 }}>
            {ELIYAHU_IMG ? (
              <ArchPortrait src={ELIYAHU_IMG} alt='הגאון המקובל הרב אליהו עטייה זצ"ל' width={HOME_ARCH_W} height={HOME_ARCH_H} />
            ) : (
              <Box sx={{ ...archFrameSx(HOME_ARCH_W), height: HOME_ARCH_H }}>
                <Box sx={{ width: '100%', height: '100%', bgcolor: GOLD, borderRadius: ARCH }} />
              </Box>
            )}
          </Box>
          <Box sx={{ width: '100%', maxWidth: 600, pt: { md: '12px' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'right' } }}>
            <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>הגאון המקובל הרב</Typography>
            <Typography component="h2" sx={{ ...goldNameSx, fontSize: { xs: '40px', md: '40px', lg: '60px' }, m: 0, mt: '10px' }}>אליהו עטייה</Typography>
            <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, mt: '8px' }}>זצ"ל</Typography>
            <SectionFlourish mt="28px" mb="0px" lineW={120} justify={{ xs: 'center', md: 'flex-start' }} />
          </Box>
        </Box>
      </Box>

      {/* ───────────── 3. ביוגרפיית ראש הישיבה ───────────── */}
      <Box component="section" sx={{
        bgcolor: 'var(--parchment-2)', direction: 'rtl', py: { xs: 5, md: '63px' }, px: { xs: 2, md: 6 },
        borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`,
        background: `radial-gradient(ellipse 60% 80% at 22% 50%, rgba(235,213,154,0.55), transparent 70%), var(--parchment-2)`,
      }}>
        {/* מידות מהמוקאפ (1440px): דיוקן 387×512 מימין, רווח 43, עמודת טקסט 600 מיושרת לימין, הכול מיושר לראש הדיוקן */}
        <Box sx={{ maxWidth: 1306, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { md: 'flex-start' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: { xs: 3, md: '43px' } }}>
          <Box sx={{ flexShrink: 0 }}>
            <ArchPortrait src={`${MEDIA_BASE_URL}/דד (1) (1).webp`} alt="ראש הישיבה הרב מרדכי עטיה שליט״א" width={HOME_ARCH_W} height={HOME_ARCH_H} />
          </Box>
          <Box sx={{ width: '100%', maxWidth: 600, pt: { md: '12px' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'right' } }}>
            <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>ראש הישיבה הרב</Typography>
            <Typography component="h2" sx={{ ...goldNameSx, fontSize: { xs: '40px', md: '40px', lg: '60px' }, m: 0, mt: '10px' }}>מרדכי עטיה</Typography>
            <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '24px', md: '24px', lg: '30px' }, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, mt: '8px' }}>שליט"א</Typography>
            <SectionFlourish mt="28px" mb="26px" lineW={120} justify={{ xs: 'center', md: 'flex-start' }} />
            <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '16px', md: '16px', lg: '18px' }, fontWeight: 400, lineHeight: 2, color: 'var(--body)', textAlign: 'right' }}>
              {founderContent.newSectionDescription}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ───────────── 3ב. הישיבה כיום ───────────── */}
      <Box component="section" sx={{ bgcolor: 'var(--parchment-2)', direction: 'rtl', py: { xs: 5, md: 8 }, px: { xs: 2, md: 6 }, borderTop: `1px solid ${GOLD}` }}>
      <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: { xs: 3, md: 6 }, direction: 'rtl' }}>
        <Box component="img" src={`${MEDIA_BASE_URL}/ישיבה (2).png`} alt="" loading="lazy" sx={{ display: "block", flexShrink: 0, height: { xs: 110, md: 237 }, width: { md: 420 }, maxWidth: "100%", objectFit: "contain" }} />
        <Box sx={{ maxWidth: 680, textAlign: 'right' }}>
          <Typography component="h3" sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '22px', md: '30px' }, fontWeight: 400, color: 'var(--ink-wine)', m: 0, mb: 1.5 }}>הישיבה כיום</Typography>
          <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '15px', md: '17px' }, lineHeight: 1.9, color: 'var(--body)', mb: 1.5 }}>
            בישיבתנו הקדושה לומדים כ-50 אברכים, מתוך מגמה שיורו הוראה. הם יושבים על המדוכה ונבחנים במבחני הוראה ודיינות.
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '15px', md: '17px' }, lineHeight: 1.9, color: 'var(--body)', mb: 1.5 }}>
            בנוסף, חדש בישיבה: לומדים בה 70 בחורים, בוגרי הישיבות המצוינות ביותר, ומכוונים אותם בלימודי הוראה בעיון, כדי להעמידם שיורו הלכה בישראל [לאחר שסיימו כמה שנים בישיבה הגדולה].
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '15px', md: '17px' }, lineHeight: 1.9, color: 'var(--body)' }}>
            וכל זה בנוסף לשיעורי הקבלה מפי מו"ר ראש הישיבה הגאון רבי מרדכי עטייה שליט"א, הנמסרים מדי ערב בישיבה להכוונה ולהעמדת מכוונים בסידור הרש"ש, ולהבנת דברי רבינו האר"י ז"ל ודברי הרש"ש ומפרשי הקבלה זיע"א. הכול נמסר בבהירות רבה ובבירור כל דבר לאמיתו.
          </Typography>
        </Box>
      </Box>
      </Box>

      {/* ───────────── 4. דברי גדולי ישראל ───────────── */}
      <Box component="section" sx={{ bgcolor: DARK, direction: 'rtl', py: { xs: 5, md: 8 }, px: { xs: 2, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <SectionArch mb="6px" />
          <Typography component="h2" sx={{ fontFamily: 'var(--font-heading-ornate)', fontSize: { xs: '30px', md: '40px' }, fontWeight: 400, m: 0, background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>דברי גדולי ישראל</Typography>
          <SectionFlourish />
        </Box>

        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'stretch' }, gap: { xs: 4, md: 5 } }}>
          {/* סרטון בקשת: קו זהב דק מבחוץ, רווח כהה, והתמונה בפנים (לפי המוקאפ) */}
          <Box sx={{ width: { xs: 240, md: 360 }, height: { xs: 330, md: 500 }, flexShrink: 0, borderRadius: ARCH, border: `1px solid var(--gold-deep)`, p: { xs: '6px', md: '8px' }, boxSizing: 'border-box', bgcolor: DARK, alignSelf: 'center', position: 'relative' }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: ARCH, overflow: 'hidden', bgcolor: DARK }}>
              <Box component="video" src={`${MEDIA_BASE_URL}/שיעור הרב עטייה מקוצר (1).mp4`} poster="/about-arch-poster.webp" {...archVideo.videoProps} loop muted playsInline preload={archVideo.reduced ? 'none' : 'metadata'}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <VideoToggleButton playing={archVideo.playing} onToggle={archVideo.toggle} sx={{ position: 'absolute', bottom: 14, left: 14 }} />
            </Box>
          </Box>

          {/* הציטוט */}
          <Box sx={{ flex: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>
            <QuoteMark open />
            <Typography component="blockquote" sx={{ m: 0, fontFamily: 'var(--font-body)', fontSize: { xs: '16px', md: '18px' }, color: '#F0EAD8', textAlign: 'right', lineHeight: 2, whiteSpace: 'pre-line' }}>
              {`אני עומד ומשתומם. אינך יודע מי האיש מי דיברת. רבי מרדכי מקובל גאון של הדור שלנו. אולי אינך יודע דרכי להפריז ולהגזים בשבחים ובתוארים.\n\nאך דע שאם יש מקובל אמיתי בדורנו חכם ובקי. צנוע ונחבא אל הכלים זה האיש זה המקובל. הוא אשר השם יתברך בחר בו להיות בדורינו השם יאריך ימיו. ודע שכל הנקראים "מקובלים" לא יגיעו אפילו למחצית מידיעותיו ומחכמתו. אשרי הדור אשר רואה פניו.`}
            </Typography>
            <QuoteMark />
            <Box sx={{ borderTop: `1px solid rgba(197,160,89,0.4)`, mt: 1.5, pt: 1.5, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: GOLD }}>— הרב בן ציון מוצפי שליט״א</Typography>
              <Box component="a" href="https://www.doresh-tzion.co.il/qas/142200" target="_blank" rel="noopener noreferrer"
                sx={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(197,160,89,0.7)', textDecoration: 'none', display: 'inline-block', direction: 'ltr', '&:hover': { color: GOLD } }}>
                doresh-tzion.co.il · שאלה 142200
              </Box>
            </Box>
          </Box>

          {/* שלוש עדויות וידאו */}
          <Box sx={{ width: { xs: '100%', md: 290 }, maxWidth: { xs: 420, md: 290 }, flexShrink: 0, display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'column' }, gap: 1.5, alignSelf: 'center', justifyContent: 'center' }}>
            {testimonyVideos.map((v) => (
              <Box key={v.youtubeId} sx={{ flex: { sm: 1, md: 'none' } }}>
                <VideoCard video={v} showDate={false} small onPlay={() => play(v.youtubeId)} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* כפתור לגלריה המלאה */}
        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
          <AppButton variant="outlineLight" onClick={() => navigate('/VideoGallery')}>
            לגלריית הסרטונים המלאים
          </AppButton>
        </Box>

        {/* ───────────── 5. רשת הסרטונים ───────────── */}
        <Box sx={{ maxWidth: 1240, mx: 'auto', mt: { xs: 4, md: 6 }, display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          {carouselVideos.map((v) => (
            <VideoCard key={v.youtubeId} video={v} onPlay={() => play(v.youtubeId)} />
          ))}
        </Box>
      </Box>

      {/* ───────────── 6. אירועים והוצאות ספרים ───────────── */}
      <Box component="section" sx={{ bgcolor: 'var(--parchment)', direction: 'rtl', py: { xs: 5, md: 8 }, px: { xs: 2, md: 6 }, borderBottom: `1px solid ${GOLD}` }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <SectionArch mb="6px" />
          <Typography component="h2" sx={{ fontFamily: 'var(--font-heading-ornate)', fontSize: { xs: '24px', md: '40px' }, fontWeight: 400, color: 'var(--ink-wine)', m: 0 }}>אירועים והוצאות ספרים</Typography>
          <SectionFlourish />
        </Box>
        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'grid', gap: { xs: 2, md: '22px' }, alignItems: 'stretch', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          {archImages.map((item, i) => (
            <Box component="figure" key={i} sx={{ m: 0, display: 'flex', flexDirection: 'column', p: '9px', bgcolor: '#FFFBF2', border: `1.5px solid ${GOLD}`, borderRadius: '14px', boxShadow: '0 2px 10px rgba(122,95,27,0.08)' }}>
              <Box sx={{ width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', bgcolor: 'var(--sand)' }}>
                <Box component="img" src={item.src} alt={item.label} loading="lazy"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.closest('figure')?.remove(); }}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              </Box>
              <Box component="figcaption" sx={{ px: '6px', pt: '14px', pb: '10px', textAlign: 'right' }}>
                <Typography component="span" sx={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: { xs: '14px', md: '18px' }, fontWeight: 400, color: 'var(--ink-wine)', lineHeight: 1.5 }}>{item.label}</Typography>
                {item.sub && <Typography component="span" sx={{ display: 'block', mt: '6px', fontSize: { xs: '12px', md: '14px' }, color: 'var(--gold-text)', lineHeight: 1.6 }}>{item.sub}</Typography>}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ maxWidth: 1240, mx: 'auto', mt: { xs: 4, md: 6 }, display: 'grid', gap: { xs: 1.5, md: '16px' }, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' } }}>
          {mahaVideos.map((v) => (
            <VideoCard key={v.youtubeId} video={v} showDate={false} small maha onPlay={() => play(v.youtubeId)} />
          ))}
        </Box>

        <Box sx={{ maxWidth: 1240, mx: 'auto', mt: { xs: 1.5, md: '16px' }, display: 'grid', gap: { xs: 1.5, md: '16px' }, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' } }}>
          {mahaNaaseImages.map((src, i) => (
            <Box component="figure" key={i} sx={{ m: 0, aspectRatio: '16/9', overflow: 'hidden', borderRadius: { xs: '6px', md: `${MAHA_CARD.radius}px` }, border: { xs: `1.5px solid ${GOLD}`, md: `${MAHA_CARD.border}px solid ${GOLD}` } }}>
              <Box component="img" src={src} alt="תמונה מהנעשה בישיבה" loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.closest('figure')?.remove(); }}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* דיאלוג סרטון יוטיוב */}
      <Dialog
        open={openVideoUrl !== null}
        onClose={() => setOpenVideoUrl(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#000', borderRadius: '12px', overflow: 'hidden', m: 2 } } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setOpenVideoUrl(null)}
            aria-label="סגור"
            sx={{ position: 'absolute', top: 8, right: 8, color: GOLD, zIndex: 10, bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            ✕
          </IconButton>
          {openVideoUrl && (
            <Box sx={{ width: '100%', aspectRatio: '16/9' }}>
              <iframe
                title="סרטון"
                width="100%"
                height="100%"
                src={openVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block', border: 'none' }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default About;
