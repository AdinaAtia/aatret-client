import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** דביק מתחת להאדר הקבוע בזמן הגלילה */
  sticky?: boolean;
}

/** פירורי לחם — משותף לתתי־העמודים (שיעור בודד, עמוד ספר, צור קשר...). BRIEF-PAGES.md */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, sticky }) => {
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      aria-label="פירורי לחם"
      sx={{
        bgcolor: 'var(--parchment-2)',
        borderBottom: `1px solid var(--gold)`,
        py: `var(--breadcrumb-padding-y)`,
        px: { xs: '20px', md: `var(--breadcrumb-padding-x)` },
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: `var(--breadcrumb-size)`,
        fontFamily: 'var(--font-body)',
        ...(sticky && {
          position: 'sticky',
          top: { xs: `var(--header-height-xs)`, md: `var(--header-height-md)` },
          zIndex: 10,
        }),
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <Box component="span" aria-hidden="true" sx={{ color: 'var(--gold-text)' }}>
                {"›"}
              </Box>
            )}
            {isLast || !item.path ? (
              <Box component="span" sx={{ color: 'var(--ink-wine)', fontWeight: 600 }}>
                {item.label}
              </Box>
            ) : (
              <Box
                component="span"
                role="link"
                tabIndex={0}
                onClick={() => navigate(item.path!)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(item.path!); }}
                sx={{ color: 'var(--gold-text)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                {item.label}
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default Breadcrumb;
