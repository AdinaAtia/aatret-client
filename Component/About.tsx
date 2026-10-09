import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayBadge from './shared/PlayBadge';
import founderContent from './founderContent.json';
import kdoshimContent from './לקדושים אשר בארץ.json';
import HeroVideo from './HeroVideo';
import { Crown } from './Header';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import { colors, fonts, goldButtonStyle, goldTextFill, radius, rabbiCard } from '../src/theme/tokens';
import mahaImg1 from '../src/assets/about/maha-1.jpg';
import mahaImg2 from '../src/assets/about/maha-2.png';
import mahaImg3 from '../src/assets/about/maha-3.png';
import mahaImg4 from '../src/assets/about/maha-4.png';
import mahaImg5 from '../src/assets/about/maha-5.png';

const GOLD = colors.gold;
const DARK = colors.ink;
const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;
const ARCH = '50% 50% 0 0 / 34% 34% 0 0';
// נמדד מ-ateret-mordechai-about.pdf: כפתורי כרטיס המייסד
const PDF_INK = colors.inkWine;
const PDF_GOLD_LIGHT = colors.goldLight;

// ביוגרפיית המייסד: הפסקה השנייה מתחילה ב"אליהו חצני הלוי…"
const founderFull: string = kdoshimContent.text;
const SPLIT_MARK = 'אליהו חצני הלוי';
const splitAt = founderFull.indexOf(SPLIT_MARK);
const founderFirst = founderFull.slice(0, splitAt).trim();
const founderSecond = founderFull.slice(splitAt).trim();

const FOUNDER_ARCH_W = { xs: 230, md: 240, lg: 320 };
const FOUNDER_ARCH_H = { xs: 304, md: 470, lg: 460 };

const LOCAL_THUMB_MORGENSTERN = `${MEDIA_BASE_URL}/צילום מסך 2026-06-22 110957.png`;

const allVideos = [
  { youtubeId: 'FWJGuXlBQ88', name: 'הראשון לציון הרב מרדכי אליהו זצ"ל', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'elWVs7nSbCs', name: 'המקובל הרב דוד שלום זצ"ל ראש ישיבת השלום', date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: '1-aGtlCP4Kk', name: 'הראשון לציון הרב דוד יוסף שליט"א', date: 'הילולת הרש"ש י\' שבט תשפ"ה ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { youtubeId: '-Wd4It5Ap_k', name: 'הרב בן ציון מוצפי שליט״א', date: '' },
  { youtubeId: 'Y-nZHTds7Tw', name: 'הרב יצחק מאיר מורגנשטרן שליט"א', thumbnail: LOCAL_THUMB_MORGENSTERN, date: 'תשס"א מסיבה על הוצאת ספר עטרת מרדכי על הקדיש' },
  { youtubeId: 'QV2Bgb3L7Ug', name: 'הרב אליהו מנצור שליט״א', date: '' },
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
  { src: `${MEDIA_BASE_URL}/חשוב מורגנשטין.png`, label: 'הוצאת הספר עטרת מרדכי על פורים בביתו של כבוד קדושת האדמור מתולדות אהרן' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-14 125657 (1).png`, label: 'הילולת הרש"ש י\' שבט תשפ"ה', sub: 'ההילולה נערכה לרגל הוצאה לאור של סידור הרש"ש ע"י הנדיב ה"ה יעקב ג"ק אורפלי' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-26 102933 (1).png`, label: 'הרב אליהו מנצור שליט"א' },
  { src: `${MEDIA_BASE_URL}/צילום מסך 2026-04-26 131432 (1).png`, label: 'הרב שמעון אלוף רב קהילת אהבה ואחוה ברוקלין' },
];

/** תמונה ממוזערת מיוטיוב לפי מזהה: maxres → sd → hq (ל־hq יש פסים שחורים, לכן cover ב־16/9) */
const YtThumb = ({ video, alt = '' }: { video: Video; alt?: string }) => {
  const sources = video.thumbnail
    ? [video.thumbnail]
    : ['maxresdefault', 'sddefault', 'hqdefault'].map((q) => `https://i.ytimg.com/vi/${video.youtubeId}/${q}.jpg`);
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i < sources.length - 1 ? i + 1 : i));
  return (
    <Box
      component="img"
      src={sources[idx]}
      alt={alt}
      loading="lazy"
      onError={next}
      // יוטיוב מחזיר ל־404 תמונה אפורה קטנה (120×90) שנטענת "בהצלחה" — מדלגים לאיכות הבאה
      onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
        if (!video.thumbnail && e.currentTarget.naturalWidth <= 120) next();
      }}
      sx={{ width: '100%', height: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
    />
  );
};

