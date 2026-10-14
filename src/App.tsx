
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import  { useState, useEffect } from 'react';
// import { Box, createTheme, ThemeProvider } from '@mui/material';
//     // { text: 'ניהול קטגוריות', icon: <FolderIcon />, path: '/admin/categories' },

// // ייבוא קומפוננטות רגילות
// import Header from '../Component/Header';
// import CategoryManager from '../Component/CategoryManager';
// import Home from '../Component/Home';
// import AdminLogin from '../Component/AdminLogin';
// import Footer from '../Component/Footer';
// import FullBooksPage from '../Component/FullBooksPage';
// import ManageLessons from '../Component/ManageLessons';
// import BookDetailsPage from '../Component/BookDetailsPage';
// import LessonPlayer from '../Component/LessonPlayer';
// import ContactForm from '../Component/ContactForm';

// import AddNewCategory from '../Component/AddNewCategory';

// import AllLessons from '../Component/AllLessons';
// import Gallery from '../Component/Gallery';
// import ModernScrollDonation from '../Component/ModernScrollDonation';
// import About from '../Component/About';

// import AudioUploader from '../Component/AudioUploader';


// // ייבוא הליאוט החדש שבנינו
// import AdminLayout from '../Component/AdminLayout'; 

// const theme = createTheme({
//   direction: 'rtl',
//   typography: {
//     fontFamily: '"Heebo", sans-serif',
//   },
// });

// function App() {
//   const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  
//   // שליפת הטוקן מהלוקל סטורג' ברגע טעינת האפליקציה
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   // עדכון הטוקן במידה והוא משתנה (למשל אחרי התחברות)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <Box sx={{ 
//           width: '100%', 
//           minHeight: '100vh', 
//           display: 'flex', 
//           flexDirection: 'column', 
//           m: 0, 
//           p: 0 
//         }}>
          
//           <Header /> 

//           <Box sx={{ flex: 1, width: '100%' }}>
//             {selectedLesson ? (
//               <LessonPlayer 
//                 lesson={selectedLesson} 
//                 onBack={() => setSelectedLesson(null)} 
//               />
//             ) : (
//               <Routes>
//                 {/* דפים ציבוריים */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/FullBooksPage" element={<FullBooksPage />} />
//                 <Route path="/ModernScrollDonation" element={<ModernScrollDonation />} />
//                 <Route path="/ContactForm" element={<ContactForm />} />
//                 <Route path="/BookDetailsPage" element={<BookDetailsPage />} />

//                 <Route path="/AllLessons" element={<AllLessons onLessonSelect={(lesson) => setSelectedLesson(lesson)}/>} />
//                 <Route path="/Gallery" element={<Gallery />} />
//                 <Route path="/About" element={<About />} />
                
//                 {/* דף התחברות למנהל - בדיקה אם כבר מחובר */}
//                 <Route 
//                   path="/admin/login" 
//                   element={
//                     token ? <Navigate to="/admin/manage" replace /> : <AdminLogin setToken={setToken} />
//                   } 
//                 />

//                 {/* דפי ניהול מוגנים */}
//                 <Route 
//                   path="/admin/*" 
//                   element={
//                     token ? (
//                       <AdminLayout token={token}>
//                         <Routes>
//                           <Route path="manage" element={<ManageLessons />} />
//                           <Route path="categories" element={<CategoryManager />} />
//                      <Route path="AddNewCategory" element={<AddNewCategory />} />
//                           <Route path="AudioUploader" element={<AudioUploader />} />

//                           {/* הפנייה מתיקיית השורש של אדמין לניהול שיעורים */}
//                           <Route path="" element={<Navigate to="manage" replace />} />
//                           <Route path="archive" element={<ManageLessons />} /> 
//                         </Routes>
//                       </AdminLayout>
//                     ) : (
//                       <Navigate to="/admin/login" replace />
//                     )
//                   } 
//                 />

//                 {/* ניתוב ברירת מחדל לדפים לא קיימים */}
//                 <Route path="*" element={<Navigate to="/" replace />} />
//               </Routes>
//             )}
//           </Box>

//           <Footer />
//         </Box>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { Box, createTheme, ThemeProvider } from '@mui/material';

