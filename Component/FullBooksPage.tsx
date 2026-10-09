
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Box, Typography, CardMedia,
  Button, Skeleton
} from '@mui/material';
import PageHeader from './shared/PageHeader';
import { Crown } from './Header';
import { colors, fonts, fontSize, gradients, goldButtonStyle, goldTextFill, radius, bookCard, bookPurchaseCard } from '../src/theme/tokens';

const CHIP_ACTIVE_TEXT = colors.goldLight;

const FullBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const STRAPI_BASE_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // שיפור מהירות: טעינה במקביל
        const [booksRes, categoriesRes] = await Promise.all([
          axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate[book_categorie][populate]=*&populate[image][populate]=*&sort[0]=Priority:asc`),
          axios.get(`${STRAPI_BASE_URL}/api/book-categories`)
        ]);

        if (booksRes.data?.data) setBooks(booksRes.data.data);
        if (categoriesRes.data?.data) setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // שיפור מהירות: מניעת חישוב מיותר בכל רינדור
  const filteredBooks = useMemo(() => {
    return books.filter((book: any) => {
      const item = book.attributes || book;
      const matchesSearch = (item.rabbi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.book_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const bookCatName = item.book_categorie?.data?.attributes?.name || item.book_categorie?.name;
      const matchesCategory = selectedCategory === 'הכל' || bookCatName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  const hasActiveFilter = selectedCategory !== 'הכל' || !!searchTerm;
  const categoryNames = categories.map((cat: any) => cat.attributes?.name || cat.name).filter(Boolean);

  return (
    <Box sx={{ direction: 'rtl', backgroundColor: colors.creamAlt, minHeight: '100vh' }}>
      <PageHeader eyebrow="אחד־עשר כרכים" title="ספרי הישיבה" />

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>

        {/* שורת סינון לפי קטגוריה */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px', mb: 5 }}>
          {['הכל', ...categoryNames].map((name) => {
            const isActive = selectedCategory === name;
            return (
              <Box
                key={name}
                component="button"
                type="button"
                onClick={() => setSelectedCategory(name)}
                sx={{
                  minHeight: '42px',
                  px: '22px',
                  borderRadius: radius.pill,
                  border: `1px solid ${colors.gold}`,
                  bgcolor: isActive ? colors.wine : colors.cream,
                  color: isActive ? CHIP_ACTIVE_TEXT : colors.goldText,
                  fontFamily: fonts.body,
                  fontSize: fontSize.sm,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s',
                  '&:hover': { bgcolor: isActive ? colors.wine : `${colors.gold}1F` },
                }}
              >
                {name}
              </Box>
            );
          })}

          {hasActiveFilter && (
            <Box
              component="button"
              type="button"
              onClick={() => { setSelectedCategory('הכל'); setSearchTerm(''); }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                minHeight: '42px',
                px: '22px',
                borderRadius: radius.pill,
                border: `1px solid ${colors.gold}`,
                bgcolor: colors.cream,
                color: colors.goldText,
                fontFamily: fonts.body,
                fontSize: fontSize.sm,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: '0.2s',
                '&:hover': { bgcolor: `${colors.gold}1F` },
              }}
            >
              <RestartAltIcon sx={{ fontSize: '1.1rem' }} />
              נקה סינון
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* רשת הספרים */}
          <Grid size={{ xs: 12, md: 9 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Grid container spacing={3}>
              {loading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Skeleton variant="rounded" height={380} sx={{ borderRadius: `${bookCard.radius}px` }} />
                  </Grid>
                ))
              ) : filteredBooks.length > 0 ? filteredBooks.map((book: any) => {
                const item = book.attributes || book;
                const imageUrl = item.image?.data?.[0]?.attributes?.url || item.image?.[0]?.url || '';
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                    <Box
                      onClick={() => navigate('/BookDetailsPage', { state: { book } })}
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

                      <Box sx={{ flex: 1, textAlign: 'center', px: '6px' }}>
                        <Typography sx={{
                          fontFamily: fonts.heading, fontWeight: 700, fontSize: fontSize.lg,
                          color: bookCard.titleColor, lineHeight: 1.3, mb: '6px',
                        }}>
                          {item.book_name}
                        </Typography>
                        <Typography sx={{ color: bookCard.rabbiColor, fontFamily: fonts.body, fontSize: fontSize.sm, fontWeight: 600 }}>
                          {item.rabbi}
                        </Typography>
                      </Box>

                      <Button
                        onClick={(e) => { e.stopPropagation(); navigate('/BookDetailsPage', { state: { book } }); }}
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
              }) : (
                <Grid size={12}>
                  <Box sx={{ textAlign: 'center', py: 10, bgcolor: colors.cream, borderRadius: '1.5rem', border: `1px dashed ${colors.goldText}` }}>
                    <Typography sx={{ color: bookCard.titleColor, fontWeight: 'bold' }}>לא נמצאו ספרים</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* סרגל צדי */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: '120px' } }}>

              {/* כרטיס רכישה */}
              <Box sx={{
                bgcolor: bookPurchaseCard.bg,
                border: `1px solid ${bookPurchaseCard.border}`,
                borderRadius: `${bookPurchaseCard.radius}px`,
                p: '28px 24px',
                textAlign: 'center',
                mb: 3,
                boxShadow: '0 10px 30px rgba(74,15,20,.25)',
              }}>
                <Crown width={44} height={37} />

                <Typography sx={{
                  ...goldTextFill,
                  fontFamily: fonts.headingOrnate,
                  fontSize: '28px',
                  fontWeight: 700,
                  mt: '10px',
                  mb: '4px',
                }}>
                  רכישת ספרים
                </Typography>

                <Typography sx={{
                  fontFamily: fonts.body,
                  fontSize: '15px',
                  color: bookPurchaseCard.subTextColor,
                  mb: '18px',
                }}>
                  להזמנה טלפונית ולפרטים על משלוח
                </Typography>

                <Box
                  component="a"
                  href="tel:+97236815542"
                  sx={{
                    display: 'block',
                    background: gradients.goldButton,
                    color: bookPurchaseCard.buttonTextColor,
                    fontFamily: fonts.heading,
                    fontWeight: 700,
                    fontSize: '22px',
                    borderRadius: radius.control,
                    py: '14px',
                    mb: '16px',
                    textDecoration: 'none',
                    transition: '0.2s',
                    '&:hover': { filter: 'brightness(1.06)' },
                  }}
                >
                  03-6815542
                </Box>

                <Typography sx={{ fontFamily: fonts.body, fontSize: fontSize.sm, fontWeight: 700, color: bookPurchaseCard.mutedTextColor, mb: '4px' }}>
                  ברזני יעקב
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: fontSize.sm, color: bookPurchaseCard.mutedTextColor, mb: '2px' }}>
                  פקס: 03-6823013
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, fontSize: fontSize.sm, color: bookPurchaseCard.mutedTextColor }}>
                  העליה 8, תל אביב יפו 6606107
                </Typography>
              </Box>

              {/* כרטיס חיפוש */}
              <Box sx={{
                bgcolor: colors.cream,
                border: `1px solid ${colors.gold}`,
                borderRadius: '12px',
                p: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}>
                <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: fontSize.lg, color: bookCard.titleColor, mb: '8px' }}>
                  חיפוש לפי שם
                </Typography>
                <Box sx={{ width: '30px', height: '1px', bgcolor: colors.goldButtonBorder, ml: 'auto', mr: 0, mb: '14px' }} />
                <Box sx={{
                  display: 'flex', flexDirection: 'row', alignItems: 'stretch',
                  border: `1px solid ${colors.gold}`, borderRadius: radius.control, overflow: 'hidden', height: '46px',
                }}>
                  <Box
                    component="button"
                    type="button"
                    aria-label="חיפוש"
                    sx={{
                      width: '46px', border: 'none', cursor: 'default',
                      bgcolor: colors.sand,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <SearchIcon sx={{ color: colors.goldDeep, fontSize: 18 }} />
                  </Box>
                  <input
                    type="text"
                    placeholder="שם הספר..."
                    aria-label="חיפוש ספר לפי שם"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1, minWidth: 0, border: 'none', outline: 'none',
                      padding: '0 14px', fontSize: fontSize.sm, direction: 'rtl',
                      textAlign: 'right', fontFamily: fonts.body, background: 'transparent',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FullBooksPage;
