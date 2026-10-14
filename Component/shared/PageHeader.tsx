import React from 'react';
import { Box, Typography } from '@mui/material';
import SectionFlourish from './SectionFlourish';
import SectionArch from './SectionArch';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
}

/**
 * רצועת כותרת עמוד — משותפת לכל תתי־העמודים (ארכיון, שיעור בודד, ספרים, צור קשר, אודות).
 * מידות: BRIEF-PAGES.md, מאומת מול ateret-mordechai-design (2).pdf עמ' 3 (גובה 259px, רקע #EFE6D0).
 */
const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title }) => (
  <Box
    component="header"
    sx={{
      bgcolor: 'var(--parchment-2)',
      borderBottom: `1px solid var(--gold)`,
      textAlign: 'center',
      pt: { xs: '14px', md: `var(--page-header-padding-top)` },
      pb: { xs: '12px', md: `var(--page-header-padding-bottom)` },
      px: { xs: '20px', md: `var(--page-header-padding-x)` },
    }}
  >
    <SectionArch mb="5px" />

    {eyebrow && (
      <Typography
        sx={{
          fontSize: `var(--page-header-eyebrow-size)`,
          letterSpacing: 'var(--page-header-eyebrow-letter-spacing)',
          color: 'var(--gold-text)',
          fontWeight: 'var(--page-header-eyebrow-weight)',
          fontFamily: 'var(--font-body)',
          mb: '2px',
        }}
      >
        {eyebrow}
      </Typography>
    )}

    <Typography
      component="h1"
      sx={{
        fontFamily: 'var(--font-heading)',
        fontSize: { xs: '28px', md: `var(--page-header-title-size)` },
        fontWeight: 'var(--page-header-title-weight)',
        color: 'var(--ink-wine)',
        lineHeight: 1.2,
        m: 0,
      }}
    >
      {title}
    </Typography>

    <SectionFlourish />
  </Box>
);

export default PageHeader;
