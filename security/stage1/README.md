# בעיות אבטחה מספר 1 — שלב 1 (BRIEF-SECURITY.md)

שינויים שנעשו בשרת (nginx 1.24, Ubuntu). הקבצים האלה הם עותק לתיעוד בלבד, השרת עצמו נמצא מחוץ ל־git.

| קובץ | מיקום בשרת | מטרה |
|---|---|---|
| security-headers.conf | /etc/nginx/snippets/ | HSTS, nosniff, X-Frame-Options, Referrer-Policy |
| server-tokens.conf | /etc/nginx/conf.d/ | `server_tokens off;` |

ב־`/etc/nginx/sites-available/ateret-mordechai` (בלוק `ateretmordechai.com`) נוספה השורה
`include snippets/security-headers.conf;` בתוך `location = /index.html` ובתוך `location /`.

בצד Strapi: הוסרה `strapi::poweredBy` מ־`config/middlewares.ts` (ריפו השרת), ו־`Disallow: /manager/` הוסר מ־`public/robots.txt`.

ביטול: להחזיר את גיבוי הקובץ (`/root/ateret-mordechai.nginx.bak-2026-10-26`), למחוק את שני קובצי ה־conf, `nginx -t && systemctl reload nginx`.
