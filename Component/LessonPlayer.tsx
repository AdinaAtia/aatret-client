import { Box, Typography, Stack, Button, IconButton, Container, Dialog, DialogTitle, DialogContent, Divider, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import  { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { Play, Pause, Volume2, VolumeX, Link2, Mail, ArrowDownToLine, FileText, Heart, MessageSquare } from 'lucide-react';
import PlayBadge from './shared/PlayBadge';
import { playBadge, audioPlayer, bookPurchaseCard, goldButtonStyle, colors, fonts, goldTextFill, pageHeader, radius, contactForm } from '../src/theme/tokens';
import { site } from '../src/content/site';
import Breadcrumb from './shared/Breadcrumb';
import LessonCard from './shared/LessonCard';
import SectionArch from './shared/SectionArch';

interface LessonPlayerProps {
  lesson: any;
  onBack: () => void;
  onLessonSelect?: (lesson: any) => void;
}

const LessonPlayer = ({ lesson, onBack, onLessonSelect }: LessonPlayerProps) => {
  if (!lesson) return null;
  const navigate = useNavigate();
  // const NEDARIM_URL = "https://www.matara.pro/nedarimplus/online/?mosad=7002025&Analytic=%D7%90%D7%AA%D7%A8";
  // const [openDonationIframe, setOpenDonationIframe] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    hasTrackedRef.current = false;
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lesson]);

  const handleAudioPlay = () => {
    if (hasTrackedRef.current) return;
    timerRef.current = setTimeout(async () => {
      hasTrackedRef.current = true;
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons/${lesson.documentId}/increment-play`);
      } catch (e) { console.error('שגיאה בספירת האזנה:', e); }
    }, 30000);
  };

  const handleAudioPause = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  // --- נגן אודיו מותאם (B2) — שולט על אלמנט <audio> מוסתר, לא ספרייה חיצונית ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [seriesFilter, setSeriesFilter] = useState<{ rabbiId: number | string | null; mainCategoryId: number | string | null; subCategoryId: number | string | null } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (sec: number) => {
    if (!sec || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleAudioPlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play(); else el.pause();
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  /** בעברית הפס מתמלא מימין לשמאל, אז האחוז נספר מהקצה הימני של הפס */
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const ratioFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return Math.min(1, Math.max(0, (rect.right - clientX) / rect.width));
  };

  const getDuration = () => {
    const d = audioRef.current?.duration;
    return d && isFinite(d) ? d : audioDuration;
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!getDuration()) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragRatio(ratioFromClientX(e.clientX));
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRatio === null) return;
    setDragRatio(ratioFromClientX(e.clientX));
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRatio === null) return;
    const el = audioRef.current;
    const dur = getDuration();
    const ratio = ratioFromClientX(e.clientX);
    if (el && dur) {
      el.currentTime = ratio * dur;
      setCurrentTime(ratio * dur);
    }
    setDragRatio(null);
  };

  const shownDuration = getDuration();
  const progressPct = dragRatio !== null
    ? dragRatio * 100
    : shownDuration ? (currentTime / shownDuration) * 100 : 0;

  const {
    title, youtube_id, lesson_date_gregorian, lesson_date_hebrew,
    rabbi, duration, AudioDir, AudioFileName, PdfFileName
  } = lesson;

  const rabbiName = rabbi?.name || "הרב מרדכי עטייה";
  const lessonNumber = title.match(/\d{3}/)?.[0] || "";

  // הגדרת בסיס הכתובת המעודכן
  const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL;
  
  // פונקציה לבניית כתובת תקינה כולל קידוד רווחים
// פונקציה לבניית כתובת תקינה ונקייה עבור נטפרי
  const buildSafeUrl = (dir: string, fileName: string) => {
  if (!dir || !fileName) return null;

  // 1. ניקוי ה-dir: מסירים סלאשים מההתחלה ומהסוף כדי שלא יתנגשו עם הבסיס
  const cleanDir = dir.replace(/^\/+|\/+$/g, '');
  
  // 2. פירוק הנתיב לחלקים וקידוד כל חלק בנפרד (כדי לטפל ברווחים ומקפים)
  const encodedPath = cleanDir
    .split('/')
    .map(part => encodeURIComponent(part))
    .join('/');

  // 3. קידוד שם הקובץ
  const encodedFileName = encodeURIComponent(fileName);

  // 4. חיבור הכל לכתובת אחת תקנית
  return `${MEDIA_BASE_URL}/${encodedPath}/${encodedFileName}`;
};
  const audioUrl = buildSafeUrl(AudioDir, AudioFileName);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = title ? `${title} | עטרת מרדכי` : 'עטרת מרדכי';
    return () => { document.title = 'עטרת מרדכי'; };
  }, [title]);
const [categoryPath, setCategoryPath] = useState<string>("");
  const [relatedLessons, setRelatedLessons] = useState<any[]>([]);
  const [dedicateOpen, setDedicateOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', message: '' });
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFeedbackSubmit = async () => {
    if (!feedbackData.name || !feedbackData.email || !feedbackData.message) return;
    setFeedbackStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/lesson-feedback`, {
        ...feedbackData,
        lessonTitle: title,
      });
      setFeedbackStatus('success');
      setFeedbackData({ name: '', email: '', message: '' });
      setTimeout(() => { setFeedbackOpen(false); setFeedbackStatus('idle'); }, 3000);
    } catch { setFeedbackStatus('error'); }
  };
  const [dedicateTime, setDedicateTime] = useState('1 שבוע');
  const [dedicateType, setDedicateType] = useState('רפואה שלמה');
  const [dedicateDate, setDedicateDate] = useState('');
  const [dedicateName, setDedicateName] = useState('');
  const [dedicateGender, setDedicateGender] = useState('בן');
  const [dedicateMother, setDedicateMother] = useState('');
  // B1.ב — facade ליוטיוב: ה-iframe (וכל ספריית הנגן שלו) נטען רק בלחיצה, לא בטעינת העמוד
  const [videoPlaying, setVideoPlaying] = useState(false);
  useEffect(() => { setVideoPlaying(false); }, [youtube_id]);


  const goldField = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff', borderRadius: radius.control, fontFamily: fonts.body,
      '& fieldset': { borderColor: colors.gold },
      '&:hover fieldset': { borderColor: colors.goldDeep },
      '&.Mui-focused fieldset': { borderColor: colors.goldDeep, borderWidth: '1px' },
      '& input': { textAlign: 'right', fontFamily: fonts.body, color: colors.body },
      '& textarea': { textAlign: 'right', fontFamily: fonts.body, color: colors.body },
    },
    '& .MuiInputLabel-root': {
      right: 22, left: 'auto', transformOrigin: 'top right',
      fontFamily: fonts.body, color: colors.muted,
      '&.Mui-focused': { color: colors.goldText },
    },
    '& .MuiInputLabel-shrink': { transform: 'translate(0, -9px) scale(0.75)', right: 14, left: 'auto' },
    '& legend': { textAlign: 'right' },
  };
  const dialogPaperSx = {
    bgcolor: colors.cream, border: `1px solid ${colors.gold}`, borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(44,14,16,.18)', backgroundImage: 'none',
  };
  const dialogTitleSx = {
    position: 'relative', textAlign: 'center', py: 2.5, px: 6,
    fontFamily: fonts.heading, fontSize: '26px', fontWeight: 700, color: colors.inkWine,
    bgcolor: colors.parchmentHeader, borderBottom: `1px solid ${colors.gold}`,
  } as const;
  const dialogCloseSx = {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    width: 36, height: 36, border: `1px solid ${colors.gold}`, color: colors.goldText,
    '&:hover': { bgcolor: `${colors.gold}1F` },
  } as const;
  const dialogContentSx = { pt: '24px !important', fontFamily: fonts.body, color: colors.body };
  const dialogSectionTitleSx = {
    fontFamily: fonts.heading, fontWeight: 700, fontSize: '20px', color: colors.inkWine,
  } as const;
  const dialogDividerSx = { borderColor: colors.ruleSoft };
  const radioSx = { color: colors.gold, '&.Mui-checked': { color: colors.goldDeep } };
  const radioLabelSx = { '& .MuiFormControlLabel-label': { fontFamily: fonts.body, fontSize: '15px', color: colors.body } };
