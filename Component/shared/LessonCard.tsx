import React from 'react';
import { Box, Typography } from '@mui/material';
import { fonts, lessonCard } from '../../src/theme/tokens';
import ActionButtons from './ActionButtons';

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
        bgcolor: lessonCard.bg,
        border: `1px solid ${lessonCard.border}`,
        borderRadius: `${lessonCard.radius}px`,
        p: '10px',
      }}
    >
      <Box
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        sx={{
          position: 'relative', aspectRatio: '16/9', borderRadius: '8px',
          overflow: 'hidden', cursor: 'pointer', flexShrink: 0, mb: '10px',
          bgcolor: '#000',
          backgroundImage: thumb ? `url(${thumb})` : undefined,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        {lesson.duration && (
          <Box sx={{
            position: 'absolute',
            bottom: lessonCard.durationBadge.bottom, right: lessonCard.durationBadge.right,
            bgcolor: lessonCard.durationBadge.bg, color: lessonCard.durationBadge.color,
            border: `1px solid ${lessonCard.durationBadge.border}`,
            fontSize: `${lessonCard.durationBadge.size}px`, fontWeight: 700, px: '8px', py: '2px',
            borderRadius: `${lessonCard.durationBadge.radius}px`, lineHeight: 1.5,
            direction: 'ltr', fontVariantNumeric: 'tabular-nums',
          }}>
            {lesson.duration}
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {lesson.topic && (
          <Box sx={{
            alignSelf: 'flex-start', bgcolor: lessonCard.topicChip.bg,
            border: `1px solid ${lessonCard.topicChip.border}`, color: lessonCard.topicChip.textColor,
            fontSize: '11px', fontWeight: 600, borderRadius: '999px', px: '10px', py: '2px', mb: '6px',
          }}>
            {lesson.topic}
          </Box>
        )}

        <Typography
          onClick={onSelect}
          sx={{
            fontFamily: fonts.heading, fontSize: '17px', fontWeight: 700,
            color: lessonCard.titleColor, cursor: 'pointer',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', overflowWrap: 'anywhere', mb: '6px',
          }}
        >
          {lesson.title}
        </Typography>

        <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: lessonCard.rabbiColor, mb: '2px' }}>
          {lesson.rabbiName}
        </Typography>
        {lesson.dateHebrew && (
          <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: lessonCard.dateColor }}>
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