// // ייבוא קומפוננטות רגילות
// import Header from '../Component/Header';
// import CategoryManager from '../Component/CategoryManager';
// import Home from '../Component/Home';
// import AdminLogin from '../Component/AdminLogin';
// import Footer from '../Component/Footer';
// import FullBooksPage from '../Component/FullBooksPage';
// import ManageLessons from '../Component/ManageLessons';
// import BookDetailsPage from '../Component/BookDetailsPage';
// import LessonPlayer from '../Component/LessonPlayer';
// import ContactForm from '../Component/ContactForm';
// import AddNewCategory from '../Component/AddNewCategory';
// import AllLessons from '../Component/AllLessons';
// import Gallery from '../Component/Gallery';
// import ModernScrollDonation from '../Component/ModernScrollDonation';
// import About from '../Component/About';
// import AudioUploader from '../Component/AudioUploader';

// // ייבוא הליאוט החדש שבנינו
// import AdminLayout from '../Component/AdminLayout'; 

// const theme = createTheme({
//   direction: 'rtl',
//   typography: {
//     fontFamily: '"Heebo", sans-serif',
//   },
// });

// function App() {
//   const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  
//   // שליפת הטוקן מהלוקל סטורג' ברגע טעינת האפליקציה
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   // עדכון הטוקן במידה והוא משתנה (למשל אחרי התחברות)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <Box sx={{ 
//           width: '100%', 
//           minHeight: '100vh', 
//           display: 'flex', 
//           flexDirection: 'column', 
//           m: 0, 
//           p: 0 
//         }}>
          
//           <Header /> 

//           <Box sx={{ flex: 1, width: '100%' }}>
//             {/* הסרנו את התנאי שחסם את ה-Routes כדי לאפשר רינדור תקין של הדפים והלוגים */}
//             <Routes>
//               {/* דפים ציבוריים */}
//               <Route path="/" element={<Home />} />
//               <Route path="/FullBooksPage" element={<FullBooksPage />} />
//               <Route path="/ModernScrollDonation" element={<ModernScrollDonation />} />
//               <Route path="/ContactForm" element={<ContactForm />} />
//               <Route path="/BookDetailsPage" element={<BookDetailsPage />} />

//               <Route path="/AllLessons" element={<AllLessons onLessonSelect={(lesson) => setSelectedLesson(lesson)}/>} />
//               <Route path="/Gallery" element={<Gallery />} />
//               <Route path="/About" element={<About />} />
              
//               {/* דף התחברות למנהל - בדיקה אם כבר מחובר */}
//               <Route 
//                 path="/admin/login" 
//                 element={
//                   token ? <Navigate to="/admin/manage" replace /> : <AdminLogin setToken={setToken} />
//                 } 
//               />

//               {/* דפי ניהול מוגנים */}
//               <Route 
//                 path="/admin/*" 
//                 element={
//                   token ? (
//                     <AdminLayout token={token}>
//                       <Routes>
//                         <Route path="manage" element={<ManageLessons />} />
//                         <Route path="categories" element={<CategoryManager />} />
//                         <Route path="AddNewCategory" element={<AddNewCategory />} />
//                         <Route path="AudioUploader" element={<AudioUploader />} />

//                         {/* הפנייה מתיקיית השורש של אדמין לניהול שיעורים */}
//                         <Route path="" element={<Navigate to="manage" replace />} />
//                         <Route path="archive" element={<ManageLessons />} /> 
//                       </Routes>
//                     </AdminLayout>
//                   ) : (
//                     <Navigate to="/admin/login" replace />
//                   )
//                 } 
//               />

//               {/* ניתוב ברירת מחדל לדפים לא קיימים */}
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>

//             {/* אם נבחר שיעור, הנגן יוצג כאלמנט נוסף (למשל כמודל או בתחתית) בהתאם לצורך */}
//             {selectedLesson && (
//               <LessonPlayer 
//                 lesson={selectedLesson} 
//                 onBack={() => setSelectedLesson(null)} 
//               />
//             )}
//           </Box>

//           <Footer />
//         </Box>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;
// -



import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { RabbisProvider } from './context/RabbisContext';

