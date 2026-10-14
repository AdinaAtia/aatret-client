/** אפקט hover אחיד לכל כרטיס באתר: עלייה של 4px וצל יין רך, במעבר של 0.25 שנייה */
export const cardHoverSx = {
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 28px color-mix(in srgb, var(--wine) 14.902%, transparent)',
  },
} as const;
