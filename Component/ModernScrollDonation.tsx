
import{ useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Globe, Users,  Heart, ShieldCheck } from 'lucide-react';

const LuxuryDonationPage = () => {
  const donationOptions = [
    { 
      title: 'מגבית לחידוש ותרומות לאתר הישיבה', 
      subtitle: 'בזכותך – קול התורה לא ייפסק', 
      icon: <Globe size={24} />, 
      progress: 15 
    },
    { 
      title: 'תרומה כללית', 
      subtitle: 'עבור החזקת פעילות הישיבה והפצת התורה', 
      icon: <Heart size={24} />, 
      progress: null 
    },
    { 
      title: 'אחזקת אברך בחודש', 
      subtitle: 'קנה לך שותף למשמרת הלימוד של הישיבה', 
      icon: <Users size={24} />, 
      progress: null 
    },
    // { 
    //   title: 'קניית ספרים', 
    //   subtitle: 'הנצחה נצחית בין דפי הספרים שיישארו לדורות', 
    //   icon: <BookOpen size={24} />, 
    //   progress: null 
    // },
  ];
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'auto' });
}, []);
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#fdfbf7', 
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      py: 6,
      direction: 'rtl'
    }}>
      
      {/* תמונת רקע - פחות מטושטשת */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url("/IMG_0729.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12, // הגדלתי מעט נוכחות
        filter: 'grayscale(100%) blur(2px)', // טישטוש עדין מאוד כפי שביקשת
        zIndex: 0
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4} 
          alignItems="center"
          justifyContent="center"
        >
          
          {/* צד ימין: המגילה - יחס שווה */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1}}
            >
              <Box 
                component="img" 
                src="/megila.png" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '525px', 
                  filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.15))'
                }} 
              />
              
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 10 }}
                transition={{ delay: 1, duration: 1}}
                style={{ position: 'absolute', bottom: '20%', right: '15%' }}
              >
                {/* <Box component="img" src="/image (10).png" sx={{ width: '80px' }} /> */}
              </motion.div>
            </motion.div>
          </Box>

          {/* צד שמאל: כרטיס התרומה - יחס שווה */}
          <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1}}
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <Paper elevation={0} sx={{ 
                p: 5, 
                borderRadius: '32px', 
                border: '1px solid #eaddca',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 30px 60px rgba(74, 52, 46, 0.08)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#4a342e', mb: 1 }}>
                  שותפות נצח
                </Typography>
                <Typography variant="body1" sx={{ color: '#9c6644', mb: 4 }}>
                  בחרו את אפיק הזכות שלכם:
                </Typography>

                <Stack spacing={2}>
                  {donationOptions.map((option, index) => (
                    <Button
                      key={index}
                      fullWidth
                      variant="outlined"
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        textAlign: 'right',
                        p: 2.5,
                        borderRadius: '16px',
                        borderColor: '#f0e6df',
                        '&:hover': {
                          borderColor: '#d4af37',
                          backgroundColor: '#fdfbf7',
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Box sx={{ color: '#9c6644', ml: 2, filter: 'sepia(1)' }}>
                        {option.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="800" color="#4a342e">
                          {option.title}
                        </Typography>
                        <Typography variant="caption" color="#7d6b5d">
                          {option.subtitle}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>

                <Divider sx={{ my: 4 }}>
                  <Typography variant="caption" sx={{ color: '#d4af37', fontWeight: 'bold' }}>עץ חיים היא למחזיקים בה</Typography>
                </Divider>

                <Button 
                  fullWidth
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#4a342e', 
                    py: 2.2, 
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    '&:hover': { backgroundColor: '#2d1d19' }
                  }}
                >
                  אני רוצה להיות שותף
                </Button>
                
                <Stack direction="row" justifyContent="center" spacing={1} mt={3} sx={{ opacity: 0.6 }}>
                  <ShieldCheck size={16} />
                  <Typography variant="caption">תשלום מאובטח בתקן PCI-DSS</Typography>
                </Stack>
              </Paper>
            </motion.div>
          </Box>
          
        </Stack>
      </Container>
    </Box>
  );
};

export default LuxuryDonationPage;