import Header from '../Component/Header';
import Footer from '../Component/Footer';
import About from '../Component/About';
import RouteSeo from '../Component/shared/RouteSeo';

const CategoryManager = lazy(() => import('../Component/CategoryManager'));
const Home = lazy(() => import('../Component/Home'));
const AdminLogin = lazy(() => import('../Component/AdminLogin'));
const FullBooksPage = lazy(() => import('../Component/FullBooksPage'));
const ManageLessons = lazy(() => import('../Component/ManageLessons'));
const BookDetailsPage = lazy(() => import('../Component/BookDetailsPage'));
const ContactForm = lazy(() => import('../Component/ContactForm'));
const AddNewCategory = lazy(() => import('../Component/AddNewCategory'));
const AllLessons = lazy(() => import('../Component/AllLessons'));
const ModernScrollDonation = lazy(() => import('../Component/ModernScrollDonation'));
const DonateLetter = lazy(() => import('../Component/DonateLetter'));
const AudioUploader = lazy(() => import('../Component/AudioUploader'));
const AdminLayout = lazy(() => import('../Component/AdminLayout'));
const DraftLessons = lazy(() => import('../Component/DraftLessons'));
const ManageRabbis = lazy(() => import('../Component/ManageRabbis'));
const ManageBooks = lazy(() => import('../Component/ManageBooks'));
const VideoGallery = lazy(() => import('../Component/VideoGallery'));

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'var(--font-body)',
    h1: { fontFamily: 'var(--font-heading)' },
    h2: { fontFamily: 'var(--font-heading)' },
    h3: { fontFamily: 'var(--font-heading)' },
  },
});

const getStoredToken = (): string | null => {
  const localToken = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');
  if (localToken && expiry) {
    if (Date.now() < parseInt(expiry)) return localToken;
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  return sessionStorage.getItem('token');
};

/** חזרה לראש הדף בכל מעבר בין עמודים */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

function App() {
  const [token, setToken] = useState<string | null>(getStoredToken());

  useEffect(() => {
    const handleStorageChange = () => setToken(getStoredToken());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <HelmetProvider>
    <ThemeProvider theme={theme}>
      <RabbisProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RouteSeo />
          <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
            <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
            <Header />
            <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, width: '100%', outline: 'none', scrollMarginTop: { xs: 'var(--header-height-xs)', md: 'var(--header-height-md)' } }}>
              <Suspense fallback={<Box sx={{ minHeight: '60vh' }} />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/FullBooksPage" element={<FullBooksPage />} />
                  <Route path="/ModernScrollDonation" element={<ModernScrollDonation />} />
                  <Route path="/DonateLetter" element={<DonateLetter />} />
                  <Route path="/ContactForm" element={<ContactForm />} />
                  <Route path="/BookDetailsPage" element={<BookDetailsPage />} />
                  <Route path="/BookDetailsPage/:bookId" element={<BookDetailsPage />} />
                  <Route path="/AllLessons" element={<AllLessons />} />
                  <Route path="/AllLessons/:lessonId" element={<AllLessons />} />
                  <Route path="/About" element={<About />} />
                  <Route path="/VideoGallery" element={<VideoGallery />} />
                  <Route
                    path="/manager/login"
                    element={token ? <Navigate to="/manager/manage" replace /> : <AdminLogin setToken={setToken} />}
                  />
                  <Route
                    path="/manager/*"
                    element={token ? (
                      <AdminLayout token={token}>
                        <Routes>
                          <Route path="manage" element={<ManageLessons />} />
                          <Route path="categories" element={<CategoryManager />} />
                          <Route path="AddNewCategory" element={<AddNewCategory />} />
                          <Route path="AudioUploader" element={<AudioUploader />} />
                          <Route path="" element={<Navigate to="manage" replace />} />
                          <Route path="archive" element={<ManageLessons />} />
                          <Route path="drafts" element={<DraftLessons />} />
                          <Route path="rabbis" element={<ManageRabbis />} />
                          <Route path="books" element={<ManageBooks />} />
                        </Routes>
                      </AdminLayout>
                    ) : (
                      <Navigate to="/manager/login" replace />
                    )}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </RabbisProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;