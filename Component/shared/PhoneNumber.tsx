import type { ReactNode } from 'react';
import { Box } from '@mui/material';

/**
 * מספר טלפון/פקס בתוך טקסט עברי: לא נשבר באמצע (03- / 6823013) ושומר על סדר הספרות.
 * unicode-bidi: isolate מונע מהמקף לקפוץ לצד הלא נכון בהקשר RTL.
 */
export default function PhoneNumber({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ whiteSpace: 'nowrap', direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block' }}>
      {children}
    </Box>
  );
}