const PlayMark = PlayBadge;

/** כפתור סרטון עדין: מסגרת זהב דקה, עיגול נגן זהב כמו בשאר הסרטונים, ושם הרב */
const FounderVideoLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Box
    component="button" type="button" onClick={onClick} aria-label={`${label} — צפייה בסרטון`}
    sx={{
      all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', height: `${rabbiCard.button.h}px`,
      display: 'flex', alignItems: 'center', gap: '12px', px: '12px', direction: 'rtl',
      border: `1px solid ${rabbiCard.button.border}`, borderRadius: `${rabbiCard.button.radius}px`,
      transition: 'background-color 0.2s ease', '&:hover': { bgcolor: rabbiCard.arch.fill },
      '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
    }}
  >
    <Box sx={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
      <PlayMark size={28} />
    </Box>
    <Typography sx={{ fontFamily: fonts.body, fontSize: `${rabbiCard.button.size}px`, fontWeight: 500, color: rabbiCard.button.color }}>{label}</Typography>
  </Box>
);

/** כרטיס סרטון: תמונה ממוזערת, סמן נגן, וכיתוב (שם + שנה/שורת משנה) */
// נמדד מ-ateret-mordechai-about.pdf (דסקטופ 1440px): כרטיס סרטון במדור "מהנעשה והנשמע"
const MAHA_CARD = { radius: 10, border: 1, playSize: 40, titleSize: 13, titleLine: 18 };

const MahaPlayMark = () => <PlayBadge size={MAHA_CARD.playSize} />;

