/**
 * טוקני העיצוב של ישיבת עטרת מרדכי.
 * מקור: ateret-mordechai-design.pdf · 7.9.2026
 * הערכים המסומנים "נמדד" נדגמו פיקסל־פיקסל מקובץ העיצוב — אין לשנות אותם בניחוש.
 */

/* ---------- צבעים ---------- */
export const colors = {
  /** הרקע הבהיר ביותר — רקע ההאדר ואזורים בהירים. נמדד #FFFCF8 */
  cream: '#FFFCF4',
  /** קרם שני — רקע קטעים מתחלפים */
  creamAlt: '#FAF6EA',
  /** חול/זהב בהיר — מסגרות, מילויים עדינים */
  sand: '#F2E6C7',
  /** רקע קטע בין שני קווי זהב — אזור ראש הישיבה. נמדד #F0E9D2 */
  sectionBg: '#F0E9D2',
  /** זהב כהה — טקסט זהב, אייקונים, מצב פעיל */
  goldDeep: '#8A6522',
  /** מסגרת כפתור הזהב (goldButton). נמדד #A6812F מ-ateret-mordechai-design.pdf עמ' 1 */
  goldButtonBorder: '#A6812F',
  /** הזהב הראשי — מסגרות וקווים. נמדד #C7A462 */
  gold: '#C5A059',
  /** זהב לטקסט על רקע בהיר — ניגודיות 5.04:1, קריא. #C5A059 על בהיר נותן 2.46:1 ואינו קריא */
  goldText: '#7E5F1B',
  /** זהב בהיר — טקסט זהב על רקע כהה (כפתורים כהים, תוויות). נמדד #EBD59A מ-ateret-mordechai-about.pdf */
  goldLight: '#EBD59A',
  /** שחור־חום — אייקון/טקסט כהה על זהב (כפתור הנגן וכד'). נמדד #1A1206 מ-ateret-mordechai-design.pdf */
  inkDark: '#1A1206',
  /** חום־יין כהה מאוד — כותרות וטקסט כהה, ורקע כפתור כהה. נמדד #2C0E10 מ-ateret-mordechai-about.pdf */
  inkWine: '#2C0E10',
  /** יין רווי — רקע כהה ראשי */
  wine: '#4A0F14',
  /** שחור־אדום — טקסט ראשי על רקע בהיר, והרקע הכהה ביותר */
  ink: '#12090B',
  /** רקע PageHeader / Breadcrumb בתתי־העמודים. נמדד #EFE6D0 מ-ateret-mordechai-design (2).pdf עמ' 3 */
  parchmentHeader: '#EFE6D0',
  /** קו הפרדה רך. נמדד #E2D8C0 */
  ruleSoft: '#E2D8C0',
  /** טקסט משני מוחלש — תאריכים, כתוביות. מ-BRIEF-PAGES.md, אין משבצת ב-PDF עמ' 9 לאימות */
  muted: '#6E6152',
  /** טקסט גוף רגיל, לא כותרת. מ-BRIEF-PAGES.md, אין משבצת ב-PDF עמ' 9 לאימות */
  body: '#3A2C1E',
} as const;

/* ---------- gradients ----------
 * הערת העיצוב: "הזהב הוא מתכת, לא צבע שטוח.
 * כל כותרת וכל כפתור הם gradient עם נקודות אור."
 */
export const gradients = {
  /**
   * מילוי הכפתור. נמדד מהקובץ: הציר אלכסוני 147deg,
   * כהה בפינה העליונה־שמאלית, פס אור ב-58%, כהה בתחתונה־ימנית.
   */
  goldButton: 'linear-gradient(147deg, #9B7A40 0%, #C0995A 24%, #E9D197 58%, #C9A566 80%, #9B7A40 100%)',
  /** מילוי טקסט זהב — בהיר למעלה, עמוק למטה. נמדד בכותרת "עטרת מרדכי" */
  goldTextVertical: 'linear-gradient(180deg, #D9BC7F 0%, #C5A059 42%, #8A6522 100%)',
  /** זהב מתכתי אנכי — אייקונים וצורות */
  gold: `linear-gradient(160deg, ${colors.sand} 0%, ${colors.gold} 38%, ${colors.goldDeep} 72%, ${colors.gold} 100%)`,
  /** זהב מתכתי אופקי — כותרות רחבות */
  goldHorizontal: `linear-gradient(90deg, ${colors.goldDeep} 0%, ${colors.gold} 25%, ${colors.sand} 50%, ${colors.gold} 75%, ${colors.goldDeep} 100%)`,
  /** רקע יין כהה */
  wine: `linear-gradient(180deg, ${colors.wine} 0%, ${colors.ink} 100%)`,
} as const;

