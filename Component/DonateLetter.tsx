import { useEffect } from 'react';
import { Box, Typography, Button, Container, Divider, Stack } from '@mui/material';
import content from './donationContent.json';

import { colors, goldButtonStyle } from '../src/theme/tokens';
const GOLD = colors.gold;
const DARK = '#000000';

const DonateLetter = () => {
  const { hebrew: he, english: en, nedarimUrl, contactEmail } = content;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfbf7', py: 4, direction: 'rtl' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start" sx={{ direction: 'ltr' }}>

          {/* תוכן - צד שמאל */}
          <Box sx={{ flex: 1 }}>

            {/* חלק עברי */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: DARK, mb: 2 }}>
                {he.bankTitle}
              </Typography>
              {he.bankDetails.map((line, i) => (
                <Typography key={i} sx={{ fontSize: '1rem', color: DARK, lineHeight: 2 }}>{line}</Typography>
              ))}

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '1rem', color: DARK }}>
                  {he.creditCardText}{' '}
                  <Box component="a" href={nedarimUrl} target="_blank" rel="noopener noreferrer"
                    sx={{ color: GOLD, fontWeight: 700, textDecoration: 'underline' }}>
                    {he.creditCardLink}
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: DARK, mt: 1 }}>{he.taxNote}</Typography>
                <Typography sx={{ fontSize: '1rem', color: DARK, mt: 1 }}>{he.emailNote}</Typography>
                <Box component="a" href={`mailto:${contactEmail}`}
                  sx={{ color: GOLD, fontWeight: 700, fontSize: '1rem', display: 'block', mt: 0.5 }}>
                  {contactEmail}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '1rem', color: DARK, fontWeight: 700 }}>{he.closing}</Typography>
                <Typography sx={{ fontSize: '1rem', color: DARK, fontWeight: 700 }}>{he.signature}</Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: GOLD, opacity: 0.5, mb: 4 }} />

            {/* חלק אנגלי */}
            <Box sx={{ textAlign: 'left', direction: 'ltr', mb: 4 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: DARK, mb: 0.5 }}>{en.title}</Typography>
              <Typography sx={{ fontSize: '1rem', color: GOLD, mb: 1, fontStyle: 'italic' }}>{en.subtitle}</Typography>
              <Typography sx={{ fontSize: '0.95rem', color: DARK, mb: 1 }}>{en.greeting}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, mb: 2 }}>{en.intro}</Typography>

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK, mb: 0.5 }}>{en.treasuryTitle}</Typography>
              {en.treasuryPoints.map((p, i) => (
                <Typography key={i} sx={{ fontSize: '0.9rem', color: DARK }}>• {p}</Typography>
              ))}

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK, mt: 2, mb: 0.5 }}>{en.challengeTitle}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK }}>{en.challengeText}</Typography>

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK, mt: 2, mb: 0.5 }}>{en.opportunityTitle}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK }}>{en.opportunityText}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, mt: 1 }}>
                {en.callToAction}{' '}
                <Box component="a" href={`mailto:${contactEmail}`} sx={{ color: GOLD, fontWeight: 700 }}>{contactEmail}</Box>
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, mt: 1 }}>{en.taxNote}</Typography>

              <Divider sx={{ my: 2, borderColor: GOLD, opacity: 0.4 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK }}>{en.fromAbroad}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, mt: 0.5 }}>
                <strong>{en.creditCardLabel}</strong>{' '}
                <Box component="a" href={nedarimUrl} target="_blank" rel="noopener noreferrer"
                  sx={{ color: GOLD, fontWeight: 700, textDecoration: 'underline' }}>
                  {en.creditCardLink}
                </Box>
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK, mt: 2 }}>{en.usBankTitle}</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: DARK, mt: 0.5 }}>{en.usBankDetails}</Typography>

              <Divider sx={{ my: 2, borderColor: GOLD, opacity: 0.4 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: DARK }}>{en.prayerTitle}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, fontStyle: 'italic', mt: 0.5, mb: 1 }}>{en.prayer}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK }}>{en.closing}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: DARK }}>{en.signature1}</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: DARK, mb: 2 }}>{en.signature2}</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: GOLD, fontStyle: 'italic' }}>{en.footer}</Typography>
            </Box>

            {/* כפתור תרומה */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button variant="contained" href={nedarimUrl} target="_blank" rel="noopener noreferrer"
                sx={{ ...goldButtonStyle, py: 2, px: 6, borderRadius: '50px', fontWeight: 900, fontSize: '1.1rem' }}>
                לתרומה בכרטיס אשראי
              </Button>
            </Box>

          </Box>

        </Stack>
      </Container>
    </Box>
  );
};

export default DonateLetter;
