import React from 'react';
import { Box, Container, Typography, Link, Stack, Grid  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRabbis } from '../src/context/RabbisContext';
import { colors, fonts, fontSize, goldTextFill, headerControls } from '../src/theme/tokens';
import { site } from '../src/content/site';
import { Crown } from './Header';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

// --- הגדרות צבעים (תואם ל-Header שלך) ---
const COLORS = {
  // #2B1213 — נמדד בפיקסלים ישירות מרקע הפוטר בעמוד 1 של המוקאפ (לא מהצהרת הטקסט
  // בעמוד 9, שאומרת #4A0F14 אך לא תואמת את מה שבאמת מרונדר שם — טעות תיוג כמו
  // שכבר נמצאה ב-gold-text וב-ink)
  footerBg: '#2B1213',
  white: '#ffffff',
  gold: colors.gold,
  divider: `${colors.gold}4D`, // ~30% — זהה לשקיפות שהייתה כאן קודם (rgba(197,160,89,0.3))
};

/** טלפון להזמנת ספרים כקישור tel: — 03-6815542 → +97236815542 */
const booksPhoneHref = `tel:+972${site.phones.books.replace(/^0/, '').replace(/-/g, '')}`;

/** "יום חמישי" → "חמישי", לשורת "שיעור שבועי · חמישי 17:30" כמו במוקאפ */
const weeklyDayShort = site.weeklyLesson.day.replace(/^יום\s/, '');

const columnHeadingSx = {
  fontFamily: fonts.headingOrnate,
  color: COLORS.gold,
  fontWeight: 500,
  mb: 0.5,
  borderBottom: `1px solid ${COLORS.divider}`,
  display: 'inline-block',
  pb: 0.8,
} as const;

/**
 * שורת "צור קשר" עם אייקון — פינה/טלפון/וואטסאפ, לפי המוקאפ.
 * fonts.body (Heebo) ולא fonts.heading — Yetzira מיועד לכותרות בלבד, לא לטקסט רשימה.
 * fontSize.sm (14px) מהסולם הרשמי, לא מספר rem חופשי.
 */
const contactLineSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.8,
  fontFamily: fonts.body,
  fontSize: fontSize.sm,
  opacity: 0.85,
} as const;

const contactIconSx = { fontSize: '1rem', color: COLORS.gold, flexShrink: 0 } as const;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { rabbis } = useRabbis();

  return (
    <Box 
      component="footer" 
      sx={{
        background: COLORS.footerBg,
        color: COLORS.white,
        py: { xs: 2, md: 3 }, 
        borderTop: `1px solid ${COLORS.gold}33`,
        mt: 'auto', 
        direction: 'rtl' 
      }}
    >
      <Container maxWidth="lg">
        {/* שימוש ב-Grid2 — ארבע עמודות שוות, לפי המוקאפ */}
        <Grid container spacing={3} justifyContent="flex-start">

          {/* עמודה 1: לוגו ותיאור */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Crown width={headerControls.crown.md.w} height={headerControls.crown.md.h} />
              <Typography
                sx={{
                  ...goldTextFill,
                  fontFamily: fonts.heading,
                  fontSize: '1.5rem',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                }}
              >
                עטרת מרדכי
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: COLORS.white,
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.75,
              }}
            >
              ישיבת החיים והשלום — בית מדרש לתורת הקבלה על פי תורת האר״י ז״ל.
            </Typography>
          </Grid>

          {/* עמודה 2: ניווט */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={columnHeadingSx}>
              ניווט
            </Typography>
            <Stack spacing={0.5}>
              {[
                { label: 'דף הבית', href: '/' },
                { label: 'שיעורים', href: '/AllLessons' },
                { label: 'ספרים', href: '/FullBooksPage' },
                { label: 'אודות הישיבה', href: '/About' },
                { label: 'צור קשר', href: '/ContactForm' },
                { label: 'תרומות', href: '/ModernScrollDonation' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  sx={{
                    fontFamily: fonts.body,
                    color: COLORS.white,
                    textDecoration: 'none',
                    fontSize: fontSize.sm,
                    opacity: 0.8,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* עמודה 3: רבני הישיבה (דינמי) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={columnHeadingSx}>
              רבני הישיבה
            </Typography>
            <Stack spacing={0.5}>
              {rabbis.map((rabbi) => (
                <Typography
                  key={rabbi.id}
                  variant="body2"
                  onClick={() => navigate('/AllLessons', { state: { rabbiId: rabbi.id } })}
                  sx={{
                    fontFamily: fonts.body,
                    color: COLORS.white,
                    opacity: 0.8,
                    fontSize: fontSize.sm,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                  }}
                >
                  {rabbi.name}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* עמודה 4: צור קשר — כל הערכים מ-src/content/site.ts, ערך ריק לא מוצג */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={columnHeadingSx}>
              צור קשר
            </Typography>
            <Stack spacing={{ xs: 2, md: 0.7 }}>
              <Typography sx={contactLineSx}>
                <RoomOutlinedIcon sx={contactIconSx} />
                {site.weeklyLesson.place} · {site.addresses.yeshiva}
              </Typography>
              <Typography sx={{ ...contactLineSx, pr: '1.65rem' /* יישור מתחת לטקסט שמעליו, בלי אייקון חוזר */ }}>
                משרד: {site.addresses.office}
              </Typography>
              <Link
                href={booksPhoneHref}
                sx={{
                  ...contactLineSx,
                  color: COLORS.white,
                  textDecoration: 'none',
                  '&:hover': { opacity: 1, textDecoration: 'underline' },
                }}
              >
                <PhoneOutlinedIcon sx={contactIconSx} />
                {site.phones.books}
              </Link>
              {site.whatsapp && (
                <Link
                  href={`https://wa.me/${site.whatsapp}`}
                  sx={{
                    ...contactLineSx,
                    color: COLORS.white,
                    textDecoration: 'none',
                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                  }}
                >
                  <WhatsAppIcon sx={contactIconSx} />
                  וואטסאפ · {site.whatsapp}
                </Link>
              )}
              <Typography sx={contactLineSx}>
                <AccessTimeOutlinedIcon sx={contactIconSx} />
                שיעור שבועי · {weeklyDayShort} {site.weeklyLesson.time}
              </Typography>
            </Stack>
          </Grid>

        </Grid>

        {/* זכויות יוצרים בתחתית */}
        <Box
          sx={{
            mt: 2,
            pt: 1,
            borderTop: `1px solid ${COLORS.divider}`,
            textAlign: 'center',
            opacity: 0.6,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: fonts.body,
              fontSize: fontSize.xs
            }}
          >
            © {new Date().getFullYear()} ישיבת החיים והשלום - עטרת מרדכי. כל הזכויות שמורות.
          </Typography>
          {/* שני הפריטים הבאים מופיעים במוקאפ אבל אין להם מסלול באתר עדיין —
              טקסט בלבד, לא קישור שקורס, עד שיובנו העמודים */}
          <Typography component="span" sx={{ fontFamily: fonts.body, fontSize: fontSize.xs, opacity: 0.7 }}>
            · הצהרת נגישות
          </Typography>
          <Typography component="span" sx={{ fontFamily: fonts.body, fontSize: fontSize.xs, opacity: 0.7 }}>
            · תנאי שימוש
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;