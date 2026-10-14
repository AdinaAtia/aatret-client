import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

export type AppButtonVariant = 'gold' | 'dark' | 'outline' | 'outlineLight';

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  component?: React.ElementType;
  target?: string;
  rel?: string;
  variant?: AppButtonVariant;
}

const base = {
  height: 'var(--btn-h)',
  minHeight: 'var(--btn-h)',
  px: 'var(--btn-px)',
  py: 0,
  borderRadius: 'var(--btn-radius)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--btn-font-size)',
  fontWeight: 'var(--btn-font-weight)',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  boxShadow: 'none',
  transition: '0.2s',
  '&:hover': { boxShadow: 'none' },
  '& .MuiButton-startIcon': { marginInlineStart: 0, marginInlineEnd: '10px' },
  '& .MuiButton-endIcon': { marginInlineEnd: 0, marginInlineStart: '10px' },
} as const;

/** שלושה סוגי כפתור טקסט — גובה, רדיוס וכתב זהים; רק הצבעים משתנים. */
const variants = {
  gold: {
    background: 'var(--gradient-gold-button)',
    color: 'var(--wine)',
    border: '1px solid var(--gold-button-border)',
    '&:hover': { background: 'var(--gradient-gold-button)', filter: 'brightness(1.06)', boxShadow: 'none' },
    '&.Mui-disabled': { backgroundImage: 'none', bgcolor: 'var(--rule-soft)', color: '#9a8f78', borderColor: 'var(--rule-soft)' },
  },
  dark: {
    bgcolor: 'var(--ink-wine)',
    color: 'var(--gold-light)',
    border: '1px solid var(--ink-wine)',
    '&:hover': { bgcolor: 'var(--ink)', boxShadow: 'none' },
    '&.Mui-disabled': { bgcolor: 'var(--rule-soft)', color: '#9a8f78', borderColor: 'var(--rule-soft)' },
  },
  outline: {
    bgcolor: 'transparent',
    color: 'var(--gold-text)',
    border: '1px solid var(--gold)',
    '&:hover': { bgcolor: 'color-mix(in srgb, var(--gold) 12.157%, transparent)', borderColor: 'var(--gold-deep)', boxShadow: 'none' },
    '&.Mui-disabled': { border: '1px solid var(--rule-soft)', color: '#9a8f78' },
  },
  /** מסגרת על רקע כהה (תמונה/יין) */
  outlineLight: {
    bgcolor: 'transparent',
    color: 'var(--gold-light)',
    border: '1px solid var(--gold)',
    '&:hover': { bgcolor: 'var(--gold)', color: 'var(--ink)', boxShadow: 'none' },
    '&.Mui-disabled': { border: '1px solid var(--rule-soft)', color: '#9a8f78' },
  },
} as const;

const AppButton: React.FC<AppButtonProps> = ({ variant = 'gold', sx, ...rest }) => (
  <Button
    disableElevation
    {...rest}
    sx={[base, variants[variant], ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as ButtonProps['sx']}
  />
);

export default AppButton;
