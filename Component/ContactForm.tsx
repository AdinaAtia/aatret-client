import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, MenuItem,
} from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PageHeader from './shared/PageHeader';
import { site } from '../src/content/site';
import {
  colors, fonts, fontSize, goldButtonStyle, radius, contactCard, contactMap, contactForm,
} from '../src/theme/tokens';

const API = import.meta.env.VITE_API_URL;

const QUESTION_TYPES = ['שאלה בתחום הקבלה', 'שאלה כללית / פרטית'];

const EXPLANATION_TEXT =
  'לכל פנייה יש לציין את שם הרב שאליו השאלה מופנית, נושא ברור וממוקד, וסוג השאלה. כך נוכל להעביר את שאלתך לגורם המתאים ולחזור אליך בהקדם.';

/** טלפון הזמנת ספרים כקישור tel: — 03-6815542 → +97236815542, כמו ב-Footer וב-FullBooksPage */
const booksPhoneHref = `tel:+972${site.phones.books.replace(/^0/, '').replace(/-/g, '')}`;

/** העיר לא מופיעה בכתובת הישיבה עצמה — נלקחת מכתובת המשרד (אותה עיר) לצורך חיפוש במפה בלבד */
const yeshivaMapQuery = `${site.addresses.yeshiva}, תל אביב-יפו`;
const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(yeshivaMapQuery)}&output=embed`;
const googleMapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(yeshivaMapQuery)}`;
const wazeHref = `https://waze.com/ul?q=${encodeURIComponent(yeshivaMapQuery)}`;

