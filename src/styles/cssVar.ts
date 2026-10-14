/**
 * קורא משתנה CSS מ-tokens.css כמספר (px או חסר יחידה).
 * למקומות שבהם הקוד צריך מספר — חישוב או אייקון — ולא מחרוזת של var(...).
 * הערך נשאר מוגדר רק ב-tokens.css.
 */
export const cssNumber = (name: string): number =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
