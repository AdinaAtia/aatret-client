# בריף עבודה — שיפור אתר עטרת מרדכי

> **איך להשתמש במסמך הזה:** שמרי אותו בשורש הריפו כ־`BRIEF-FOR-SONNET.md` וקומיטי אותו.
> אחר כך תני ל־Claude Code **פאזה אחת בכל פעם** (לא את כל המסמך), בנוסח:
> `קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 1 בלבד. אל תתחיל פאזות אחרות.`
> קומיטי בסוף כל פאזה, ובדקי בדפדפן לפני שממשיכים לבאה.

---

## הקשר

אתר ישיבת עטרת מרדכי — `https://ateretmordechai.com`.
React + Vite, MUI (Emotion), עברית RTL. מסלולים קיימים:
`/` · `/About` · `/AllLessons` · `/AllLessons/:lessonId` · `/FullBooksPage` · `/BookDetailsPage` · `/ContactForm` · `/RabbiQuestionForm` · `/VideoGallery` · `/ModernScrollDonation` · `/DonateLetter` · `/manager/*`

הממצאים במסמך הזה נמדדו על האתר החי בדפדפן אמיתי ב־6.9.2026. כולם ניתנים לאימות.

### מצב היום מול היעד

| מדד | היום | יעד |
|---|---|---|
| משקל דף הבית | 74.3 MB | < 5 MB |
| זמן טעינה מלא | 16.7 שניות | < 3 שניות |
| משפחות גופנים | 7 | 2 |
| גדלי טקסט שונים | 29 (הקטן 4.4px) | 6 |
| כותרות H1/H2 בדף הבית | 0 | לפחות 5 |
| תגיות meta | 1 | 8+ עם og |
| תמונות ללא alt | 28 | 0 |
| כפתורים ללא שם נגיש | 23 | 0 |
| קישורי `tel:` / וואטסאפ | 0 | קיימים |

---

---

> ## ⚠️ קראי את זה ראשון
>
> **כל המספרים והממצאים בקובץ הזה נמדדו על האתר שבאוויר** (`ateretmordechai.com`), לא על הגרסה
> המקומית שלך. הן שונות.
>
> **הגרסה המקומית שלך היא מקור האמת.** לפני כל פאזה — להריץ את בדיקת הסטטוס שבהמשך
> **על הבילד שלך**, ולעבוד רק לפי מה שהיא מחזירה.
>
> ממצא שכבר תיקנת — לדלג ולציין. אל תבצעי שום דבר פעמיים, ואל תתקני לפי מספר שכתוב כאן
> אם הבדיקה אצלך מראה אחרת.


## ⚡ ראשון לפני הכול — מה כבר בוצע

**אל תעברי על הבריף מההתחלה.** הוא רשימת בדיקה, לא סקריפט. הדביקי את הקוד הבא בקונסול
של הדפדפן **בדף הבית** וקבלי טבלה שאומרת איזו משימה סגורה ואיזו עדיין פתוחה.

להריץ גם על הגרסה המקומית שלך וגם על מה שבאוויר — אם הן שונות, המקומית היא הקובעת.

