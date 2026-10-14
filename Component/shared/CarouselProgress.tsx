import { useRef } from 'react';
import { Box } from '@mui/material';

/** חצי קרוסלה בדסקטופ — אחידים בכל הקטעים; בנייד מוסתרים ומשתמשים בסרגל */
export const carouselArrowSx = {
  display: { xs: 'none', md: 'inline-flex' },
  width: '44px',
  height: '44px',
  flexShrink: 0,
  color: 'var(--gold-text)',
  border: `1px solid var(--gold)`,
  borderRadius: 'var(--radius-pill)',
  backgroundColor: 'transparent',
  transition: 'background-color 0.25s ease, opacity 0.2s ease',
  '&:hover': { backgroundColor: 'var(--sand)' },
  '&.Mui-disabled': { opacity: 0.3, color: 'var(--gold-text)' },
} as const;

const THUMB = 0.32; // רוחב הידית מתוך הפס

/**
 * סרגל התקדמות זהב שאפשר לגרור או ללחוץ עליו כדי להזיז את הקרוסלה.
 * הפס עצמו דק, אבל שטח הלחיצה סביבו גדול כדי שיהיה נוח באצבע.
 * progress ו-onSeek הם בין 0 ל-1, כש-0 הוא ההתחלה (ימין, RTL).
 */
const CarouselProgress = ({
  progress,
  onSeek,
  hideOnDesktop = false,
}: {
  progress: number;
  onSeek: (fraction: number) => void;
  hideOnDesktop?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const seekFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    // מרכז הידית במרחק מהימין; מנרמלים לטווח שבו הידית נעה
    const fromRight = (rect.right - clientX) / rect.width;
    onSeek(Math.min(1, Math.max(0, (fromRight - THUMB / 2) / (1 - THUMB))));
  };

  return (
    <Box
      ref={trackRef}
      role="slider"
      aria-label="מיקום בקרוסלה"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromPointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e.clientX);
      }}
      sx={{
        display: { xs: 'flex', md: hideOnDesktop ? 'none' : 'flex' },
        alignItems: 'center',
        width: { xs: '160px', md: '180px' },
        height: '32px',
        mx: 'auto',
        mt: { xs: '8px', md: '16px' },
        position: 'relative',
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '6px', bgcolor: `color-mix(in srgb, var(--gold) 25.098%, transparent)`, borderRadius: '3px' }}>
        <Box sx={{
          position: 'absolute', top: 0, bottom: 0, width: `${THUMB * 100}%`,
          right: `${progress * (1 - THUMB) * 100}%`,
          bgcolor: 'var(--gold)', borderRadius: '3px',
          transition: 'right 0.1s linear',
        }} />
      </Box>
    </Box>
  );
};

export default CarouselProgress;
