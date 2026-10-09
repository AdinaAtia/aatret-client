# CODEMAP — מיפוי הקוד של אתר עטרת מרדכי

> **פאזה 0 מתוך `BRIEF-FOR-SONNET.md`.** מסמך קריאה בלבד — נוצר בלי לשנות אף קובץ קיים.
> נסרק על הריפו המקומי ב־4.10.2026, ענף `master`, קומיט `5ea4307`.

---

## 0. הערה מקדימה — המבנה שונה ממה שהבריף מניח

הבריף מניח שהקומפוננטות יושבות תחת `src/`. **הן לא.**
`src/` מכיל רק את התשתית; **כל 35 הקומפוננטות יושבות ב־`Component/` בשורש הריפו**, מחוץ ל־`src/`.

כל חיפוש שהבריף מורה לעשות `grep -rn "..." src/` חייב לכלול גם את `Component/`.

---

## 1. עץ הקבצים

```
src/
├── App.tsx            ← ראוטר + theme של MUI (370 שורות; ~270 מהן קוד מת בהערות)
├── App.css            ← @font-face של YetziraCustom
├── index.css          ← @font-face של שלושת גופני Yetzira
├── main.tsx           ← נקודת כניסה: StrictMode + CssBaseline
├── assets/react.svg
├── context/RabbisContext.tsx
├── fonts/
│   ├── BA HaYetzira Choppy (2).woff2
│   ├── BA HaYetzira Light.woff2
│   └── BA HaYetzira Regular.woff2
└── theme/tokens.ts    ← קובץ טוקנים קיים (ראו סעיף 11)

Component/   (35 קבצים)
├── ציבורי:  Home · About · AllLessons · LessonPlayer · FullBooksPage · BookDetailsPage
│            ContactForm · Header · Footer · LecturesGrid · LatestLessonCard
│            BooksCarousel · ModernScrollDonation · DonateLetter · VideoGallery
│            GlobalSearch · AskRabbiForm · RabbiQuestionForm
├── ניהול:   ManageLessons · ManageRabbis · ManageBooks · CategoryManager
│   (לא לגעת) AddNewCategory · SubCategoryTable · EditLessonDialog · AudioUploader
│            AdminLayout · AdminLogin · AdminSearchBar · DraftLessons · DraftCategories
│            DeleteActionPopover
└── JSON:    donationContent · donationLetterContent · founderContent · weeklyLesson
```

גדלי הקבצים הציבוריים המרכזיים:

| קובץ | שורות |
|---|---|
| `Home.tsx` | 1,232 |
| `About.tsx` | 1,118 |
| `AllLessons.tsx` | 720 |
| `Header.tsx` | 550 |
| `LessonPlayer.tsx` | 534 |
| `LecturesGrid.tsx` | 381 |
| `FullBooksPage.tsx` | 321 |
| `ContactForm.tsx` | 246 |
| `LatestLessonCard.tsx` | 233 |
| `ModernScrollDonation.tsx` | 219 |
| `BooksCarousel.tsx` | 183 |
| `BookDetailsPage.tsx` | 173 |
| `Footer.tsx` | 140 |

---

## 2. ה־theme של MUI

**קיים** — `src/App.tsx:295`.

```jsx
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Heebo", sans-serif',
  },
});
```

**מה שחסר בו:** אין `h1`/`h2`/`h3` עם Yetzira · אין `palette` · אין `components.MuiButton` · אין
וריאציות כפתור. כלומר פאזה 2.2 (סעיף א) ו־2.4 פתוחות לגמרי.

**הערה חשובה:** `fontFamily: "Heebo"` **כן** מוגדר, כלומר ברירת המחדל Roboto של MUI כבר הוחלפה.
הממצא בבריף ("Roboto עם 272 אלמנטים") נמדד על האתר שבאוויר ואינו משקף את המצב המקומי.

> ⚠️ ב־`src/App.tsx` יש **שתי גרסאות מתות** של כל האפליקציה בהערות (שורות 1–268), כולל
> שני בלוקי `createTheme` מוערים (שורות 33, 160). הקוד האמיתי מתחיל בשורה 269.
> שווה למחוק, אבל **לא בפאזה הזו** — זה ריפקטור "בדרך" שהבריף אוסר.

### המסלולים הפעילים (`src/App.tsx:331–366`)

