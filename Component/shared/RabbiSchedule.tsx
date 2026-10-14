import { Box, Typography } from '@mui/material';

export interface RabbiScheduleSlot {
  day: string;
  startTime: string;
  endTime?: string | null;
  topic: string;
}

const DAY_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABEL: Record<string, string> = {
  sunday: 'יום א׳',
  monday: 'יום ב׳',
  tuesday: 'יום ג׳',
  wednesday: 'יום ד׳',
  thursday: 'יום ה׳',
  friday: 'יום ו׳',
  saturday: 'שבת',
};

// Strapi מחזיר "HH:mm:ss.SSS" — מציגים "HH:mm"
const hhmm = (t?: string | null) => (t ? t.slice(0, 5) : '');

export const sortSchedule = (slots: RabbiScheduleSlot[] = []) =>
  [...slots].sort((a, b) =>
    DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || hhmm(a.startTime).localeCompare(hhmm(b.startTime))
  );

// זמני לימוד של רב: שורה לכל שיעור, ממוינת לפי יום ושעה. ללא שיעורים — לא מציג כלום.
const RabbiSchedule = ({ slots }: { slots?: RabbiScheduleSlot[] }) => {
  if (!slots || slots.length === 0) return null;

  return (
    <Box sx={{ width: '100%', mt: '12px', textAlign: 'right' }}>
      {sortSchedule(slots).map((s, i) => {
        const start = hhmm(s.startTime);
        const end = hhmm(s.endTime);
        const time = end ? `${start}–${end}` : start;
        return (
          <Box key={i} sx={{ display: 'flex', alignItems: 'stretch', gap: '10px', mb: '10px' }}>
            {/* יום ושעות, ופס אנכי מפריד מהנושא */}
            <Box sx={{ flexShrink: 0, pl: '10px', borderLeft: '1px solid var(--rule-soft)' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--wine)', lineHeight: 1.3 }}>
                {DAY_LABEL[s.day] || s.day}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'var(--wine)', lineHeight: 1.3 }}>
                {time}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--ink-wine)', lineHeight: 1.3, alignSelf: 'center' }}>
              {s.topic}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default RabbiSchedule;