```js
(async () => {
  const R = performance.getEntriesByType('resource');
  const all = [...document.querySelectorAll('*')];
  const vis = all.filter(e => e.getBoundingClientRect().width > 0);
  const F = {}, S = {};
  vis.forEach(e => { const c = getComputedStyle(e);
    F[c.fontFamily.split(',')[0].replace(/["']/g, '')] = 1; S[c.fontSize] = 1; });

  const mb = R.reduce((a, x) => a + (x.transferSize || x.encodedBodySize || 0), 0) / 1048576;
  const vid = R.filter(x => /\.(mp4|webm)/i.test(x.name)).length;
  const lazy = [...document.querySelectorAll('img')].filter(i => i.loading === 'lazy').length;
  const imgs = document.querySelectorAll('img').length;
  const noalt = [...document.querySelectorAll('img')].filter(i => !i.alt).length;
  const nobtn = [...document.querySelectorAll('button')].filter(b => !b.innerText.trim() && !b.getAttribute('aria-label')).length;
  const rootVars = getComputedStyle(document.documentElement);
  const hasTokens = ['--ink', '--parchment', '--gold', '--gold-text'].filter(v => rootVars.getPropertyValue(v).trim()).length;
  const blackGaps = all.filter(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e);
    return r.height > 60 && r.width > 1000 && !e.innerText.trim()
      && !e.querySelector('img,video,svg,iframe') && /rgb\(0, 0, 0\)|rgb\(18, 9, 11\)/.test(c.backgroundColor); }).length;
  const goldOnLight = vis.filter(e => {
    const c = getComputedStyle(e); if (!e.textContent.trim()) return false;
    return c.color === 'rgb(197, 160, 89)'; }).length;
  const metas = [...document.querySelectorAll('meta')].filter(m => m.name || m.getAttribute('property')).length;
  const og = !!document.querySelector('meta[property^="og:"]');
  const tel = document.querySelectorAll('a[href^="tel:"]').length;
  const wa = document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').length;
  const h = document.querySelectorAll('h1,h2').length;
  const searches = [...document.querySelectorAll('input')].filter(i => /חפש|חיפוש/.test(i.placeholder || '')).length;

  let robots = '?', sitemap = '?';
  try { const a = await fetch('/robots.txt'); const t = await a.text();
        robots = (a.ok && !/<!doctype/i.test(t)) ? 'קיים' : 'חסר'; } catch (e) { robots = 'חסר'; }
  try { const a = await fetch('/sitemap.xml'); const t = await a.text();
        sitemap = (a.ok && /<urlset|<sitemapindex/i.test(t)) ? 'קיים' : 'חסר'; } catch (e) { sitemap = 'חסר'; }

  const row = (phase, what, got, ok) => ({ 'פאזה': phase, 'מה נבדק': what, 'נמצא': got, 'סטטוס': ok ? '✅ בוצע' : '❌ פתוח' });
  const T = [
    row('1.1', 'בקשות וידאו / משקל', `${vid} בקשות · ${mb.toFixed(1)}MB`, vid <= 1 && mb < 5),
    row('1.4', 'בלוקים שחורים ריקים', blackGaps, blackGaps === 0),
    row('1.5', 'תמונות עם lazy', `${lazy} מתוך ${imgs}`, imgs > 0 && lazy >= imgs - 2),
    row('2.1', 'טוקני CSS ב-:root', `${hasTokens} מתוך 4`, hasTokens === 4),
    row('2.2', 'משפחות גופנים', Object.keys(F).join(', '), Object.keys(F).length <= 2),
    row('2.3', 'זהב #C5A059 כטקסט', `${goldOnLight} אלמנטים`, goldOnLight === 0),
    row('2.4', 'גדלי טקסט שונים', Object.keys(S).length, Object.keys(S).length <= 8),
    row('4.1', 'תגיות meta / og', `${metas} meta · og=${og ? 'כן' : 'לא'}`, metas >= 8 && og),
    row('4.2', 'כותרות h1+h2', h, h >= 5),
    row('4.3', 'קישורי tel / וואטסאפ', `tel=${tel} · wa=${wa}`, tel > 0),
    row('4.5', 'robots / sitemap', `${robots} / ${sitemap}`, robots === 'קיים' && sitemap === 'קיים'),
    row('5.2', 'נגישות', `${noalt} img ללא alt · ${nobtn} כפתורים ללא שם`, noalt === 0 && nobtn === 0),
    row('5.3', 'שדות חיפוש בעמוד', searches, searches <= 1),
  ];
  console.table(T);
  const open = T.filter(r => r['סטטוס'].includes('פתוח')).map(r => r['פאזה']);
  console.log(open.length ? '%cפאזות שעדיין פתוחות: ' + open.join(', ') : '%cהכול בוצע ✅',
              'font-size:14px;font-weight:bold');
})();
```

הפלט הוא טבלה של 13 בדיקות עם `✅ בוצע` או `❌ פתוח`, ובסוף שורה אחת עם רשימת הפאזות הפתוחות.

**לעשות רק את הפתוחות.** משימה שכבר סגורה — לדלג ולציין זאת, לא לבצע פעמיים.

> הבדיקה מכסה 13 מתוך המשימות. שלוש משימות לא ניתנות לבדיקה מהקונסול וצריך לוודא בעין:
> **1.2** הכותרת בהירו לא נחתכת ב־390px · **1.3** אין ממוזערות אפורות או כרטיסים ריקים ·
> **2.5** כל הכפתורים בשורת כרטיסים באותו גובה.

---

## כללי עבודה — חשוב, קראי לפני שמתחילים

**לעשות:**
- לעבוד בברנץ' נפרד לכל פאזה: `git checkout -b fix/phase-1-performance`
- לקרוא את הקוד הקיים לפני שינוי, ולהתאים את הסגנון הקיים
- לשמור על `dir="rtl"` — לבדוק כל שינוי לייאאוט גם ב־RTL
- לבדוק כל שינוי בדפדפן ב־**שני** רוחבים: 1440px ו־390px

**לא לעשות:**
- לא לשכתב לפריימוורק אחר (לא Next.js, לא Tailwind) — לתקן במקום
- לא לשנות טקסטים בעברית, שמות רבנים או תוכן תורני בלי לשאול
- לא לגעת ב־`/manager/*` — זו מערכת הניהול
- לא להסיר את גופן **Yetzira** — הוא הזהות של האתר, הוא נשאר לכותרות
- לא לעשות ריפקטור רחב "בדרך" — רק מה שכתוב בפאזה
- לא להמציא תוכן (טלפונים, כתובות, שעות) — מה שלא ידוע, לשאול

---

## פאזה 0 — מיפוי (לפני כל תיקון)

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md. בצע פאזה 0 בלבד: מיפוי.
אל תשנה אף קובץ — רק צור את CODEMAP.md.
```

צרי קובץ `CODEMAP.md` שמכיל:

1. עץ הקבצים תחת `src/` (עומק 3)
2. מיקום ה־theme של MUI (חיפוש: `createTheme`) — האם קיים? איפה?
3. כל הקומפוננטות שמכילות `fontFamily` (חיפוש: `grep -rn "fontFamily" src/`) — רשימה עם מספרי שורות
4. כל המקומות שמכילים `#C5A059` או `c5a059` — רשימה עם מספרי שורות
5. הקומפוננטה של ההירו בדף הבית ושל הווידאו (חיפוש: `<video`)
6. הקומפוננטה של כרטיס השיעור, כרטיס הרב, וכרטיס הספר
7. הקומפוננטה של הפוטר
8. איך נטענים הנתונים — יש API? Strapi? קובץ סטטי? (חיפוש: `fetch`, `axios`, `VITE_`)
9. האם מותקן `react-helmet` / `react-helmet-async`?
10. האם יש `public/robots.txt` ו־`public/sitemap.xml`?

