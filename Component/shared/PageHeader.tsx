import React from 'react';
import { Box, Typography } from '@mui/material';
import { fonts, pageHeader } from '../../src/theme/tokens';
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
      bgcolor: pageHeader.bg,
      borderBottom: `1px solid ${pageHeader.borderColor}`,
      textAlign: 'center',
      pt: { xs: '14px', md: `${pageHeader.padding.top}px` },
      pb: { xs: '12px', md: `${pageHeader.padding.bottom}px` },
      px: { xs: '20px', md: `${pageHeader.padding.x}px` },
    }}
  >
    <SectionArch mb="5px" />

    {eyebrow && (
      <Typography
        sx={{
          fontSize: `${pageHeader.eyebrow.size}px`,
          letterSpacing: pageHeader.eyebrow.letterSpacing,
          color: pageHeader.eyebrow.color,
          fontWeight: pageHeader.eyebrow.weight,
          fontFamily: fonts.body,
          mb: '2px',
        }}
      >
        {eyebrow}
      </Typography>
    )}

    <Typography
      component="h1"
      sx={{
        fontFamily: fonts.heading,
        fontSize: { xs: '28px', md: `${pageHeader.title.size}px` },
        fontWeight: pageHeader.title.weight,
        color: pageHeader.title.color,
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