```
/ · /About · /AllLessons · /AllLessons/:lessonId · /FullBooksPage · /BookDetailsPage
/ContactForm · /RabbiQuestionForm · /VideoGallery · /ModernScrollDonation · /DonateLetter
/manager/{manage,categories,AddNewCategory,AudioUploader,archive,drafts,rabbis,books}
```

תואם למה שהבריף מתאר. `/Gallery` מופיע רק בקוד המת.

---

## 3. כל המופעים של `fontFamily`

**סה״כ כ־130 מופעים ב־21 קבצים.** הם מתחלקים לשתי משפחות, וזה ההבדל שקובע את העבודה:

### א. הסגנון החדש — דרך `tokens.ts` ✅

שלושה קבצים כבר עברו ומשתמשים ב־`fonts.heading` / `fonts.body` / `fonts.headingOrnate`:

| קובץ | שורות |
|---|---|
| `Header.tsx` | 127, 139, 158, 309, 368, 513, 535 |
| `Home.tsx` | 434, 446, 467, 478, 499, 520, 580, 600, 608, 633, 655, 737, 747, 755, 779, 802, 821, 862, 955, 975, 989, 1024, 1065, 1076, 1180, 1191 |
| `LecturesGrid.tsx` | 143, 205, 232, 250, 262, 338, 359 |

**אלה לא צריכים טיפול.** הם כבר מרוכזים.

### ב. הסגנון הישן — מחרוזות קשיחות ❌

| קובץ | שורות |
|---|---|
| `About.tsx` | 235, 329, 336, 340, 362, 369, 373, 400, 427, 454, 558, 574, 585, 605, 668, 672, 682, 686, 695, 751, 816, 888, 889, 946, 991, 1057 |
| `ContactForm.tsx` | 21, 22, 26, 31, 108, 128, 134, 140, 161, 174, 188, 212, 217, 233 |
| `FullBooksPage.tsx` | 77, 135, 145, 198, 207, 210, 213, 216, 219, 269, 297 |
| `LessonPlayer.tsx` | 118, 119, 123, 229, 238, 401 |
| `Footer.tsx` | 39, 64, 83, 101, 129 |
| `BookDetailsPage.tsx` | 63, 66, 91, 129, 150 |
| `Home.tsx` | 70, 127 (שתי חריגות בתוך קובץ שאחרת נקי) |
| `BooksCarousel.tsx` | 67, 153 |
| `VideoGallery.tsx` | 82, 124, 172, 182 |
| `AllLessons.tsx` | 408, 437, 545, 654 |
| `ModernScrollDonation.tsx` | 117 |
| `AskRabbiForm.tsx` | 13 |
| **ניהול — לא לגעת** | `AdminLayout` 72,75,111,135 · `AdminLogin` 113,116,222 · `AddNewCategory` 138 · `DraftCategories` 62 · `DraftLessons` 347 · `ManageLessons` 308 · `EditLessonDialog` 496 |

**`!important`** מופיע בכ־25 מהם — אלה שיתנגדו ל־theme וחייבים מחיקה ידנית.

**חריגה:** `About.tsx:668` ו־`About.tsx:682` משתמשים ב־`'Georgia, serif'` — גופן חמישי שלא
מוצהר בשום מקום ואינו חלק מזהות האתר.

---

## 4. כל המופעים של `#C5A059`

**סה״כ 305 מופעים.** החלוקה קריטית:

| אזור | מופעים | פעולה |
|---|---|---|
| **מערכת ניהול** (`Manage*`, `Draft*`, `Admin*`, `CategoryManager`, `AddNewCategory`, `SubCategoryTable`, `EditLessonDialog`, `AudioUploader`, `DeleteActionPopover`) | **244** | ❌ **לא לגעת** — הבריף אוסר על `/manager/*` |
| **צד ציבורי** | **61** | ✅ אלה שרלוונטיים לפאזה 2.3 |

פירוט הצד הציבורי:

| קובץ | מופעים |
|---|---|
| `LessonPlayer.tsx` | 24 |
| `About.tsx` | 11 |
| `ModernScrollDonation.tsx` | 5 |
| `Home.tsx` | 3 |
| `FullBooksPage.tsx` | 3 |
| `AllLessons.tsx` | 2 |
| `tokens.ts` | 2 (הגדרה — תקין) |
| `Footer.tsx` · `ContactForm.tsx` · `BooksCarousel.tsx` · `BookDetailsPage.tsx` · `VideoGallery.tsx` · `DonateLetter.tsx` | 1 כל אחד |