בסוף הקובץ: רשימת שאלות פתוחות אליי.

---

## פאזה 1 — ביצועים ובאגים שוברים

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 1 בלבד (משימות 1.1 עד 1.5).
אחרי כל משימה, עצור ותאר לי מה שינית לפני שתמשיך לבאה.
```

### 1.1 — סרטון הרקע יורד שלוש פעמים (הבעיה מספר 1)

**הממצא:** הקובץ `תדמית.mp4` במשקל **22.9 MB** נטען מהשרת **שלוש פעמים בטעינת עמוד אחת** — כ־69MB מתוך 74MB של הדף. הוא מוגדר `autoplay` + `preload="auto"` וללא `poster`.

**מה לעשות:**

א. **למצוא למה זה נטען 3 פעמים.** הסיבות הרגילות:
- לרכיב ה־`<video>` מועבר `key` שמשתנה בכל render
- ה־`src` מחושב inline (למשל `src={import(...)}` או תבנית מחרוזת) ולכן זהות ה־prop משתנה
- אותו רכיב מרונדר ביותר ממקום אחד (hero + רקע)
- `<video>` בתוך קומפוננטה שלא עטופה ב־`React.memo` ומקבלת props חדשים

בדיקה: פתחי DevTools → Network → סנני לפי `mp4`. אחרי התיקון חייבת להופיע **בקשה אחת**.

ב. **לדחוס את הקובץ.** לקצר ל־10–15 שניות ולייצא ב־1280×720:
```bash
ffmpeg -i תדמית.mp4 -t 14 -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -an hero.mp4
ffmpeg -i תדמית.mp4 -t 14 -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 38 -b:v 0 -an hero.webm
ffmpeg -i תדמית.mp4 -ss 2 -frames:v 1 -vf "scale=1280:-2" hero-poster.jpg
```
יעד: **מתחת ל־2MB**.

ג. **החלפת הרכיב:**
```jsx
<video
  autoPlay muted loop playsInline
  preload="none"
  poster="/hero-poster.jpg"
  style={{width:'100%',height:'100%',objectFit:'cover'}}
>
  <source src="/hero.webm" type="video/webm" />
  <source src="/hero.mp4"  type="video/mp4" />
</video>
```

ד. **בנייד לא להגיש סרטון בכלל** — לא להסתיר ב־CSS, אלא לא להרכיב את הרכיב:
```jsx
const isMobile = useMediaQuery('(max-width:768px)');
...
{isMobile ? <img src="/hero-poster.jpg" alt="" /> : <HeroVideo />}
```

**בדיקת הצלחה:** דף הבית מתחת ל־5MB, בקשת mp4 אחת בלבד, בנייד אפס בקשות וידאו.

---

### 1.2 — הכותרת בהירו נחתכת בנייד

**הממצא:** ב־390px הכותרת "ישיבת עטרת מרדכי" גולשת מחוץ למסך — האות הראשונה והאחרונה נחתכות. גם שורת המשנה.

**מה לעשות:**
```css
.hero-title{
  font-size: clamp(2rem, 8.5vw, 5rem);
  line-height: 1.15;
  padding-inline: 1.25rem;
  text-wrap: balance;
  white-space: normal;
}
.hero-subtitle{
  font-size: clamp(0.95rem, 3.4vw, 1.5rem);
  padding-inline: 1.25rem;
}
```
לחפש `fontSize` קבוע (px או vw בלי clamp) על הכותרת ולהחליף.

בנוסף: תמונת הרקע חתוכה למסך רחב, ובנייד רואים כף יד וכוס קפה. להוסיף:
```css
.hero-media{ object-position: center; }
@media (max-width:768px){ .hero-media{ object-position: 70% center; } }
```
(אם יש תמונה אנכית ייעודית — עדיף `<picture>` עם `media`.)

**בדיקת הצלחה:** ב־390px, 360px ו־320px הכותרת שלמה בתוך המסך.

---

### 1.3 — תמונות ממוזערות שבורות וכרטיסים ריקים

**הממצא:**
- השרת מחזיר 404 על `https://img.youtube.com/vi/null/mqdefault.jpg` — יש שיעורים ששמורים **בלי מזהה וידאו**
- כרטיסים רבים מציגים את מלבן "אין תצוגה מקדימה" האפור של יוטיוב, כולל הכרטיס המרכזי הגדול
- בקטע "רבני הישיבה" שני כרטיסים מציגים אייקון תמונה שבורה, וכרטיס אחד **ריק לגמרי** — בלי כותרת ובלי תאריך
- תמונות ממוזערות בגודל 120×90 מוצגות במסגרת 425×360 (מטושטש)

**מה לעשות:**

