import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import LegalPage from './shared/LegalPage';
import PhoneNumber from './shared/PhoneNumber';
import { site } from '../src/content/site';
import { accessibilityContent } from '../src/content/legal';

const toTelHref = (phone: string) => `tel:+972${phone.replace(/^0/, '').replace(/-/g, '')}`;

const linkSx = { color: 'var(--ink-wine)', textDecorationColor: 'var(--gold)' } as const;

/** הצהרת נגישות — נוסח ב-src/content/legal.ts, פרטי הרכז ב-src/content/site.ts (ערך ריק לא מוצג) */
const Accessibility = () => {
  const { name, phone, email } = site.accessibilityCoordinator;
  const hasCoordinator = !!(name || phone || email);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  return (
    <LegalPage
      eyebrow="נגישות"
      title="הצהרת נגישות"
      intro={accessibilityContent.intro}
      sections={accessibilityContent.sections}
      updated={site.legalUpdated}
    >
      <Box component="section" sx={{ mb: 5 }}>
        <Typography component="h2" sx={{ fontFamily: 'var(--font-heading)', fontSize: { xs: '22px', md: '26px' }, color: 'var(--ink-wine)', mb: 1.5, lineHeight: 1.3 }}>
          פרטי רכז הנגישות
        </Typography>
        {hasCoordinator ? (
          <Box sx={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.9, color: 'var(--ink-wine)' }}>
            {name && <div>שם: {name}</div>}
            {phone && (
              <div>
                טלפון:{' '}
                <Box component="a" href={toTelHref(phone)} sx={linkSx}>
                  <PhoneNumber>{phone}</PhoneNumber>
                </Box>
              </div>
            )}
            {email && (
              <div>
                מייל:{' '}
                <Box component="a" href={`mailto:${email}`} sx={linkSx}>{email}</Box>
              </div>
            )}
          </Box>
        ) : (
          <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.8, color: 'var(--ink-wine)' }}>
            פרטי רכז הנגישות יפורסמו כאן בקרוב. עד אז אפשר לפנות דרך{' '}
            <Box component="a" href="/ContactForm" sx={linkSx}>עמוד צור קשר</Box>
            {' '}או בטלפון המשרד: <PhoneNumber>{site.phones.general}</PhoneNumber>.
          </Typography>
        )}
      </Box>
    </LegalPage>
  );
};

export default Accessibility;
