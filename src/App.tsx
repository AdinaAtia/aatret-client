import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../Component/Header';
import Home from '../Component/Home';
import RabbiQuestionForm from '../Component/RabbiQuestionForm';

import ContactForm from '../Component/ContactForm';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/RabbiQuestionForm" element={<RabbiQuestionForm />} />
           <Route path="/ContactForm" element={<ContactForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
