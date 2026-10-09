import React from 'react';
import { Box } from '@mui/material';
import { Play } from 'lucide-react';
import { playBadge } from '../../src/theme/tokens';

interface PlayBadgeProps {
  size?: number;
}

/** עיגול נגן זהב מעל תמונה ממוזערת. כל הצבעים מ-playBadge בטוקנים. ממורכז בתוך הורה ב-position: relative */
const PlayBadge: React.FC<PlayBadgeProps> = ({ size = 44 }) => (
  <Box sx={{
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%',
    backgroundImage: playBadge.background, color: playBadge.icon,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
  }}>
    <Play fill="currentColor" size={Math.round(size * playBadge.iconRatio)} strokeWidth={1} />
  </Box>
);

export default PlayBadge;