א. לא לרנדר כרטיס בלי מזהה וידאו או בלי כותרת:
```jsx
const visible = lessons.filter(l => l.videoId && l.title?.trim());
```

ב. תמונת ברירת מחדל במקום המלבן האפור. צרי `public/lesson-fallback.webp` (רקע שחור + הכתר בזהב, 1280×720):
```jsx
const FALLBACK = '/lesson-fallback.webp';
const thumb = lesson.videoId
  ? `https://i.ytimg.com/vi/${lesson.videoId}/hqdefault.jpg`
  : FALLBACK;

<img
  src={thumb}
  alt={lesson.title}
  loading="lazy"
  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
/>
```
שימי לב: `hqdefault` (480×360) ולא `mqdefault` (320×180).

ג. **תיקון יישור הרשת ב־RTL:** בקטע רבני הישיבה, כשנשאר כרטיס יחיד בשורה השנייה הוא נופל לצד **שמאל**. ב־RTL מקומו בימין:
```css
.rabbis-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}
```
(`grid` פותר את זה מעצמו. אם נשארים ב־flex: `justify-content: flex-start` בתוך מיכל `dir="rtl"`.)

**בדיקת הצלחה:** אפס 404 בקונסול, אפס מלבנים אפורים, אפס כרטיסים ריקים.

---

### 1.4 — בלוקים שחורים ריקים

**הממצא:** בדף הבית יש `div` שחור ריק בגובה **130px** בין קטע התרומות לקטע ראש הישיבה. בעמוד `/About` בלוק דומה בגובה **70px**. אין בהם תוכן, תמונה או וידאו.

**מה לעשות:** למצוא ולמחוק. איתור מהיר בקונסול של הדפדפן:
```js
[...document.querySelectorAll('div,section')]
  .filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);
    return r.height>60 && r.width>1000 && !e.innerText.trim()
      && !e.querySelector('img,video,svg,iframe')
      && c.backgroundColor==='rgb(0, 0, 0)';})
  .forEach(e=>console.log(e));
```

---

### 1.5 — טעינת תמונות

**הממצא:** כמעט כל התמונות `loading="auto"` (יורדות מיד). טקסטורת הרקע היא PNG של **2MB**. הלוגו נטען ב־184×156 ומוצג ב־99×81 (רך במסכי רטינה).

**מה לעשות:**
- `loading="lazy"` לכל `<img>` שאינו בהירו
- להמיר `pastel-yellow-vignette-concrete-textured-background.png` (2MB) ל־WebP — יורד ל־~80KB. אם זה סתם רקע קרם, עדיף **להחליף בצבע** `#F5F0E4` ולוותר על הקובץ לגמרי
- להמיר `מגילה.png` (1.6MB) ל־WebP
- ללוגו: לספק קובץ בכפולה 2 (`logo@2x.png`) או SVG

**בדיקת הצלחה של פאזה 1 כולה:** הריצי את סקריפט הבדיקה בסוף המסמך. `משקל MB` מתחת ל־5.

---

## פאזה 2 — מערכת עיצוב

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 2 בלבד (2.1 עד 2.6).
התחל מ־2.1 ו־2.2 שהם התשתית, ורק אחריהם המשך.
```

### 2.1 — קובץ טוקנים

צרי `src/styles/tokens.css` וייבאי אותו ב־`main.jsx`:
```css
:root{
  /* צבעים — ארבעה, כל אחד עם תפקיד */
  --ink:#14100A;          /* טקסט, כותרות, רקעים כהים */
  --parchment:#F5F0E4;    /* רקע אזורים — חדש, זה מה שחסר */
  --surface:#FFFFFF;      /* הכרטיס עצמו */
  --gold:#C5A059;         /* מילויים, מסגרות, טקסט על כהה */
  --gold-text:#8A6A22;    /* זהב לטקסט על רקע בהיר — קריא */
  --maroon:#5B2320;       /* צבע משני: תגיות, הדגשות */
  --rule:#D9D0BB;         /* גבולות — לא אפור ניטרלי */
  --ink-soft:#4B4436;
  --ink-mute:#7C7461;

  /* מרווחים — שום ערך אחר */
  --s1:4px; --s2:8px; --s3:16px; --s4:24px; --s5:40px; --s6:64px;

  /* גדלי טקסט — שום ערך אחר */
  --t1:12px; --t2:14px; --t3:16px; --t4:20px; --t5:28px; --t6:40px;
}
```

### 2.2 — שני גופנים בלבד

**הממצא:** בדף הבית פעילים 7 גופנים: Roboto, Yetzira-Regular, Arial, Heebo, Yetzira-Choppy, YetziraCustom, Times New Roman. **הנפוץ ביותר הוא Roboto עם 272 אלמנטים** — ברירת המחדל של MUI שמעולם לא הוחלפה. ל־Roboto אין אותיות עבריות, ולכן כל טקסט כזה נופל בשקט לגופן המערכת (Arial בווינדוס, אחר במק, אחר באייפון). **זו הסיבה שהאתר מרגיש לא־אחיד.**

**מה לעשות:**

א. להגדיר פעם אחת ב־theme:
```jsx
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: "'Heebo', system-ui, 'Segoe UI', Arial, sans-serif",
    h1:{ fontFamily:"'Yetzira-Regular', serif" },
    h2:{ fontFamily:"'Yetzira-Regular', serif" },
    h3:{ fontFamily:"'Yetzira-Regular', serif" },
  },
});
```

ב. **למחוק כל `fontFamily` נקודתי בקומפוננטות** — כולל אלה עם `!important` (יש 4 כאלה עם Yetzira-Regular ו־2 עם Yetzira-Choppy). הרשימה נמצאת ב־`CODEMAP.md` מפאזה 0.

ג. להשאיר את `Yetzira-Choppy` **רק** אם הוא באמת בשימוש ייעודי; אחרת להסיר את ה־`@font-face` שלו ולחסוך הורדה.

ד. אם Heebo לא בשימוש — להסיר את הקישור לגוגל פונטס מ־`index.html`. אם כן — להשאיר, ולוודא `display=swap`.

**בדיקת הצלחה:** סקריפט הבדיקה מחזיר **שני** גופנים בלבד.

### 2.3 — הזהב לא קריא על לבן

**הממצא:** `#C5A059` על רקע לבן נותן ניגודיות **2.46:1** — התקן דורש 4.5:1. הצבע הזה משמש לכל שמות הרבנים ולכותרות המשנה. אותו זהב על שחור נותן **8.55:1** ועובד מצוין.

