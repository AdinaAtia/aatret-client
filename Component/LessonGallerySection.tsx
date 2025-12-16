// // LessonGallerySection.tsx
// import React, { useState } from 'react';
// import { Box, Button, Grid, Stack } from '@mui/material';
// // נניח ש-VideoCardComponent נמצא באותה ספרייה
// import VideoCardComponent, { VideoData } from './VideoCardComponent'; 

// // נתוני דמה ניטרליים (כדי להימנע מנושאים אסורים)
// const DUMMY_VIDEO_DATA: VideoData[] = [
//   { id: 1, title: "קורס א': פיתוח ווב מתקדם", speaker: "דוקטור ישראלי", details: "תאריך: 01.03.05, גודל: 250MB", duration: "01:03:05", isNew: true, imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=הרצאה+1" },
//   { id: 2, title: "קורס ב': מבוא לכלכלה פיננסית", speaker: "גב' כהן", details: "תאריך: 05.03.05, גודל: 180MB", duration: "00:45:12", isNew: true, imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=הרצאה+2" },
//   { id: 3, title: "קורס ג': UX/UI עקרונות בסיס", speaker: "מר לוי", details: "תאריך: 10.03.05, גודל: 300MB", duration: "01:15:30", isNew: false, imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=הרצאה+3" },
//   { id: 4, title: "קורס ד': שיווק דיגיטלי 2024", speaker: "מר עמי", details: "תאריך: 15.03.05, גודל: 120MB", duration: "00:30:00", isNew: false, imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=הרצאה+4" },
//   // מוסיפים שורת כרטיסים שנייה כדי לדמות את התמונה המקורית
//   { id: 5, title: "קורס ה': עקרונות ניהול פרויקטים", speaker: "דוקטור ישראלי", details: "תאריך: 20.03.05, גודל: 290MB", duration: "01:10:00", isNew: false, imageUrl: "https://via.placeholder.com/150/00FFFF/000000?text=הרצאה+5" },
//   { id: 6, title: "קורס ו': חשיבה יצירתית בעבודה", speaker: "גב' כהן", details: "תאריך: 25.03.05, גודל: 150MB", duration: "00:55:00", isNew: false, imageUrl: "https://via.placeholder.com/150/FF00FF/000000?text=הרצאה+6" },
//   { id: 7, title: "קורס ז': אבטחת מידע למתחילים", speaker: "מר לוי", details: "תאריך: 30.03.05, גודל: 220MB", duration: "01:05:00", isNew: false, imageUrl: "https://via.placeholder.com/150/AAAAAA/FFFFFF?text=הרצאה+7" },
//   { id: 8, title: "קורס ח': כתיבה טכנית אפקטיבית", speaker: "מר עמי", details: "תאריך: 05.04.05, גודל: 190MB", duration: "00:40:00", isNew: false, imageUrl: "https://via.placeholder.com/150/123456/FFFFFF?text=הרצאה+8" },
// ];

// const TABS = ['קצרים', 'נבחרים', 'חדשים', 'הכל'];

// const LessonGallerySection: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('הכל');
//   const activeColor = '#8B0000'; // אדום כהה מהתמונה המקורית

//   // סינון דמה לפי לשונית
//   const filteredVideos = DUMMY_VIDEO_DATA.filter(video => {
//     if (activeTab === 'חדשים') return video.isNew;
//     // כאן תהיה לוגיקת סינון אמיתית
//     return true; 
//   });


//   return (
//     <Box sx={{ p: 4, textAlign: 'center', direction: 'rtl' }}>
      
//       {/* 1. ניווט לשוניות (טאבים) */}
//       <Stack 
//         direction="row" 
//         spacing={0.5} 
//         justifyContent="center" 
//         sx={{ mb: 4, display: 'inline-flex', border: '1px solid #ddd', borderRadius: '4px' }}
//       >
//         {TABS.map((tab) => (
//           <Button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             variant={'text'} // נשתמש ב-text ונשלוט ב-backgroundColor
//             sx={{
//               backgroundColor: activeTab === tab ? activeColor : 'white',
//               color: activeTab === tab ? 'white' : 'black',
//               fontWeight: 'bold',
//               minWidth: '90px',
//               padding: '8px 15px',
//               borderRadius: '0', // כדי ליצור מראה מחובר
//               borderLeft: tab !== TABS[TABS.length - 1] ? '1px solid #ddd' : 'none',
//               '&:hover': {
//                 backgroundColor: activeTab === tab ? activeColor : '#f0f0f0',
//               }
//             }}
//           >
//             {tab}
//           </Button>
//         ))}
//       </Stack>

//       {/* 2. גריד הסרטונים */}
//       <Grid container spacing={4} justifyContent="center">
//         {filteredVideos.map((video) => (
//           <Grid 
//             item 
//             key={video.id} 
//             xs={12} 
//             sm={6} 
//             md={3} // מציג 4 כרטיסים בשורה במסך רחב
//             sx={{ display: 'flex', justifyContent: 'center' }}
//           >
//             <VideoCardComponent video={video} />
//           </Grid>
//         ))}
//       </Grid>
      
//       {/* 3. כפתורי פעולה תחתונים */}
//       <Stack 
//         direction={{ xs: 'column', sm: 'row' }} 
//         spacing={2} 
//         justifyContent="center" 
//         sx={{ mt: 5, maxWidth: 600, margin: '40px auto 0 auto' }}
//       >
//         <Button 
//           variant="outlined"
//           sx={{ 
//             borderColor: 'black', 
//             color: 'black', 
//             fontWeight: 'bold',
//             flexGrow: 1,
//             padding: '10px 20px',
//             '&:hover': { backgroundColor: '#f5f5f5', borderColor: 'black' }
//           }}
//         >
//           חיפוש מתקדם
//         </Button>
//         <Button 
//           variant="contained"
//           sx={{ 
//             backgroundColor: '#8B0000', // צבע ניטרלי מהתמונה
//             color: 'white',
//             fontWeight: 'bold',
//             flexGrow: 1,
//             padding: '10px 20px',
//             '&:hover': { backgroundColor: '#7a2222' }
//           }}
//         >
//           לכל ההרצאות
//         </Button>
//       </Stack>
//     </Box>
//   );
// };

// export default LessonGallerySection;
// // ייצוא סוג הנתונים לשימוש ברכיב הראשי
// export type { VideoData };