
import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton, Fade, Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation, Pagination } from 'swiper/modules';

import 'swiper/swiper-bundle.css';

const Aboot = () => {
  const [open, setOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const path = "/Public/compressimage-io/GOOD/";
    const path2 = "/Public/compressimage-io/";

const images2 = [
"DSC_5191.JPG","p1.webp" ,"DSC_5210(1).JPG","DSC_5594.JPG","DSC_5225.JPG","p8.webp","DSC_5243(1).JPG","DSC_5250.JPG","p4.webp","p5.webp"
,"צילום מסך 2026-01-12 130718.png" ,"DSC_5576.JPG","DSC_5257(1).JPG","p7.webp","צילום מסך 2026-01-12 130742.png","p3.webp","DSC_5268.JPG","DSC_5543.JPG","DSC_5492.JPG","DSC_5257.JPG","DSC_5491(1).JPG","צילום מסך 2026-01-12 130729.png","DSC_5612.JPG"
, "DSC_5195.JPG","DSC_5505.JPG","p6.webp","DSC_5557.JPG","p2.webp" ,"צילום מסך 2026-01-12 130626.png","DSC_5584.JPG","צילום מסך 2026-01-12 130534.png","DSC_5264.JPG","צילום מסך 2026-01-12 130504.png","צילום מסך 2026-01-12 130452.png"
,"DSC_5254.JPG",
"DSC_5507.JPG" ,"צילום מסך 2026-01-12 130400.png","DSC_5254.JPG","DSC_5575.JPG","DSC_5199.JPG","צילום מסך 2026-01-12 130338.png","צילום מסך 2026-01-12 130231.png","צילום מסך 2026-01-11 113035.png","באנר יוטיוב.jpg","image (11).png","DSC_5604.JPG","DSC_5583.JPG","DSC_5579.JPG"
];
  const images = ["p8.webp", "צילום מסך 2026-01-12 130516.png", 
    "צילום מסך 2026-01-12 130504.png", "DSC_5210(1).JPG", "DSC_5612.JPG", 
    "image (12).png", "באנר יוטיוב.jpg", "מיני מייז.png", "DSC_5284.JPG",
    "צילום מסך 2026-01-12 130400.png", "צילום מסך 2026-01-12 130435.png",
    "DSC_5193.JPG"
  ];

  const handleOpen = (img: string) => {
    setCurrentImg(img);
    setOpen(true);
  };

  const brandBrown = '#9c6644';
  const bgCream = '#fdfbe7';

 return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: bgCream, 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      py: 10, overflowX: 'hidden'
    }} dir="rtl">
      
      {/* --- 1. אזור כותרת ולוגו --- */}
      <Box sx={{ zIndex: 1, textAlign: 'center', mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" sx={{ color: brandBrown, fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 800, fontSize: { xs: '2.8rem', md: '3.8rem' }, mb: 1 }}>
          עטרת מרדכי
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%' }}>
          <Box sx={{ width: { xs: '30px', md: '80px' }, height: '1px', bgcolor: brandBrown, opacity: 0.3 }} />
          <Box sx={{ width: { xs: '70px', md: '100px' }, height: { xs: '50px', md: '80px' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="img" src="/compressimage-io/GOOD/LOGO2.png" alt="לוגו" sx={{ width: '90%', height: '90%', objectFit: 'contain' }} />
          </Box>
          <Box sx={{ width: { xs: '30px', md: '80px' }, height: '1px', bgcolor: brandBrown, opacity: 0.3 }} />
        </Box>

        <Typography sx={{ color: brandBrown, opacity: 0.8, mt: 2, fontSize: '1.1rem', letterSpacing: '0.25em', fontWeight: 300 }}>
          רגעים של עליה
        </Typography>
      </Box>

      {/* --- 2. הסליידר (התמונות הנבחרות) --- */}
      <Box sx={{ 
        width: { xs: '95vw', sm: '80vw', md: '800px' },
        zIndex: 2,
        position: 'relative',
        '& .swiper-button-next, & .swiper-button-prev': { color: brandBrown },
        '& .swiper-pagination-fraction': { color: brandBrown }
      }}>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          modules={[EffectCards, Navigation, Pagination]}
          navigation={true}
          pagination={{ type: 'fraction', el: '.custom-pagination' }}
          cardsEffect={{ slideShadows: true, rotate: true, perSlideOffset: 12, perSlideRotate: 4 }}
          style={{ width: '100%' }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} style={{ 
              borderRadius: '1.5rem', background: 'rgba(156, 102, 68, 0.45)', backdropFilter: 'blur(25px)',
              border: `1.5px solid ${brandBrown}66`, padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', aspectRatio: '16 / 10'
            }}>
              <Box onClick={() => handleOpen(img)} sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="img" src={`${path}${img}`} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '0.8rem', cursor: 'pointer' }} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box className="custom-pagination" sx={{ color: brandBrown, textAlign: 'center', mt: 4, fontWeight: 700 }} />
      </Box>

      {/* --- 3. מדור מחיי הישיבה (הגריד החדש) --- */}
      <Box sx={{ textAlign: 'center', mt: 15, mb: 6 }}>
        <Typography variant="h3" sx={{ color: brandBrown, fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
          מחיי הישיבה
        </Typography>
        <Box sx={{ width: '80px', height: '3px', bgcolor: brandBrown, mx: 'auto', mt: 2, borderRadius: '2px' }} />
      </Box>

     <Box sx={{ 
  width: '100%', 
  maxWidth: '1200px', 
  px: { xs: 2, md: 4 },
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
  gap: 4, 
  mb: 12
}}>
  {images2.map((img, index) => (
    <Box 
      key={index}
      onClick={() => handleOpen(img)}
      sx={{ 
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '1.8rem', 
        
        // השילוב המנצח: צבע חום חזק (0.8) עם טשטוש עמוק
        background: 'rgba(139, 90, 60, 0.8)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', // תמיכה בדפדפני ספארי
        
        border: `2px solid ${brandBrown}`,
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        padding: '3px',
        aspectRatio: '1 / 1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.4s ease',
        
        '&:hover': {
          transform: 'translateY(-10px)',
          background: 'rgba(156, 102, 68, 0.9)', // כמעט אטום לגמרי בהובר
          boxShadow: '0 15px 30px rgba(156, 102, 68, 0.4)',
        }
      }}
    >
      <Box 
        component="img" 
        src={`${path2}${img}`} 
        sx={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain', 
          borderRadius: '1rem',
          filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.25))'
        }} 
      />
    </Box>
  ))}
</Box>

      {/* --- 4. מודל הגדלה סופי --- */}
      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: ' rgba(0,0,0,0.25)', 
        backdropFilter: 'blur(20px)',} } }}>
        <Fade in={open}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(false)} sx={{ alignSelf: 'flex-end', color: '#fff', mb: 1, bgcolor: brandBrown, '&:hover': { bgcolor: '#fff', color: brandBrown } }}>
              <CloseIcon />
            </IconButton>
            <Box component="img" src={`${path2}${currentImg}`} sx={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '1.2rem', border: `3px solid ${brandBrown}`, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
};

export default Aboot;