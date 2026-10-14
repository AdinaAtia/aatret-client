import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Box, Typography, CircularProgress, CardMedia, CardContent } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Breadcrumb from './shared/Breadcrumb';
import AppButton from './shared/AppButton';
import SectionFlourish from './shared/SectionFlourish';
import { cardHoverSx } from './shared/cardHover';
import { site } from '../src/content/site';
import { getBookDetails } from '../src/content/bookDetails';

const STRAPI_BASE_URL = `${import.meta.env.VITE_API_URL}`;

/** טלפון הזמנת ספרים כקישור tel: — 03-6815542 → +97236815542, כמו ב-Footer וב-FullBooksPage */
const booksPhoneHref = `tel:+972${site.phones.books.replace(/^0/, '').replace(/-/g, '')}`;

const BookDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();

  // הספר מגיע מה-state בניווט פנימי; ברענון או בקישור שיתוף אין state, אז נטען מהשרת לפי המזהה שבכתובת
  const stateBook = state?.book && (!bookId || String(state.book.id) === bookId) ? state.book : null;
  const [fetchedBook, setFetchedBook] = useState<any>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const book = stateBook ?? fetchedBook;

  useEffect(() => {
    if (stateBook || !bookId) return;
    let cancelled = false;
    setLoadingBook(true);
    setFetchedBook(null);
    axios
      .get(`${STRAPI_BASE_URL}/api/rabbi-books?filters[id][$eq]=${encodeURIComponent(bookId)}&populate[book_categorie][populate]=*&populate[image][populate]=*`)
      .then((res) => { if (!cancelled) setFetchedBook(res.data?.data?.[0] ?? null); })
      .catch(() => { if (!cancelled) setFetchedBook(null); })
      .finally(() => { if (!cancelled) setLoadingBook(false); });
    return () => { cancelled = true; };
  }, [bookId, stateBook]);

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

  if (!book && loadingBook) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!book) return <Typography sx={{ textAlign: 'center', mt: 5 }}>הספר לא נמצא</Typography>;

  const seriesName = book.book_categorie?.data?.attributes?.name || book.book_categorie?.name || '';
  const details = getBookDetails(book.id);

  const detailRows = [
    { label: 'מחבר', value: book.rabbi },
    { label: 'מספר עמודים', value: details.pages ? String(details.pages) : '' },
    { label: 'כריכה', value: details.binding },
    { label: 'מהדורה', value: details.edition },
    { label: 'מסת"ב', value: details.isbn },
  ].filter((row) => !!row.value);

  return (
    <Box sx={{ direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      <Breadcrumb
        items={[
          { label: 'ראשי', path: '/' },
          { label: 'ספרי הישיבה', path: '/FullBooksPage' },
          { label: book.book_name },
        ]}
      />

      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: { xs: 2, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'var(--book-details-hero-grid-cols)' },
            gap: { xs: '32px', md: `var(--book-details-hero-grid-gap)` },
            mb: 8,
          }}
        >
          {/* עמודת הכריכה */}
          <Box
            sx={{
              bgcolor: 'var(--book-details-hero-cover-bg)',
              border: `1px solid var(--gold)`,
              borderRadius: `var(--book-details-hero-cover-outer-radius)`,
              p: `var(--book-details-hero-cover-outer-pad)`,
              justifySelf: { xs: 'center', md: 'stretch' },
              width: '100%',
              maxWidth: { xs: '340px', md: 'none' },
            }}
          >
            <Box
              sx={{
                border: `1px solid var(--book-details-hero-cover-inner-border)`,
                borderRadius: `var(--book-details-hero-cover-inner-radius)`,
                bgcolor: 'var(--book-details-hero-cover-inner-bg)',
                p: 'var(--book-details-hero-cover-inner-pad)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={book.image?.[0]?.url ? `${STRAPI_BASE_URL}${book.image[0].url}` : ''}
                alt={`כריכת הספר ${book.book_name || ''}`}
                sx={{
                  width: `var(--book-details-hero-cover-image-w)`,
                  height: `var(--book-details-hero-cover-image-h)`,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                }}
              />
            </Box>
          </Box>

          {/* עמודת הפרטים */}
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            {seriesName && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '30px',
                  px: '16px',
                  mb: '14px',
                  bgcolor: 'var(--sand)',
                  border: `1px solid var(--gold)`,
                  borderRadius: '999px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: 'var(--wine)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1,
                  }}
                >
                  {seriesName}
                </Typography>
              </Box>
            )}

            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-heading)',
                fontSize: { xs: '32px', md: `var(--book-details-hero-title-size)` },
                fontWeight: 'var(--book-details-hero-title-weight)',
                color: 'var(--ink-wine)',
                lineHeight: 1.2,
                m: 0,
                mb: '8px',
              }}
            >
              {book.book_name}
            </Typography>

            {book.rabbi && (
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: `var(--book-details-hero-author-size)`,
                  color: 'var(--gold-text)',
                  fontWeight: 600,
                  mb: '18px',
                }}
              >
                {book.rabbi}
              </Typography>
            )}

            <SectionFlourish mt={0} mb="22px" justify={{ xs: 'center', md: 'flex-start' }} />

            {book.description && (
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: `var(--book-details-hero-description-size)`,
                  lineHeight: 'var(--book-details-hero-description-line-height)',
                  color: 'var(--body)',
                  maxWidth: 'var(--book-details-hero-description-max-width)',
                  mx: { xs: 'auto', md: 0 },
                  mb: '28px',
                }}
              >
                {book.description}
              </Typography>
            )}

            {/* גוש ההזמנה — טלפונית בלבד, בדיוק כמו היום */}
            <Box
              sx={{
                bgcolor: 'var(--wine)',
                border: `1px solid var(--gold)`,
                borderRadius: `var(--order-block-radius)`,
                p: 'var(--order-block-padding)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: '20px',
                mb: '32px',
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: `var(--order-block-phone-circle-size)`,
                  height: `var(--order-block-phone-circle-size)`,
                  borderRadius: '50%',
                  background: 'var(--gradient-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneOutlinedIcon sx={{ color: 'var(--ink)', fontSize: 24 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: `var(--order-block-label-size)`,
                    letterSpacing: 'var(--order-block-label-letter-spacing)',
                    color: 'var(--gold-light)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    mb: '2px',
                  }}
                >
                  להזמנת הספר
                </Typography>
                <Box
                  component="a"
                  href={booksPhoneHref}
                  sx={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontSize: `var(--order-block-number-size)`,
                    fontWeight: 400,
                    color: 'var(--order-block-number-color)',
                    textDecoration: 'none',
                    direction: 'ltr',
                    textAlign: { xs: 'center', md: 'right' },
                  }}
                >
                  {site.phones.books}
                </Box>
                <Typography
                  sx={{
                    fontSize: `var(--order-block-sub-text-size)`,
                    color: 'var(--order-block-sub-text-color)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {site.booksContact} · {site.addresses.office}
                </Typography>
              </Box>
            </Box>

            {/* טבלת פרטים — נבנית מקובץ התוכן, שורה בלי ערך לא מוצגת */}
            {detailRows.length > 0 && (
              <Box>
                {detailRows.map((row) => (
                  <Box
                    key={row.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: '11px',
                      borderBottom: `1px solid var(--rule-soft)`,
                    }}
                  >
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--muted)' }}>
                      {row.label}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--ink-wine)', fontWeight: 600 }}>
                      {row.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* ספרים נוספים בנושא */}
        <Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-heading-ornate)',
              fontSize: '2em',
              fontWeight: 400,
              textAlign: 'center',
              mb: 4,
            }}
          >
            ספרים נוספים בנושא
          </Typography>

          {loadingRelated ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : relatedBooks.length > 0 && (
            <Grid container spacing={3}>
              {relatedBooks.map((relBook) => {
                const item = relBook.attributes || relBook;
                const imageUrl = item.image?.data?.[0]?.attributes?.url || item.image?.[0]?.url || '';
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={relBook.id}>
                    <Box
                      onClick={() => navigate(`/BookDetailsPage/${relBook.id}`, { state: { book: relBook } })}
                      sx={{
                        bgcolor: 'var(--surface)',
                        border: `1px solid var(--gold)`,
                        borderRadius: `var(--book-card-radius)`,
                        p: '9px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        ...cardHoverSx,
                      }}
                    >
                      <Box sx={{
                        border: `1px solid var(--book-card-inner-border)`,
                        borderRadius: `var(--book-card-inner-radius)`,
                        bgcolor: '#fff',
                        height: `var(--book-card-image-height)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', mb: '16px',
                      }}>
                        <CardMedia
                          component="img"
                          image={imageUrl ? `${STRAPI_BASE_URL}${imageUrl}` : ''}
                          alt={`כריכת הספר ${item.book_name || ''}`}
                          sx={{ height: '88%', width: 'auto', maxWidth: '85%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                        />
                      </Box>

                      <CardContent sx={{ flex: 1, textAlign: 'center', p: '0 6px' }}>
                        <Typography sx={{
                          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--t4)',
                          color: 'var(--ink-wine)', lineHeight: 1.3, mb: '6px',
                        }}>
                          {item.book_name}
                        </Typography>
                        <Typography sx={{ color: 'var(--gold-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', fontWeight: 600 }}>
                          {item.rabbi}
                        </Typography>
                      </CardContent>

                      <AppButton
                        onClick={(e) => { e.stopPropagation(); navigate(`/BookDetailsPage/${relBook.id}`, { state: { book: relBook } }); }}
                        sx={{ width: '100%', mt: '14px' }}
                      >
                        לפרטים
                      </AppButton>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetailsPage;
