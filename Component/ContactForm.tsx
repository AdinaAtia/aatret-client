import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, MenuItem,
} from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AppButton from './shared/AppButton';
import PageHeader from './shared/PageHeader';
import { site } from '../src/content/site';

const API = import.meta.env.VITE_API_URL;

const QUESTION_TYPES = ['שאלה בתחום הקבלה', 'שאלה כללית / פרטית'];

const EXPLANATION_TEXT =
  'לכל פנייה יש לציין את שם הרב שאליו השאלה מופנית, נושא ברור וממוקד, וסוג השאלה. כך נוכל להעביר את שאלתך לגורם המתאים ולחזור אליך בהקדם.';

/** טלפון הזמנת ספרים כקישור tel: — 03-6815542 → +97236815542, כמו ב-Footer וב-FullBooksPage */
const toTelHref = (phone: string) => `tel:+972${phone.replace(/^0/, '').replace(/-/g, '')}`;
const booksPhoneHref = toTelHref(site.phones.books);
const generalPhoneHref = toTelHref(site.phones.general);

const yeshivaMapQuery = site.addresses.yeshiva;
const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(yeshivaMapQuery)}&output=embed`;
const googleMapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(yeshivaMapQuery)}`;
const wazeHref = `https://waze.com/ul?q=${encodeURIComponent(yeshivaMapQuery)}`;

const fieldStyle = {
  direction: 'rtl',
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff',
    '&:hover fieldset': { borderColor: 'var(--gold)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--gold)' },
    '& fieldset': { textAlign: 'right' },
    '& input, & textarea': { textAlign: 'right', fontFamily: 'var(--font-body)' },
  },
  '& .MuiInputLabel-root': {
    left: 'auto',
    right: 0,
    transformOrigin: 'top right',
    fontFamily: 'var(--font-body)',
    '&.Mui-focused': { color: 'var(--gold)' },
    '&.Mui-error': { color: 'error.main' },
  },
  '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
    transform: 'translate(-14px, 9px) scale(1)',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(-14px, -9px) scale(0.75)',
  },
  '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right' },
  '& .MuiSelect-select': { textAlign: 'right', fontFamily: 'var(--font-body)' },
  '& .MuiSelect-icon': { right: 'auto', left: 7 },
  '& .MuiSelect-select.MuiSelect-outlined': { paddingRight: '14px', paddingLeft: '32px' },
  '& .MuiFormHelperText-root': { textAlign: 'right', mx: '14px' },
};