// נמדד מ-ateret-mordechai-about.pdf (דסקטופ 1440px): כרטיס עדות/רשת עם פס כיתוב נפרד מתחת לתמונה
const CAPTION_CARD = { radius: 10, pad: 0, titleSize: 16, titleLine: 22, subSize: 13, playSize: 43, hoverBg: '#350913', bg: '#0C0607' };

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
          p: `${CAPTION_CARD.pad}px`, overflow: 'hidden', bgcolor: CAPTION_CARD.bg, borderRadius: `${CAPTION_CARD.radius}px`,
          border: '1px solid rgba(197,160,89,0.45)', transition: 'border-color .25s, box-shadow .25s',
          '&:hover, &:focus-visible': { borderColor: colors.goldLight, boxShadow: `inset 0 0 0 1px ${colors.goldLight}` },
          '&:hover .vc-caption, &:focus-visible .vc-caption': { bgcolor: CAPTION_CARD.hoverBg },
          '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: `${CAPTION_CARD.radius - CAPTION_CARD.pad}px`, bgcolor: '#000' }}>
          <YtThumb video={video} />
          <PlayMark size={small ? 32 : CAPTION_CARD.playSize} />
        </Box>
        <Box
          className="vc-caption"
          sx={{
            direction: 'rtl', textAlign: small ? 'center' : 'right', px: '12px', py: small ? '10px' : '12px',
            minHeight: small ? 0 : 76, borderRadius: `0 0 ${CAPTION_CARD.radius - CAPTION_CARD.pad}px ${CAPTION_CARD.radius - CAPTION_CARD.pad}px`,
            transition: 'background-color .25s',
          }}
        >
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 400, fontSize: { xs: '0.9rem', md: `${CAPTION_CARD.titleSize}px` }, lineHeight: { xs: 1.4, md: `${CAPTION_CARD.titleLine}px` }, color: colors.goldLight }}>{video.name}</Typography>
          {showDate && video.date && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: { xs: '0.75rem', md: `${CAPTION_CARD.subSize}px` }, color: 'rgba(235,213,154,0.6)', lineHeight: 1.5, mt: '4px' }}>{video.date}</Typography>
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
      transition: 'transform .3s, box-shadow .3s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 22px rgba(197,160,89,0.3)' },
      '&:focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
    }}
  >
    <YtThumb video={video} />
    {maha ? <MahaPlayMark /> : <PlayMark size={small ? 32 : 44} />}
    <Box sx={maha
      ? { position: 'absolute', bottom: 0, left: 0, right: 0, px: '12px', pt: '8px', pb: '9px', direction: 'rtl', textAlign: 'center', background: 'linear-gradient(to top, rgba(12,6,7,0.92), rgba(12,6,7,0.55))' }
      : { position: 'absolute', bottom: 0, left: 0, right: 0, px: 1, py: 0.6, direction: 'rtl', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(18,9,11,0.92) 55%)' }}>
      <Typography sx={maha
        ? { fontFamily: fonts.body, fontWeight: 400, fontSize: `${MAHA_CARD.titleSize}px`, color: colors.goldLight, lineHeight: `${MAHA_CARD.titleLine}px` }
        : { fontFamily: fonts.heading, fontSize: small ? { xs: '0.75rem', md: '14px' } : { xs: '0.8rem', md: '15px' }, color: colors.goldLight, lineHeight: 1.3 }}>{video.name}</Typography>
      {showDate && video.date && (
        <Typography sx={{ fontFamily: fonts.body, fontSize: { xs: '0.68rem', md: '13px' }, color: 'rgba(235,213,154,0.75)', lineHeight: 1.3 }}>{video.date}</Typography>
      )}
    </Box>
  </Box>
  );
};

