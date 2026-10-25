import { HDate } from '@hebcal/core';

/**
 * תאריך עברי אחיד לתצוגה, מחושב מהתאריך הלועזי: כ"ז תשרי תשפ"ז.
 * lesson_date_hebrew במסד מגיע בכמה צורות (גרש לפני השנה, ניקוד, "התשפ"ז"), לכן לא מציגים אותו ישירות.
 * אם אין תאריך לועזי תקין — חוזרים לערך השמור, כדי שלא יוצג שדה ריק.
 */
export const formatHebrewDate = (gregorian?: string | null, stored?: string | null): string => {
  const fallback = (stored || '').trim();
  const iso = (gregorian || '').split('T')[0];
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return fallback;
  try {
    return new HDate(new Date(y, m - 1, d))
      .renderGematriya(true)
      .replace(/״/g, '"')
      .replace(/׳/g, "'");
  } catch {
    return fallback;
  }
};
