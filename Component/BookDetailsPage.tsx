import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid'; // גריד 2 כפי שביקשת
import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material';

const MAIN_BROWN = '#9c6644';
const STRAPI_BASE_URL = 'http://localhost:1337';

const BookDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;

  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!book || !book.book_categorie) {
        setLoadingRelated(false);
        return;
      }
      try {
        const categoryId = book.book_categorie.id;
        const response = await axios.get(
          `${STRAPI_BASE_URL}/api/rabbi-books?filters[book_categorie][id][$eq]=${categoryId}&filters[id][$ne]=${book.id}&pagination[limit]=4&populate=*`
        );
        if (response.data?.data) setRelatedBooks(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelatedBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [book]);

  if (!book) return <Typography sx={{ textAlign: 'center', mt: 5 }}>הספר לא נמצא</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '150vh' }}>
      
      {/* הבלוק המרכזי - הצרנו את ה-maxWidth ל-800px במקום 950px */}
      <Box sx={{ 
        backgroundColor: '#fdfbe7', 
        borderRadius: '50px', 
        p: { xs: 3, md: 5 }, 
        maxWidth: '950px', // כאן השליטה על הצרת האלמנט
        margin: '0 auto',
        mb: 10,
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
      }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* תמונת הספר - צד ימין */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={book.image?.[0]?.url ? `${STRAPI_BASE_URL}${book.image[0].url}` : ''}
              sx={{ 
                width: '100%',
                maxWidth: '400px', // הקטנתי מעט גם את התמונה כדי שתתאים לבלוק הצר
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(10px 10px 20px rgba(0,0,0,0.12))'
              }}
            />
          </Grid>

          {/* פרטי הספר - צד שמאל בתוך הבלוק הלבן */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Box sx={{ backgroundColor: '#fff', p: 3, borderRadius: '25px' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{book.book_name}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.7, mb: 2 }}>
                  מחבר: {book.rabbi}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {book.description || "אין תיאור זמין לספר זה."}
                </Typography>
              </Box>

              <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: '25px', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, mb: 1.5, fontSize: '0.85rem' }}>לרכישה צור קשר עם הישיבה</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/ContactForm')}
                  sx={{ 
                    backgroundColor: MAIN_BROWN, 
                    borderRadius: '50px', 
                    px: 4, 
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#7d5236' }
                  }}
                >
                  צור קשר
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* ספרים נוספים בנושא */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, textAlign: 'center', mb: 4 }}>ספרים נוספים בנושא</Typography>
        
        {loadingRelated ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {relatedBooks.map((relBook) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={relBook.id}>
                <Box 
                   sx={{ 
                     backgroundColor: '#fdfbe7', borderRadius: '1.5rem', p: 2, pb: 3, 
                     textAlign: 'center', height: '100%', cursor: 'pointer'
                   }}
                   onClick={() => navigate('/BookDetailsPage', { state: { book: relBook } })}
                >
                  <Box sx={{ height: '110px', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                    <Box
                      component="img"
                      src={relBook.image?.[0]?.url ? `${STRAPI_BASE_URL}${relBook.image[0].url}` : ''}
                      sx={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', mb: 1, minHeight: '32px' }}>
                    {relBook.book_name}
                  </Typography>
                  <Button variant="contained" sx={{ fontSize: '0.65rem', backgroundColor: MAIN_BROWN, borderRadius: '6px', py: 0.5 }}>
                    לפרטים
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default BookDetailsPage;