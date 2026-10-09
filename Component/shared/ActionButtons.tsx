import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Play, Volume2, ArrowDownToLine } from 'lucide-react';
import { colors, actionButtons, playBadge } from '../../src/theme/tokens';

interface ActionButtonsProps {
  onPlayVideo?: () => void;
  onPlayAudio?: () => void;
  onDownload?: () => void;
  downloadDisabled?: boolean;
}

const circleSx = {
  width: actionButtons.size,
  height: actionButtons.size,
  minWidth: actionButtons.size,
  borderRadius: '50%',
  flexShrink: 0,
};

/**
 * שלושת העיגולים — צפייה בווידאו / האזנה לשיעור / הורדה. BRIEF-PAGES.md.
 * שלושת הכפתורים מוצגים תמיד; כפתור ללא handler מוצג כמושבת.
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ onPlayVideo, onPlayAudio, onDownload, downloadDisabled }) => (
  <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
  <IconButton
        onClick={onPlayVideo}
        disabled={!onPlayVideo}
        aria-label="צפייה בווידאו"
        sx={{
          ...circleSx,
          bgcolor: actionButtons.video.bg,
          color: actionButtons.video.icon,
          '&:hover': { opacity: 0.85, bgcolor: actionButtons.video.bg },
          '&.Mui-disabled': { opacity: 0.35, bgcolor: actionButtons.video.bg, color: actionButtons.video.icon },
        }}
      >
        <Play fill="currentColor" size={9} strokeWidth={1} />
      </IconButton>

  <IconButton
        onClick={onPlayAudio}
        disabled={!onPlayAudio}
        aria-label="האזנה לשיעור"
        sx={{
          ...circleSx,
          backgroundImage: playBadge.background,
          color: playBadge.icon,
          '&:hover': { opacity: 0.85 },
          '&.Mui-disabled': { opacity: 0.35, color: playBadge.icon },
        }}
      >
        <Volume2 fill="currentColor" size={14} />
      </IconButton>

  <IconButton
        onClick={onDownload}
        disabled={!onDownload || downloadDisabled}
        aria-label="הורדת השיעור"
        sx={{
          ...circleSx,
          border: `1px solid ${actionButtons.download.border}`,
          color: actionButtons.download.icon,
          '&:hover': { bgcolor: `${colors.gold}1F` },
          '&.Mui-disabled': { opacity: 0.35, color: actionButtons.download.icon },
        }}
      >
        <ArrowDownToLine size={14} />
      </IconButton>
  </Box>
);

export default ActionButtons;