**המשמעות:** פאזה 2.3 היא עבודה על 61 מופעים, לא 305. זה הופך אותה לסבירה.

---

## 5. ההירו והווידאו — **זו כנראה הבעיה מספר 1**

`תדמית.mp4` מופיע ב**שני** מקומות, עם **הגדרות זהות לחלוטין**:

| מיקום | הקשר |
|---|---|
| `Component/Home.tsx:362–382` | הירו של דף הבית |
| `Component/About.tsx:163–182` | הירו של `/About` |

שניהם:

```jsx
<Box component="video" autoPlay loop muted playsInline
     preload="auto"                                              // מוריד הכול מיד
     onCanPlay={() => setVideoReady(true)}
     src={`${import.meta.env.VITE_MEDIA_URL}/About/תדמית.mp4`}    // תבנית מחרוזת inline
     sx={{ /* objectFit:'cover', opacity: videoReady ? 1 : 0 */ }} />
```

**שלושה גורמים אפשריים לטעינה הכפולה/משולשת:**

1. **`src` נבנה כתבנית מחרוזת inline** — זהות ה־prop משתנה בכל render. זה בדיוק התרחיש
   שהבריף מתאר בסעיף 1.1.א.
2. **`<StrictMode>` ב־`src/main.tsx:18`** — בפיתוח React מרנדר כל קומפוננטה פעמיים.
   זה מכפיל בקשות וידאו **בדב בלבד**, לא בפרודקשן. חשוב לדעת כדי לא לרדוף אחרי רוח רפאים.
3. **`preload="auto"` ובלי `poster`** — הדפדפן מוריד את כל ה־22.9MB לפני שמשהו נראה.

**אין `poster`. אין `<source>` מרובים. אין גרסת webm. אין התניה על נייד.**

**הקובץ עצמו:** מגיע מ־`VITE_MEDIA_URL` (שרת חיצוני), **לא** מ־`public/`. כלומר הדחיסה
ב־`ffmpeg` תדרוש גישה לשרת המדיה, לא רק לריפו.

> ⚠️ **זו סתירה לבריף.** הבריף מתאר את הסרטון כבעיה של דף הבית בלבד. בפועל `/About`
> נושא בדיוק את אותו נטל. ובנוסף, ב־`BRIEF-PAGES.md` פאזה B נכתב שהסרטון "נטען גם בעמוד
> שיעור בודד" — **לא מצאתי לכך אישור בקוד.** `LessonPlayer.tsx` לא טוען וידאו רקע.

### וידאו נוסף
`About.tsx:654` — `שיעור הרב עטייה מקוצר (1).mp4`, גם הוא מהשרת החיצוני.

---

## 6. כרטיסי שיעור / רב / ספר

| כרטיס | קובץ | הערה |
|---|---|---|
| שיעור (דף הבית) | `Component/LatestLessonCard.tsx` | 233 שורות |
| רשת שיעורים | `Component/LecturesGrid.tsx` | 381 שורות — כבר משתמש ב־`tokens.ts` |
| ספר (קרוסלה) | `Component/BooksCarousel.tsx` | 183 שורות |
| ספר (רשת מלאה) | `Component/FullBooksPage.tsx` | 321 שורות — הכרטיס בתוך הקובץ, לא מופרד |
| רב | `src/theme/tokens.ts:178` (`rabbiCard`) + `Component/Home.tsx` | הטוקנים קיימים |

**אין קומפוננטת `<LessonCard>` משותפת.** `BRIEF-PAGES.md` דורש אחת — היא תצטרך להיבנות
מאפס, ולאחד בין `LatestLessonCard` ל־`LecturesGrid`.

---

## 7. הפוטר

`Component/Footer.tsx` — 140 שורות.
חמישה `fontFamily` קשיחים עם `!important` (39, 64, 83, 101, 129) · מופע `#C5A059` אחד.
**אין בו `tel:`, אין `wa.me`, ואין שעות.** פאזה 5.5 פתוחה.

---

## 8. איך נטענים הנתונים

**Strapi דרך `axios`.** שני משתני סביבה:

| משתנה | שימוש |
|---|---|
| `VITE_API_URL` | `/api/lessons`, `/api/rabbis`, `/api/categories-mains`, `/api/categories-subs`, `/api/books`, `/api/auth/local` |
| `VITE_MEDIA_URL` | קובצי אודיו, וידאו ותמונות |

