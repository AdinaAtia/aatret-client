import React from 'react';
import { Box, Typography } from '@mui/material';
import ActionButtons from './ActionButtons';
import LessonThumb from './LessonThumb';
import { cardHoverSx } from './cardHover';

export interface LessonCardData {
  id: string | number;
  title: string;
  rabbiName: string;
  dateHebrew?: string;
  youtubeId?: string;
  duration?: string;
  topic?: string;
}

interface LessonCardProps {
  lesson: LessonCardData;
  onSelect: () => void;
  onPlayVideo?: () => void;
  onPlayAudio?: () => void;
  onDownload?: () => void;
}

/**
 * כרטיס שיעור משותף — ארכיון, שיעור בודד ("שיעורים נוספים"), ועוד. BRIEF-PAGES.md.
 * גובה אחיד בתוך רשת: height:100%, הגוף flex:1, הפעולות נדחקות לתחתית.
 */
const LessonCard: React.FC<LessonCardProps> = ({ lesson, onSelect, onPlayVideo, onPlayAudio, onDownload }) => {
  const thumb = lesson.youtubeId ? `https://i.ytimg.com/vi/${lesson.youtubeId}/hqdefault.jpg` : undefined;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--surface)',
        border: `1px solid var(--gold)`,
        borderRadius: `var(--lesson-card-radius)`,
        p: '10px',
        ...cardHoverSx,
      }}
    >
      <LessonThumb
        src={thumb}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') onSelect(); }}
        sx={{ aspectRatio: '16/9', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, mb: '10px' }}
      >
        {lesson.duration && (
          <Box sx={{
            position: 'absolute',
            bottom: 'var(--lesson-card-duration-badge-bottom)', right: 'var(--lesson-card-duration-badge-right)',
            bgcolor: 'var(--wine)', color: 'var(--gold-light)',
            border: `1px solid var(--lesson-card-duration-badge-border)`,
            fontSize: `var(--lesson-card-duration-badge-size)`, fontWeight: 700, px: '8px', py: '2px',
            borderRadius: `var(--lesson-card-duration-badge-radius)`, lineHeight: 1.5,
            direction: 'ltr', fontVariantNumeric: 'tabular-nums',
          }}>
            {lesson.duration}
          </Box>
        )}
      </LessonThumb>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {lesson.topic && (
          <Box sx={{
            alignSelf: 'flex-start', bgcolor: 'var(--sand)',
            border: `1px solid var(--gold)`, color: 'var(--wine)',
            fontSize: '11px', fontWeight: 600, borderRadius: '999px', px: '10px', py: '2px', mb: '6px',
          }}>
            {lesson.topic}
          </Box>
        )}

        <Typography
          onClick={onSelect}
          sx={{
            fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 700,
            color: 'var(--ink-wine)', cursor: 'pointer',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', overflowWrap: 'anywhere', mb: '6px',
          }}
        >
          {lesson.title}
        </Typography>

        <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--gold-text)', mb: '2px' }}>
          {lesson.rabbiName}
        </Typography>
        {lesson.dateHebrew && (
          <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
            {lesson.dateHebrew}
          </Typography>
        )}

        <Box sx={{ mt: 'auto', pt: '10px' }}>
          <ActionButtons onPlayVideo={onPlayVideo} onPlayAudio={onPlayAudio} onDownload={onDownload} />
        </Box>
      </Box>
    </Box>
  );
};

export default LessonCard;