useEffect(() => {
  const fetchCategoryHierarchy = async () => {
    const currentDocId = lesson?.documentId || lesson?.id;
    if (!currentDocId) return;

    try {
      // אנחנו מבצעים Populate עמוק יותר כדי להגיע מהתת-קטגוריה של השיעור עד למעלה
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${currentDocId}?` + 
        `populate[rabbi][fields][0]=name` + 
        `&populate[main_category][fields][0]=name` + 
        `&populate[sub_category][populate][main_category][fields][0]=name` +
        `&populate[sub_category][populate][parent_sub][populate][parent_sub][fields][0]=name` + // רמה 4
        `&populate[sub_category][populate][parent_sub][fields][0]=name` // רמה 3
      );

      const data = response.data.data;
      const lessonAttrs = data.attributes || data;
      const sub = lessonAttrs.sub_category?.data?.attributes || lessonAttrs.sub_category;
      
      // שליפת ה-id לצורך שיעורים קשורים
      const subId = lessonAttrs.sub_category?.data?.id || lessonAttrs.sub_category?.id;
      const mainId = lessonAttrs.main_category?.data?.id || lessonAttrs.main_category?.id;
      const rabbiId = lessonAttrs.rabbi?.data?.id || lessonAttrs.rabbi?.id || data.rabbi?.id;
      setSeriesFilter({ rabbiId: rabbiId ?? null, mainCategoryId: mainId ?? null, subCategoryId: subId ?? null });
      const filterKey = subId ? 'sub_category' : 'main_category';
      const filterId = subId || mainId;
      if (filterId) {
        try {
          // התאמה מדויקת לאותה קטגוריה: אם אין תת-קטגוריה, לא מביאים שיעורים השייכים לתת-קטגוריות של הראשית
          const exactOnly = subId ? '' : '&filters[sub_category][id][$null]=true';
          const relRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/lessons?filters[${filterKey}][id][$eq]=${filterId}${exactOnly}&filters[id][$ne]=${lesson.id}&populate=rabbi&pagination[pageSize]=4&sort[0]=lesson_date_gregorian:desc`
          );
          setRelatedLessons(relRes.data.data || []);
        } catch (e) { console.error(e); }
      }
      
      let pathParts: string[] = [];

      // 1. קטגוריה ראשית (Level 1) - למשל: "קבוצת: יד בנימין"
      const mainName = lessonAttrs.main_category?.data?.attributes?.name || 
                       lessonAttrs.main_category?.name ||
                       sub?.main_category?.data?.attributes?.name ||
                       sub?.main_category?.name;
      if (mainName) pathParts.push(mainName);

      // 2. סבא של התת-קטגוריה (Level 2) - למשל: "חגים"
      const grandParentName = sub?.parent_sub?.data?.attributes?.parent_sub?.data?.attributes?.name ||
                              sub?.parent_sub?.parent_sub?.name;
      if (grandParentName) pathParts.push(grandParentName);

      // 3. אבא של התת-קטגוריה (Level 3) - למשל: "פסח - יד בנימין"
      const parentName = sub?.parent_sub?.data?.attributes?.name || 
                         sub?.parent_sub?.name;
      if (parentName && parentName !== grandParentName) pathParts.push(parentName);

      // 4. התת-קטגוריה של השיעור עצמו (Level 4) - למשל: "הגדה - יד בנימין"
      const currentSubName = sub?.name;
      if (currentSubName && currentSubName !== parentName && currentSubName !== mainName) {
        pathParts.push(currentSubName);
      }

      // סינון כפילויות ליתר ביטחון וחיבור
      setCategoryPath(pathParts.filter(Boolean).join(' / '));
console.log("ategoryPath",pathParts);

    } catch (error) {
      console.error("Error fetching hierarchy:", error);
      setCategoryPath(""); 
    }
  };

  fetchCategoryHierarchy();
}, [lesson?.documentId]);

  // --- B3/B4 — נתונים נגזרים לפריסת העמוד ---
  const seriesName = categoryPath ? categoryPath.split(' / ').pop() : '';
  const yearHebrew = lesson_date_hebrew ? lesson_date_hebrew.trim().split(' ').pop() : '';
  const breadcrumbItems = [
    { label: 'דף הבית', path: '/' },
    { label: 'ארכיון השיעורים', path: '/AllLessons' },
    ...(seriesName ? [{ label: seriesName }] : []),
    { label: lessonNumber ? `שיעור מס׳ ${lessonNumber}` : title },
  ];

  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.error(e); }
  };

  /** מוסיף אירוע חוזר שבועי ליומן — נבנה מקובץ התוכן (site.weeklyLesson), לא מהמצאה */
  const handleAddWeeklyToCalendar = () => {
    const dayMap: Record<string, number> = { 'ראשון': 0, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6 };
    const dayName = site.weeklyLesson.day.replace(/^יום\s/, '');
    const targetDay = dayMap[dayName] ?? 4;
    const [hh, mm] = site.weeklyLesson.time.split(':').map(Number);
    const now = new Date();
    const diff = (targetDay - now.getDay() + 7) % 7;
    const next = new Date(now);
    next.setDate(now.getDate() + diff);
    next.setHours(hh || 0, mm || 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const end = new Date(next.getTime() + 60 * 60 * 1000);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `DTSTART:${fmt(next)}`, `DTEND:${fmt(end)}`, 'RRULE:FREQ=WEEKLY',
      'SUMMARY:שיעור קבלה שבועי', `LOCATION:${site.weeklyLesson.place} · ${site.addresses.yeshiva}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'שיעור-קבלה-שבועי.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const primaryBtnSx = {
    minHeight: '46px', borderRadius: '6px', fontWeight: 700, fontSize: '14px',
    px: '20px', textTransform: 'none', ...goldButtonStyle,
    '& .MuiButton-startIcon': { marginInlineStart: 0, marginInlineEnd: '10px' },
    '&.Mui-disabled': { backgroundImage: 'none', bgcolor: colors.ruleSoft, color: '#9a8f78' },
  } as const;
  const secondaryBtnSx = {
    minHeight: '46px', borderRadius: '6px', fontWeight: 700, fontSize: '14px',
    px: '20px', textTransform: 'none', bgcolor: 'transparent',
    '& .MuiButton-startIcon': { marginInlineStart: 0, marginInlineEnd: '10px' },
    border: `1px solid ${colors.gold}`, color: colors.goldText,
    '&:hover': { bgcolor: `${colors.gold}1F` },
    '&.Mui-disabled': { border: `1px solid ${colors.ruleSoft}`, color: '#9a8f78' },
  } as const;
  const metaItemSx = { display: 'flex', alignItems: 'center', gap: '7px', fontFamily: fonts.body, fontSize: '15px', color: colors.body } as const;
  const shareIconSx = {
    width: 46, height: 46, border: `1px solid ${colors.gold}`, color: colors.goldText,
    '&:hover': { bgcolor: `${colors.gold}1F` },
  } as const;

  return (
    <Box sx={{ bgcolor: colors.creamAlt, direction: 'rtl' }}>
      <Breadcrumb items={breadcrumbItems} sticky />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
          gap: { xs: '32px', md: '40px' },
          alignItems: 'start',
        }}>
          {/* ===== טור ראשי ===== */}
          <Box sx={{ minWidth: 0 }}>
            {seriesName && (
              <Typography sx={{
                display: 'inline-block', mb: '14px', px: '14px', py: '4px', borderRadius: '999px',
                bgcolor: colors.sand, border: `1px solid ${colors.gold}`, fontFamily: fonts.body,
                fontSize: `${pageHeader.eyebrow.size}px`, letterSpacing: pageHeader.eyebrow.letterSpacing,
                color: colors.wine, fontWeight: pageHeader.eyebrow.weight,
              }}>
                {seriesName}
              </Typography>
            )}

            <Typography component="h1" sx={{ fontFamily: fonts.heading, fontSize: { xs: '28px', md: '40px' }, fontWeight: 700, color: colors.inkWine, lineHeight: 1.25, mb: '10px' }}>
              {title}
            </Typography>

            <Typography sx={{ fontFamily: fonts.body, fontSize: '17px', fontWeight: 700, color: colors.goldText, mb: '24px' }}>
              {rabbiName}
              {yearHebrew && ` · ${yearHebrew}`}
              {lessonNumber && ` · שיעור מס׳ ${lessonNumber}`}
            </Typography>

            {/* וידאו יוטיוב — facade: ה-iframe (וכל ספריית הנגן) נטען רק בלחיצה. B1.ב */}
            {youtube_id && (
              <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: '12px', overflow: 'hidden', mb: 3, border: `1px solid ${colors.gold}`, bgcolor: '#000' }}>
                {videoPlaying ? (
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    src={`https://www.youtube-nocookie.com/embed/${youtube_id}?autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Box
                    component="button"
                    onClick={() => setVideoPlaying(true)}
                    aria-label="צפייה בשיעור"
                    sx={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      border: 0, p: 0, cursor: 'pointer',
                      backgroundImage: `url(https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg)`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <PlayBadge size={84} />
                  </Box>
                )}
              </Box>
            )}

            {/* נגן אודיו מותאם — B2. אלמנט ה-audio האמיתי מוסתר, הממשק כולו בנוי מסביבו */}
            {audioUrl && (
              <Box sx={{
                mb: 3, bgcolor: audioPlayer.bg, border: `1px solid ${audioPlayer.border}`,
                borderRadius: `${audioPlayer.radius}px`, p: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '18px', textAlign: 'right',
              }}>
                <audio
                  ref={audioRef}
                  key={audioUrl}
                  style={{ display: 'none' }}
                  preload="metadata"
                  onPlay={() => { setIsPlaying(true); handleAudioPlay(); }}
                  onPause={() => { setIsPlaying(false); handleAudioPause(); }}
                  onEnded={() => { setIsPlaying(false); handleAudioPause(); }}
                  onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                  onDurationChange={(e) => setAudioDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                >
                  <source src={audioUrl} type="audio/mpeg" />
                </audio>

                <IconButton
                  onClick={toggleAudioPlay}
                  aria-label={isPlaying ? 'השהיית השיעור' : 'האזנה לשיעור'}
                  sx={{
                    width: audioPlayer.playButton.size, height: audioPlayer.playButton.size,
                    minWidth: audioPlayer.playButton.size, flexShrink: 0, borderRadius: '50%',
                    backgroundImage: playBadge.background, color: playBadge.icon,
                    '&:hover': { backgroundImage: playBadge.background, opacity: 0.9 },
                  }}
                >
                  {isPlaying
                    ? <Pause fill="currentColor" size={22} />
                    : <Play fill="currentColor" size={17} strokeWidth={1} />}
                </IconButton>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '4px' }}>
                    <Typography sx={{ fontSize: `${audioPlayer.label.size}px`, fontWeight: audioPlayer.label.weight, color: audioPlayer.label.color }}>
                      האזנה לשיעור
                    </Typography>
                    <Typography sx={{
                      fontSize: `${audioPlayer.time.size}px`, color: audioPlayer.time.color,
                      fontVariantNumeric: 'tabular-nums', direction: 'ltr', whiteSpace: 'nowrap',
                    }}>
                      {formatTime(currentTime)} / {formatTime(audioDuration)}
                    </Typography>
                  </Box>

                  <Box
                    ref={trackRef}
                    onPointerDown={handleTrackPointerDown}
                    onPointerMove={handleTrackPointerMove}
                    onPointerUp={handleTrackPointerUp}
                    onPointerCancel={() => setDragRatio(null)}
                    sx={{
                      position: 'relative', height: `${audioPlayer.track.height}px`,
                      borderRadius: '999px', bgcolor: audioPlayer.track.bg, cursor: 'pointer', mb: '6px',
                      touchAction: 'none', userSelect: 'none',
                    }}
                  >
                    <Box sx={{
                      position: 'absolute', top: 0, bottom: 0, right: 0,
                      width: `${progressPct}%`, borderRadius: '999px', bgcolor: colors.gold,
                    }} />
                    <Box sx={{
                      position: 'absolute', top: '-4px', right: `calc(${progressPct}% - 7px)`,
                      width: `${audioPlayer.handle.size}px`, height: `${audioPlayer.handle.size}px`,
                      borderRadius: '50%', bgcolor: audioPlayer.handle.color,
                    }} />
                  </Box>
                </Box>

                <IconButton
                  onClick={cyclePlaybackRate}
                  aria-label="מהירות ניגון"
                  sx={{
                    width: audioPlayer.controlButton.size, height: audioPlayer.controlButton.size,
                    flexShrink: 0, borderRadius: "10px", border: `1px solid ${audioPlayer.border}`, color: audioPlayer.label.color,
                    fontSize: '13px', fontWeight: 700, direction: 'ltr',
                  }}
                >
                  {playbackRate}x
                </IconButton>

                <IconButton
                  onClick={toggleMute}
                  aria-label={isMuted ? 'ביטול השתקה' : 'השתקה'}
                  sx={{
                    width: audioPlayer.controlButton.size, height: audioPlayer.controlButton.size,
                    flexShrink: 0, borderRadius: "10px", border: `1px solid ${audioPlayer.border}`, color: audioPlayer.label.color,
                  }}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </IconButton>
              </Box>
            )}

            {/* רצועת מטא אחת — במקום כמה שורות נפרדות */}
            <Box sx={{
              bgcolor: colors.cream, border: `1px solid ${colors.gold}`, borderRadius: '12px',
              p: '18px 22px', display: 'flex', flexWrap: 'wrap', gap: '16px 34px', mb: '24px',
            }}>
              <Box sx={metaItemSx}><PersonOutlineOutlinedIcon sx={{ fontSize: 17, color: colors.goldText }} />{rabbiName}</Box>
              {lesson_date_hebrew && <Box sx={metaItemSx}><CalendarTodayOutlinedIcon sx={{ fontSize: 17, color: colors.goldText }} />{lesson_date_hebrew}</Box>}
              {lesson_date_gregorian && <Box sx={metaItemSx}><CalendarTodayOutlinedIcon sx={{ fontSize: 17, color: colors.goldText }} />{lesson_date_gregorian}</Box>}
              <Box sx={metaItemSx}><AccessTimeOutlinedIcon sx={{ fontSize: 17, color: colors.goldText }} />{duration || '00:00'}</Box>
              {lessonNumber && <Box sx={metaItemSx}><ConfirmationNumberOutlinedIcon sx={{ fontSize: 17, color: colors.goldText }} />שיעור מס׳ {lessonNumber}</Box>}
            </Box>

            {/* כפתורי פעולה — אחד ראשי, השאר משניים */}
            <Box sx={{
              display: 'grid', gap: 1.5,
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              '& .MuiButton-root': { width: '100%', height: '46px', whiteSpace: 'nowrap' },
            }}>
              <Button
                variant="contained" disableElevation sx={primaryBtnSx}
                disabled={!AudioFileName}
                onClick={() => {
                  const cleanDir = (AudioDir || '').replace(/^\/+|\/+$/g, '');
                  const file = `${cleanDir}/${AudioFileName}`;
                  const params = new URLSearchParams({ key: 'ATERET_DL_2026', file, title: title || AudioFileName });
                  const a = document.createElement('a');
                  a.href = `https://ateretmordechaifiles.com/download.php?${params}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                startIcon={<ArrowDownToLine size={15} strokeWidth={1.75} />}
              >
                הורדת השיעור
              </Button>

              <Button
                variant="outlined" sx={secondaryBtnSx}
                disabled={!PdfFileName}
                onClick={() => {
                  const cleanDir = (AudioDir || '').replace(/^\/+|\/+$/g, '');
                  const file = `${cleanDir}/${PdfFileName}`;
                  const params = new URLSearchParams({ key: 'ATERET_DL_2026', file, title: title || PdfFileName });
                  const a = document.createElement('a');
                  a.href = `https://ateretmordechaifiles.com/download.php?${params}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                startIcon={<FileText size={15} strokeWidth={1.75} />}
              >
                הורדת דף מקורות
              </Button>

              <Button variant="outlined" sx={secondaryBtnSx} startIcon={<Heart size={15} strokeWidth={1.75} />} onClick={() => setDedicateOpen(true)}>
                הקדשת השיעור
              </Button>
              <Button variant="outlined" sx={secondaryBtnSx} startIcon={<MessageSquare size={15} strokeWidth={1.75} />} onClick={() => { setFeedbackOpen(true); setFeedbackStatus('idle'); }}>
                הערה על השיעור
              </Button>
            </Box>
          </Box>

          {/* ===== סרגל צד ===== */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {seriesName && (
              <Box sx={{ bgcolor: colors.cream, border: `1px solid ${colors.gold}`, borderRadius: '12px', p: '20px' }}>
                <Typography sx={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.inkWine, mb: '8px' }}>
                  על הסדרה
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.muted, mb: '14px' }}>
                  שיעור זה הוא חלק מסדרת "{seriesName}" של {rabbiName}.
                </Typography>
                <Button fullWidth variant="outlined" sx={secondaryBtnSx} onClick={() => navigate('/AllLessons', { state: seriesFilter })}>
                  לכל הסדרה
                </Button>
              </Box>
            )}

            <Box sx={{ bgcolor: colors.cream, border: `1px solid ${colors.gold}`, borderRadius: '12px', p: '20px' }}>
              <Typography sx={{ fontFamily: fonts.heading, fontSize: '18px', fontWeight: 700, color: colors.inkWine, mb: '12px' }}>
                שיתוף
              </Typography>
              <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <IconButton
                  aria-label="שיתוף בוואטסאפ" sx={shareIconSx}
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`, '_blank')}
                >
                  <WhatsAppIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton aria-label={copied ? 'הקישור הועתק' : 'העתקת קישור'} sx={shareIconSx} onClick={handleCopyLink}>
                  <Link2 size={18} />
                </IconButton>
                <IconButton
                  aria-label="שיתוף במייל" sx={shareIconSx}
                  onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
                >
                  <Mail size={18} />
                </IconButton>
              </Box>
              {copied && (
                <Typography sx={{ fontSize: '12px', color: colors.goldText, textAlign: 'center', mt: '8px' }}>
                  הקישור הועתק
                </Typography>
              )}
            </Box>

            <Box sx={{ bgcolor: colors.wine, border: `1px solid ${colors.gold}`, borderRadius: '12px', p: '20px', color: '#fff' }}>
              <Typography sx={{ ...goldTextFill, fontFamily: fonts.heading, fontSize: '18px', fontWeight: 700, mb: '10px' }}>
                שיעור קבלה שבועי
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '15px', color: bookPurchaseCard.subTextColor, mb: '4px' }}>
                {site.weeklyLesson.day} · {site.weeklyLesson.time}
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: bookPurchaseCard.subTextColor, mb: '14px' }}>
                {site.weeklyLesson.place} · {site.addresses.yeshiva}
              </Typography>
              <Button
                fullWidth variant="contained" disableElevation onClick={handleAddWeeklyToCalendar}
                sx={{ ...primaryBtnSx, minHeight: '44px', px: 0 }}
              >
                הוספה ליומן
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* שיעורים נוספים בסדרה — רשת כרטיסים, לא קרוסלה. B5 */}
      {relatedLessons.length > 0 && (
        <Box sx={{ bgcolor: colors.sectionBg, borderTop: `1px solid ${colors.gold}`, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <SectionArch mb="17px" />
          <Typography component="h2" sx={{ fontFamily: fonts.heading, fontSize: { xs: '26px', md: '38px' }, lineHeight: 1.2, fontWeight: 700, color: colors.inkWine, mb: '38px', textAlign: 'center' }}>
            שיעורים נוספים בסדרה
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: '20px' }}>
            {relatedLessons.map((rel) => {
              const a = rel.attributes || rel;
              const relRabbiName = a.rabbi?.name || a.rabbi?.data?.attributes?.name || 'הרב מרדכי עטייה';
              const selectThisLesson = () => {
                const formatted = { ...a, rabbi: { name: relRabbiName } };
                onLessonSelect ? onLessonSelect(formatted) : onBack();
              };
              return (
                <LessonCard
                  key={rel.id}
                  lesson={{
                    id: rel.id, title: a.title, rabbiName: relRabbiName,
                    dateHebrew: a.lesson_date_hebrew, youtubeId: a.youtube_id, duration: a.duration,
                  }}
                  onSelect={selectThisLesson}
                  onPlayVideo={selectThisLesson}
                />
              );
            })}
          </Box>
        </Container>
        </Box>
      )}

      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle sx={dialogTitleSx}>
          הערה על השיעור
          <IconButton aria-label="סגירה" onClick={() => setFeedbackOpen(false)} sx={dialogCloseSx}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <Stack spacing={2}>
            <Typography sx={{ fontFamily: fonts.body, color: colors.muted, fontSize: '15px' }}>שיעור: <strong style={{ color: colors.inkWine }}>{title}</strong></Typography>
            <Divider sx={dialogDividerSx} />
            <TextField size="small" label="שם" value={feedbackData.name} onChange={e => setFeedbackData(p => ({ ...p, name: e.target.value }))} sx={goldField} />
            <TextField size="small" label='אימייל' value={feedbackData.email} onChange={e => setFeedbackData(p => ({ ...p, email: e.target.value }))} sx={goldField} />
            <TextField multiline rows={4} label="תגובה" value={feedbackData.message} onChange={e => setFeedbackData(p => ({ ...p, message: e.target.value }))} sx={goldField} />
            {feedbackStatus === 'success' && <Typography sx={{ color: colors.goldText, textAlign: 'center', fontWeight: 700 }}>התגובה נשלחה! החלון יסגר בעוד מספר שניות...</Typography>}
            {feedbackStatus === 'error' && <Typography sx={{ color: contactForm.required, textAlign: 'center' }}>שגיאה בשליחה, נסה שוב.</Typography>}
            <Button fullWidth variant="contained" disableElevation disabled={feedbackStatus === 'loading'} onClick={handleFeedbackSubmit} sx={primaryBtnSx}>
              {feedbackStatus === 'loading' ? 'שולח...' : 'שליחת תגובה'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={dedicateOpen} onClose={() => setDedicateOpen(false)} dir="rtl" fullWidth maxWidth="sm" PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle sx={dialogTitleSx}>
          הקדשת השיעור
          <IconButton aria-label="סגירה" onClick={() => setDedicateOpen(false)} sx={dialogCloseSx}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <Stack spacing={1.5}>
            <Box sx={{ bgcolor: colors.sand, border: `1px solid ${colors.gold}`, borderRadius: '8px', p: '14px 18px' }}>
              <Stack direction="row" gap={1}>
                <Typography fontWeight={700} fontFamily={fonts.body}>מספר שיעור:</Typography>
                <Typography fontFamily={fonts.body}>{lesson.id}</Typography>
              </Stack>
              <Stack direction="row" gap={1}>
                <Typography fontWeight={700} fontFamily={fonts.body}>שם:</Typography>
                <Typography fontFamily={fonts.body}>{title}{categoryPath ? ` - ${categoryPath}` : ''}</Typography>
              </Stack>
              <Stack direction="row" gap={1}>
                <Typography fontWeight={700} fontFamily={fonts.body}>נושא:</Typography>
                <Typography fontFamily={fonts.body}>{categoryPath || '-'}</Typography>
              </Stack>
              <Stack direction="row" gap={1}>
                <Typography fontWeight={700} fontFamily={fonts.body}>שם הרב:</Typography>
                <Typography fontFamily={fonts.body}>{rabbiName}</Typography>
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={4} sx={{ mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ ...dialogSectionTitleSx, textAlign: 'center', mb: 1 }}>זמן הופעה</Typography>
                <RadioGroup value={dedicateTime} onChange={(e) => setDedicateTime(e.target.value)}>
                  {['1 שבוע', '1 חודש', '4 חודשים', '1 שנה'].map(opt => (
                    <FormControlLabel key={opt} value={opt} control={<Radio size="small" sx={radioSx} />} label={opt} sx={radioLabelSx} />
                  ))}
                </RadioGroup>
                <Typography sx={{ mt: 1, fontFamily: fonts.body, fontSize: '14px', color: colors.muted }}>ההקדשה תוצג מתאריך:</Typography>
                <TextField
                  type="date"
                  size="small"
                  value={dedicateDate}
                  onChange={(e) => setDedicateDate(e.target.value)}
                  sx={{ ...goldField, mt: 0.5, width: '100%', direction: 'ltr' }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ ...dialogSectionTitleSx, textAlign: 'center', mb: 1 }}>סוג ההקדשה</Typography>
                <RadioGroup value={dedicateType} onChange={(e) => setDedicateType(e.target.value)}>
                  {['רפואה שלמה', 'מציאת זיווג', 'פרנסה', 'הצלחה', 'זרע של קיימא - פרי בטן', 'אחר'].map(opt => (
                    <FormControlLabel key={opt} value={opt} control={<Radio size="small" sx={radioSx} />} label={opt} sx={radioLabelSx} />
                  ))}
                </RadioGroup>
              </Box>
            </Stack>

            <Divider sx={dialogDividerSx} />

            <Typography sx={{ ...dialogSectionTitleSx, fontSize: '18px', textAlign: 'right' }}>הקדש שיעור ל:</Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.muted, textAlign: 'right' }}>לדוגמא: דוד בן אסתר</Typography>
            <Stack direction="row" alignItems="center" gap={2} sx={{ flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="שם" value={dedicateName} onChange={e => setDedicateName(e.target.value)} sx={{ flex: 1, ...goldField }} />
              <RadioGroup row value={dedicateGender} onChange={e => setDedicateGender(e.target.value)}>
                <FormControlLabel value="בן" control={<Radio size="small" sx={radioSx} />} label="בן" sx={radioLabelSx} />
                <FormControlLabel value="בת" control={<Radio size="small" sx={radioSx} />} label="בת" sx={radioLabelSx} />
              </RadioGroup>
              <TextField size="small" placeholder="שם האם" value={dedicateMother} onChange={e => setDedicateMother(e.target.value)} sx={{ flex: 1, ...goldField }} />
            </Stack>

            <Divider sx={dialogDividerSx} />

            <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.muted }}>* הערה: אם ברצונך להקדיש מספר שיעורים כתוב לנו את בקשתך כאן.</Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.muted }}>השדות המסומנים עם * הכרחיים למילוי</Typography>
            <Button fullWidth variant="contained" disableElevation onClick={() => navigate('/DonateLetter')} sx={{ ...primaryBtnSx, mt: 1 }}>
              לתרומה
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LessonPlayer;