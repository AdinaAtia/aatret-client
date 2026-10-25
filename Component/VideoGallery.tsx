import { useState, useEffect, useRef } from 'react';
import { Box, Dialog, IconButton, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import LessonThumb, { youtubeThumbSources } from './shared/LessonThumb';
import SectionArch from './shared/SectionArch';
import SectionFlourish from './shared/SectionFlourish';
import { cssNumber } from '../src/styles/cssVar';
import { cardHoverSx } from './shared/cardHover';
import { formatHebrewDate } from '../src/utils/hebrewDate';

interface VideoItem {
  youtubeId: string;
  name: string;
  date?: string;
}

/** תמונה ממוזערת מיוטיוב לפי מזהה: maxres → sd → hq (ל־hq יש פסים שחורים, לכן cover ב־16/9) */
const YtThumb = ({ youtubeId, alt = '' }: { youtubeId: string; alt?: string }) => (
  <LessonThumb
    src={youtubeThumbSources(youtubeId)}
    alt={alt}
    playSize={cssNumber('--video-card-play-size')}
    sx={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
  />
);

/** כרטיס סרטון: תמונה ממוזערת, סמן נגן, ופס כיתוב (שם + תאריך) — זהה לכרטיס בדף האודות */
const VideoCard = ({ video, onPlay }: { video: VideoItem; onPlay: () => void }) => (
  <Box
    component="button"
    type="button"
    onClick={onPlay}
    aria-label={video.name}
    sx={{
      all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%',
      overflow: 'hidden', bgcolor: 'var(--video-card-bg)', borderRadius: `var(--video-card-radius)`,
      border: `1px solid var(--video-card-border)`,
      ...cardHoverSx,
      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color .25s',
      '&:hover': { ...cardHoverSx['&:hover'], borderColor: 'var(--gold-light)' },
      '&:hover .vc-caption, &:focus-visible .vc-caption': { bgcolor: 'var(--video-card-hover-bg)' },
      '&:focus-visible': { outline: `2px solid var(--gold)`, outlineOffset: 2 },
    }}
  >
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', bgcolor: '#000' }}>
      <YtThumb youtubeId={video.youtubeId} alt={video.name} />
    </Box>
    <Box
      className="vc-caption"
      sx={{ direction: 'rtl', textAlign: 'right', px: '12px', py: '12px', minHeight: 'var(--video-card-caption-min-height)', transition: 'background-color .25s' }}
    >
      <Typography sx={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: { xs: '0.9rem', md: `var(--video-card-title-size)` }, lineHeight: { xs: 1.4, md: `var(--video-card-title-line)` }, color: 'var(--gold-light)' }}>
        {video.name}
      </Typography>
      {video.date && (
        <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: { xs: '0.75rem', md: `var(--video-card-sub-size)` }, color: 'var(--video-card-sub-color)', lineHeight: 1.5, mt: '4px' }}>
          {video.date}
        </Typography>
      )}
    </Box>
  </Box>
);

const VideoGallery = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchVideos = async () => {
      try {
        const catRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories-mains?filters[name][$eq]=${encodeURIComponent('תדמית הישיבה')}&fields[0]=id`
        );
        const cats = catRes.data?.data || [];
        if (cats.length === 0) return;

        const categoryId = cats[0].id;

        const lessonsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/lessons/fast?mainCategoryId=${categoryId}&pageSize=200`
        );
        const lessons = lessonsRes.data?.data || [];

        const mapped: VideoItem[] = lessons
          .filter((l: any) => {
            const attrs = l.attributes || l;
            return attrs.youtube_id && attrs.youtube_id.trim() !== '';
          })
          .map((l: any) => {
            const attrs = l.attributes || l;
            return {
              youtubeId: attrs.youtube_id,
              name: attrs.title || '',
              date: formatHebrewDate(attrs.lesson_date_gregorian, attrs.lesson_date_hebrew),
            };
          });

        setVideos(mapped);
      } catch (err) {
        console.error('Error fetching VideoGallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--ink)',
        direction: 'rtl',
        py: { xs: 5, md: 8 },
        px: { xs: 2, md: 6 },
        boxSizing: 'border-box',
      }}
    >
      {/* כותרת */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <SectionArch mb="6px" />
        <Typography component="h1" sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '1.8rem', md: '42px' }, fontWeight: 400, m: 0, background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
          גלריית וידאו
        </Typography>
        <SectionFlourish />
      </Box>

      {/* תוכן */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: 'var(--gold)' }} />
        </Box>
      ) : videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '1.2rem', md: '1.5rem' }, color: 'var(--gold-light)', opacity: 0.7 }}>
            הסרטונים יתווספו בקרוב
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 1240,
            mx: 'auto',
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {videos.map((v, i) => (
            <VideoCard key={`${v.youtubeId}-${i}`} video={v} onPlay={() => setOpenVideoUrl(`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`)} />
          ))}
        </Box>
      )}

      {/* דיאלוג סרטון יוטיוב */}
      <Dialog
        open={openVideoUrl !== null}
        onClose={() => setOpenVideoUrl(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', m: 2 } } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setOpenVideoUrl(null)}
            aria-label="סגור"
            sx={{ position: 'absolute', top: 8, right: 8, color: 'var(--gold)', zIndex: 10, bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
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
    </Box>
  );
};

export default VideoGallery;
