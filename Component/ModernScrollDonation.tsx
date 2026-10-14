
import AppButton from './shared/AppButton';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Stack, Paper, Divider, Dialog, DialogContent, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Globe, Users,  Heart, ShieldCheck } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/About`;

const LuxuryDonationPage = () => {
  const [openDonation, setOpenDonation] = useState(false);
  const navigate = useNavigate();
  const NEDARIM_URL = "https://www.matara.pro/nedarimplus/online/?mosad=7002025&Analytic=%D7%90%D7%AA%D7%A8";

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
      backgroundImage: `url('${MEDIA_BASE_URL}/pastel-yellow-vignette-concrete-textured-background 1 (1) (1).png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      py: 6,
      direction: 'rtl'
    }}>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4} 
          alignItems="center"
          justifyContent="center"
        >
          
          {/* צד ימין: סרטון */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ width: '100%', maxWidth: '700px' }}
            >
              <Box sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
              }}>
                <Box
                  component="iframe"
                  src="https://www.youtube.com/embed/7-r83WoriYk"
                  title="סרטון תרומות"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </Box>
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
                border: '1px solid rgba(197, 160, 89, 0.3)',
                backgroundColor: 'rgba(0, 0, 0, 0.88)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--gold)', mb: 1, fontFamily: "'Yetzira-Choppy', sans-serif !important" }}>
                  שותפות נצח
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
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
                        borderColor: 'rgba(197, 160, 89, 0.3)',
                        '&:hover': {
                          borderColor: 'var(--gold)',
                          backgroundColor: 'rgba(197, 160, 89, 0.08)',
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Box sx={{ color: 'var(--gold)', ml: 2 }}>
                        {option.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#ffffff' }}>
                          {option.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                          {option.subtitle}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>

                <Divider sx={{ my: 4, borderColor: 'rgba(197, 160, 89, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: 'var(--gold)', fontWeight: 'bold' }}>עץ חיים היא למחזיקים בה</Typography>
                </Divider>

                <AppButton fullWidth onClick={() => navigate('/DonateLetter')}>
                  אני רוצה להיות שותף
                </AppButton>

                <Stack direction="row" justifyContent="center" spacing={1} mt={3} sx={{ opacity: 0.5 }}>
                  <ShieldCheck size={16} color="#ffffff" />
                  <Typography variant="caption" sx={{ color: '#ffffff' }}>תשלום מאובטח בתקן PCI-DSS</Typography>
                </Stack>
              </Paper>
            </motion.div>
          </Box>
          
        </Stack>
      </Container>

      {/* חלון תרומה צף (נדרים פלוס) */}
      <Dialog 
        open={openDonation} 
        onClose={() => setOpenDonation(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '20px', overflow: 'hidden' }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, bgcolor: '#fdfbf7' }}>
          <IconButton onClick={() => setOpenDonation(false)} aria-label="סגירה">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          <iframe
            src={NEDARIM_URL}
            width="100%"
            height="100%"
            title="תרומה מאובטחת"
            style={{ border: 'none' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LuxuryDonationPage;