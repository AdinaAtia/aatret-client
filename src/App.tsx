import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../Component/Header';
import Home from '../Component/Home';
import RabbiQuestionForm from '../Component/RabbiQuestionForm';
import LecturesGrid from '../Component/LecturesGrid';
// BooksSection.tsx
import BooksSection from '../Component/BooksSection';
import ContactForm from '../Component/ContactForm';
import AllLessons from '../Component/AllLessons';
import LessonPlayer from '../Component/LessonPlayer';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/BooksSection" element={<BooksSection />} />
         <Route path="/RabbiQuestionForm" element={<RabbiQuestionForm />} />
           <Route path="/ContactForm" element={<ContactForm />} />
             <Route path="/AllLessons" element={<AllLessons />} />
               {/* <Route path="/LessonPlayer" element={<LessonPlayer />} /> */}
           {/* <Route path="/LecturesGrid" element={<LecturesGrid />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