נקודות משיכה מרכזיות בצד הציבורי:

| קובץ | שורות |
|---|---|
| `src/context/RabbisContext.tsx` | 27 — רשימת הרבנים, קונטקסט גלובלי |
| `AllLessons.tsx` | 65, 93, 119, 149, 160 |
| `LessonPlayer.tsx` | 5 קריאות |
| `FullBooksPage.tsx` | 3 קריאות |
| `VideoGallery.tsx` | 3 קריאות |

יש גם endpoint ייעודי `/api/lessons/fast` (`AllLessons.tsx:119`) עם `page` ו־`pageSize` —
**עימוד כבר נתמך בשרת**, מה שמקל על פאזה A סעיף 6.

ארבעה קובצי JSON סטטיים בשימוש: `donationLetterContent.json`, `weeklyLesson.json`,
`founderContent.json`, `donationContent.json`.

---

## 9. `react-helmet`

**לא מותקן.** `package.json` לא מכיל `react-helmet` ולא `react-helmet-async`.

`index.html` מכיל: `<title>עטרת מרדכי</title>`, `charset`, `viewport`, `icon`, ו־preconnect
לגוגל־פונטס וליוטיוב. **אפס `meta description`. אפס `og:`. אפס `canonical`.**
פאזה 4.1 פתוחה לגמרי.

> `index.html` מכיל גם **שתי גרסאות מתות בהערות** (שורות 1–32) לפני ה־doctype האמיתי.

---

## 10. `robots.txt` ו־`sitemap.xml`

**שניהם חסרים.** `public/` לא מכיל אף אחד מהם. פאזה 4.5 פתוחה.

---

## 11. מה כבר נעשה — `src/theme/tokens.ts`

**קובץ טוקנים קיים ומתועד היטב**, עם הערות "נמדד פיקסל־פיקסל מקובץ העיצוב".
הוא מייצא: `colors` · `gradients` · `goldTextFill` · `fonts` · `fontSize` · `space` ·
`radius` · `border` · `headerHeight` · `headerPadX` · `headerControls` · `weeklyBar` ·
`rabbiCard` · `chamferPath()`.

הצבעים תואמים ללוח של ה־PDF: `#FFFCF4` · `#FAF6EA` · `#F2E6C7` · `#8A6522` · `#C5A059` ·
`#4A0F14` · `#12090B`. סולם הטקסט `12/14/16/20/28/40` תואם לבריף במדויק.

**אבל:**

| נושא | מצב |
|---|---|
| הקובץ קיים ומלא | ✅ |
| מיובא ב־ | **3 קבצים בלבד** — `Header.tsx`, `Home.tsx`, `LecturesGrid.tsx` |
| 15 הקבצים הציבוריים האחרים | ❌ עדיין מחרוזות קשיחות |
| הפורמט | `.ts` עם `export const`, **לא** `tokens.css` עם `:root` |

> ⚠️ **זו נקודת החלטה לפאזה 2.1.** הבריף מבקש `src/styles/tokens.css` עם משתני `:root`.
> אצלנו קיים `src/theme/tokens.ts` עם אובייקטים של JS. **שניהם תקפים, אבל אסור שיתקיימו
> במקביל** — זה בדיוק הכפל שהבריף בא למנוע.
> סקריפט הבדיקה של המנהל בודק `--ink`/`--parchment`/`--gold`/`--gold-text` ב־`:root`
> ולכן **תמיד יחזיר "פתוח"** על 2.1 כל עוד הטוקנים הם TS בלבד. זה לא אומר שלא נעשה —
> זה אומר שהבדיקה מודדת דבר אחר.

---

## 12. ממצאים נוספים שלא נשאלו

### א. גופן שבור
`src/App.css:1` מצהיר על `YetziraCustom` ומצביע על `./fonts/BA HaYetzira Choppy.woff2`.
**הקובץ הזה לא קיים.** בתיקייה יש רק `BA HaYetzira Choppy (2).woff2` (עם הסוגריים).
`BooksCarousel.tsx:67,153` משתמש ב־`YetziraCustom` — כלומר **נופל בשקט לגופן המערכת**.

### ב. ארבע הצהרות גופן ועוד אחד חיצוני

