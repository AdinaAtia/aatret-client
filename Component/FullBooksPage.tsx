
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Box, Typography, CardMedia,
  Skeleton
} from '@mui/material';
import AppButton from './shared/AppButton';
import PageHeader from './shared/PageHeader';
import { cardHoverSx } from './shared/cardHover';
import { Crown } from './Header';
import { site } from '../src/content/site';

/** טלפון הזמנת ספרים כקישור tel: — 03-6815542 → +97236815542 */
const booksPhoneHref = `tel:+972${site.phones.books.replace(/^0/, '').replace(/-/g, '')}`;

const CHIP_ACTIVE_TEXT = 'var(--gold-light)';

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
    <Box sx={{ direction: 'rtl', backgroundColor: 'var(--parchment)', minHeight: '100vh' }}>
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
                  minHeight: 'var(--btn-h)',
                  px: '22px',
                  borderRadius: 'var(--radius-pill)',
                  border: `1px solid var(--gold)`,
                  bgcolor: isActive ? 'var(--wine)' : 'var(--surface)',
                  color: isActive ? CHIP_ACTIVE_TEXT : 'var(--gold-text)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--t2)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s',
                  '&:hover': { bgcolor: isActive ? 'var(--wine)' : `color-mix(in srgb, var(--gold) 12.157%, transparent)` },
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
                minHeight: 'var(--btn-h)',
                px: '22px',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid var(--gold)`,
                bgcolor: 'var(--surface)',
                color: 'var(--gold-text)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--t2)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: '0.2s',
                '&:hover': { bgcolor: `color-mix(in srgb, var(--gold) 12.157%, transparent)` },
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
                    <Skeleton variant="rounded" height={380} sx={{ borderRadius: `var(--book-card-radius)` }} />
                  </Grid>
                ))
              ) : filteredBooks.length > 0 ? filteredBooks.map((book: any) => {
                const item = book.attributes || book;
                const imageUrl = item.image?.data?.[0]?.attributes?.url || item.image?.[0]?.url || '';
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                    <Box
                      onClick={() => navigate(`/BookDetailsPage/${book.id}`, { state: { book } })}
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

                      <Box sx={{ flex: 1, textAlign: 'center', px: '6px' }}>
                        <Typography sx={{
                          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--t4)',
                          color: 'var(--ink-wine)', lineHeight: 1.3, mb: '6px',
                        }}>
                          {item.book_name}
                        </Typography>
                        <Typography sx={{ color: 'var(--gold-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', fontWeight: 600 }}>
                          {item.rabbi}
                        </Typography>
                      </Box>

                      <AppButton
                        onClick={(e) => { e.stopPropagation(); navigate(`/BookDetailsPage/${book.id}`, { state: { book } }); }}
                        sx={{ width: '100%', mt: '14px' }}
                      >
                        לפרטים
                      </AppButton>
                    </Box>
                  </Grid>
                );
              }) : (
                <Grid size={12}>
                  <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'var(--surface)', borderRadius: '1.5rem', border: `1px dashed var(--gold-text)` }}>
                    <Typography sx={{ color: 'var(--ink-wine)', fontWeight: 'bold' }}>לא נמצאו ספרים</Typography>
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
                bgcolor: 'var(--wine)',
                border: `1px solid var(--gold)`,
                borderRadius: `var(--book-purchase-card-radius)`,
                p: '28px 24px',
                textAlign: 'center',
                mb: 3,
                boxShadow: '0 10px 30px rgba(74,15,20,.25)',
              }}>
                <Crown width={44} height={37} />

                <Typography sx={{
                  background: 'var(--gradient-gold-text-vertical)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
                  fontFamily: 'var(--font-heading-ornate)',
                  fontSize: '28px',
                  fontWeight: 700,
                  mt: '10px',
                  mb: '4px',
                }}>
                  רכישת ספרים
                </Typography>

                <Typography sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--book-purchase-card-sub-text-color)',
                  mb: '18px',
                }}>
                  להזמנה טלפונית ולפרטים על משלוח
                </Typography>

                <Box
                  component="a"
                  href={booksPhoneHref}
                  sx={{
                    display: 'block',
                    background: 'var(--gradient-gold-button)',
                    color: 'var(--ink-dark)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '22px',
                    borderRadius: 'var(--radius-control)',
                    py: '14px',
                    mb: '16px',
                    textDecoration: 'none',
                    transition: '0.2s',
                    '&:hover': { filter: 'brightness(1.06)' },
                  }}
                >
                  {site.phones.books}
                </Box>

                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', fontWeight: 700, color: 'var(--book-purchase-card-muted-text-color)', mb: '4px' }}>
                  {site.booksContact}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--book-purchase-card-muted-text-color)', mb: '2px' }}>
                  פקס: {site.phones.fax}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--book-purchase-card-muted-text-color)', mb: site.hours ? '2px' : 0 }}>
                  {site.addresses.office}
                </Typography>
                {site.hours && (
                  <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t2)', color: 'var(--book-purchase-card-muted-text-color)' }}>
                    {site.hours}
                  </Typography>
                )}
              </Box>

              {/* כרטיס חיפוש */}
              <Box sx={{
                bgcolor: 'var(--surface)',
                border: `1px solid var(--gold)`,
                borderRadius: '12px',
                p: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}>
                <Typography sx={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--t4)', color: 'var(--ink-wine)', mb: '8px' }}>
                  חיפוש לפי שם
                </Typography>
                <Box sx={{ width: '30px', height: '1px', bgcolor: 'var(--gold-button-border)', ml: 'auto', mr: 0, mb: '14px' }} />
                <Box sx={{
                  display: 'flex', flexDirection: 'row', alignItems: 'stretch',
                  border: `1px solid var(--gold)`, borderRadius: 'var(--radius-control)', overflow: 'hidden', height: '46px',
                }}>
                  <Box
                    component="button"
                    type="button"
                    aria-label="חיפוש"
                    sx={{
                      width: '46px', border: 'none', cursor: 'default',
                      bgcolor: 'var(--sand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <SearchIcon sx={{ color: 'var(--gold-deep)', fontSize: 18 }} />
                  </Box>
                  <input
                    type="text"
                    placeholder="שם הספר..."
                    aria-label="חיפוש ספר לפי שם"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1, minWidth: 0, border: 'none', outline: 'none',
                      padding: '0 14px', fontSize: 'var(--t2)', direction: 'rtl',
                      textAlign: 'right', fontFamily: 'var(--font-body)', background: 'transparent',
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
