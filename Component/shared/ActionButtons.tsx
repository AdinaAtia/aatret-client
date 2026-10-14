import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Play, Volume2, ArrowDownToLine } from 'lucide-react';

interface ActionButtonsProps {
  onPlayVideo?: () => void;
  onPlayAudio?: () => void;
  onDownload?: () => void;
  downloadDisabled?: boolean;
}

const circleSx = {
  width: 'var(--action-buttons-size)',
  height: 'var(--action-buttons-size)',
  minWidth: 'var(--action-buttons-size)',
  borderRadius: '50%',
  flexShrink: 0,
};

/**
 * שלושת העיגולים — צפייה בווידאו / האזנה לשיעור / הורדה. BRIEF-PAGES.md.
 * שלושת הכפתורים מוצגים תמיד; כפתור ללא handler מוצג כמושבת.
 */
/** הכפתורים יושבים בתוך שורות שהן קישורים; עוצרים את הלחיצה כדי שלא תנווט גם את השורה. */
const stopRow = (fn?: () => void) => (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  fn?.();
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPlayVideo, onPlayAudio, onDownload, downloadDisabled }) => (
  <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
  <IconButton
        onClick={stopRow(onPlayVideo)}
        disabled={!onPlayVideo}
        aria-label="צפייה בווידאו"
        sx={{
          ...circleSx,
          bgcolor: 'var(--wine)',
          color: 'var(--gold-light)',
          '&:hover': { opacity: 0.85, bgcolor: 'var(--wine)' },
          '&.Mui-disabled': { opacity: 0.35, bgcolor: 'var(--wine)', color: 'var(--gold-light)' },
        }}
      >
        <Play fill="currentColor" size={9} strokeWidth={1} />
      </IconButton>

  <IconButton
        onClick={stopRow(onPlayAudio)}
        disabled={!onPlayAudio}
        aria-label="האזנה לשיעור"
        sx={{
          ...circleSx,
          backgroundImage: 'var(--gradient-gold-button)',
          color: 'var(--ink-dark)',
          '&:hover': { opacity: 0.85 },
          '&.Mui-disabled': { opacity: 0.35, color: 'var(--ink-dark)' },
        }}
      >
        <Volume2 fill="currentColor" size={14} />
      </IconButton>

  <IconButton
        onClick={stopRow(onDownload)}
        disabled={!onDownload || downloadDisabled}
        aria-label="הורדת השיעור"
        sx={{
          ...circleSx,
          border: `1px solid var(--gold)`,
          color: 'var(--gold-text)',
          '&:hover': { bgcolor: `color-mix(in srgb, var(--gold) 12.157%, transparent)` },
          '&.Mui-disabled': { opacity: 0.35, color: 'var(--gold-text)' },
        }}
      >
        <ArrowDownToLine size={14} />
      </IconButton>
  </Box>
);

export default ActionButtons;