const fieldStyle = {
  direction: 'rtl',
  '& .MuiOutlinedInput-root': {
    bgcolor: '#fff',
    '&:hover fieldset': { borderColor: colors.gold },
    '&.Mui-focused fieldset': { borderColor: colors.gold },
    '& fieldset': { textAlign: 'right' },
    '& input, & textarea': { textAlign: 'right', fontFamily: fonts.body },
  },
  '& .MuiInputLabel-root': {
    left: 'auto',
    right: 0,
    transformOrigin: 'top right',
    fontFamily: fonts.body,
    '&.Mui-focused': { color: colors.gold },
    '&.Mui-error': { color: 'error.main' },
  },
  '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
    transform: 'translate(-14px, 9px) scale(1)',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(-14px, -9px) scale(0.75)',
  },
  '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right' },
  '& .MuiSelect-select': { textAlign: 'right', fontFamily: fonts.body },
  '& .MuiSelect-icon': { right: 'auto', left: 7 },
  '& .MuiSelect-select.MuiSelect-outlined': { paddingRight: '14px', paddingLeft: '32px' },
  '& .MuiFormHelperText-root': { textAlign: 'right', mx: '14px' },
};

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
    fullName: '', phone: '', email: '', questionType: '', message: '',
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
    const newErrors = { fullName: '', phone: '', email: '', questionType: '', message: '' };
    if (formData.fullName.trim().length < 2) newErrors.fullName = 'שם מלא חייב להכיל לפחות 2 תווים';
    if (!formData.phone.trim()) newErrors.phone = 'טלפון הוא שדה חובה';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'כתובת דוא"ל אינה תקינה';
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
      label: 'טלפון',
      value: site.phones.books,
      href: booksPhoneHref,
      subText: ['ראשון–חמישי', site.hours].filter(Boolean).join(' · '),
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
      subText: `שיעור שבועי · ${site.weeklyLesson.day.replace(/^יום\s/, '')} ${site.weeklyLesson.time}`,
    },
    {
      key: 'office',
      icon: <HomeWorkOutlinedIcon sx={{ fontSize: 22 }} />,
      label: 'משרד והזמנת ספרים',
      value: site.addresses.office,
      subText: `פקס ${site.phones.fax}`,
    },
  ];

  return (
    <Box component="main" sx={{ direction: 'rtl', bgcolor: colors.creamAlt, minHeight: '100vh' }}>
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
              sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: fontSize.xl, color: colors.inkWine, mb: 3 }}
            >
              פרטי הישיבה
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {contactCards.map((card, i) => (
                <Box
                  key={card.key}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '18px',
                    bgcolor: contactCard.bg,
                    border: `1px solid ${contactCard.border}`,
                    borderRadius: `${contactCard.radius}px`,
                    p: '18px 20px',
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: `${contactCard.iconCircle.size}px`,
                      height: `${contactCard.iconCircle.size}px`,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: i === 0 ? contactCard.iconCircle.firstBg : contactCard.iconCircle.restBg,
                      color: i === 0 ? contactCard.iconCircle.firstIcon : contactCard.iconCircle.restIcon,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{
                      fontSize: `${contactCard.label.size}px`, letterSpacing: contactCard.label.letterSpacing,
                      color: contactCard.label.color, fontWeight: contactCard.label.weight, fontFamily: fonts.body, mb: '2px',
                    }}>
                      {card.label}
                    </Typography>
                    {card.href ? (
                      <Box
                        component="a"
                        href={card.href}
                        sx={{
                          display: 'block', fontFamily: fonts.heading,
                          fontSize: `${contactCard.value.size}px`, fontWeight: contactCard.value.weight,
                          color: contactCard.value.color, textDecoration: 'none', direction: 'ltr', textAlign: 'right',
                        }}
                      >
                        {card.value}
                      </Box>
                    ) : (
                      <Typography sx={{
                        fontFamily: fonts.heading, fontSize: `${contactCard.value.size}px`,
                        fontWeight: contactCard.value.weight, color: contactCard.value.color,
                      }}>
                        {card.value}
                      </Typography>
                    )}
                    {card.subText && (
                      <Typography sx={{ fontFamily: fonts.body, fontSize: `${contactCard.subText.size}px`, color: contactCard.subText.color, mt: '2px' }}>
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
                width: '100%', aspectRatio: '16/9', border: `1px solid ${contactMap.border}`,
                borderRadius: `${contactMap.radius}px`, mb: 2, bgcolor: contactMap.bg,
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component="a" href={wazeHref} target="_blank" rel="noopener noreferrer"
                fullWidth
                sx={{
                  minHeight: '46px', border: `1px solid ${colors.gold}`, color: colors.goldText,
                  fontFamily: fonts.body, fontWeight: 600, borderRadius: radius.control,
                }}
              >
                ניווט ב-Waze
              </Button>
              <Button
                component="a" href={googleMapsHref} target="_blank" rel="noopener noreferrer"
                fullWidth
                sx={{
                  minHeight: '46px', border: `1px solid ${colors.gold}`, color: colors.goldText,
                  fontFamily: fonts.body, fontWeight: 600, borderRadius: radius.control,
                }}
              >
                Google Maps
              </Button>
            </Box>
          </Box>

          {/* עמודת הטופס — מסגרת כפולה כמו כריכת הספר */}
          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                bgcolor: colors.cream,
                border: `1px solid ${contactForm.outer.border}`,
                borderRadius: `${contactForm.outer.radius}px`,
                p: `${contactForm.outer.pad}px`,
              }}
            >
              <Box
                sx={{
                  border: `1px solid ${contactForm.inner.border}`,
                  borderRadius: `${contactForm.inner.radius}px`,
                  bgcolor: '#fff',
                  p: `${contactForm.inner.pad}px`,
                }}
              >
                <Typography
                  component="h2"
                  sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: fontSize.xl, color: colors.inkWine, mb: 1 }}
                >
                  שאלה לרב
                </Typography>
                <Typography sx={{ mb: 3, color: contactForm.label.color, fontFamily: fonts.body, lineHeight: 1.8, fontSize: fontSize.sm }}>
                  {EXPLANATION_TEXT}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth size="small" required
                      name="phone" label="טלפון"
                      value={formData.phone} onChange={handleChange}
                      error={!!errors.phone} helperText={errors.phone}
                      inputProps={{ 'aria-required': true }}
                      sx={fieldStyle}
                    />
                    <TextField
                      fullWidth size="small" required
                      name="fullName" label="שם מלא"
                      value={formData.fullName} onChange={handleChange}
                      error={!!errors.fullName} helperText={errors.fullName}
                      inputProps={{ 'aria-required': true }}
                      sx={fieldStyle}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      select fullWidth size="small"
                      name="rabbiName" label="הפנייה לרב"
                      value={formData.rabbiName} onChange={handleChange}
                      sx={fieldStyle}
                    >
                      {rabbis.map(r => (
                        <MenuItem key={r.id} value={r.name} sx={{ justifyContent: 'flex-end' }}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth size="small"
                      name="email" label='דוא"ל'
                      value={formData.email} onChange={handleChange}
                      error={!!errors.email} helperText={errors.email}
                      sx={fieldStyle}
                    />
                  </Box>

                  <TextField
                    select fullWidth size="small" required
                    name="questionType" label="נושא הפנייה"
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

                  <TextField
                    fullWidth multiline required
                    minRows={6}
                    name="message" label="תוכן הפנייה"
                    value={formData.message} onChange={handleChange}
                    error={!!errors.message} helperText={errors.message}
                    inputProps={{ 'aria-required': true }}
                    sx={{ ...fieldStyle, '& .MuiOutlinedInput-root': { ...fieldStyle['& .MuiOutlinedInput-root'], minHeight: `${contactForm.textareaHeight}px` } }}
                  />

                  {submitStatus === 'success' && (
                    <Typography role="status" sx={{ color: 'green', textAlign: 'center', fontFamily: fonts.body }}>
                      הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.
                    </Typography>
                  )}
                  {submitStatus === 'error' && (
                    <Typography role="alert" sx={{ color: 'red', textAlign: 'center', fontFamily: fonts.body }}>
                      שגיאה בשליחה, נסו שוב.
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={submitStatus === 'loading'}
                    sx={{
                      minHeight: `${contactForm.submitButton.minHeight}px`,
                      borderRadius: radius.control,
                      ...goldButtonStyle,
                      fontWeight: 800,
                      fontSize: fontSize.lg,
                      fontFamily: fonts.body,
                    }}
                  >
                    {submitStatus === 'loading' ? 'שולח...' : 'שליחת הפנייה'}
                  </Button>

                  <Typography sx={{ fontSize: fontSize.xs, color: contactCard.subText.color, textAlign: 'center', fontFamily: fonts.body }}>
                    התשובה תפורסם באתר ללא פרטים מזהים.
                    {site.responseDays && ` נחזור אליך תוך ${site.responseDays} ימי עבודה.`}
                  </Typography>
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
