/**
 * פרטים טכניים לספרים — מספר עמודים, כריכה, מהדורה ומסת"ב.
 * מקור: BRIEF-PAGES.md ("קובץ התוכן — לבנות ראשון").
 * השדות האלה לא קיימים בסכימת rabbi-book ב-Strapi, ולכן הם יושבים כאן,
 * לפי מזהה הספר (book.id). עד שיימסרו ערכים — השורה המתאימה לא מוצגת כלל.
 *
 * כלל הברזל: ערך ריק ('' / null) לא מוצג בממשק.
 */

export interface BookDetails {
  pages: number | null;
  binding: string;
  edition: string;
  isbn: string;
}

export const bookDetails: Record<number, BookDetails> = {
  // 12: { pages: 312, binding: 'קשיח', edition: 'תשפ"ה', isbn: '978-965-...' },
};

export const emptyBookDetails: BookDetails = { pages: null, binding: '', edition: '', isbn: '' };

export const getBookDetails = (bookId: number): BookDetails => bookDetails[bookId] ?? emptyBookDetails;
