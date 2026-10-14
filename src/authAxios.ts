import axios from 'axios';

// נתיבים שפתוחים לכולם גם בבקשת כתיבה — לא שולחים אליהם טוקן
const PUBLIC_WRITE = [/\/increment-play$/, /\/api\/contact\//, /\/api\/auth\//];

/** מצרף את ה-JWT של האדמין לכל בקשת כתיבה (POST/PUT/PATCH/DELETE) אל ה-API שלנו */
axios.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  const api = import.meta.env.VITE_API_URL;
  // עדכון שיעור (PUT /api/lessons/:id) — לתפקיד Authenticated אין הרשאה על Rabbi/קטגוריות, ולכן נשלח בלי טוקן
  const isLessonUpdate = method === 'put' && /\/api\/lessons\/[^/?]+(\?.*)?$/.test(url);
  if (method === 'get' || !url.startsWith(api) || isLessonUpdate || PUBLIC_WRITE.some((r) => r.test(url))) return config;

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