const goldNameSx = {
  fontFamily: fonts.headingOrnate,
  fontWeight: 800,
  lineHeight: 0.95,
  textAlign: 'center' as const,
  ...goldTextFill,
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
  const play = (id: string) => setOpenVideoUrl(`https://www.youtube.com/embed/${id}?autoplay=1`);

  return (
    <>
      {/* ───────────── 1. הירו ───────────── */}
      <Box component="header" sx={{ position: 'relative', width: '100%', height: { xs: '80vh', md: '90vh' }, overflow: 'hidden', direction: 'rtl', bgcolor: colors.cream }}>
        <HeroVideo sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, filter: 'brightness(1.10)' }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `linear-gradient(180deg, ${colors.cream}D4 0%, ${colors.creamAlt}C4 45%, ${colors.sand}CC 100%)` }} />
        <Box sx={{ position: 'absolute', inset: { xs: '12px', md: '26px' }, zIndex: 2, pointerEvents: 'none', borderRadius: radius.arch, border: `1px solid ${colors.goldDeep}A6` }} />
        <Box sx={{ position: 'absolute', inset: { xs: '19px', md: '36px' }, zIndex: 2, pointerEvents: 'none', borderRadius: radius.arch, border: `1px solid ${colors.goldDeep}5C` }} />

        <Box sx={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2 }}>
          <Box sx={{ mb: { xs: 1.5, md: 2 }, '& svg': { width: { xs: '34px', md: '46px' }, height: 'auto' } }}>
            <Crown width={46} height={39} />
          </Box>
          <Typography component="h1" sx={{ fontFamily: fonts.heading, fontSize: { xs: '34px', md: '60px' }, fontWeight: 700, color: colors.wine, lineHeight: 1.15, m: 0 }}>
            ישיבת החיים והשלום
          </Typography>
          <SectionFlourish mt="18px" mb="28px" />
          <Button
            onClick={() => navigate('/ModernScrollDonation')}
            sx={{
              ...goldButtonStyle, fontFamily: fonts.body, fontWeight: 600, fontSize: '17px',
              borderRadius: radius.control, height: 51, px: { xs: 4, md: 6 }, whiteSpace: 'nowrap', transition: '0.2s',
            }}
          >
            לתרומות
          </Button>
        </Box>

        <Box
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 3, cursor: 'pointer', textAlign: 'center' }}
        >
          <Typography sx={{ fontFamily: fonts.heading, fontSize: '13px', color: colors.goldText, letterSpacing: 1 }}>גלול למטה</Typography>
        </Box>
      </Box>

      {/* ───────────── 2. ביוגרפיית המייסד ───────────── */}
      <Box component="section" sx={{ bgcolor: colors.creamAlt, py: { xs: 5, md: 9 }, px: { xs: 2, md: 6 }, direction: 'rtl' }}>
        <Box sx={{ maxWidth: 1180, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', gap: { xs: 4, md: 6 } }}>

          {/* כרטיס הקלף בצורת קשת */}
          <Box sx={{ width: { xs: '100%', sm: 300, md: 240, lg: 320 }, maxWidth: { xs: 300, md: 320 }, flexShrink: 0, order: { xs: 2, md: 0 } }}>
            <Box sx={{
              bgcolor: colors.cream, border: `1px solid ${GOLD}`, borderRadius: { xs: archOuter(300), md: archOuter(240), lg: archOuter(320) }, boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              height: { xs: 'auto', md: FOUNDER_ARCH_H.md, lg: FOUNDER_ARCH_H.lg },
              px: { xs: '26px', md: '20px', lg: '30px' }, pt: { xs: '70px', md: '60px', lg: '64px' }, pb: 3, direction: 'rtl', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              {/* direction: ltr מעביר את הגלגלת לצד ימין; התוכן הפנימי נשאר rtl */}
              <Box sx={{
                width: '100%', flex: { md: 1 }, minHeight: 0, maxHeight: { xs: 340, md: 'none' }, overflowY: 'auto', direction: 'ltr', pl: '10px',
                scrollbarWidth: 'thin', scrollbarColor: `${GOLD} transparent`,
                '&::-webkit-scrollbar': { width: '3px' },
                '&::-webkit-scrollbar-button': { display: 'none' },
                '&::-webkit-scrollbar-track': { background: `${GOLD}1A`, borderRadius: '2px' },
                '&::-webkit-scrollbar-thumb': { background: GOLD, borderRadius: '2px' },
                '&::-webkit-scrollbar-thumb:hover': { background: colors.goldDeep },
              }}>
                <Box sx={{ direction: 'rtl' }}>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: { xs: '0.8125rem', md: '11px', lg: '12px' }, lineHeight: { xs: 1.75, md: 1.6 }, color: colors.body, textAlign: 'right', whiteSpace: 'pre-line' }}>
                    {founderFirst}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: { xs: '0.8125rem', md: '11px', lg: '12px' }, lineHeight: { xs: 1.75, md: 1.6 }, color: colors.body, textAlign: 'right', whiteSpace: 'pre-line', mt: 1 }}>
                    {founderSecond}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* עמודת האמצע: שם המייסד במרכז, וקישורי הסרטונים למטה בקו תחתית הקשתות */}
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: { xs: 'center', md: 'stretch' }, justifyContent: 'space-between',
            gap: { xs: 4, md: 0 }, order: { xs: 0, md: 1 }, minWidth: { md: 0 },
          }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, height: 1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.5rem', md: '24px', lg: '30px' }, fontWeight: 700, color: colors.ink, lineHeight: 1.1 }}>הגאון המוקובל רבי</Typography>
              <Typography component="h2" sx={{ ...goldNameSx, fontSize: { xs: '2.8rem', md: '46px', lg: '60px' }, m: 0 }}>מרדכי עטיה</Typography>
              <Typography sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.5rem', md: '24px', lg: '30px' }, fontWeight: 700, color: colors.ink, lineHeight: 1.1 }}>זצ"ל</Typography>
            </Box>
            <Box sx={{ width: '100%', maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: fonts.heading, fontSize: '16px', fontWeight: 700, color: colors.goldText, lineHeight: 1.2 }}>דברי הרבנים על הגאון</Typography>
              <Box sx={{ width: 34, height: '1px', bgcolor: rabbiCard.rule.color, my: '10px' }} />
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FounderVideoLink label="לדברי הרב יצחק בן זיכר" onClick={() => setOpenVideoUrl('https://www.youtube.com/embed/J0oyTQ12TRA?autoplay=1')} />
                <FounderVideoLink label="לדברי הרב יעקב הלל" onClick={() => setOpenVideoUrl('https://www.youtube.com/embed/iGNYFMQXWzc?autoplay=1')} />
              </Box>
            </Box>
          </Box>

          {/* דיוקן בקשת */}
          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <ArchPortrait src={`${MEDIA_BASE_URL}/מייסד (2).png`} alt="הגאון המקובל רבי מרדכי עטיה זצ״ל" width={FOUNDER_ARCH_W} height={FOUNDER_ARCH_H} grayscale priority />
          </Box>
        </Box>
      </Box>

      {/* ───────────── 3. ביוגרפיית ראש הישיבה ───────────── */}
      <Box component="section" sx={{
        bgcolor: colors.parchmentHeader, direction: 'rtl', py: { xs: 5, md: '63px' }, px: { xs: 2, md: 6 },
        borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`,
        background: `radial-gradient(ellipse 60% 80% at 22% 50%, rgba(235,213,154,0.55), transparent 70%), ${colors.parchmentHeader}`,
      }}>
        {/* מידות מהמוקאפ (1440px): דיוקן 387×512 מימין, רווח 43, עמודת טקסט 600 מיושרת לימין, הכול מיושר לראש הדיוקן */}
        <Box sx={{ maxWidth: 1306, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { md: 'flex-start' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: { xs: 3, md: '43px' } }}>
          <Box sx={{ flexShrink: 0 }}>
            <ArchPortrait src={`${MEDIA_BASE_URL}/דד (1) (1).png`} alt="ראש הישיבה הרב מרדכי עטיה שליט״א" width={HOME_ARCH_W} height={HOME_ARCH_H} />
          </Box>
          <Box sx={{ width: '100%', maxWidth: 600, pt: { md: '12px' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'right' } }}>
            <Typography sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.3rem', md: '24px', lg: '30px' }, fontWeight: 700, color: colors.ink, lineHeight: 1.1 }}>ראש הישיבה הרב</Typography>
            <Typography component="h2" sx={{ ...goldNameSx, fontSize: { xs: '2.6rem', md: '46px', lg: '62px' }, m: 0, mt: '10px' }}>מרדכי עטיה</Typography>
            <Typography sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.3rem', md: '24px', lg: '30px' }, fontWeight: 700, color: colors.ink, lineHeight: 1.1, mt: '8px' }}>שליט"א</Typography>
            <SectionFlourish mt="28px" mb="26px" lineW={120} justify={{ xs: 'center', md: 'flex-start' }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: { xs: '0.95rem', md: '15px', lg: '17px' }, fontWeight: 400, lineHeight: 2, color: colors.body, textAlign: 'right' }}>
              {founderContent.newSectionDescription}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ───────────── 4. דברי גדולי ישראל ───────────── */}
      <Box component="section" sx={{ bgcolor: DARK, direction: 'rtl', py: { xs: 5, md: 8 }, px: { xs: 2, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <SectionArch mb="6px" />
          <Typography component="h2" sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.8rem', md: '42px' }, fontWeight: 700, m: 0, ...goldTextFill }}>דברי גדולי ישראל</Typography>
          <SectionFlourish />
        </Box>

        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'stretch' }, gap: { xs: 4, md: 5 } }}>
          {/* סרטון בקשת: קו זהב דק מבחוץ, רווח כהה, והתמונה בפנים (לפי המוקאפ) */}
          <Box sx={{ width: { xs: 240, md: 360 }, height: { xs: 330, md: 500 }, flexShrink: 0, borderRadius: ARCH, border: `1px solid ${colors.goldDeep}`, p: { xs: '6px', md: '8px' }, boxSizing: 'border-box', bgcolor: DARK, alignSelf: 'center', position: 'relative' }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: ARCH, overflow: 'hidden', bgcolor: '#000' }}>
              <Box component="video" src={`${MEDIA_BASE_URL}/שיעור הרב עטייה מקוצר (1).mp4`} autoPlay loop muted playsInline preload="metadata"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <PlayMark size={52} />
            </Box>
          </Box>

          {/* הציטוט */}
          <Box sx={{ flex: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>
            <Typography aria-hidden sx={{ fontFamily: 'Georgia, serif', fontSize: '54px', lineHeight: 0.7, textAlign: 'center', ...goldTextFill }}>❝</Typography>
            <Typography component="blockquote" sx={{ m: 0, fontFamily: fonts.body, fontSize: { xs: '0.95rem', md: '18px' }, color: '#F0EAD8', textAlign: 'right', lineHeight: 2, whiteSpace: 'pre-line' }}>
              {`אני עומד ומשתומם. אינך יודע מי האיש מי דיברת. רבי מרדכי מקובל גאון של הדור שלנו. אולי אינך יודע דרכי להפריז ולהגזים בשבחים ובתוארים.\n\nאך דע שאם יש מקובל אמיתי בדורנו חכם ובקי. צנוע ונחבא אל הכלים זה האיש זה המקובל. הוא אשר השם יתברך בחר בו להיות בדורינו השם יאריך ימיו. ודע שכל הנקראים "מקובלים" לא יגיעו אפילו למחצית מידיעותיו ומחכמתו. אשרי הדור אשר רואה פניו.`}
            </Typography>
            <Typography aria-hidden sx={{ fontFamily: 'Georgia, serif', fontSize: '54px', lineHeight: 0.7, textAlign: 'center', mt: 1, ...goldTextFill }}>❞</Typography>
            <Box sx={{ borderTop: `1px solid rgba(197,160,89,0.4)`, mt: 1.5, pt: 1.5, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: fonts.heading, fontSize: '17px', color: GOLD }}>— הרב בן ציון מוצפי שליט״א</Typography>
              <Box component="a" href="https://www.doresh-tzion.co.il/qas/142200" target="_blank" rel="noopener noreferrer"
                sx={{ fontFamily: fonts.body, fontSize: '13px', color: 'rgba(197,160,89,0.7)', textDecoration: 'none', display: 'inline-block', direction: 'ltr', '&:hover': { color: GOLD } }}>
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
          <Button
            onClick={() => navigate('/VideoGallery')}
            sx={{
              fontFamily: fonts.heading, fontSize: { xs: '1rem', md: '16px' }, color: colors.goldLight, border: `1px solid ${GOLD}`, borderRadius: radius.sm,
              px: { xs: 3, md: 5 }, py: 1, textTransform: 'none', transition: '0.3s',
              '&:hover': { bgcolor: GOLD, color: colors.ink },
            }}
          >
            לגלריית הסרטונים המלאים
          </Button>
        </Box>

        {/* ───────────── 5. רשת הסרטונים ───────────── */}
        <Box sx={{ maxWidth: 1240, mx: 'auto', mt: { xs: 4, md: 6 }, display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          {carouselVideos.map((v) => (
            <VideoCard key={v.youtubeId} video={v} onPlay={() => play(v.youtubeId)} />
          ))}
        </Box>
      </Box>

      {/* ───────────── 6. אירועים והוצאות ספרים ───────────── */}
      <Box component="section" sx={{ bgcolor: colors.creamAlt, direction: 'rtl', py: { xs: 5, md: 8 }, px: { xs: 2, md: 6 }, borderBottom: `1px solid ${GOLD}` }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <SectionArch mb="6px" />
          <Typography component="h2" sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.6rem', md: '40px' }, fontWeight: 700, color: colors.inkWine, m: 0 }}>אירועים והוצאות ספרים</Typography>
          <SectionFlourish />
        </Box>
        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'grid', gap: { xs: 2, md: '22px' }, alignItems: 'stretch', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          {archImages.map((item, i) => (
            <Box component="figure" key={i} sx={{ m: 0, display: 'flex', flexDirection: 'column', p: '9px', bgcolor: '#FFFBF2', border: `1.5px solid ${GOLD}`, borderRadius: '14px', boxShadow: '0 2px 10px rgba(122,95,27,0.08)' }}>
              <Box sx={{ width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', bgcolor: colors.sand }}>
                <Box component="img" src={item.src} alt={item.label} loading="lazy"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.closest('figure')?.remove(); }}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              </Box>
              <Box component="figcaption" sx={{ px: '6px', pt: '14px', pb: '10px', textAlign: 'right' }}>
                <Typography component="span" sx={{ display: 'block', fontFamily: fonts.heading, fontSize: { xs: '0.9rem', md: '17px' }, fontWeight: 700, color: colors.inkWine, lineHeight: 1.5 }}>{item.label}</Typography>
                {item.sub && <Typography component="span" sx={{ display: 'block', mt: '6px', fontSize: { xs: '0.8rem', md: '14px' }, color: colors.goldText, lineHeight: 1.6 }}>{item.sub}</Typography>}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ───────────── 7. מהנעשה והנשמע בישיבה ───────────── */}
      <Box component="section" sx={{ bgcolor: DARK, direction: 'rtl', borderTop: { md: `1px solid ${GOLD}` }, pt: { xs: 5, md: 0 }, pb: { xs: 5, md: '84px' }, px: { xs: 2, md: '52px' } }}>
        {/* נמדד מ-ateret-mordechai-about.pdf: כותרת 648px משמאל, תמונת ישיבה 420×237 מימין, מפריד זהב מתחת לכותרת */}
        <Box sx={{ maxWidth: { xs: 1240, md: 1336 }, mx: 'auto', display: 'flex', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: { xs: 'center', md: 'space-between' }, gap: { xs: 2, md: 0 }, mb: { xs: 4, md: '52px' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <Box sx={{ order: { xs: 1, md: 2 }, width: { md: 648 }, flexShrink: 0, mt: { md: '73px' } }}>
            <Typography component="h2" sx={{ fontFamily: fonts.heading, fontSize: { xs: '1.8rem', md: '50px' }, lineHeight: { md: '62px' }, fontWeight: 700, m: 0, pr: { md: '14px' }, textAlign: { md: 'right' }, ...goldTextFill }}>
              מהנעשה והנשמע בישיבה
            </Typography>
            <Box aria-hidden sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', height: 0, mt: '25px' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 382, width: 150, height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.702))' }} />
              <Box sx={{ position: 'absolute', top: '-3px', left: 543, width: 6, height: 6, bgcolor: GOLD, transform: 'rotate(45deg)' }} />
              <Box sx={{ position: 'absolute', top: 0, left: 560, width: 88, height: '1px', bgcolor: GOLD }} />
            </Box>
          </Box>
          <Box component="img" src={`${MEDIA_BASE_URL}/ישיבה (2).png`} alt="" loading="lazy" sx={{ order: { xs: 2, md: 1 }, height: { xs: 110, md: 237 }, width: { md: 420 }, mr: { md: '114px' }, flexShrink: 0, objectFit: 'contain', display: 'block' }} />
        </Box>

        <Box sx={{ maxWidth: { xs: 1240, md: 1336 }, mx: 'auto', display: 'grid', gap: { xs: 1.5, md: '16px' }, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' } }}>
          {mahaVideos.map((v) => (
            <VideoCard key={v.youtubeId} video={v} showDate={false} small maha onPlay={() => play(v.youtubeId)} />
          ))}
        </Box>

        <Box sx={{ maxWidth: { xs: 1240, md: 1336 }, mx: 'auto', mt: { xs: 1.5, md: '18px' }, display: 'grid', gap: { xs: 1.5, md: '16px' }, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' } }}>
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
