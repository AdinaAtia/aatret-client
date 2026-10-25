import { useSyncExternalStore } from 'react';
import { Box, Paper, Stack, Typography, CircularProgress, LinearProgress, IconButton, Button } from '@mui/material';
import { colors } from '../src/theme/tokens';

const GOLD = colors.gold;

// --- העלאות שרצות ברקע ---
// המצב נשמר מחוץ לקומפוננטות, כך שההעלאה ממשיכה (והתגית נשארת) גם במעבר בין דפים
export type UploadJob = {
  id: number;
  title: string;
  status: 'uploading' | 'saving' | 'done' | 'failed';
  percent: number;
  error?: string;
  audioUrl?: string;
};

let uploadJobs: UploadJob[] = [];
let nextJobId = 1;
const jobListeners = new Set<() => void>();

const emitJobs = () => jobListeners.forEach(l => l());
const subscribeJobs = (l: () => void) => { jobListeners.add(l); return () => { jobListeners.delete(l); }; };
const getJobs = () => uploadJobs;

// מונה העלאות שהסתיימו בהצלחה — דפים אחרים (ניהול שיעורים) מתרעננים כשהוא משתנה
let completedUploads = 0;
const getCompleted = () => completedUploads;
export const useCompletedUploads = () => useSyncExternalStore(subscribeJobs, getCompleted);

export const addJob = (title: string, status: UploadJob['status']): number => {
  const id = nextJobId++;
  uploadJobs = [...uploadJobs, { id, title, status, percent: 0 }];
  emitJobs();
  return id;
};

export const patchJob = (id: number, patch: Partial<UploadJob>) => {
  const prev = uploadJobs.find(j => j.id === id);
  if (patch.status === 'done' && prev?.status !== 'done') completedUploads++;
  uploadJobs = uploadJobs.map(j => (j.id === id ? { ...j, ...patch } : j));
  emitJobs();
};

export const removeJob = (id: number) => {
  uploadJobs = uploadJobs.filter(j => j.id !== id);
  emitJobs();
};

// מונע סגירת לשונית בטעות בזמן שיש העלאה פעילה
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (e) => {
    if (uploadJobs.some(j => j.status === 'uploading' || j.status === 'saving')) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

// התגיות עצמן — מוצגות בלייאוט של המנהל, ולכן נראות בכל דף
export const UploadJobsPanel = () => {
  const jobs = useSyncExternalStore(subscribeJobs, getJobs);
  if (jobs.length === 0) return null;

  return (
    <Stack spacing={1} sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1400, width: 320, maxWidth: 'calc(100vw - 40px)', direction: 'rtl' }}>
      {jobs.map(job => {
        const active = job.status === 'uploading' || job.status === 'saving';
        const label =
          job.status === 'uploading' ? `מעלה קובץ שמע... ${job.percent}%`
          : job.status === 'saving' ? 'שומר שיעור...'
          : job.status === 'done' ? 'השיעור נשמר בהצלחה'
          : job.error;
        return (
          <Paper key={job.id} elevation={6} sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#000', color: GOLD }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {active && <CircularProgress size={14} sx={{ color: GOLD }} />}
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {job.title}
              </Typography>
              {job.status === 'done' && job.audioUrl && (
                <Button size="small" onClick={() => window.open(job.audioUrl, '_blank')} sx={{ color: GOLD, border: `1px solid ${GOLD}`, borderRadius: '8px', minWidth: 0, px: 1 }}>
                  האזן
                </Button>
              )}
              {!active && (
                <IconButton size="small" onClick={() => removeJob(job.id)} sx={{ color: GOLD }}>✕</IconButton>
              )}
            </Box>
            <Typography sx={{ fontSize: '0.75rem', mt: 0.5, color: job.status === 'failed' ? '#ff8a80' : GOLD }}>
              {label}
            </Typography>
            {active && (
              <LinearProgress
                variant={job.status === 'uploading' ? 'determinate' : 'indeterminate'}
                value={job.percent}
                sx={{ mt: 0.75, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { bgcolor: GOLD } }}
              />
            )}
          </Paper>
        );
      })}
    </Stack>
  );
};
