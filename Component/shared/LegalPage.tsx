import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import PageHeader from './PageHeader';
import Breadcrumb from './Breadcrumb';
import type { LegalSection } from '../../src/content/legal';

interface LegalPageProps {
  eyebrow?: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  /** תוכן נוסף אחרי הסעיפים (למשל פרטי רכז הנגישות) */
  children?: React.ReactNode;
  /** תאריך עדכון — לא מוצג כשהוא ריק */
  updated?: string;
}

/** עמוד טקסט משפטי (הצהרת נגישות, תנאי שימוש) — כותרת, פירורי לחם וסעיפים בעימוד קריא */
const LegalPage: React.FC<LegalPageProps> = ({ eyebrow, title, intro, sections, children, updated }) => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'var(--parchment)', direction: 'rtl' }}>
    <PageHeader eyebrow={eyebrow} title={title} />
    <Breadcrumb items={[{ label: 'דף הבית', path: '/' }, { label: title }]} />

    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 }, px: { xs: '16px', md: '24px' } }}>
      <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.8, color: 'var(--ink-wine)', mb: 5 }}>
        {intro}
      </Typography>

      {sections.map((section) => (
        <Box component="section" key={section.heading} sx={{ mb: 5 }}>
          <Typography
            component="h2"
            sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '22px', md: '26px' }, color: 'var(--ink-wine)', mb: 1.5, lineHeight: 1.3 }}
          >
            {section.heading}
          </Typography>
          {section.paragraphs?.map((p) => (
            <Typography key={p} sx={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.8, color: 'var(--ink-wine)', mb: 1.5 }}>
              {p}
            </Typography>
          ))}
          {section.items && (
            <Box component="ul" sx={{ m: 0, pr: '22px', pl: 0 }}>
              {section.items.map((item) => (
                <Box
                  component="li"
                  key={item}
                  sx={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.8, color: 'var(--ink-wine)', mb: 0.75 }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}

      {children}

      {updated && (
        <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--gold-text)', mt: 4 }}>
          עודכן לאחרונה: {updated}
        </Typography>
      )}
    </Container>
  </Box>
);

export default LegalPage;
