import React, { useId } from 'react';
import { Box, Stack } from '@mui/material';

/**
 * נעילת הלוגו — כתר + כתובית "עטרת מרדכי", במקום אחד לסרגל, לתפריט הנייד ולפוטר.
 * TODO: להחליף ב-SVG יחיד (כתר + שם) כשהמעצב יספק. עד אז הכתר נבנה מ-logo.png (ראו Crown).
 */

/**
 * הכתר — הלוגו המקורי של הישיבה (logo.png), צבוע בזהב מתכתי.
 *
 * הקובץ בנוי ממילוי לבן אטום עם קווים כהים (#211E1E) על רקע שקוף, ולכן
 * מסכת שקיפות רגילה הייתה נותנת כתם זהב מלא. במקומה: feColorMatrix הופך
 * את הצבעים, ואז מסכת luminance מעבירה את הזהב רק במקום שבו היו הקווים
 * הכהים — המילוי הלבן נחסם. כל הפרטים נשמרים, כולל הכיתוב שבתוך הכתר.
 */
export const Crown: React.FC<{ width: number | string; height: number | string }> = ({ width, height }) => {
  const uid = useId().replace(/:/g, '');
  const gid = `crown-g-${uid}`;
  const mid = `crown-m-${uid}`;
  const fid = `crown-f-${uid}`;
  return (
    <Box
      component="svg"
      viewBox="0 0 184 156"
      sx={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={fid} colorInterpolationFilters="sRGB">
          {/* היפוך צבע, שמירה על ערוץ השקיפות */}
          <feColorMatrix
            type="matrix"
            values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
          />
        </filter>
        <mask id={mid}>
          <image href="/logo.png" x="0" y="0" width="184" height="156" filter={`url(#${fid})`} />
        </mask>
        <linearGradient id={gid} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#D9BC7F" />
          <stop offset="42%" stopColor={'var(--gold)'} />
          <stop offset="100%" stopColor={'var(--gold-deep)'} />
        </linearGradient>
      </defs>
      <rect width="184" height="156" fill={`url(#${gid})`} mask={`url(#${mid})`} />
    </Box>
  );
};

/** כתובית המותג. בדסקטופ עם שורת המשנה, בנייד בלעדיה — לפי קובץ העיצוב. */
export const Wordmark: React.FC<{ onClick?: () => void; withSubtitle?: boolean; titleSize?: string; titleWeight?: number }> = ({ onClick, withSubtitle = true, titleSize, titleWeight }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      lineHeight: 1,
      minWidth: 0,
    }}
  >
    <Box
      component="span"
      sx={{
        background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
        fontFamily: 'var(--font-heading)',
        fontSize: titleSize ?? (withSubtitle ? 'var(--t5)' : 'var(--logo-title-mobile)'),
        ...(titleWeight ? { fontWeight: titleWeight } : {}),
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      עטרת מרדכי
    </Box>
    {withSubtitle && (
      <Box
        component="span"
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--t1)',
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: 'var(--ink)',
          mt: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        ישיבת החיים והשלום
      </Box>
    )}
  </Box>
);


type LogoVariant = 'horizontal' | 'compact' | 'footer';

interface LogoProps {
  /**
   * horizontal — סרגל בדסקטופ: כתובית עם שורת משנה, ואחריה הכתר
   * compact    — סרגל/תפריט בנייד: כתובית בלבד, כתר קטן
   * footer     — כתר ואחריו כתובית (23px/700)
   */
  variant?: LogoVariant;
  onClick?: () => void;
  gap?: string | number;
}

const Logo: React.FC<LogoProps> = ({ variant = 'horizontal', onClick, gap }) => {
  if (variant === 'footer') {
    return (
      <Stack direction="row" alignItems="center" sx={{ gap: gap ?? 1 }}>
        <Crown width="var(--header-controls-crown-md-w)" height="var(--header-controls-crown-md-h)" />
        <Wordmark withSubtitle={false} titleSize="23px" titleWeight={700} />
      </Stack>
    );
  }
  const full = variant === 'horizontal';
  return (
    <Stack
      direction="row"
      alignItems="center"
      {...(onClick
        ? {
            component: 'a',
            href: '/',
            'aria-label': 'עטרת מרדכי — לדף הבית',
            onClick: (e: React.MouseEvent) => {
              if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onClick();
            },
          }
        : {})}
      sx={{ gap: gap ?? '12px', flexShrink: 0, cursor: onClick ? 'pointer' : 'default', textDecoration: 'none', color: 'inherit' }}
    >
      <Wordmark withSubtitle={full} />
      <Crown
        width={full ? 'var(--header-controls-crown-md-w)' : 'var(--header-controls-crown-xs-w)'}
        height={full ? 'var(--header-controls-crown-md-h)' : 'var(--header-controls-crown-xs-h)'}
      />
    </Stack>
  );
};

export default Logo;
