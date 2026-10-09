import { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
const GOLD = colors.gold;
const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;
const BG_IMAGE = `url('${MEDIA_BASE_URL}/pastel-yellow-vignette-concrete-textured-background 1 (1) (1).png')`;

interface VideoItem {
  youtubeId: string;
  name: string;
  date?: string;
}

const VideoGallery = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
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
              date: attrs.lesson_date_hebrew || '',
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
      sx={{
        minHeight: '100vh',
        backgroundImage: BG_IMAGE,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: 'rtl',
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 12 },
        px: { xs: 2, md: 6, lg: 12 },
        boxSizing: 'border-box',
      }}
    >
      {/* כותרת */}
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
        <Typography
          sx={{
            fontFamily: "'Yetzira-Choppy', sans-serif",
            fontSize: { xs: '2.8rem', md: '4rem', lg: '5rem' },
            fontWeight: 800,
            color: GOLD,
            lineHeight: 1,
          }}
        >
          גלריית וידאו
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Box sx={{ height: '2px', width: { xs: 60, md: 100 }, bgcolor: GOLD }} />
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: GOLD,
              flexShrink: 0,
            }}
          />
          <Box sx={{ height: '2px', width: { xs: 60, md: 100 }, bgcolor: GOLD }} />
        </Box>
      </Box>

      {/* תוכן */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: GOLD }} />
        </Box>
      ) : videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.4 }}>
          <Typography
            sx={{
              fontFamily: "'Yetzira-Regular', sans-serif",
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: '#000',
            }}
          >
            הסרטונים יתווספו בקרוב
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, md: 4 },
            maxWidth: '1400px',
            mx: 'auto',
          }}
        >
          {videos.map((v, i) => (
            <Box
              key={i}
              sx={{
                bgcolor: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `2px solid ${GOLD}`,
                boxShadow: '4px 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#111' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${v.youtubeId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block', border: 'none' }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'Yetzira-Regular', sans-serif",
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: GOLD,
                  }}
                >
                  {v.name}
                </Typography>
                {v.date && (
                  <Typography
                    sx={{
                      fontFamily: "'Yetzira-Regular', sans-serif",
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {v.date}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VideoGallery;
