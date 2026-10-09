import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * מצב גלילה של קרוסלה אופקית: התקדמות (0..1), האם אפשר להמשיך לכל כיוון,
 * וגלילה בלחיצה על חץ. מותאם ל-RTL, שבו scrollLeft שלילי.
 * itemCount — כדי לחשב מחדש כשהפריטים נטענים מהשרת.
 */
export function useCarousel(itemCount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ progress: 0, canPrev: false, canNext: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setState({
      progress: max > 0 ? Math.min(1, pos / max) : 0,
      canPrev: pos > 2,
      canNext: pos < max - 2,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, itemCount]);

  /** prev = חזרה להתחלה, next = קדימה (ב-RTL ימינה = התחלה) */
  const scrollPage = useCallback((dir: 'prev' | 'next') => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const sign = (dir === 'next' ? 1 : -1) * (rtl ? -1 : 1);
    el.scrollBy({ left: sign * el.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  /** קפיצה למיקום (0 = התחלה, 1 = סוף), בלי אנימציה — לגרירת הסרגל */
  const seek = useCallback((fraction: number) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (rtl ? -1 : 1) * fraction * max, behavior: 'instant' });
  }, []);

  return { ref, ...state, onScroll: update, scrollPage, seek };
}