**מה לעשות:** לעבור על כל מופע של `#C5A059` (הרשימה ב־`CODEMAP.md`) ולהחליט:
- זהב על רקע **כהה** → נשאר `var(--gold)`
- זהב כ**מילוי** כפתור/מסגרת → נשאר `var(--gold)`
- זהב כ**טקסט על רקע בהיר** → מוחלף ל־`var(--gold-text)` (`#8A6A22` = 5.04:1)

טקסט על כפתור זהב יהיה `#1A1206` (7.54:1) — **לא לבן** (2.46:1).

### 2.4 — שלוש וריאציות כפתור בלבד

**הממצא:** היום יש שלושה סגנונות שונים לכפתור **ראשי**: זהב מלא בסרגל, שחור מלא בטופס יצירת קשר, שחור בעמוד הספרים. בלי כלל אחד המשתמש לא לומד מה לחיץ.

**מה לעשות:** להגדיר ב־theme ולהשתמש רק בהן:
- **ראשי** — מילוי `--gold`, טקסט `#1A1206`, `min-height:44px`
- **משני** — רקע שקוף, מסגרת `--gold`, טקסט `--gold-text`
- **טקסטואלי** — טקסט `--gold-text` בלבד

בנוסף: כפתורי ההורדה/נגינה בכרטיסים הם **34×34px** וקישורי הניווט **37px** — מתחת ל־44×44 המומלץ למגע. להגדיל.

### 2.5 — חוזה כרטיס אחיד

**הממצא:** כרטיסים באותה שורה מקבלים גבהים שונים לפי אורך הכותרת, ולכן הכפתורים בתוכם "קופצים". בעמוד `/AllLessons` כותרות ארוכות **גולשות מחוץ לגבול הכרטיס** ונחתכות בקצה השמאלי.

**מה לעשות:** להגדיר חוזה אחד לכרטיס שיעור, ולחזור עליו בכל מקום:

| רכיב | מפרט |
|---|---|
| תמונה | יחס 16:9 קבוע, `object-fit:cover` |
| תווית אורך | מונחת על התמונה, פינה תחתונה |
| כותרת | בדיוק 2 שורות, `-webkit-line-clamp:2` |
| שם הרב | `var(--gold-text)`, `--t2` |
| תאריך | **אחד בלבד** — עברי או לועזי, לא שניהם |
| פעולה | כפתור ראשי אחד + אייקון הורדה, `min-height:44px` |

```css
.lesson-card{ display:flex; flex-direction:column; height:100%; }
.lesson-card .body{ flex:1; min-width:0; }              /* min-width:0 מונע גלישה */
.lesson-card .title{
  display:-webkit-box; -webkit-line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
  overflow-wrap:anywhere;
}
.lesson-card .footer{ margin-top:auto; }                 /* מיישר כפתורים */
.lesson-card .thumb{ aspect-ratio:16/9; overflow:hidden; }
```
`min-width:0` + `overflow-wrap:anywhere` הם התיקון הרגיל לטקסט שגולש מתוך `flex`.

### 2.6 — משטח קלף במקום לבן על לבן

**הממצא:** כמעט כל התוכן הוא כרטיס לבן על רקע לבן, מופרד בקו שיער אפור. אין הבדל בין "משטח" ל"רקע", ולכן אין עומק והדף נקרא כמו מסמך.

**מה לעשות:** לצבוע אזורים ברקע `--parchment`, ולהשאיר את הכרטיסים `--surface` לבנים. לסירוגין בין הקטעים:
```css
.section--tinted{ background: var(--parchment); }
.card{ background: var(--surface); border:1px solid var(--rule); }
```
זה שינוי של משתנה אחד והוא משנה את התחושה יותר מכל שאר פאזה 2.

---