/** מילוי טקסט בזהב מתכתי אנכי — לכותרות */
export const goldTextFill = {
  background: gradients.goldTextVertical,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
} as const;

/* ---------- גופנים ---------- */
export const fonts = {
  /** כותרות בלבד — הגופן הסריפי של הישיבה */
  heading: "'Yetzira-Regular', 'Heebo', sans-serif",
  /** כותרות מעוטרות */
  headingOrnate: "'Yetzira-Choppy', 'Heebo', sans-serif",
  /** כותרות קלות */
  headingLight: "'Yetzira-Light', 'Heebo', sans-serif",
  /** גוף הטקסט, וגם הניווט — נמדד כסאנס בקובץ העיצוב */
  body: "'Heebo', sans-serif",
} as const;

/** סולם הטקסט מה-PDF: 12 · 14 · 16 · 20 · 28 · 40 */
export const fontSize = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '28px',
  xxl: '40px',
} as const;

/**
 * חריגה מתועדת מהסולם: כותרת הלוגו בנייד.
 * נמדדה 24px בקובץ העיצוב (מול 28px בדסקטופ). לא להשתמש בה במקום אחר.
 */
export const logoTitleMobile = '24px';

/** סולם המרווחים מה-PDF: 4 · 8 · 16 · 24 · 40 · 64 */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

/* ---------- מידות ---------- */
export const radius = {
  sm: '4px',
  /** פקדים — כפתורים ותיבות קלט. נמדד */
  control: '6px',
  md: '8px',
  lg: '16px',
  pill: '999px',
  /** קשת ארון הקודש — המוטיב החוזר של העיצוב */
  arch: '50% 50% 0 0 / 28% 28% 0 0',
} as const;

/**
 * כפתור זהב — המפרט היחיד לכל כפתורי הזהב באתר (צבעים, מסגרת, ריחוף).
 * גודל, גופן וריווח נשארים בכל כפתור לפי ההקשר.
 */
export const goldButtonStyle = {
  background: gradients.goldButton,
  color: colors.wine,
  border: `1px solid ${colors.goldButtonBorder}`,
  boxShadow: 'none',
  '&:hover': { background: gradients.goldButton, filter: 'brightness(1.06)', boxShadow: 'none' },
} as const;

/**
 * עיגול הנגן הזהב (סמן נגן על תמונות ממוזערות). הרכיב: Component/shared/PlayBadge.tsx.
 * iconRatio = גודל האייקון ביחס לקוטר העיגול.
 */
export const playBadge = {
  background: gradients.goldButton,
  icon: colors.inkDark,
  iconRatio: 0.4,
} as const;

export const border = {
  /** קו שיער זהוב — מפריד עדין */
  hairline: `1px solid ${colors.goldDeep}38`,
  /** מסגרת זהב מלאה — גבול ההאדר ומסגרות פקדים. נמדד */
  gold: `1px solid ${colors.gold}`,
} as const;

/** גובה ההאדר הקבוע. נמדד: 80px דסקטופ, 64px נייד. ה-spacer חייב להיות זהה. */
export const headerHeight = { xs: 64, md: 80 } as const;

/** ריפוד הצדדים של ההאדר. נמדד */
export const headerPadX = { xs: 16, md: 56 } as const;

/** מידות פקדי ההאדר. נמדד */
export const headerControls = {
  /** כפתור התרומות */
  donate: { xs: { w: 71, h: 44 }, md: { w: 105, h: 46 } },
  /** ריבוע החיפוש הסגור, ורוחבו כשנפתח */
  search: { size: 47, openWidth: 230 },
  /** הכתר — logo.png, יחס 184:156. מוצג כקו זהב דרך מסכת luminance הפוכה. */
  crown: { xs: { w: 42, h: 36 }, md: { w: 61, h: 52 } },
  /** המרווח בין פריטי הניווט */
  navGap: 36,
} as const;

/* ---------- פס השיעור השבועי ----------
 * כל הערכים נמדדו ישירות מקובץ העיצוב (עמוד 1 · קנבס 1440px,
 * עמוד 2 · קנבס 390px) ואומתו מול צילום המסך פיקסל־פיקסל.
 * אין לשנות ערך כאן בלי מדידה חוזרת מהמקור.
 *
 * פריסת הדסקטופ: flex ממורכז, gap 40px בין כל בלוק.
 * רוחב התוכן יוצא 1028px, כלומר x=208 עד x=1236 בקנבס 1440.
 */
