import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * כותרת, תיאור ותגיות שיתוף (og) לכל עמוד — פאזה 4.1.
 * מקור אחד לכל המסלולים הציבוריים, כדי לא לפזר <Helmet> בכל קומפוננטה.
 * מסלולי /manager לא נכנסים לאינדקס.
 *
 * ⚠️ באפליקציית SPA התגיות נקבעות בדפדפן בלבד. הסורק של וואטסאפ קורא רק את ה-HTML
 * הראשוני, ולכן כדי שתצוגה מקדימה תעבוד בשיתוף קישור נדרש גם prerendering בשרת האירוח.
 */
const SITE_URL = 'https://ateretmordechai.com';
const SITE_NAME = 'ישיבת עטרת מרדכי';
const DEFAULT_DESC = 'ישיבת עטרת מרדכי — שיעורי תורה, ספרי הישיבה ודברי תורה מפי רבני הישיבה.';
const OG_IMAGE = `${SITE_URL}/og-default.jpg`;

interface PageMeta {
  title: string;
  description: string;
}

const PAGES: Record<string, PageMeta> = {
  '/': {
    title: 'ישיבת עטרת מרדכי',
    description: DEFAULT_DESC,
  },
  '/about': {
    title: 'אודות הישיבה',
    description: 'אודות ישיבת החיים והשלום — עטרת מרדכי: ביוגרפיית המייסד וראש הישיבה, דברי גדולי ישראל וסרטונים מהנעשה בישיבה.',
  },
  '/alllessons': {
    title: 'ארכיון השיעורים',
    description: 'ארכיון שיעורי התורה של ישיבת עטרת מרדכי — צפייה, האזנה והורדה, לפי רב, מסכת ונושא.',
  },
  '/fullbookspage': {
    title: 'ספרי הישיבה',
    description: 'ספרי ישיבת עטרת מרדכי — כל הכרכים שיצאו לאור והזמנה טלפונית.',
  },
  '/bookdetailspage': {
    title: 'פרטי הספר',
    description: 'פרטי הספר, תיאור והזמנה טלפונית — ספרי ישיבת עטרת מרדכי.',
  },
  '/contactform': {
    title: 'צור קשר',
    description: 'פרטי הקשר של ישיבת עטרת מרדכי, כתובות, מפה וטופס פנייה.',
  },
  '/videogallery': {
    title: 'גלריית סרטונים',
    description: 'גלריית הסרטונים של ישיבת עטרת מרדכי — שיעורים, אירועים ודברי גדולי ישראל.',
  },
  '/modernscrolldonation': {
    title: 'תרומות',
    description: 'תמיכה בישיבת עטרת מרדכי — תרומה להחזקת לימוד התורה.',
  },
  '/accessibility': {
    title: 'הצהרת נגישות',
    description: 'הצהרת הנגישות של אתר ישיבת עטרת מרדכי — רמת התאימות, התאמות שבוצעו ופרטי רכז הנגישות.',
  },
  '/terms': {
    title: 'תנאי שימוש ומדיניות פרטיות',
    description: 'תנאי השימוש ומדיניות הפרטיות של אתר ישיבת עטרת מרדכי.',
  },
  '/donateletter': {
    title: 'מכתב התרומה',
    description: 'מכתב ראש הישיבה — "עץ חיים היא למחזיקים בה".',
  },
};

export default function RouteSeo() {
  const { pathname } = useLocation();

  if (pathname.toLowerCase().startsWith('/manager')) {
    return (
      <Helmet>
        <title>ניהול | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    );
  }

  // /AllLessons/:lessonId — עד שיהיה כותרת פר־שיעור, משתמשים בכותרת הארכיון
  const lower = pathname.toLowerCase();
  const key = lower.startsWith('/alllessons') ? '/alllessons' : lower.startsWith('/bookdetailspage') ? '/bookdetailspage' : lower;
  const meta = PAGES[key] ?? { title: SITE_NAME, description: DEFAULT_DESC };
  const isHome = key === '/';
  const fullTitle = isHome ? meta.title : `${meta.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  // עמוד שיעור בודד (/AllLessons/:id): הכותרת וה-og:title/og:description מגיעים מ-LessonPlayer.
  // אם גם כאן נוסיף אותם, יהיו שתי תגיות og:title והכללית (ארכיון השיעורים) תופיע ראשונה.
  const isLessonPage = /^\/alllessons\/[^/]+/.test(lower);

  return (
    <Helmet>
      <html lang="he" dir="rtl" />
      {!isLessonPage && <title>{fullTitle}</title>}
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {!isLessonPage && <meta property="og:title" content={fullTitle} />}
      {!isLessonPage && <meta property="og:description" content={meta.description} />}
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="he_IL" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
