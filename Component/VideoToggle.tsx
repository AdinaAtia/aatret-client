import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery, type SxProps, type Theme } from '@mui/material';

/**
 * עצירה/הפעלה לסרטונים דקורטיביים שמתנגנים לבד (ההירו והסרטון בקשת באודות).
 * - prefers-reduced-motion: הסרטון לא מתחיל לבד ולא נטען, ורואים רק את ה-poster.
 * - כפתור עגול 46px עם aria-label שמתחלף לפי המצב.
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useVideoPlayback() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  // reduced-motion: עוצרים (גם אם הופעל בזמן שהדף פתוח). אחרת מפעילים במפורש —
  // React לא מסמן את muted כמאפיין, ובלי זה הדפדפן לפעמים לא מתחיל autoplay.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
    } else {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [reduced]);

  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  return {
    reduced,
    playing,
    toggle,
    /** props לפיזור על אלמנט ה-video */
    videoProps: {
      ref,
      autoPlay: !reduced,
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
    },
  };
}

interface VideoToggleButtonProps {
  playing: boolean;
  onToggle: () => void;
  sx?: SxProps<Theme>;
}

export function VideoToggleButton({ playing, onToggle, sx }: VideoToggleButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'עצירת הסרטון' : 'הפעלת הסרטון'}
      sx={{
        all: 'unset',
        boxSizing: 'border-box',
        width: 46,
        height: 46,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        bgcolor: 'rgba(255,252,244,0.85)',
        border: '1px solid var(--gold-deep)',
        color: 'var(--gold-text)',
        '&:hover': { bgcolor: '#FFFCF4' },
        '&:focus-visible': { outline: '2px solid var(--gold)', outlineOffset: 3 },
        ...sx,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {playing ? (
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
    </Box>
  );
}
