import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { Crown } from '../Header';
import PlayBadge from './PlayBadge';

interface LessonThumbProps extends Omit<BoxProps, 'children'> {
  /**
   * כתובת תמונה, או רשימת כתובות לפי סדר ניסיון (למשל maxres → sd → hq).
   * ריק, או שכולן נכשלו = מציגים את הכתר.
   */
  src?: string | null | string[];
  alt?: string;
  /** רוחב הכתר בפיקסלים. הגובה נגזר מיחס הלוגו 184:156 */
  crownWidth?: number;
  /** object-position של התמונה (ברירת מחדל: center) */
  imagePosition?: string;
  /** גודל סמן נגן ממורכז מעל התמונה. כשאין תמונה הכתר מוזז מעליו כדי שלא יתכסה */
  playSize?: number;
  children?: React.ReactNode;
}

/** תמונות ממוזערות של יוטיוב לפי מזהה, מהאיכות הגבוהה לנמוכה. ל-hq יש פסים שחורים — לכן cover ב-16/9 */
export const youtubeThumbSources = (youtubeId?: string | null): string[] =>
  youtubeId ? ['maxresdefault', 'sddefault', 'hqdefault'].map((q) => `https://i.ytimg.com/vi/${youtubeId}/${q}.jpg`) : [];

/**
 * תמונת סרטון/שיעור עם חלופה: כשאין תמונה, או שכל המקורות נכשלו בטעינה, מוצג רקע הקשת
 * והכתר — אותו עיצוב כמו כרטיס רב בלי דיוקן ב-Home (rabbiCard.arch.fill + <Crown>).
 * ילדים (למשל תווית אורך או סמן נגן) מוצגים מעל התמונה.
 */
const LessonThumb: React.FC<LessonThumbProps> = ({ src, alt = '', crownWidth = 46, imagePosition = 'center', playSize, children, sx, ...rest }) => {
  const sources = (Array.isArray(src) ? src : [src]).filter((s): s is string => !!s);
  const key = sources.join('|');

  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [key]);

  const current = sources[idx];
  // מקור אחרון שנכשל => idx חורג מהרשימה => מציגים כתר
  const next = () => setIdx((i) => i + 1);

  return (
    <Box
      {...rest}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'var(--rabbi-card-arch-fill)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {current ? (
        <Box
          component="img"
          src={current}
          alt={alt}
          loading="lazy"
          onError={next}
          // יוטיוב מחזיר במקום 404 תמונת "אין תצוגה" אפורה בגודל 120×90 — מדלגים לאיכות הבאה
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            if (e.currentTarget.naturalWidth <= 120) next();
          }}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition }}
        />
      ) : (
        <Box sx={{ display: 'flex', transform: playSize ? `translateY(-${Math.round(playSize * 0.9)}px)` : undefined }}>
          <Crown width={crownWidth} height={Math.round((crownWidth * 156) / 184)} />
        </Box>
      )}
      {playSize && <PlayBadge size={playSize} />}
      {children}
    </Box>
  );
};

export default LessonThumb;
