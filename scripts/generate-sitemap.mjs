/**
 * מייצר את public/sitemap.xml בזמן build: העמודים הקבועים + כל השיעורים + כל הספרים מה-API.
 * מקור: BRIEF-FOR-SONNET.md סעיף 4.5.
 *
 * אם ה-API לא זמין — הקובץ הקיים נשאר כמו שהוא (הבילד לא נכשל בגלל זה).
 * הרצה ידנית: npm run sitemap
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://ateretmordechai.com';
const PAGE_SIZE = 100;

const STATIC_PATHS = ['/', '/About', '/AllLessons', '/FullBooksPage', '/ContactForm', '/VideoGallery', '/ModernScrollDonation'];

/** ה-API של האתר החי נמצא באותו דומיין. אפשר לעקוף עם SITEMAP_API_URL (למשל לבדיקה מול שרת אחר) */
const getApiUrl = () => process.env.SITEMAP_API_URL || SITE_URL;

async function fetchAllIds(api, endpoint) {
  const items = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${api}/api/${endpoint}?fields[0]=updatedAt&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`);
    if (!res.ok) throw new Error(`${endpoint} עמוד ${page}: HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data ?? [];
    for (const row of data) {
      const attrs = row.attributes ?? row;
      items.push({ id: row.id, updatedAt: attrs.updatedAt });
    }
    const pageCount = json.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount || data.length === 0) break;
  }
  return items;
}

const urlEntry = (path, updatedAt) => {
  const lastmod = updatedAt ? `<lastmod>${new Date(updatedAt).toISOString().slice(0, 10)}</lastmod>` : '';
  return `  <url><loc>${SITE_URL}${path}</loc>${lastmod}</url>`;
};

async function main() {
  const api = getApiUrl();
  try {
    const [lessons, books] = await Promise.all([fetchAllIds(api, 'lessons'), fetchAllIds(api, 'rabbi-books')]);
    const entries = [
      ...STATIC_PATHS.map((p) => urlEntry(p)),
      ...lessons.map((l) => urlEntry(`/AllLessons/${l.id}`, l.updatedAt)),
      ...books.map((b) => urlEntry(`/BookDetailsPage/${b.id}`, b.updatedAt)),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
    writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), xml, 'utf8');
    console.log(`[sitemap] נכתב: ${STATIC_PATHS.length} עמודים קבועים, ${lessons.length} שיעורים, ${books.length} ספרים`);
  } catch (err) {
    console.warn(`[sitemap] נכשל (${err.message}) — sitemap.xml נשאר כפי שהוא`);
  }
}

main();
