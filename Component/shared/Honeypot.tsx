import { forwardRef } from 'react';

/**
 * שדה פיתיון נגד בוטים: בני אדם לא רואים אותו ולא ממלאים אותו, בוטים ממלאים כל שדה.
 * השרת מתעלם מפנייה שהשדה (website) מולא בה. אין להסיר את aria-hidden / tabIndex — הם מונעים מקוראי מסך ומטאב להגיע אליו.
 */
const Honeypot = forwardRef<HTMLInputElement>((_props, ref) => (
  <div
    aria-hidden="true"
    style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', opacity: 0, pointerEvents: 'none' }}
  >
    <input ref={ref} type="text" name="website" tabIndex={-1} autoComplete="off" />
  </div>
));
Honeypot.displayName = 'Honeypot';

export default Honeypot;
