/** רשימת קבצי ה-PDF של שיעור: PdfFiles (מערך) ואם ריק — PdfFileName הישן (שם בודד). */
export const getPdfList = (attrs: any): string[] => {
  const arr = attrs?.PdfFiles;
  if (Array.isArray(arr)) {
    const clean = arr.map((s) => String(s || '').trim()).filter(Boolean);
    if (clean.length) return clean;
  }
  const single = String(attrs?.PdfFileName || attrs?.pdfFileName || '').trim();
  return single ? [single] : [];
};
