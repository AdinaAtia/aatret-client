import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, IconButton, CircularProgress, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const BooksCarousel = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const MAIN_BROWN = '#9c6644';
  const STRAPI_BASE_URL = 'http://localhost:1337'; 
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // ב-Strapi 5 משתמשים ב-populate=* כדי לקבל את הקטגוריה והתמונות
        const response = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate=*`);
        if (response.data && response.data.data) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * 0.5;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: MAIN_BROWN }} />
      </Box>
    );
  }

  return (
  <Box sx={{ 
  py: 10, 
  width: '100%', 
  maxWidth: '100vw', // הגבלה לרוחב המסך
  textAlign: 'center', 
  direction: 'rtl', 
  backgroundColor: '#fff', 
  overflow: 'hidden', // חותך שאריות שיוצאות מהצדדים
  position: 'relative' 
}}>
      
      <Typography variant="h4" sx={{ color:'#9c6644'  , fontSize:60 ,fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
fontWeight: 500, mb: 6 }}>
        ספרי הישיבה
      </Typography>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', px: { xs: 1, md: 6 } }}>
        
        {/* חץ ימין */}
        <IconButton 
          onClick={() => scroll('right')} 
          sx={{ zIndex: 10, color: '#333', '&:hover': { opacity: 0.7 } }}
        >
          <ChevronRight size={48} strokeWidth={1} />
        </IconButton>

        {/* מיכל הספרים */}
        {/* <Box 
          ref={scrollRef}
          sx={{ 
            display: 'flex', gap: 3, overflowX: 'auto', width: '100%', pb: 8, pt: 2, px: 2,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none', scrollbarWidth: 'none',
            justifyContent: books.length <= 4 ? 'center' : 'flex-start'
          }}
        > */}
        <Box 
  ref={scrollRef}
  sx={{ 
    display: 'flex', 
    gap: 3, 
    overflowX: 'auto', 
    width: '100%', 
    maxWidth: '100%', // מבטיח שהמיכל לא יגדל מעבר לאבא שלו
    pb: 8, pt: 2, px: 2,
    '&::-webkit-scrollbar': { display: 'none' },
    msOverflowStyle: 'none', 
    scrollbarWidth: 'none',
    justifyContent: books.length <= 4 ? 'center' : 'flex-start'
  }}
>
          {books.slice(0, 6).map((book) => {
            // חילוץ תמונה (מערך ב-Strapi 5 לפי ה-JSON שלך)
            let imageUrl = '/book_placeholder.jpg'; 
            if (book.image && Array.isArray(book.image) && book.image.length > 0) {
              imageUrl = `${STRAPI_BASE_URL}${book.image[0].url}`;
            }

            // חילוץ קטגוריה (ישיר ב-Strapi 5)
            const categoryName = book.book_categorie?.name || "כללי";

            return (
              <Card 
                key={book.id}
                elevation={0} 
                sx={{ 
                  backgroundColor: '#fdfbe7', borderRadius: '2.5rem', p: 3, pb: 6,
                  flexBasis: { xs: '85%', sm: '45%', md: '22%' }, 
                  flexShrink: 0, 
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative', overflow: 'visible',
                }}
              >
                {/* הצגת שם הקטגוריה */}
                <Chip 
                  label={categoryName} 
                  size="small"
                  sx={{ 
                    mb: 2, 
                    backgroundColor: 'rgba(156, 102, 68, 0.1)', 
                    color: MAIN_BROWN, 
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }} 
                />

                <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={book.book_name}
                    sx={{ 
                      maxHeight: '180px', 
                      width: 'auto', 
                  mixBlendMode: 'multiply',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 0.5 }}>
                    {book.book_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', opacity: 0.7, mb: 1 }}>
                    {book.rabbi}
                  </Typography>
                  {/* <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: MAIN_BROWN }}>
                    {book.price ? `${book.price} ₪` : 'צור קשר'}
                  </Typography> */}
                </CardContent>

                {/* כפתור רכישה צף */}
                <Button 
                 onClick={() => navigate('/BookDetailsPage', { state: { book } })}
                  variant="contained" 
                  sx={{ 
                    backgroundColor: MAIN_BROWN, borderRadius: '12px', px: 4, py: 1,
                    fontWeight: 700, position: 'absolute', bottom: '-22px', 
                    left: '50%', transform: 'translateX(-50%)',
                    boxShadow: '0 8px 16px rgba(156, 102, 68, 0.4)',
                    whiteSpace: 'nowrap',
                    '&:hover': { backgroundColor: '#7d5236' } 
                  }}
                >
לפרטים
                </Button>
              </Card>
            );
          })}
        </Box>

        {/* חץ שמאל */}
        <IconButton 
          onClick={() => scroll('left')} 
          sx={{ zIndex: 10, color: '#333', '&:hover': { opacity: 0.7 } }}
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </IconButton>
      </Box>

      {/* כפתור תחתון */}
      <Box sx={{ mt: 15, display: 'flex', justifyContent: 'center' }}> 
        <Button
         onClick={() => navigate('/FullBooksPage' )}
          variant="contained"
          sx={{ 
backgroundColor: MAIN_BROWN,            color: 'white', 
            px: 8, py: 2, 
            borderRadius: '12px', 
            fontWeight: 800, 
            fontSize: '1.1rem',
                    '&:hover': { backgroundColor: '#7d5236' } 
          }}
        >
          לכל הספרים
        </Button>
      </Box>
    </Box>
  );
};

export default BooksCarousel;