/**
 * קובץ התוכן המרכזי של האתר — טלפונים, כתובות, שעות ונוסחים.
 * מקור: BRIEF-PAGES.md ("קובץ התוכן — לבנות ראשון") ו-BRIEF-FOR-SONNET.md ("קובץ התוכן").
 *
 * כלל הברזל: ערך ריק ('' / null) לא מוצג בממשק. לא כותרת ריקה, לא מקף, לא סוגריים.
 *   {site.whatsapp && <a href={`https://wa.me/${site.whatsapp}`}>וואטסאפ</a>}
 *
 * ערכים שמסומנים "אומת בקוד" נלקחו ממקום קיים באתר (לא הומצאו).
 * ערכים ריקים ימולאו על ידי המנהל — אין לנחש אותם.
 */

export const site = {
  phones: {
    /** הזמנת ספרים — אומת ב-FullBooksPage.tsx:210 */
    books: '03-6815542',
    /** מספר כללי של הישיבה — טרם נמסר */
    general: '',
    /** אומת ב-FullBooksPage.tsx:217 */
    fax: '03-6823013',
  },
  /** בפורמט בינלאומי ללא +, למשל 9725XXXXXXXX — טרם נמסר */
  whatsapp: '',
  /** למשל 'ראשון–חמישי 09:00–16:00' — טרם נמסר */
  hours: '',
  addresses: {
    /** אומת ב-weeklyLesson.json */
    yeshiva: 'יוסף בן מתתיהו 18',
    /** אומת ב-FullBooksPage.tsx:216 (כולל מיקוד) */
    office: 'העלייה 8, תל אביב־יפו 6606107',
  },
  /** אומת ב-Component/weeklyLesson.json */
  weeklyLesson: {
    day: 'יום חמישי',
    time: '17:30',
    place: 'בניין הישיבה',
  },
  about: {
    /** סיפור הקמת הישיבה — טרם נמסר */
    story: '',
    /** מספר אברכים בכולל — טרם נמסר */
    avrechim: null as number | null,
  },
  /** נוסח מכתב ראש הישיבה — טעון הגהה, טרם נמסר */
  donationLetter: '',
  /** מספר ימי עבודה לחזרה בטופס יצירת קשר — טרם נמסר */
  responseDays: null as number | null,
} as const;
