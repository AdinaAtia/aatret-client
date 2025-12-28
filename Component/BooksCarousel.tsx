import React, { useRef } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BOOKS_DATA = [
  { id: 1, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 2, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 3, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 4, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 5, title: 'ספר חמישי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
];

const BooksCarousel = () => {
  const MAIN_BROWN = '#9c6644';
  const scrollRef = useRef<HTMLDivElement>(null);

  // פונקציית הגלילה שמפעילה את החצים
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * 0.5; // מזיז חצי מהרוחב של המיכל בכל לחיצה
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ py: 10, width: '100%', textAlign: 'center', direction: 'rtl', backgroundColor: '#fff', overflow: 'hidden' }}>
      
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 6, fontFamily: 'serif' }}>
        ספרי הישיבה
      </Typography>

      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', px: { xs: 1, md: 6 } }}>
        
        {/* חץ ימין */}
        <IconButton 
          onClick={() => scroll('right')}
          sx={{ zIndex: 10, color: '#333', '&:hover': { backgroundColor: 'transparent', opacity: 0.7 } }}
        >
          <ChevronRight size={48} strokeWidth={1} />
        </IconButton>

        {/* מיכל הקרוסלה - כאן קורה הקסם */}
        <Box 
          ref={scrollRef}
          sx={{ 
            display: 'flex', 
            gap: 3, 
            overflowX: 'auto', 
            scrollBehavior: 'smooth',
            width: '100%',
            pb: 8, pt: 2,
            px: 2,
            '&::-webkit-scrollbar': { display: 'none' }, // מסתיר פס גלילה
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            // מבטיח שלא יהיה רווח מיותר בצד שמאל אם יש מעט ספרים
            justifyContent: BOOKS_DATA.length <= 4 ? 'center' : 'flex-start'
          }}
        >
          {BOOKS_DATA.map((book) => (
            <Card 
              key={book.id}
              elevation={0} 
              sx={{ 
                backgroundColor: '#fdfbe7', 
                borderRadius: '2.5rem', 
                p: 3, pb: 6,
                // רוחב קטן ורספונסיבי: במחשב 20% מהמסך (כדי שייכנסו 4 עם רווח), במובייל 75%
                flexBasis: { xs: '75%', sm: '40%', md: '20%' }, 
                flexShrink: 0, 
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative', overflow: 'visible',
              }}
            >
              <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={book.image}
                  sx={{ maxHeight: '180px', width: 'auto', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.15))' }}
                />
              </Box>
              
              <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>{book.title}</Typography>
                <Typography sx={{ fontSize: '0.85rem', opacity: 0.7, mb: 1 }}>{book.author}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{book.price}</Typography>
              </CardContent>

              {/* הכפתור שיושב חצי בפנים חצי בחוץ בדיוק כמו בתמונה */}
              <Button 
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
                לרכישה
              </Button>
            </Card>
          ))}
        </Box>

        {/* חץ שמאל */}
        <IconButton 
          onClick={() => scroll('left')}
          sx={{ zIndex: 10, color: '#333', '&:hover': { backgroundColor: 'transparent', opacity: 0.7 } }}
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </IconButton>
      </Box>

      {/* הכפתור השחור למטה - רחוק מהקרוסלה */}
      <Box sx={{ mt: 15, display: 'flex', justifyContent: 'center' }}> 
        <Button
          variant="contained"
          sx={{ backgroundColor: 'black', color: 'white', px: 10, py: 2, borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem' }}
        >
          לכל הספרים
        </Button>
      </Box>
    </Box>
  );
};

export default BooksCarousel;