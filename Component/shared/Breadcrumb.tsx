import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fonts, breadcrumb, headerHeight } from '../../src/theme/tokens';

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
        bgcolor: breadcrumb.bg,
        borderBottom: `1px solid ${breadcrumb.borderColor}`,
        py: `${breadcrumb.padding.y}px`,
        px: { xs: '20px', md: `${breadcrumb.padding.x}px` },
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: `${breadcrumb.size}px`,
        fontFamily: fonts.body,
        ...(sticky && {
          position: 'sticky',
          top: { xs: `${headerHeight.xs}px`, md: `${headerHeight.md}px` },
          zIndex: 10,
        }),
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <Box component="span" aria-hidden="true" sx={{ color: breadcrumb.linkColor }}>
                {breadcrumb.separator}
              </Box>
            )}
            {isLast || !item.path ? (
              <Box component="span" sx={{ color: breadcrumb.currentColor, fontWeight: 600 }}>
                {item.label}
              </Box>
            ) : (
              <Box
                component="span"
                role="link"
                tabIndex={0}
                onClick={() => navigate(item.path!)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(item.path!); }}
                sx={{ color: breadcrumb.linkColor, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
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
