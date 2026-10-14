import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { site } from '../src/content/site';
import AppButton from './shared/AppButton';
import SectionFlourish from './shared/SectionFlourish';
import SectionArch from './shared/SectionArch';
import { cardHoverSx } from './shared/cardHover';
import CarouselProgress, { carouselArrowSx } from "./shared/CarouselProgress";
import { useCarousel } from './shared/useCarousel';

const arrowSx = {
  ...carouselArrowSx,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  p: 0,
  zIndex: 2,
} as const;

const BooksCarousel = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const STRAPI_BASE_URL = `${import.meta.env.VITE_API_URL}`;
  const { ref: scrollRef, progress, canPrev, canNext, onScroll, scrollPage, seek } = useCarousel(books.length + (loading ? 0 : 1));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate=*`);
        if (response.data && response.data.data) {
          // הצגת 7 ספרים בלבד
          setBooks(response.data.data.slice(0, 7));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: 'var(--section-bg)' }}>
        <CircularProgress sx={{ color: 'var(--gold)' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      boxSizing: 'border-box',
      bgcolor: 'var(--section-bg)',
      borderTop: `1px solid var(--gold)`,
      borderBottom: `1px solid var(--gold)`,
      py: { xs: 6, md: '80px' },
      direction: 'rtl',
      overflow: 'hidden',
    }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: '52px' }, boxSizing: 'border-box' }}>

        {/* כותרת הקטע */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: '32px', md: '48px' } }}>
          <SectionArch mb="16px" />
          <Typography component="h2" sx={{
            fontFamily: 'var(--font-heading-ornate)',
            fontSize: { xs: 'var(--t5)', md: 'var(--t6)' },
            fontWeight: 400,
            lineHeight: 1.2,
            color: 'var(--wine)',
          }}>
            ספרי הישיבה
          </Typography>
          <SectionFlourish mt="24px" />
        </Box>

        <Box sx={{ position: 'relative' }}>
          <IconButton
            aria-label="הקודם"
            disabled={!canPrev}
            onClick={() => scrollPage('prev')}
            sx={{ ...arrowSx, right: -52 }}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </IconButton>

          <Box
            ref={scrollRef}
            onScroll={onScroll}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              width: '100%',
              py: '6px',
              my: '-6px',
              gap: '26px',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {books.map((book) => {
              let imageUrl = '/book_placeholder.jpg';
              if (book.image && Array.isArray(book.image) && book.image.length > 0) {
                imageUrl = `${STRAPI_BASE_URL}${book.image[0].url}`;
              }
              const openBook = () => navigate(`/BookDetailsPage/${book.id}`, { state: { book } });

              return (
                <Box
                  key={book.id}
                  onClick={openBook}
                  sx={{
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    width: {
                      xs: '100%',
                      sm: 'calc((100% - 26px) / 2)',
                      md: 'calc((100% - 78px) / 4)',
                    },
                    minHeight: { md: '444px' },
                    display: 'flex',
                    bgcolor: 'var(--surface)',
                    border: `1px solid var(--gold)`,
                    borderRadius: `var(--book-card-radius)`,
                    p: '8px',
                    cursor: 'pointer',
                    scrollSnapAlign: 'start',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    ...cardHoverSx,
                  }}
                >
                  {/* המסגרת הפנימית עוטפת את כל תוכן הכרטיס */}
                  <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid var(--book-card-inner-border)`,
                    borderRadius: `var(--book-card-inner-radius)`,
                    p: '8px 18px 18px',
                  }}>
                    <Box sx={{
                      height: `var(--book-card-image-height)`,
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      <img
                        src={imageUrl}
                        alt={`כריכת הספר ${book.book_name || ''}`}
                        loading="lazy"
                        style={{
                          height: '72%',
                          width: 'auto',
                          maxWidth: '85%',
                          objectFit: 'contain',
                          mixBlendMode: 'multiply',
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography sx={{
                        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--t4)',
                        color: 'var(--ink-wine)', lineHeight: 1.3, mt: '2px', mb: '8px',
                      }}>
                        {book.book_name}
                      </Typography>
                      {book.rabbi && (
                        <Typography sx={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.5 }}>
                          {book.rabbi}
                        </Typography>
                      )}
                    </Box>

                    <AppButton
                      onClick={(e) => { e.stopPropagation(); openBook(); }}
                      sx={{ mt: '14px', width: '100%' }}
                    >
                      לפרטים
                    </AppButton>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <IconButton
            aria-label="הבא"
            disabled={!canNext}
            onClick={() => scrollPage('next')}
            sx={{ ...arrowSx, left: -52 }}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </IconButton>
        </Box>

        <CarouselProgress progress={progress} onSeek={seek} />

        {/* רצועת הזמנה טלפונית */}
        {site.phones.books && (
          <Box sx={{
            mt: { xs: 4, md: 5 },
            bgcolor: '#2E0F11',
            borderRadius: '14px',
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: '26px' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, md: '24px' },
            textAlign: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: '24px' }, flexDirection: { xs: 'column', md: 'row' } }}>
              <Typography sx={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '23px', color: '#fff' }}>
                לרכישת הספרים
              </Typography>
              <Typography
                component="a"
                href={`tel:${site.phones.books.replace(/-/g, '')}`}
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--gold-light)',
                  textDecoration: 'none',
                  direction: 'ltr',
                }}
              >
                {site.phones.books}
              </Typography>
            </Box>
            {site.addresses.office && (
              <>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', height: '43px', bgcolor: 'var(--gold)' }} />
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: `color-mix(in srgb, var(--surface) 60%, transparent)` }}>
                  {site.addresses.office.replace(/\s*\d{7}$/, '')}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BooksCarousel;
