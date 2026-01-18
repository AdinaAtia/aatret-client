import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, Stack, Grid  } from '@mui/material';
import axios from 'axios';

// --- הגדרות צבעים (תואם ל-Header שלך) ---
const COLORS = {
  footerBg: '#9c6644',
  white: '#ffffff',
  divider: 'rgba(255, 255, 255, 0.3)'
};

const Footer: React.FC = () => {
  const [rabbis, setRabbis] = useState<string[]>([]);

  useEffect(() => {
    const fetchRabbis = async () => {
      try {
        // וודאי שהכתובת תואמת לשרת ה-Strapi שלך
        const response = await axios.get('http://localhost:1337/api/rabbis');
        // שליפת השמות מהמבנה של Strapi (הנחה שהשדה הוא name)
        const names = response.data.data.map((r: any) => r.name);
        setRabbis(names);
      } catch (error) {
        console.error('Error fetching rabbis:', error);
        // פולבק למקרה שה-API לא זמין
        setRabbis(['הרה"ג מרדכי עטייה', 'הרב בניהו עטייה', 'הרב יואל חקון', 'הרב יואל בלומנפלד']); 
      }
    };
    fetchRabbis();
  }, []);

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: COLORS.footerBg, 
        color: COLORS.white, 
        py: { xs: 6, md: 8 }, 
        mt: 'auto', 
        direction: 'rtl' 
      }}
    >
      <Container maxWidth="lg">
        {/* שימוש ב-Grid2 */}
        <Grid container spacing={4} justifyContent="flex-start">
          
          {/* עמודה 1: ניווט */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2, 
                borderBottom: `1px solid ${COLORS.divider}`, 
                display: 'inline-block',
                pb: 0.5
              }}
            >
              ניווט
            </Typography>
            <Stack spacing={1.5}>
              {[
                  { label: 'דף הבית', href: '/' },
                { label: 'שיעורים', href: '/AllLessons' },
                { label: 'רכישת ספרים', href: '/Books' },
                { label: 'אודות הישיבה', href: '/About' },
                      { label: ' גלריה', href: '/Gallery' },
                { label: 'שאל את הרב', href: '/RabbiQuestionForm' },
                { label: 'תרומות', href: '#' },
                
              ].map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  sx={{ 
                    color: COLORS.white, 
                    textDecoration: 'none', 
                    fontSize: '0.95rem', 
                    opacity: 0.85, 
                    '&:hover': { opacity: 1, textDecoration: 'underline' } 
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* עמודה 2: רבני הישיבה (דינמי) */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2, 
                borderBottom: `1px solid ${COLORS.divider}`, 
                display: 'inline-block',
                pb: 0.5
              }}
            >
              רבני הישיבה
            </Typography>
            <Stack spacing={1.5}>
              {rabbis.map((name, i) => (
                <Typography 
                  key={i} 
                  variant="body2" 
                  sx={{ opacity: 0.9, fontSize: '0.95rem' }}
                >
                  {name}
                </Typography>
              ))}
            </Stack>
          </Grid>

        </Grid>

        {/* זכויות יוצרים בתחתית */}
        <Box 
          sx={{ 
            mt: 6, 
            pt: 3, 
            borderTop: `1px solid ${COLORS.divider}`, 
            textAlign: 'center',
            opacity: 0.6
          }}
        >
          <Typography variant="caption">
            © {new Date().getFullYear()} ישיבת החיים והשלום - עטרת מרדכי. כל הזכויות שמורות.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;