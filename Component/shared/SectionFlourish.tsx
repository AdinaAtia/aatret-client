import React from 'react';
import { Box } from '@mui/material';

interface SectionFlourishProps {
  /** מרווח עליון מעל הקו (ברירת מחדל 5px, כמו ברצועת הכותרת) */
  mt?: string | number;
  /** מרווח תחתון מתחת לקו */
  mb?: string | number;
  /** אורך כל קו (ברירת מחדל מה-tokens) */
  lineW?: number;
  /** יישור — ברירת מחדל מרכז */
  justify?: 'center' | 'flex-start' | { xs?: string; md?: string };
}

/**
 * הקו עם המעוין שמתחת לכותרת קטע/עמוד — מקור אחד לכל האתר.
 * ערכים מ-pageHeader.flourish ב-tokens: קווים של 96px שמתעממים החוצה, מעוין 6px, רווח 10px.
 */
const SectionFlourish: React.FC<SectionFlourishProps> = ({ mt = '5px', mb, lineW: lineWProp, justify = 'center' }) => {
  const tokenLineW = 'var(--page-header-flourish-line-w)';
  const color = 'var(--gold-button-border)';
  const diamond = 'var(--page-header-flourish-diamond)';
  const lineW = lineWProp ?? tokenLineW;
  return (
    <Box aria-hidden="true" sx={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: '10px', mt, mb }}>
      <Box sx={{ width: lineW, height: '1px', background: `linear-gradient(90deg, transparent, ${color})` }} />
      <Box sx={{ width: diamond, height: diamond, bgcolor: color, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <Box sx={{ width: lineW, height: '1px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </Box>
  );
};

export default SectionFlourish;
