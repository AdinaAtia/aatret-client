const HONORIFIC = 'שליט"א';

/** מוסיף "שליט"א" לשם רב מהמסד, אם עדיין לא כתוב. */
export const withHonorific = (name?: string | null): string => {
  if (!name) return '';
  return name.includes(HONORIFIC) ? name : `${name} ${HONORIFIC}`;
};