export const weeklyBar = {
  /** גובה הפס: 103px בדסקטופ, 234px בנייד */
  height: { mobile: 234, desktop: 103 },
  /** רקע הפס — זהה ל-colors.sand */
  bg: colors.sand,
  /** הקו העליון והתחתון — זהב מלא ולא שקוף */
  rule: colors.gold,
  /** עובי הקו העליון והתחתון: 1px, נמדד מהווקטור ב-PDF (עמ' 1) */
  ruleWidth: 1,
  /** המרווח בין הבלוקים בדסקטופ */
  gap: 40,
  /** המפריד האנכי בין הבלוקים — לא מוצג בנייד */
  divider: { w: 2, h: 49 },
  /** המעוין שלפני הכותרת — 13px באלכסון, מרווח 10px מהכותרת */
  diamond: { diagonal: 13, gap: 10 },
  /** "שיעור קבלה שבועי" */
  title: { desktop: 28, mobile: 23, color: colors.wine },
  /** "יום חמישי · 17:30" — זהב כהה חם, לא יין */
  time: { size: 17, color: colors.goldText },
  /** "עם ראש הישיבה..." — חום־אפור */
  subtitle: { size: 14, color: '#5A4A32' },
  /** "בניין הישיבה · יוסף בן מתתיהו 18" — בנייד 14px ובצבע ה-subtitle */
  place: { desktop: 15, mobile: 14, color: colors.body },
  /** אייקון המיקום */
  pin: { size: 12, color: colors.goldDeep },
  /** הכפתור — מסגרת בלבד, ללא מילוי וללא צל */
  button: { w: 133, h: 46, radius: 6, border: colors.goldButtonBorder, size: 15, px: 26 },
  /** המרחק בין ה-baseline של השעה לזה של הכתובית */
  timeLineHeight: 25,
} as const;

/* ---------- כרטיס רב ----------
 * כל הערכים נמדדו פיקסל־פיקסל מקובץ העיצוב (עמוד 1 · קנבס 1440px)
 * בסריקת צבע לאורך חתכים אופקיים ואנכיים. אין לשנות ערך בלי מדידה חוזרת.
 *
 * הרשת: חמישה כרטיסים ברוחב 247px עם מרווח 24px — מיכל 1331px.
 * הכרטיס: מלבן עם מסגרת זהב 1px ופינות קטומות באלכסון (לא מעוגלות),
 * ובתוכו קשת ארון הקודש הנושאת את הדיוקן.
 */
export const rabbiCard = {
  /** רוחב הכרטיס וגובהו בעיצוב המקורי */
  width: 248,
  height: 387,
  /** המרווח בין הכרטיסים ברשת */
  gap: 24,
  /** אורך הקטימה האלכסונית בפינות הכרטיס */
  radius: 12,
  /** מסגרת הכרטיס — 1px, זהב מלא. נמדד #C7A462 */
  border: colors.gold,
  /** רקע הכרטיס מתחת לקשת. נמדד #FFFCF8 */
  bg: colors.cream,
  /**
   * הקשת שבראש הכרטיס — 247×248, כלומר ריבוע.
   * לכן aspect-ratio 1 בקוד, כדי שתתכווץ נכון במסכים צרים.
   * המילוי מוצג רק כשאין דיוקן. נמדד #F1E6C8
   */
  arch: { fill: "#F0E4C6" },
  /** הכתר שבמרכז הקשת כשאין דיוקן — logo.png ביחס 184:156 */
  crown: { w: 46, h: 39 },
  /** שם הרב — חום־שחור, לא יין. נמדד #3D2F30 */
  name: { size: 20, color: colors.inkWine },
  /** הקו הקצר שמתחת לשם. נמדד #A98741 */
  rule: { w: 34, h: 1, color: colors.goldButtonBorder },
  /** הכפתור — מסגרת בלבד ללא מילוי, פינות קטומות כמו הכרטיס */
  button: { w: 122, h: 44, radius: 6, size: 14, color: colors.goldText, border: colors.gold },
  /** המרווחים האנכיים בחלק שמתחת לקשת */
  pad: { top: 18, ruleTop: 16, ruleBottom: 16, bottom: 22 },
  /** כותרת הקטע: עיטור הקשת שמעליה, וצבע הכותרת עצמה */
  heading: { ornament: { w: 48, h: 27, stroke: 2, radius: 10 }, color: '#3D2F30' },
} as const;

