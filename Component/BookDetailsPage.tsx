import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Box, Typography, Button, CircularProgress, CardMedia, CardContent } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Breadcrumb from './shared/Breadcrumb';
import SectionFlourish from './shared/SectionFlourish';
import { site } from '../src/content/site';
import { getBookDetails } from '../src/content/bookDetails';
import {
  colors, fonts, fontSize, gradients, goldButtonStyle, radius, bookCard, bookDetailsHero, orderBlock, detailsTable,
} from '../src/theme/tokens';

const STRAPI_BASE_URL = `${import.meta.env.VITE_API_URL}`;

/** טלפון הזמנת ספרים כקישור tel: — 03-6815542 → +97236815542, כמו ב-Footer וב-FullBooksPage */
const booksPhoneHref = `tel:+972${site.phones.books.replace(/^0/, '').replace(/-/g, '')}`;

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
            gridTemplateColumns: { xs: '1fr', md: bookDetailsHero.grid.cols },
            gap: { xs: '32px', md: `${bookDetailsHero.grid.gap}px` },
            mb: 8,
          }}
        >
          {/* עמודת הכריכה */}
          <Box
            sx={{
              bgcolor: bookDetailsHero.cover.bg,
              border: `1px solid ${bookDetailsHero.cover.outerBorder}`,
              borderRadius: `${bookDetailsHero.cover.outerRadius}px`,
              p: `${bookDetailsHero.cover.outerPad}px`,
              justifySelf: { xs: 'center', md: 'stretch' },
              width: '100%',
              maxWidth: { xs: '340px', md: 'none' },
            }}
          >
            <Box
              sx={{
                border: `1px solid ${bookDetailsHero.cover.innerBorder}`,
                borderRadius: `${bookDetailsHero.cover.innerRadius}px`,
                bgcolor: bookDetailsHero.cover.innerBg,
                p: bookDetailsHero.cover.innerPad,
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
                  width: `${bookDetailsHero.cover.image.w}px`,
                  height: `${bookDetailsHero.cover.image.h}px`,
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
                  bgcolor: colors.sand,
                  border: `1px solid ${colors.gold}`,
                  borderRadius: '999px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: colors.wine,
                    fontWeight: 700,
                    fontFamily: fonts.body,
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
                fontFamily: fonts.heading,
                fontSize: { xs: '32px', md: `${bookDetailsHero.title.size}px` },
                fontWeight: bookDetailsHero.title.weight,
                color: bookCard.titleColor,
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
                  fontFamily: fonts.body,
                  fontSize: `${bookDetailsHero.author.size}px`,
                  color: bookDetailsHero.author.color,
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
                  fontFamily: fonts.body,
                  fontSize: `${bookDetailsHero.description.size}px`,
                  lineHeight: bookDetailsHero.description.lineHeight,
                  color: colors.body,
                  maxWidth: bookDetailsHero.description.maxWidth,
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
                bgcolor: orderBlock.bg,
                border: `1px solid ${orderBlock.border}`,
                borderRadius: `${orderBlock.radius}px`,
                p: orderBlock.padding,
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
                  width: `${orderBlock.phoneCircle.size}px`,
                  height: `${orderBlock.phoneCircle.size}px`,
                  borderRadius: '50%',
                  background: gradients.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneOutlinedIcon sx={{ color: colors.ink, fontSize: 24 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: `${orderBlock.label.size}px`,
                    letterSpacing: orderBlock.label.letterSpacing,
                    color: colors.goldLight,
                    fontWeight: 700,
                    fontFamily: fonts.body,
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
                    fontFamily: fonts.heading,
                    fontSize: `${orderBlock.number.size}px`,
                    fontWeight: 700,
                    color: orderBlock.number.color,
                    textDecoration: 'none',
                    direction: 'ltr',
                    textAlign: { xs: 'center', md: 'right' },
                  }}
                >
                  {site.phones.books}
                </Box>
                <Typography
                  sx={{
                    fontSize: `${orderBlock.subText.size}px`,
                    color: orderBlock.subText.color,
                    fontFamily: fonts.body,
                  }}
                >
                  ברזני יעקב · {site.addresses.office}
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
                      borderBottom: `1px solid ${detailsTable.borderColor}`,
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.body, fontSize: fontSize.sm, color: detailsTable.labelColor }}>
                      {row.label}
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.body, fontSize: fontSize.sm, color: detailsTable.valueColor, fontWeight: 600 }}>
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
              fontFamily: fonts.headingOrnate,
              fontSize: '2em',
              fontWeight: 700,
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
                      onClick={() => navigate('/BookDetailsPage', { state: { book: relBook } })}
                      sx={{
                        bgcolor: bookCard.bg,
                        border: `1px solid ${bookCard.border}`,
                        borderRadius: `${bookCard.radius}px`,
                        p: '9px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: '0.25s',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 28px rgba(74,15,20,.14)' },
                      }}
                    >
                      <Box sx={{
                        border: `1px solid ${bookCard.innerBorder}`,
                        borderRadius: `${bookCard.innerRadius}px`,
                        bgcolor: '#fff',
                        height: `${bookCard.imageHeight}px`,
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
                          fontFamily: fonts.heading, fontWeight: 700, fontSize: fontSize.lg,
                          color: bookCard.titleColor, lineHeight: 1.3, mb: '6px',
                        }}>
                          {item.book_name}
                        </Typography>
                        <Typography sx={{ color: bookCard.rabbiColor, fontFamily: fonts.body, fontSize: fontSize.sm, fontWeight: 600 }}>
                          {item.rabbi}
                        </Typography>
                      </CardContent>

                      <Button
                        onClick={(e) => { e.stopPropagation(); navigate('/BookDetailsPage', { state: { book: relBook } }); }}
                        sx={{
                          ...goldButtonStyle,
                          fontFamily: fonts.body,
                          fontWeight: 600,
                          fontSize: fontSize.sm,
                          borderRadius: radius.control,
                          minHeight: '44px',
                          width: '100%',
                          mt: '14px',
                        }}
                      >
                        לפרטים
                      </Button>
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