/** תווית קבועה מעל השדה (לא placeholder ולא תווית צפה). הכוכבית aria-hidden — השדה עצמו נושא required */
const FieldLabel = ({ id, children, required }: { id: string; children: React.ReactNode; required?: boolean }) => (
  <Box
    component="label"
    id={`${id}-label`}
    htmlFor={id}
    sx={{ display: 'block', mb: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', fontWeight: 600, color: 'var(--body)' }}
  >
    {children}
    {required && <Box component="span" aria-hidden="true" sx={{ color: 'var(--contact-form-required)', mr: '4px' }}>*</Box>}
  </Box>
);

interface ContactCardDef {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  subText?: string;
}

const ContactForm: React.FC = () => {
  const [rabbis, setRabbis] = useState<{ id: number; name: string }[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    rabbiName: '',
    questionType: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    fullName: '', phone: '', email: '', rabbiName: '', questionType: '', message: '',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    axios
      .get(`${API}/api/rabbis?fields[0]=name`)
      .then(res => {
        const data: { id: number; name: string }[] = res.data?.data || [];
        setRabbis(data.sort((a, b) => {
          if (a.name.includes('מרדכי עטייה')) return -1;
          if (b.name.includes('מרדכי עטייה')) return 1;
          return a.name.localeCompare(b.name, 'he');
        }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = { fullName: '', phone: '', email: '', rabbiName: '', questionType: '', message: '' };
    if (formData.fullName.trim().length < 2) newErrors.fullName = 'שם מלא חייב להכיל לפחות 2 תווים';
    if (!formData.phone.trim()) newErrors.phone = 'טלפון הוא שדה חובה';
    if (!formData.email.trim()) newErrors.email = 'דוא"ל הוא שדה חובה';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'כתובת דוא"ל אינה תקינה';
    if (!formData.rabbiName) newErrors.rabbiName = 'יש לבחור את הרב שאליו מופנית השאלה';
    if (!formData.questionType) newErrors.questionType = 'יש לבחור נושא פנייה';
    if (formData.message.trim().length < 10) newErrors.message = 'תוכן הפנייה חייב להכיל לפחות 10 תווים';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitStatus('loading');
    try {
      await axios.post(`${API}/api/contact/send`, { ...formData, subject: formData.questionType });
      setSubmitStatus('success');
      setFormData({ fullName: '', phone: '', email: '', rabbiName: '', questionType: '', message: '' });
    } catch {
      setSubmitStatus('error');
    }
  };

  const contactCards: ContactCardDef[] = [
    {
      key: 'phone',
      icon: <PhoneOutlinedIcon sx={{ fontSize: 22 }} />,
      label: 'משרד הישיבה',
      value: site.phones.general,
      href: generalPhoneHref,
      subText: ['בירורים על הישיבה והשיעורים (לא לרכישת ספרים)', site.hours].filter(Boolean).join(' · '),
    },
    {
      key: 'booksPhone',
      icon: <PhoneOutlinedIcon sx={{ fontSize: 22 }} />,
      label: 'משרד והזמנת ספרים',
      value: site.phones.books,
      href: booksPhoneHref,
      subText: `${site.addresses.office} · פקס ${site.phones.fax}`,
    },
    {
      key: 'lessonsArchive',
      icon: <PhoneOutlinedIcon sx={{ fontSize: 22 }} />,
      label: 'מאגר שיעורים טלפוני',
      value: site.phones.lessonsArchive,
      href: site.phones.lessonsArchive ? toTelHref(site.phones.lessonsArchive) : undefined,
      subText: 'שיעורי רבני הישיבה, ובהם הרב אליהו מרגי שליט"א ועוד, זמינים להאזנה בטלפון במרחב הקולי. המערכת כוללת שלוחות.',
    },
    ...(site.whatsapp ? [{
      key: 'whatsapp',
      icon: <WhatsAppIcon sx={{ fontSize: 22 }} />,
      label: 'וואטסאפ',
      value: site.whatsapp,
      href: `https://wa.me/${site.whatsapp}`,
      subText: 'מענה מהיר להודעות',
    }] : []),
    {
      key: 'yeshiva',
      icon: <RoomOutlinedIcon sx={{ fontSize: 22 }} />,
      label: 'בניין הישיבה',
      value: site.addresses.yeshiva,
      subText: `שיעור יומי · ${site.weeklyLesson.time}`,
    },
  ];

  return (
    <Box component="div" sx={{ direction: 'rtl', bgcolor: 'var(--parchment)', minHeight: '100vh' }}>
      <PageHeader title="צור קשר" />

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: '32px', md: '44px' },
          }}
        >
          {/* עמודת פרטי הישיבה */}
          <Box sx={{ order: { xs: 2, md: 1 } }}>
            <Typography
              component="h2"
              sx={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'var(--t5)', color: 'var(--ink-wine)', mb: 3 }}
            >
              פרטי הישיבה
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {contactCards.map((card, i) => (
                <Box
                  key={card.key}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '18px',
                    bgcolor: 'var(--surface)',
                    border: `1px solid var(--gold)`,
                    borderRadius: `var(--contact-card-radius)`,
                    p: '18px 20px',
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: `var(--contact-card-icon-circle-size)`,
                      height: `var(--contact-card-icon-circle-size)`,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: i === 0 ? 'var(--wine)' : 'var(--sand)',
                      color: i === 0 ? 'var(--gold-light)' : 'var(--gold-deep)',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{
                      fontSize: `var(--contact-card-label-size)`, letterSpacing: 'var(--contact-card-label-letter-spacing)',
                      color: 'var(--gold-text)', fontWeight: 'var(--contact-card-label-weight)', fontFamily: 'var(--font-body)', mb: '2px',
                    }}>
                      {card.label}
                    </Typography>
                    {card.href ? (
                      <Box
                        component="a"
                        href={card.href}
                        sx={{
                          display: 'block', fontFamily: 'var(--font-heading)',
                          fontSize: `var(--contact-card-value-size)`, fontWeight: 'var(--contact-card-value-weight)',
                          color: 'var(--wine)', textDecoration: 'none', direction: 'ltr', textAlign: 'right',
                        }}
                      >
                        {card.value}
                      </Box>
                    ) : (
                      <Typography sx={{
                        fontFamily: 'var(--font-heading)', fontSize: `var(--contact-card-value-size)`,
                        fontWeight: 'var(--contact-card-value-weight)', color: 'var(--wine)',
                      }}>
                        {card.value}
                      </Typography>
                    )}
                    {card.subText && (
                      <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: `var(--contact-card-sub-text-size)`, color: 'var(--muted)', mt: '2px' }}>
                        {card.subText}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* מפה וניווט */}
            <Box
              component="iframe"
              title="מפת בניין הישיבה"
              src={mapEmbedSrc}
              loading="lazy"
              sx={{
                width: '100%', aspectRatio: '16/9', border: `1px solid var(--gold)`,
                borderRadius: `var(--contact-map-radius)`, mb: 2, bgcolor: 'var(--sand)',
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AppButton variant="outline" component="a" href={wazeHref} target="_blank" rel="noopener noreferrer" fullWidth>
                ניווט ב-Waze
              </AppButton>
              <AppButton variant="outline" component="a" href={googleMapsHref} target="_blank" rel="noopener noreferrer" fullWidth>
                Google Maps
              </AppButton>
            </Box>
          </Box>

          {/* עמודת הטופס — מסגרת כפולה כמו כריכת הספר */}
          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                bgcolor: 'var(--surface)',
                border: `1px solid var(--gold)`,
                borderRadius: `var(--contact-form-outer-radius)`,
                p: `var(--contact-form-outer-pad)`,
              }}
            >
              <Box
                sx={{
                  border: `1px solid var(--contact-form-inner-border)`,
                  borderRadius: `var(--contact-form-inner-radius)`,
                  bgcolor: '#fff',
                  p: `var(--contact-form-inner-pad)`,
                }}
              >
                <Typography
                  component="h2"
                  sx={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 'var(--t5)', color: 'var(--ink-wine)', mb: 1 }}
                >
                  שאלה לרב
                </Typography>
                <Typography sx={{ mb: 3, color: 'var(--body)', fontFamily: 'var(--font-body)', lineHeight: 1.8, fontSize: 'var(--t2)' }}>
                  {EXPLANATION_TEXT}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FieldLabel id="cf-phone" required>טלפון</FieldLabel>
                    <TextField
                      id="cf-phone" fullWidth size="small" required
                      name="phone"
                      value={formData.phone} onChange={handleChange}
                      error={!!errors.phone} helperText={errors.phone}
                      inputProps={{ 'aria-required': true }}
                      sx={fieldStyle}
                    />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FieldLabel id="cf-fullName" required>שם מלא</FieldLabel>
                    <TextField
                      id="cf-fullName" fullWidth size="small" required
                      name="fullName"
                      value={formData.fullName} onChange={handleChange}
                      error={!!errors.fullName} helperText={errors.fullName}
                      inputProps={{ 'aria-required': true }}
                      sx={fieldStyle}
                    />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FieldLabel id="cf-rabbiName" required>הפנייה לרב</FieldLabel>
                    <TextField
                      id="cf-rabbiName" select fullWidth size="small" required
                      name="rabbiName"
                      SelectProps={{ labelId: 'cf-rabbiName-label' }}
                      value={formData.rabbiName} onChange={handleChange}
                      error={!!errors.rabbiName} helperText={errors.rabbiName}
                      inputProps={{ 'aria-required': true }}
                      sx={fieldStyle}
                    >
                      {rabbis.map(r => (
                        <MenuItem key={r.id} value={r.name} sx={{ justifyContent: 'flex-end' }}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                    <FieldLabel id="cf-email" required>דוא"ל</FieldLabel>
                    <TextField
                      id="cf-email" fullWidth size="small" required
                      name="email" type="email"
                      value={formData.email} onChange={handleChange}
                      error={!!errors.email} helperText={errors.email}
                      inputProps={{ 'aria-required': true, dir: 'ltr', style: { textAlign: 'right' } }}
                      sx={fieldStyle}
                    />
                    </Box>
                  </Box>

                  <Box>
                  <FieldLabel id="cf-questionType" required>נושא הפנייה</FieldLabel>
                  <TextField
                    id="cf-questionType" select fullWidth size="small" required
                    name="questionType"
                    SelectProps={{ labelId: 'cf-questionType-label' }}
                    value={formData.questionType} onChange={handleChange}
                    error={!!errors.questionType} helperText={errors.questionType}
                    inputProps={{ 'aria-required': true }}
                    sx={fieldStyle}
                  >
                    {QUESTION_TYPES.map(type => (
                      <MenuItem key={type} value={type} sx={{ justifyContent: 'flex-end' }}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  </Box>

                  <Box>
                  <FieldLabel id="cf-message" required>תוכן הפנייה</FieldLabel>
                  <TextField
                    id="cf-message" fullWidth multiline required
                    minRows={6}
                    name="message"
                    value={formData.message} onChange={handleChange}
                    error={!!errors.message} helperText={errors.message}
                    inputProps={{ 'aria-required': true }}
                    sx={{ ...fieldStyle, '& .MuiOutlinedInput-root': { ...fieldStyle['& .MuiOutlinedInput-root'], minHeight: `var(--contact-form-textarea-height)` } }}
                  />
                  </Box>

                  {submitStatus === 'success' && (
                    <Typography role="status" sx={{ color: 'var(--gold-text)', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                      הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.
                    </Typography>
                  )}
                  {submitStatus === 'error' && (
                    <Typography role="alert" sx={{ color: 'var(--contact-form-required)', fontWeight: 600, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                      שגיאה בשליחה, נסו שוב.
                    </Typography>
                  )}

                  <AppButton type="submit" fullWidth disabled={submitStatus === 'loading'}>
                    {submitStatus === 'loading' ? 'שולח...' : 'שליחת הפנייה'}
                  </AppButton>

                  {site.responseDays && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--muted)' }}>
                      <InfoOutlinedIcon aria-hidden="true" sx={{ fontSize: 16, color: 'var(--gold-text)', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 'var(--t1)', color: 'inherit', fontFamily: 'var(--font-body)' }}>
                        {`נחזור אליך תוך ${site.responseDays} ימי עבודה.`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactForm;
