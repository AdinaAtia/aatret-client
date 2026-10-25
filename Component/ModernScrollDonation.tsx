import AppButton from './shared/AppButton';
import PageHeader from './shared/PageHeader';
import SectionArch from './shared/SectionArch';
import SectionFlourish from './shared/SectionFlourish';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Globe, Users, Heart, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import content from './donationContent.json';

// כל אפיק מוביל ישר לדף התשלום בנדרים פלוס; Analytic שונה לכל אחד כדי לדעת מה נבחר
const paymentUrl = (analytic: string) =>
  `${content.nedarimUrl.split('&Analytic=')[0]}&Analytic=${encodeURIComponent(analytic)}`;

const donationOptions = [
  { title: 'מגבית לחידוש ותרומות לאתר הישיבה', subtitle: 'בזכותך – קול התורה לא ייפסק', icon: <Globe size={24} />, href: paymentUrl('אתר-מגבית') },
  { title: 'תרומה כללית', subtitle: 'עבור החזקת פעילות הישיבה והפצת התורה', icon: <Heart size={24} />, href: paymentUrl('אתר-כללית') },
  { title: 'אחזקת אברך בחודש', subtitle: 'קנה לך שותף למשמרת הלימוד של הישיבה', icon: <Users size={24} />, href: paymentUrl('אתר-אברך') },
];

const LuxuryDonationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--parchment)', direction: 'rtl' }}>
      <PageHeader eyebrow="שותפות נצח" title="תרומות" />

      <Box sx={{ py: { xs: '48px', md: 'var(--s6)' }, px: { xs: '16px', md: '24px' } }}>
        {/* מלבן אחד: מסגרת זהב ופינות פעם אחת, היין והבהיר מתחלקים בתוכו (כמו בדף הבית) */}
        <Box sx={{
          maxWidth: 'var(--donation-section-max-width)',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          border: '1px solid var(--gold)',
          borderRadius: 'var(--donation-section-radius)',
          overflow: 'hidden',
        }}>
          {/* החלק היין — אפיקי התרומה */}
          <Box sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 'var(--donation-section-card-wine-width)' },
            boxSizing: 'border-box',
            bgcolor: 'var(--wine)',
            p: { xs: '32px 24px', md: 'var(--donation-section-wine-pad)' },
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography sx={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--donation-section-wine-eyebrow-size)',
              fontWeight: 700,
              letterSpacing: 'var(--donation-section-wine-eyebrow-letter-spacing)',
              color: 'var(--gold)',
              mb: 'var(--s3)',
            }}>שותפות נצח</Typography>

            <Typography component="h2" sx={{
              fontFamily: 'var(--font-heading-ornate)',
              fontSize: 'var(--donation-section-wine-title-size)',
              fontWeight: 400,
              lineHeight: 1.2,
              background: 'var(--gradient-gold-text-vertical)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}>החזקת התורה</Typography>

            <Typography sx={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--donation-section-wine-subtitle-size)',
              color: 'var(--gold-light)',
              mt: 'var(--s4)',
              mb: 'var(--s4)',
            }}>בחרו את אפיק הזכות שלכם:</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
              {donationOptions.map((option) => (
                <Box
                  key={option.title}
                  component="a"
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--s3)',
                    width: '100%',
                    boxSizing: 'border-box',
                    textAlign: 'right',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    p: 'var(--s3)',
                    border: '1px solid color-mix(in srgb, var(--gold) 34.902%, transparent)',
                    borderRadius: 'var(--donation-section-letter-inner-radius)',
                    transition: 'border-color 0.2s, background-color 0.2s',
                    '&:hover, &:focus-visible': {
                      borderColor: 'var(--gold)',
                      bgcolor: 'color-mix(in srgb, var(--gold) 10%, transparent)',
                    },
                    '&:focus-visible': { outline: '2px solid var(--gold-light)', outlineOffset: '2px' },
                  }}
                >
                  <Box sx={{ color: 'var(--gold)', display: 'flex', flexShrink: 0 }}>{option.icon}</Box>
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--t3)', color: 'var(--gold-light)', lineHeight: 1.3 }}>
                      {option.title}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--book-purchase-card-sub-text-color)', mt: 'var(--s1)' }}>
                      {option.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1, minHeight: 'var(--s5)' }} />

            <AppButton onClick={() => navigate('/DonateLetter')} sx={{ width: '100%' }}>
              אני רוצה להיות שותף
            </AppButton>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s2)', mt: 'var(--s4)', color: 'var(--book-purchase-card-muted-text-color)' }}>
              <ShieldCheck size={16} />
              <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t1)', color: 'inherit' }}>
                תשלום מאובטח בתקן PCI-DSS
              </Typography>
            </Box>
          </Box>

          {/* החלק הבהיר — עץ חיים והסרטון */}
          <Box sx={{
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
            bgcolor: 'var(--surface)',
            p: 'var(--donation-section-letter-inner-inset)',
          }}>
            <Box sx={{
              height: '100%',
              boxSizing: 'border-box',
              border: '1px solid color-mix(in srgb, var(--gold) 34.902%, transparent)',
              borderRadius: 'var(--donation-section-letter-inner-radius)',
              p: { xs: '24px 16px', md: 'var(--donation-section-letter-pad)' },
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '40px' } }}>
                <SectionArch mb="16px" />
                <Typography component="h2" sx={{
                  fontFamily: 'var(--font-heading-ornate)',
                  fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
                  fontWeight: 400,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  color: 'var(--wine)',
                }}>עץ חיים היא למחזיקים בה</Typography>
                <SectionFlourish mt="24px" />
              </Box>

              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 'var(--s3)' }}>
                <Box sx={{
                  width: '100%',
                  maxWidth: 'var(--donation-section-video-max-width)',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  borderRadius: 'var(--donation-section-video-radius)',
                  border: '1px solid var(--gold)',
                  bgcolor: 'var(--ink)',
                }}>
                  <iframe
                    src="https://www.youtube.com/embed/7YVDVwYOM3E"
                    title="דברי ראש הישיבה"
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block', border: 'none' }}
                  />
                </Box>
              </Box>

              <Box sx={{ borderTop: '1px solid var(--rule-soft)', pt: 'var(--s2)', display: 'flex', alignItems: 'baseline', gap: 'var(--s2)' }}>
                <Typography sx={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--donation-section-letter-name-size)', fontWeight: 400, color: 'var(--ink-wine)' }}>
                  הרב מרדכי עטייה שליט״א
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--donation-section-letter-role-size)', color: 'var(--muted)' }}>
                  · ראש הישיבה
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default LuxuryDonationPage;
