import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';

const BOOKS_DATA = [
  { id: 1, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 2, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 3, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
  { id: 4, title: 'עטרת מרדכי', author: 'הרב מרדכי עטייה', price: '60 ש"ח', image: '/book_cover.jpg' },
];

const BooksSection = () => {
  const MAIN_BROWN = '#9c6644';

  return (
    <Box sx={{ 
      py: 8, 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      backgroundColor: '#fff',
      direction: 'rtl'
    }}>
      
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 6, fontFamily: 'serif' }}>
        ספרי הישיבה
      </Typography>

      {/* כאן התיקון הקריטי - הוספת sx שמכריח שורה */}
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          width: '100%', 
          maxWidth: '1200px', // מגביל את הרוחב כדי שלא יימרח מדי
          display: 'flex', 
          flexDirection: 'row', // מכריח שורה!
          flexWrap: 'wrap',    // מאפשר ירידת שורה רק אם אין מקום
          justifyContent: 'center',
          margin: '0 auto'
        }}
      >
        {BOOKS_DATA.map((book) => (
          <Grid 
            key={book.id} 
            size={{ xs: 12, sm: 6, md: 3 }} // 4 כרטיסים בשורה במחשב
            sx={{ 
                display: 'flex', 
                justifyContent: 'center' 
            }}
          >
            <Card 
              elevation={0} 
              sx={{ 
                backgroundColor: '#fdfbe7', 
                borderRadius: '2.5rem', 
                p: 3,
                width: '100%',
                maxWidth: '280px', // גודל כרטיס מקסימלי
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-10px)' }
              }}
            >
              <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                  component="img"
                  image={book.image}
                  sx={{ 
                    maxHeight: '180px', 
                    width: 'auto', 
                    borderRadius: '4px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
              
              <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 0.5 }}>
                  {book.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.7, mb: 1 }}>
                  {book.author}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>
                  {book.price}
                </Typography>
              </CardContent>

              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: MAIN_BROWN, 
                  borderRadius: '8px', 
                  px: 4, 
                  py: 1,
                  fontWeight: 700,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#7d5236', boxShadow: 'none' } 
                }}
              >
                לרכישה
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        sx={{ 
          mt: 8, 
          backgroundColor: 'black', 
          color: 'white', 
          px: 8, 
          py: 1.8, 
          borderRadius: '10px', 
          fontWeight: 900,
          '&:hover': { backgroundColor: '#222' }
        }}
      >
        לכל הספרים
      </Button>
    </Box>
  );
};

export default BooksSection;