## פאזה 3 — ההירו

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 3 בלבד.
זה שינוי חזותי — צלם מסך לפני ואחרי ב־1440px וב־390px והראה לי.
```

### 3.1 — טיפול דואוטון על תמונת ההירו (השינוי בעל ההשפעה הגדולה ביותר)

**הממצא:** תמונת ההירו היא צילום גולמי של בית המדרש — חולצות לבנות, ויטראז' בחמישה צבעים, כיסאות חומים, שולחנות שיש. שבעה צבעים מתחרים על אותו שטח, ולכן הכותרת נאלצת להישען על צל שחור כבד כדי בכלל להיקרא. אתרים באותה קטגוריה מעבדים את התמונה לגוון אחד.

**מה לעשות** — שש שורות CSS על התמונה הקיימת, בלי פוטושופ:
```css
.hero{ position:relative; isolation:isolate; background:#3B1A14; }

.hero-media{                      /* התמונה או הווידאו */
  position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; z-index:0;
  mix-blend-mode: luminosity;     /* משאיר רק בהירות */
  opacity:.60;
  filter: grayscale(1) contrast(1.06);
}

.hero::after{                     /* שכבת הכהיה לטקסט */
  content:""; position:absolute; inset:0; z-index:1;
  background:linear-gradient(to top,
    #100C07 6%, rgba(16,12,7,.62) 48%, rgba(16,12,7,.28) 100%);
}

.hero-content{ position:relative; z-index:2; }
```
אפשר לבחור גוון אחר ל־`background` (שחור־חום, נחושת, ירוק־זית). העיקרון: **גוון אחד לכל הפריים**.

אחרי זה אפשר להסיר את ה־`text-shadow` הכבד מהכותרת — היא כבר לא צריכה אותו.

### 3.2 — ההירו צריך לומר למה האתר קיים

**הממצא:** 700 פיקסלים של תמונה נושאים שם, שורת תיאור, וכפתור "אודות הישיבה" — הפעולה הכי פחות דחופה באתר. המידע השימושי באמת ("שיעור קבלה שבועי · יום חמישי 17:30 · בניין הישיבה, יוסף בן מתתיהו 18") מופיע רק אחרי גלילה.

**מה לעשות:**
- לקצר את ההירו ל־`min-height:55vh` (במקום ~700px / 100vh)
- להעלות את שורת השיעור השבועי **אל תוך** ההירו
- להחליף את ה־CTA לשני כפתורים: **"השיעור הקרוב"** (ראשי) ו**"כל השיעורים"** (משני)
- להוסיף את אמבלם הכתר מעל הכותרת

### 3.3 — נעילת לוגו

**הממצא:** יש אמבלם כתר יפה, ובנפרד שם הישיבה כטקסט עם `text-shadow`. שני דברים נפרדים אינם לוגו.

**מה לעשות:** ליצור קומפוננטה `<Logo variant="horizontal" | "stacked" />` שמרנדרת קובץ SVG יחיד (כתר + שם), ולהשתמש בה **בכל מקום** — סרגל, הירו, פוטר.

> ⚠️ **קובץ ה־SVG עצמו צריך להיות מיוצר על ידי מעצב.** בינתיים בני את הקומפוננטה עם ה־PNG הקיים ותשאירי TODO. **אל תנסי לצייר לוגו בקוד.**

---

## פאזה 4 — תוכן, קשר ו־SEO

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 4 בלבד.
כל פרט קשר מגיע מ־src/content/site.js (המפרט בקובץ BRIEF-PAGES.md).
ערך ריק פירושו שהשדה פשוט לא מוצג. אל תמציא ואל תשאיר סוגריים בממשק.
```

### 4.1 — כותרות ותגיות שיתוף

**הממצא:** לכל העמודים באתר בדיוק אותה כותרת דפדפן ("עטרת מרדכי"), אין `meta description`, ואין אף תגית `og:`. כשמישהו משתף קישור לשיעור בוואטסאפ — לא מופיעה תמונה, לא כותרת ולא תיאור. עבור אתר שכל תפוצתו היא שיתוף בקבוצות, זו אבידה גדולה.

**מה לעשות:**
```bash
npm i react-helmet-async
```
לעטוף ב־`<HelmetProvider>` ולהוסיף בכל עמוד:
```jsx
<Helmet>
  <title>{`${pageTitle} | ישיבת עטרת מרדכי`}</title>
  <meta name="description" content={desc} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={desc} />
  <meta property="og:image" content="https://ateretmordechai.com/og-default.jpg" />
  <meta property="og:url" content={`https://ateretmordechai.com${pathname}`} />
  <meta property="og:locale" content="he_IL" />
  <link rel="canonical" href={`https://ateretmordechai.com${pathname}`} />
</Helmet>
```
צריך קובץ `public/og-default.jpg` בגודל 1200×630.

> ⚠️ **שימי לב:** באפליקציית SPA, `react-helmet` פותר את הכותרת בדפדפן אבל **לא** בסורק של וואטסאפ, שקורא רק את ה־HTML הראשוני. כדי ששיתוף קישור לשיעור יעבוד באמת צריך prerendering. אם האתר מתארח ב־Netlify או Cloudflare — יש שם prerendering בהגדרה אחת, בלי לשכתב את האפליקציה. **בדקי איפה האתר מתארח. אם זה Netlify או Cloudflare — הפעילי שם prerendering. אם זו פלטפורמה אחרת, רשמי זאת ב־CODEMAP.md והמשיכי.**

### 4.2 — היררכיית כותרות

**הממצא:** בדף הבית **אפס** כותרות `h1` או `h2`. הכותרות היחידות בעמוד הן שתי `h6` בפוטר. גוגל וקורא מסך לא מקבלים שום מבנה.

**מה לעשות:** `h1` אחד לעמוד (שם הישיבה בהירו), ו־`h2` לכל כותרת קטע ("השיעורים האחרונים", "רבני הישיבה", "ספרי הישיבה"). **לבחור תגית לפי משמעות ולעצב ב־CSS** — לא לבחור תגית לפי גודל.

ב־MUI: `<Typography variant="h2" component="h2">` — לוודא ששניהם מוגדרים.

### 4.3 — פרטי קשר

**הממצא:** בעמוד `/ContactForm` יש טופס בלבד — אין טלפון, אין כתובת, אין וואטסאפ, אין שעות. באתר כולו **אפס קישורי `tel:` ואפס קישורי וואטסאפ**. הפרטים כן קיימים, אבל קבורים בסרגל הצד של **עמוד הספרים**: "ברוני יעקב, טלפון 03-6815542, פקס 03-6823013, העלייה 8, תל אביב יפו 6606107".

**מה לעשות:**
- להוסיף בלוק פרטי קשר לעמוד `/ContactForm` **ולפוטר**
- קישורים לחיצים:
  ```html
  <a href="tel:+97236815542">03-6815542</a>
  <a href="https://wa.me/9725XXXXXXXX">וואטסאפ</a>
  <a href="https://waze.com/ul?q=העלייה 8 תל אביב">העלייה 8, תל אביב־יפו</a>
  ```
- בנייד: כפתור וואטסאפ צף בפינה

> **הערכים מגיעים מקובץ התוכן.** `03-6815542` הוא טלפון הזמנת הספרים ונכנס ל־`site.phones.books`.
> `site.phones.general`, `site.whatsapp` ו־`site.hours` נשארים ריקים לעת עתה — והשדות שלהם לא מוצגים כלל עד שיתמלאו.

### 4.4 — מכתב התרומה כטקסט

**הממצא:** מכתב "עץ חיים היא למחזיקים בה" מוגש כתמונת PNG במשקל 1.6MB. בדסקטופ קריא בקושי; **בנייד הוא מתרוקן כמעט לחלוטין** — נשארת עמודה של מילה בשורה שנופלת על פניו של הרב, וגוף המכתב נעלם. טקסט בתוך תמונה גם לא ניתן לחיפוש, לא נקרא בגוגל, ולא נגיש לקורא מסך.

**מה לעשות:** לבנות את המכתב כ־HTML אמיתי על רקע קלף (טקסטורה קלה ב־WebP, 60–120KB). הטקסט נשאר טקסט. הכותרת "עץ חיים היא למחזיקים בה" צריכה להיות מעל המכתב או לצידו — לא מעל פניו של הרב.

> **הנוסח מגיע מ־`site.donationLetter`.** כל עוד הוא ריק, הקטע מציג את הכותרת ואת החתימה בלבד — בלי גוף המכתב ובלי טקסט ממלא מקום. אין להעתיק טקסט תורני מהתמונה ללא הגהה.

### 4.5 — robots ו־sitemap

**הממצא:** `/robots.txt` ו־`/sitemap.xml` לא קיימים — הבקשה אליהם מחזירה את דף ה־HTML של האפליקציה.

**מה לעשות:** להוסיף שניהם כקבצים סטטיים ל־`public/`. את ה־sitemap לייצר בזמן build מרשימת השיעורים והספרים.

---

## פאזה 5 — טפסים ונגישות

**פרומפט לפאזה זו:**
```
קרא את BRIEF-FOR-SONNET.md ובצע את פאזה 5 בלבד.
```

### 5.1 — טופס יצירת הקשר

**הממצא:** שמות השדות מופיעים כ־`placeholder` בלבד — ברגע שמתחילים להקליד המשתמש כבר לא רואה מה השדה מבקש. אין סימון לשדות חובה, אין הודעה מה קורה אחרי שליחה, ואין זמן תגובה משוער. "הפנייה לרב" ו"סוג שאלה" נראים כשדות טקסט חופשי אף שסביר שהם אמורים להיות רשימות בחירה.

**מה לעשות:**
- תווית קבועה מעל כל שדה (`<label htmlFor>`) או `InputLabel` של MUI — **לא** placeholder כתחליף
- כוכבית + `required` + `aria-required` לשדות חובה
- `<select>` אמיתי ל"הפנייה לרב" ו"סוג שאלה"
- אחרי שליחה: הודעת אישור עם משפט כמו "נחזור אליך תוך 3 ימי עבודה"
- הודעות שגיאה שאומרות מה לתקן, לא "שגיאה"

### 5.2 — נגישות בסיסית

**הממצא:** 28 תמונות ללא `alt`, 23 כפתורים ללא שם נגיש.

**מה לעשות:**
- `alt` תיאורי לכל תמונת תוכן; `alt=""` לתמונות דקורטיביות בלבד
- `aria-label` לכל כפתור אייקון: `aria-label="הורדת השיעור"`, `aria-label="ניגון"`, `aria-label="חיפוש"`
- מצב פוקוס נראה: `:focus-visible{ outline:2px solid var(--gold); outline-offset:3px; }`
- אזורי מגע 44×44 מינימום

### 5.3 — שני שדות חיפוש בעמוד השיעורים

**הממצא:** ב־`/AllLessons` מוצגים בו־זמנית שדה חיפוש בסרגל העליון ושדה חיפוש בגוף העמוד, שניהם עם אותו placeholder "חפש שיעור…". לא ברור במה להשתמש ואם הם מסונכרנים. בנוסף ה־placeholder נצמד לשמאל במקום לימין.

**מה לעשות:** להשאיר את החיפוש שבגוף העמוד, ולהסתיר את זה שבסרגל **בעמוד השיעורים עצמו** (או להפוך אותו לאייקון שנפתח). ולשדות: `text-align:right`.

### 5.4 — עמוד התרומות

**הממצא:** העמוד המעוצב ביותר באתר, אבל אין אף אפשרות מסומנת כברירת מחדל, אין מצב ויזואלי ל"נבחר", ואין סכומים מוצעים.

**מה לעשות:** שורת סכומים — ₪52 · ₪180 · ₪360 · ₪1,000 · "סכום אחר" — עם ברירת מחדל מסומנת, ומצב `selected` ברור (מסגרת זהב + רקע כהה יותר).

### 5.5 — הפוטר

**הממצא:** הפוטר מחזיק שתי עמודות ושני שלישים ריקים. שנת הזכויות קבועה.

**מה לעשות:** עמודה שלישית עם כתובת, טלפון לחיץ, וואטסאפ ושעות שיעורים. ושנה דינמית: `{new Date().getFullYear()}`.

---

## סקריפט בדיקה

הדביקי בקונסול של הדפדפן בדף הבית, לפני ואחרי כל פאזה:

```js
(()=>{const f={},s={};
document.querySelectorAll('*').forEach(e=>{const c=getComputedStyle(e);
  if(!e.getBoundingClientRect().width)return;
  f[c.fontFamily.split(',')[0].replace(/["']/g,'')]=1; s[c.fontSize]=1;});
const r=performance.getEntriesByType('resource');
const mb=r.reduce((a,x)=>a+(x.transferSize||x.encodedBodySize||0),0)/1048576;
console.table({
 'גופנים': Object.keys(f).join(', '),
 'מספר גדלי טקסט': Object.keys(s).length,
 'משקל MB': mb.toFixed(1),
 'בקשות': r.length,
 'H1+H2': document.querySelectorAll('h1,h2').length,
 'תמונות בלי alt': [...document.querySelectorAll('img')].filter(i=>!i.alt).length,
 'כפתורים בלי שם': [...document.querySelectorAll('button')].filter(b=>!b.innerText.trim()&&!b.getAttribute('aria-label')).length,
 'בקשות וידאו': r.filter(x=>/\.(mp4|webm)/.test(x.name)).length,
 'שגיאות 404': 'בדקי בטאב Network',
});})()
```

*(משקל של משאבים מדומיינים חיצוניים עלול להופיע כ־0 — התוצאה שמרנית.)*

---

## סדר עדיפויות אם אין זמן להכול

1. **1.1** — הסרטון (74MB → מתחת ל־5MB). ההשפעה הגדולה ביותר בפער הגדול ביותר.
2. **3.1** — הדואוטון על ההירו. שש שורות CSS, משנה את הרושם הראשון יותר מכל השאר.
3. **1.2** + **1.3** — הכותרת שנחתכת בנייד והתמונות השבורות. שתי בעיות שכל מבקר רואה.
4. **4.3** — פרטי קשר. אתר של ישיבה בלי טלפון לחיץ.
5. **2.2** + **2.3** — שני גופנים, וזהב קריא.

---

## קובץ התוכן

כל ערך שחסר באתר — מספר וואטסאפ, שעות מענה, נוסח מכתב התרומה, סיפור הישיבה — יושב בקובץ אחד
ולא נשאל אף פעם. המפרט המלא נמצא ב־`BRIEF-PAGES.md`, בקטע "קובץ התוכן".

**כלל הברזל:** ערך ריק ⟵ השדה לא מוצג. לא כותרת ריקה, לא מקף, ולא סוגריים מרובעות בממשק.

```jsx
{site.whatsapp && <a href={`https://wa.me/${site.whatsapp}`}>וואטסאפ</a>}
```

---

## מה לא ניתן לפתור בקוד

שלושת הפריטים האלה דורשים מעצב או צלם, ולא הוגן לבקש מהמפתחת לפתור אותם ב־CSS:

- **נעילת לוגו** — כתר + שם ב־SVG, שתי גרסאות (יום עבודה של מעצב)
- **ניקוי רקע לכריכות הספרים** — הן צולמו על רקע לבנבן ולא נוקו; רואים מלבנים אפרפרים וכתמים סביב כל ספר
- **תמונת הירו אנכית לנייד** — חיתוך ייעודי שבו רואים את בית המדרש ולא כף יד וכוס קפה