| גופן | מוצהר ב־ | קיים? |
|---|---|---|
| `Yetzira-Light` | `index.css:4` | ✅ |
| `Yetzira-Choppy` | `index.css:13` | ✅ |
| `Yetzira-Regular` | `index.css:20` | ✅ |
| `YetziraCustom` | `App.css:1` | ❌ **קובץ חסר** |
| `Heebo` | `index.html` (Google Fonts, `display=swap`) | ✅ |

בתוספת `'Georgia, serif'` ב־`About.tsx` — סה״כ שש משפחות בפוטנציה.

### ג. נגן האודיו הגולמי — מאושר
`Component/LessonPlayer.tsx:274`:

```jsx
<audio controls key={audioUrl} style={{ width: '100%', height: '40px' }} />
```

בדיוק כפי שהבריף מתאר. **יעד פאזה B2.**
שימו לב ל־`key={audioUrl}` — אותו דפוס שחשוד כגורם לטעינה כפולה בווידאו.

### ד. הטמעות יוטיוב ישירות — מאושר
`iframe` עם `youtube.com/embed` מוטמע ישירות ב־`LessonPlayer.tsx:256`, `Home.tsx:142`,
`About.tsx:867`, `About.tsx:1098`. **יעד פאזה B1.ב** (facade).

### ה. `public/` מכיל שבעה קובצי `.mp4` מקומיים
`video-placeholder.mp4`, `הרב בן ציון מוצפי .mp4`, `חלק א.mp4`, `קליפ הישיבה.mp4`,
`שיעור הרב עטייה.mp4`, `שיעור הרב עטייה מקוצר.mp4`, `שיעור הרב עטייה מקוצר_compressed.mp4`.
**אף אחד מהם אינו `תדמית.mp4`** — זה מגיע מהשרת. שווה לבדוק אם הם בשימוש בכלל.

### ו. ה־PNG הכבדים קיימים
`public/pastel-yellow-vignette-concrete-textured-background 1.png` — זה ה־PNG של 2MB
מסעיף 1.5. גם `megila.png` ו־`megila (1).png` נמצאים שם, וכן `image.png` בשורש הריפו (1.1MB).

---

## שאלות פתוחות למנהל

1. **הסרטון יושב על שרת המדיה, לא בריפו.** הדחיסה ל־`hero.mp4` + `hero.webm` + `poster`
   דורשת גישת כתיבה לשרת. מי מעלה את הקבצים החדשים?

2. **`תדמית.mp4` רץ גם ב־`/About`, לא רק בדף הבית.** הבריף לא מזכיר את זה. לתקן בשניהם
   בפאזה 1.1, או רק בדף הבית ולהשאיר את `/About` לפאזה F?

3. **ב־`BRIEF-PAGES.md` פאזה B כתוב שסרטון הרקע נטען גם בעמוד שיעור בודד.**
   לא מצאתי לכך זכר ב־`LessonPlayer.tsx`. ייתכן שזה תוקן מאז המדידה — או שנמדד
   `/AllLessons/:lessonId` כשהוא מוצג כמודאל מעל `/About`. אפשר לאמת?

4. **טוקנים: `tokens.ts` או `tokens.css`?** קיים `src/theme/tokens.ts` מלא ומתועד,
   והבריף מבקש `src/styles/tokens.css`. **ההמלצה: להישאר עם ה־TS הקיים** ולהוסיף לו
   שכבת `:root` דקה שמייצאת את אותם ערכים כ־CSS vars — כך סקריפט הבדיקה יעבור
   ולא נוצר מקור אמת כפול.

5. **`YetziraCustom` שבור** (קובץ חסר) ומשמש ב־`BooksCarousel`. למחוק את ההצהרה ולהעביר
   ל־`Yetzira-Choppy`, או שחסר כאן קובץ גופן שצריך לקבל?

6. **`About.tsx` משתמש ב־`Georgia, serif`** בשתי כותרות. מכוון או שריד?

7. **ב־`src/App.tsx` יש כ־270 שורות של קוד מת בהערות**, וכן ב־`index.html` וב־`main.tsx`.
   למחוק במסגרת אחת הפאזות, או להשאיר?

8. **איפה האתר מתארח?** פאזה 4.1 תלויה בזה — אם Netlify או Cloudflare, prerendering
   הוא הגדרה אחת. לא נמצאו `netlify.toml`, `vercel.json` או `_redirects` בריפו.
