import React from 'react';
import { Box } from '@mui/material';

import { colors } from '../../src/theme/tokens';
interface SectionArchProps {
  /** מרווח תחתון מתחת לקשת */
  mb?: string | number;
}

const W = 46;
const H = 26;
const RX = 23;
const RY = 9;
/** עובי הקו — דק כמו הקו שבעיטור מתחת לכותרת (SectionFlourish) */
const STROKE = 0.75;

/**
 * קשת ארון הקודש מעל כותרת קטע בדף הבית — מקור אחד.
 * נמדד מהווקטור ב-PDF (1440px): 46×26, קשת אליפטית 23×9, פתוחה מלמטה, צבע #A6812F.
 * מצויר כ-SVG כדי שהעובי יהיה זהה לעובי הקו של SectionFlourish ולא יתעבה כמו border.
 */
const SectionArch: React.FC<SectionArchProps> = ({ mb = '12px' }) => {
  const o = STROKE / 2;
  return (
    <Box
      component="svg"
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      sx={{ display: 'block', mx: 'auto', mb, overflow: 'visible' }}
    >
      <path
        d={`M${o} ${H} V${RY} A${RX - o} ${RY - o} 0 0 1 ${W - o} ${RY} V${H}`}
        fill="none"
        stroke={colors.goldButtonBorder}
        strokeWidth={STROKE}
      />
    </Box>
  );
};

export default SectionArch;