/* ---------- PageHeader / Breadcrumb — משותף לכל תתי־העמודים ----------
 * מקור: BRIEF-PAGES.md ("רכיבים משותפים") + אימות גובה/רקע/קו מול
 * ateret-mordechai-design (2).pdf עמ' 3 (ארכיון השיעורים), XObject 686:
 * הרצועה נמדדה y 131–390 (גובה 259px), רקע #EFE6D0, קו זהב 1px מעל ומתחת.
 */
export const pageHeader = {
  bg: colors.parchmentHeader,
  borderColor: colors.gold,
  /** גובה כולל ~150px (הוקטן מ-259px לפי בקשה) */
  height: 125,
  padding: { top: 16, x: 52, bottom: 14 },
  arch: { w: 28, h: 12, border: colors.goldButtonBorder },
  eyebrow: { size: 12, letterSpacing: '.28em', color: colors.goldText, weight: 700 },
  title: { size: 32, weight: 700, color: colors.inkWine },
  flourish: { lineW: 96, color: colors.goldButtonBorder, diamond: 6 },
} as const;

export const breadcrumb = {
  bg: colors.parchmentHeader,
  borderColor: colors.gold,
  padding: { y: 20, x: 52 },
  size: 14,
  linkColor: colors.goldText,
  currentColor: colors.inkWine,
  separator: '›',
} as const;

/* ---------- כרטיס/שורת שיעור ---------- */
export const lessonCard = {
  bg: colors.cream,
  border: colors.gold,
  radius: 12,
  /** מכויל מול העיבוד של Chrome ל-PDF (עמ' 3): צל דק מאוד, מעט יותר מתחת */
  shadow: '0 1px 3px rgba(44,14,16,.05)',
  titleColor: colors.inkWine,
  rabbiColor: colors.goldText,
  dateColor: colors.muted,
  topicChip: { bg: colors.sand, border: colors.gold, textColor: colors.wine },
  /** נמדד מהווקטור ב-PDF (עמ' 3, הגדלה 400%): תווית משך בפינה הימנית־תחתונה של התמונה */
  durationBadge: { bg: colors.wine, border: '#875736', color: colors.goldLight, size: 11, radius: 4, right: 8, bottom: 7 },
} as const;

/**
 * שלושת העיגולים — צפייה בווידאו / האזנה לאודיו / הורדה. 44–46px, תמיד עם aria-label.
 * כל הצבעים נמדדו פיקסל־פיקסל מ-ateret-mordechai-design (2).pdf עמ' 3 (ארכיון השיעורים).
 */
export const actionButtons = {
  size: 44,
  video: { bg: colors.wine, icon: colors.goldLight },
  audio: { icon: colors.inkDark },
  /** נמדד מה-PDF: הטבעת gold (#C5A059), האייקון goldText (#7E5F1B) */
  download: { border: colors.gold, icon: colors.goldText },
} as const;

/**
 * נגן האודיו המותאם — עמוד שיעור בודד (/AllLessons/:lessonId). מפרט: BRIEF-PAGES.md פאזה B2.
 * הערכים כתובים מפורשות בבריף (hex ישיר), לא נמדדו מה-PDF.
 */
export const audioPlayer = {
  bg: colors.wine,
  border: colors.gold,
  radius: 12,
  playButton: { size: 52, icon: colors.inkDark },
  label: { size: 14, weight: 600, color: colors.goldLight },
  time: { size: 13, color: '#D6B7AE' },
  /** rgba(197,160,89,.28) */
  track: { height: 6, bg: `${colors.gold}47` },
  handle: { size: 14, color: '#F5E7BC' },
  controlButton: { size: 44 },
} as const;

/* ---------- כרטיס ספר וכרטיס רכישה — /FullBooksPage ----------
 * המפרט מ-BRIEF-PAGES.md (פאזה C). הצבעים אומתו מול היסטוגרמת המילויים
 * של ateret-mordechai-design (2).pdf עמ' 5 (XObject 999): #c5a059,
 * #2c0e10, #7e5f1b, #efe6d0 ו-#c4b396 כולם נמצאים בפועל בדף.
 * רקע כרטיס הרכישה (#4A0F14) מצויר כ-path מעוגל ולא כ-re פשוט,
 * ולכן לא נמדד ישירות ברקטנגלים — המידה (radius) לקוחה מהבריף.
 */
export const bookCard = {
  bg: colors.cream,
  border: colors.gold,
  /** מסגרת פנימית סביב התמונה — rgba(197,160,89,.35) בבריף */
  innerBorder: `${colors.gold}59`,
  radius: 12,
  innerRadius: 7,
  imageHeight: 236,
  titleColor: colors.inkWine,
  rabbiColor: colors.goldText,
} as const;

