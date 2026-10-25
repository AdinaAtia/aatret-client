import axios from 'axios';

// נתיבים שפתוחים לכולם גם בבקשת כתיבה — לא שולחים אליהם טוקן
const PUBLIC_WRITE = [/\/increment-play$/, /\/api\/contact\//, /\/api\/auth\//];

// בקשות קריאה של מסכי הניהול (טיוטות, רשימת רבנים מלאה) — מוגנות בשרת, לכן צריכות טוקן גם ב-GET
const ADMIN_READ = [/\/api\/(lessons|categories-mains)\/drafts(\?|$)/, /\/api\/rabbis\/admin\/all(\?|$)/];

/** מצרף את ה-JWT של האדמין לכל בקשת כתיבה (POST/PUT/PATCH/DELETE) ולקריאות הניהול אל ה-API שלנו */
axios.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  const api = import.meta.env.VITE_API_URL;
  const isAdminRead = method === 'get' && ADMIN_READ.some((r) => r.test(url));
  if (!url.startsWith(api) || PUBLIC_WRITE.some((r) => r.test(url))) return config;
  if (method === 'get' && !isAdminRead) return config;

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
