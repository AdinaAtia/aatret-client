import React from 'react';
import { Box } from '@mui/material';
import { Play } from 'lucide-react';
import { cssNumber } from '../../src/styles/cssVar';

interface PlayBadgeProps {
  size?: number;
}

/** עיגול נגן זהב מעל תמונה ממוזערת. כל הצבעים מ-playBadge בטוקנים. ממורכז בתוך הורה ב-position: relative */
const PlayBadge: React.FC<PlayBadgeProps> = ({ size = 44 }) => (
  <Box sx={{
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%',
    backgroundImage: 'var(--gradient-gold-button)', color: 'var(--ink-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
  }}>
    <Play fill="currentColor" size={Math.round(size * cssNumber('--play-badge-icon-ratio'))} strokeWidth={1} />
  </Box>
);

export default PlayBadge;
