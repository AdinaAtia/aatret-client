
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import  { useState, useEffect } from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
    // { text: 'ניהול קטגוריות', icon: <FolderIcon />, path: '/admin/categories' },

// ייבוא קומפוננטות רגילות
import Header from '../Component/Header';
import CategoryManager from '../Component/CategoryManager';
import Home from '../Component/Home';
import RabbiQuestionForm from '../Component/RabbiQuestionForm';
import AdminLogin from '../Component/AdminLogin';
import Footer from '../Component/Footer';
import FullBooksPage from '../Component/FullBooksPage';
import ManageLessons from '../Component/ManageLessons';
import BookDetailsPage from '../Component/BookDetailsPage';
import LessonPlayer from '../Component/LessonPlayer';
import ContactForm from '../Component/ContactForm';

import AddNewCategory from '../Component/AddNewCategory';

import AllLessons from '../Component/AllLessons';
import Gallery from '../Component/Gallery';
import ModernScrollDonation from '../Component/ModernScrollDonation';
import About from '../Component/About';

import AudioUploader from '../Component/AudioUploader';


// ייבוא הליאוט החדש שבנינו
import AdminLayout from '../Component/AdminLayout'; 

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Heebo", sans-serif',
  },
});

function App() {
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  
  // שליפת הטוקן מהלוקל סטורג' ברגע טעינת האפליקציה
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // עדכון הטוקן במידה והוא משתנה (למשל אחרי התחברות)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ 
          width: '100%', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          m: 0, 
          p: 0 
        }}>
          
          <Header /> 

          <Box sx={{ flex: 1, width: '100%' }}>
            {selectedLesson ? (
              <LessonPlayer 
                lesson={selectedLesson} 
                onBack={() => setSelectedLesson(null)} 
              />
            ) : (
              <Routes>
                {/* דפים ציבוריים */}
                <Route path="/" element={<Home />} />
                <Route path="/RabbiQuestionForm" element={<RabbiQuestionForm />} />
                <Route path="/FullBooksPage" element={<FullBooksPage />} />
                <Route path="/ModernScrollDonation" element={<ModernScrollDonation />} />
                <Route path="/ContactForm" element={<ContactForm />} />
                <Route path="/BookDetailsPage" element={<BookDetailsPage />} />

                <Route path="/AllLessons" element={<AllLessons onLessonSelect={(lesson) => setSelectedLesson(lesson)}/>} />
                <Route path="/Gallery" element={<Gallery />} />
                <Route path="/About" element={<About />} />
                
                {/* דף התחברות למנהל - בדיקה אם כבר מחובר */}
                <Route 
                  path="/admin/login" 
                  element={
                    token ? <Navigate to="/admin/manage" replace /> : <AdminLogin setToken={setToken} />
                  } 
                />

                {/* דפי ניהול מוגנים */}
                <Route 
                  path="/admin/*" 
                  element={
                    token ? (
                      <AdminLayout token={token}>
                        <Routes>
                          <Route path="manage" element={<ManageLessons />} />
                          <Route path="categories" element={<CategoryManager />} />
                     <Route path="AddNewCategory" element={<AddNewCategory />} />
                          <Route path="AudioUploader" element={<AudioUploader />} />

                          {/* הפנייה מתיקיית השורש של אדמין לניהול שיעורים */}
                          <Route path="" element={<Navigate to="manage" replace />} />
                          <Route path="archive" element={<ManageLessons />} /> 
                        </Routes>
                      </AdminLayout>
                    ) : (
                      <Navigate to="/admin/login" replace />
                    )
                  } 
                />

                {/* ניתוב ברירת מחדל לדפים לא קיימים */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </Box>

          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