/**
 * כרטיס הרכישה — נמדד פיקסל־פיקסל מה-path הווקטורי עצמו (לא היסטוגרמה):
 * מיכל 319×363 עם פינה מעוגלת ~12px, גבול זהב 1px. כפתור הטלפון בתוכו
 * 270×54, פינה 6px (= radius.control), במרכז עם ריפוד אופקי ~24.5px מכל צד.
 */
export const bookPurchaseCard = {
  bg: colors.wine,
  border: colors.gold,
  radius: 12,
  buttonTextColor: colors.inkDark,
  /** שורת המשנה "להזמנה טלפונית..." — 15px, בהיר יותר משאר הטקסט על היין */
  subTextColor: '#E0CDA8',
  /** שם/פקס/כתובת — 14px, נמדד #C4B396 */
  mutedTextColor: '#C4B396',
} as const;

/* ---------- קטימת פינות ----------
 * מחזירה clip-path של מלבן שארבע פינותיו קטומות באלכסון (לא מעוגלות),
 * כפי שמופיע בעיצוב לכרטיס הרב ולכפתור שבתוכו.
 * @param c אורך הקטימה בפיקסלים — rabbiCard.chamfer או rabbiCard.button.chamfer.
 *          לשכבת המילוי שבתוך מסגרת 1px מעבירים c-1, כך שהאלכסון מקביל.
 */
export const chamferPath = (c: number): string => {
  const n = Math.max(0, c);
  return `polygon(${n}px 0, calc(100% - ${n}px) 0, 100% ${n}px, 100% calc(100% - ${n}px), calc(100% - ${n}px) 100%, ${n}px 100%, 0 calc(100% - ${n}px), 0 ${n}px)`;
};

/* ---------- עמוד ספר — /BookDetailsPage ----------
 * המפרט מ-BRIEF-PAGES.md (פאזה D), כל הערכים נתונים מפורשות בבריף.
 */
export const bookDetailsHero = {
  grid: { cols: '480px 1fr', gap: 56 },
  cover: {
    outerBorder: colors.gold,
    outerRadius: 12,
    outerPad: 12,
    innerBorder: `${colors.gold}59`,
    innerRadius: 7,
    innerPad: '52px 77px',
    image: { w: 300, h: 380 },
    bg: '#FFFCF4',
    innerBg: '#FFFFFF',
  },
  title: { size: 46, weight: 700 },
  author: { size: 19, color: colors.goldText },
  description: { size: 18, lineHeight: 1.95, maxWidth: '60ch' },
} as const;

export const orderBlock = {
  bg: colors.wine,
  border: colors.gold,
  radius: 12,
  padding: '26px 28px',
  phoneCircle: { size: 52 },
  label: { size: 13, letterSpacing: '.14em' },
  number: { size: 32, color: '#F5E7BC' },
  subText: { size: 14, color: '#C4B396' },
} as const;

export const detailsTable = {
  rowPadding: '11px 0',
  borderColor: colors.ruleSoft,
  labelColor: colors.muted,
  valueColor: colors.inkWine,
} as const;

/* ---------- צור קשר — /ContactForm ----------
 * המפרט מ-BRIEF-PAGES.md (פאזה E), מאומת מול ateret-mordechai-design.pdf עמ' 7.
 */
export const contactCard = {
  bg: colors.cream,
  border: colors.gold,
  radius: 12,
  /** עיגול האייקון — הראשון (טלפון) ברקע יין, השאר בחול בהיר */
  iconCircle: { size: 48, firstBg: colors.wine, firstIcon: colors.goldLight, restBg: colors.sand, restIcon: colors.goldDeep },
  label: { size: 13, letterSpacing: '.14em', color: colors.goldText, weight: 700 },
  value: { size: 24, weight: 700, color: colors.wine },
  subText: { size: 14, color: colors.muted },
} as const;

export const contactMap = {
  border: colors.gold,
  radius: 12,
  bg: colors.sand,
} as const;

export const contactForm = {
  /** מסגרת כפולה כמו כריכת הספר — outer + inner */
  outer: { border: colors.gold, radius: 12, pad: 20 },
  inner: { border: `${colors.gold}59`, radius: 7, pad: 24 },
  label: { size: 14, weight: 600, color: colors.body },
  required: '#9B2C1E',
  textareaHeight: 150,
  submitButton: { minHeight: 56 },
} as const;
