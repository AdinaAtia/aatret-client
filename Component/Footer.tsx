import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRabbis } from '../src/context/RabbisContext';
import { site } from '../src/content/site';
import Logo from './shared/Logo';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

/**
 * הפוטר — כל הערכים נמדדו מהווקטור של ateret-mordechai-design.pdf (עמוד הארכיון, דסקטופ 1440)
 * ומוגדרים כטוקנים --footer-* ב-src/styles/tokens.css. הערכים הלא-מדודים (שקיפות הקווים,
 * המרווחים האנכיים) נשארו כפי שהיו / קירוב.
 */
const DIVIDER = `color-mix(in srgb, var(--gold) 30.196%, transparent)`; // שקיפות הקו — לא נמדדה, נשארה כפי שהייתה

/** טלפון להזמנת ספרים כקישור tel: — 03-6815542 → +97236815542 */
const toTelHref = (phone: string) => `tel:+972${phone.replace(/^0/, '').replace(/-/g, '')}`;
const booksPhoneHref = toTelHref(site.phones.books);
const generalPhoneHref = toTelHref(site.phones.general);

const columnHeadingSx = {
  fontFamily: 'var(--font-heading)',
  fontSize: 'var(--footer-heading-size)',
  fontWeight: 'var(--footer-heading-weight)',
  color: 'var(--gold)',
  lineHeight: 1.3,
  mb: '14px',
  borderBottom: `1px solid ${DIVIDER}`,
  display: 'inline-block',
  pb: 0.8,
} as const;

/** שורת קישור/שם רב — 15px, #C4B396, מרחק 38px בין שורות */
const listItemSx = {
  fontFamily: 'var(--font-body)',
  color: 'var(--footer-text-color)',
  fontSize: 'var(--footer-text-size)',
  lineHeight: '24px',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

/** שורת "צור קשר" עם אייקון — Heebo, #C4B396, 15px (טלפון ווטסאפ: 16px) */
const contactLineSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.8,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--footer-text-size)',
  lineHeight: 'var(--footer-brand-text-line)',
  color: 'var(--footer-text-color)',
} as const;

