/**
 * הערכים עצמם מוגדרים ב-src/styles/tokens.css (המקור היחיד, כפי שביקש המנהל).
 * הקובץ הזה נשאר רק בשביל קבצי מערכת הניהול (/manager/*) שמייבאים ממנו `colors`, ואינם משתנים.
 * הצד הציבורי של האתר קורא ישירות מ-tokens.css ולא מכאן.
 */

/* ---------- צבעים ---------- */
export const colors = {
  /** הרקע הבהיר ביותר — רקע ההאדר ואזורים בהירים. נמדד #FFFCF8 */
  cream: 'var(--surface)',
  /** קרם שני — רקע קטעים מתחלפים */
  creamAlt: 'var(--parchment)',
  /** חול/זהב בהיר — מסגרות, מילויים עדינים */
  sand: 'var(--sand)',
  /** רקע קטע בין שני קווי זהב — אזור ראש הישיבה. נמדד #F0E9D2 */
  sectionBg: 'var(--section-bg)',
  /** זהב כהה — טקסט זהב, אייקונים, מצב פעיל */
  goldDeep: 'var(--gold-deep)',
  /** מסגרת כפתור הזהב (goldButton). נמדד #A6812F מ-ateret-mordechai-design.pdf עמ' 1 */
  goldButtonBorder: 'var(--gold-button-border)',
  /** הזהב הראשי — מסגרות וקווים. נמדד #C7A462 */
  gold: 'var(--gold)',
  /** זהב לטקסט על רקע בהיר — ניגודיות 5.04:1, קריא. #C5A059 על בהיר נותן 2.46:1 ואינו קריא */
  goldText: 'var(--gold-text)',
  /** זהב בהיר — טקסט זהב על רקע כהה (כפתורים כהים, תוויות). נמדד #EBD59A מ-ateret-mordechai-about.pdf */
  goldLight: 'var(--gold-light)',
  /** שחור־חום — אייקון/טקסט כהה על זהב (כפתור הנגן וכד'). נמדד #1A1206 מ-ateret-mordechai-design.pdf */
  inkDark: 'var(--ink-dark)',
  /** חום־יין כהה מאוד — כותרות וטקסט כהה, ורקע כפתור כהה. נמדד #2C0E10 מ-ateret-mordechai-about.pdf */
  inkWine: 'var(--ink-wine)',
  /** יין רווי — רקע כהה ראשי */
  wine: 'var(--wine)',
  /** שחור־אדום — טקסט ראשי על רקע בהיר, והרקע הכהה ביותר */
  ink: 'var(--ink)',
  /** רקע PageHeader / Breadcrumb בתתי־העמודים. נמדד #EFE6D0 מ-ateret-mordechai-design (2).pdf עמ' 3 */
  parchmentHeader: 'var(--parchment-2)',
  /** קו הפרדה רך. נמדד #E2D8C0 */
  ruleSoft: 'var(--rule-soft)',
  /** טקסט משני מוחלש — תאריכים, כתוביות. מ-BRIEF-PAGES.md, אין משבצת ב-PDF עמ' 9 לאימות */
  muted: 'var(--muted)',
  /** טקסט גוף רגיל, לא כותרת. מ-BRIEF-PAGES.md, אין משבצת ב-PDF עמ' 9 לאימות */
  body: 'var(--body)',
} as const;
