import { useEffect } from 'react';
import LegalPage from './shared/LegalPage';
import { site } from '../src/content/site';
import { termsContent } from '../src/content/legal';

/** תנאי שימוש ומדיניות פרטיות — נוסח ב-src/content/legal.ts */
const Terms = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

  return (
    <LegalPage
      eyebrow="מידע משפטי"
      title="תנאי שימוש ומדיניות פרטיות"
      intro={termsContent.intro}
      sections={termsContent.sections}
      updated={site.legalUpdated}
    />
  );
};

export default Terms;