const contactIconSx = { fontSize: '1rem', color: 'var(--gold)', flexShrink: 0 } as const;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { rabbis } = useRabbis();

  return (
    <Box
      component="footer"
      sx={{
        background: 'var(--footer-bg)',
        color: 'var(--footer-text-color)',
        pt: { xs: 5, md: '64px' },
        pb: { xs: 3, md: '28px' },
        px: { xs: 2, md: 'var(--footer-pad-x)' },
        borderTop: `1px solid var(--gold)`,
        mt: 'auto',
        direction: 'rtl',
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {/* ארבע עמודות לפי העיצוב: מותג 335 · ניווט 248 · רבנים 248 · צור קשר (השאר) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'var(--footer-cols)' },
            columnGap: 'var(--footer-gap)',
            rowGap: 4,
            alignItems: 'start',
          }}
        >
          {/* עמודה 1: לוגו ותיאור */}
          <Box>
            <Box sx={{ mb: '14px' }}>
              <Logo variant="footer" />
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                color: 'var(--footer-brand-text-color)',
                fontSize: 'var(--footer-text-size)',
                lineHeight: 'var(--footer-brand-text-line)',
              }}
            >
              ישיבת החיים והשלום — בית מדרש לתורת הקבלה על פי תורת האר״י ז״ל.
            </Typography>
          </Box>

          {/* עמודה 2: ניווט */}
          <Box>
            <Typography component="h6" sx={columnHeadingSx}>
              ניווט
            </Typography>
            <Stack spacing="14px">
              {[
                { label: 'דף הבית', href: '/' },
                { label: 'שיעורים', href: '/AllLessons' },
                { label: 'ספרים', href: '/FullBooksPage' },
                { label: 'אודות הישיבה', href: '/About' },
                { label: 'צור קשר', href: '/ContactForm' },
                { label: 'תרומות', href: '/ModernScrollDonation' },
              ].map((link) => (
                <Link key={link.label} href={link.href} sx={listItemSx}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* עמודה 3: רבני הישיבה (דינמי) */}
          <Box>
            <Typography component="h6" sx={columnHeadingSx}>
              רבני הישיבה
            </Typography>
            <Stack spacing="14px">
              {rabbis.map((rabbi) => (
                rabbi.phoneOnly ? (
                  // רב במרחב הקולי בלבד — אין לו שיעורים באתר, לכן חיוג לקו במקום מעבר לרשימה ריקה
                  <Link
                    key={rabbi.id}
                    href={toTelHref(site.phones.lessonsArchive)}
                    sx={listItemSx}
                  >
                    {rabbi.name} · מרחב קולי
                  </Link>
                ) : (
                  <Typography
                    key={rabbi.id}
                    onClick={() => navigate('/AllLessons', { state: { rabbiId: rabbi.id } })}
                    sx={{ ...listItemSx, cursor: 'pointer' }}
                  >
                    {rabbi.name}
                  </Typography>
                )
              ))}
            </Stack>
          </Box>

          {/* עמודה 4: צור קשר — כל הערכים מ-src/content/site.ts, ערך ריק לא מוצג */}
          <Box>
            <Typography component="h6" sx={columnHeadingSx}>
              צור קשר
            </Typography>
            <Stack>
              <Typography sx={contactLineSx}>
                <RoomOutlinedIcon sx={contactIconSx} />
                {site.weeklyLesson.place} · {site.addresses.yeshiva}
              </Typography>
              <Typography sx={{ ...contactLineSx, pr: '1.65rem' /* יישור מתחת לטקסט שמעליו, בלי אייקון חוזר */ }}>
                משרד: {site.addresses.office}
              </Typography>
              <Link
                href={generalPhoneHref}
                sx={{
                  ...contactLineSx,
                  fontSize: 'var(--footer-contact-strong-size)',
                  mt: '20px',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <PhoneOutlinedIcon sx={contactIconSx} />
                משרד הישיבה (לא לרכישת ספרים): {site.phones.general}
              </Link>
              <Link
                href={booksPhoneHref}
                sx={{
                  ...contactLineSx,
                  fontSize: 'var(--footer-contact-strong-size)',
                  mt: '12px',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <PhoneOutlinedIcon sx={contactIconSx} />
                רכישת ספרים: {site.phones.books}
              </Link>
              {site.phones.lessonsArchive && (
                <Link
                  href={toTelHref(site.phones.lessonsArchive)}
                  sx={{
                    ...contactLineSx,
                    fontSize: 'var(--footer-contact-strong-size)',
                    mt: '12px',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <PhoneOutlinedIcon sx={contactIconSx} />
                  מאגר שיעורים טלפוני: {site.phones.lessonsArchive}
                </Link>
              )}
              {site.whatsapp && (
                <Link
                  href={`https://wa.me/${site.whatsapp}`}
                  sx={{
                    ...contactLineSx,
                    fontSize: 'var(--footer-contact-strong-size)',
                    mt: '26px',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <WhatsAppIcon sx={contactIconSx} />
                  וואטסאפ · {site.whatsapp}
                </Link>
              )}
              <Typography sx={{ ...contactLineSx, mt: '26px' }}>
                <AccessTimeOutlinedIcon sx={contactIconSx} />
                שיעור יומי · {site.weeklyLesson.time}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* זכויות יוצרים בתחתית: זכויות מימין, קישורים משפטיים משמאל — 14px #6E6152 */}
        <Box
          sx={{
            mt: { xs: 4, md: '56px' },
            pt: { xs: 2, md: '34px' },
            borderTop: `1px solid ${DIVIDER}`,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--footer-copyright-size)',
            color: 'var(--footer-copyright-color)',
          }}
        >
          <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
            © {new Date().getFullYear()} ישיבת החיים והשלום - עטרת מרדכי. כל הזכויות שמורות.
          </Typography>
          {/* שני הפריטים הבאים מופיעים במוקאפ אבל אין להם מסלול באתר עדיין —
              טקסט בלבד, לא קישור שקורס, עד שיובנו העמודים */}
          <Typography sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
            הצהרת נגישות · תנאי שימוש
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
