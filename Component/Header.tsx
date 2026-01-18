

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  InputBase, 
  IconButton, 
  Stack, 
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu'; 
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
const COLORS = {
  mainBg: '#9c6644', 
  linkText: 'white',
  indicatorBar: 'white',
  borderRadius: '8px', 
  linkGap: 3, 
  elementSpacing: 4, 
};

// --- רכיב הלוגו - פתרון הריבוע הלבן ---
const Logo: React.FC<{ onClick?: () => void, sx?: any }> = ({ onClick, sx }) => (
  <Box 
    onClick={onClick}
    sx={{
      width: { xs: '60px', sm: '80px', md: '100px' }, 
      height: { xs: '40px', sm: '60px', md: '80px' }, 
      flexShrink: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      // התיקון הקריטי:
      // invert(1) הופך את הכתר השחור ללבן ואת הרקע הלבן לשחור
      // mixBlendMode: 'screen' גורם לכל מה ששחור להפוך לשקוף לחלוטין
      filter: 'invert(1)', 
      mixBlendMode: 'screen',
      ...sx 
    }}
  >
    <Box 
      component="img"
      src="/logo.jpg.jpg" 
      alt="לוגו האתר" 
      sx={{
        width: '90%',
        height: '90%',
        objectFit: 'contain',
      }} 
    />
  </Box>
);

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('דף הבית');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navLinks = [
    { text: 'דף הבית', path: '/' },
    { text: 'שיעורים', path: '/AllLessons' },
    { text: 'אודות', path: '/About' },
    { text: 'גלריה', path: '/Gallery' },
    { text: 'ספרים', path: '/FullBooksPage' },
    { text: 'צור קשר', path: '/ContactForm' },
    { text: 'שאל את הרב', path: '/RabbiQuestionForm' },
  ];

useEffect(() => {
  // בודק אם הנתיב הנוכחי הוא של דף התרומות
  if (location.pathname === '/ModernScrollDonation') {
    setActiveTab(''); // מרוקן את הטאב הפעיל כדי שהפס הלבן ייעלם מכל הקישורים
    return;
  }

  const currentLink = navLinks.find(link => link.path === location.pathname);
  if (currentLink) {
    setActiveTab(currentLink.text);
  } else {
    setActiveTab(''); // גם במקרה של דף לא מוכר, לא יהיה פס
  }
}, [location.pathname]);

  return (
    <AppBar position="static" sx={{ backgroundColor: COLORS.mainBg, width: '100%', boxShadow: 'none' }}>
      
      <Collapse in={showMobileSearch}>
        <Box sx={{ p: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
          <InputBase
            fullWidth
            placeholder="חפש שיעור..."
            sx={{ px: 2, color: 'black' }}
          />
          <IconButton onClick={() => setShowMobileSearch(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Collapse>

      <Toolbar 
        disableGutters 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingY: { xs: '10px', sm: '15px' },
          maxWidth: '95%', 
          width: '100%', 
          margin: '0 auto', 
          direction: 'rtl', 
        }}
      >
        {/* ימין: לוגו וקישורים */}
        <Stack direction="row" alignItems="center">
          <Logo 
            onClick={() => navigate('/')} 
            sx={{ ml: { xs: 1, md: 2 } }} 
          />
            
          <Stack direction="row" gap={COLORS.linkGap} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((item) => (
              <Link 
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  color: COLORS.linkText,
                  textDecoration: 'none',
                  fontSize: { md: '0.9rem', lg: '1rem' },
                  fontWeight: 600, 
                  padding: '8px 10px', 
                  cursor: 'pointer',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '10%', 
                    width: activeTab === item.text ? '80%' : '0%', 
                    height: '3px',
                    backgroundColor: COLORS.indicatorBar,
                    transition: 'width 0.2s ease', 
                  }
                }}
              >
                {item.text}
              </Link>
            ))}
          </Stack>
        </Stack>
        
        {/* שמאל: חיפוש ותרומות */}
        <Stack direction="row" alignItems="center" spacing={COLORS.elementSpacing}>
          <IconButton 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: 'white' }}
          >
            <SearchIcon />
          </IconButton>

          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              borderRadius: COLORS.borderRadius, 
              backgroundColor: 'white',
              height: '40px',
              overflow: 'hidden'
            }}
          >
            <InputBase placeholder="חפש שיעור" sx={{ px: 2, width: { sm: '120px', md: '170px' } }} />
            <IconButton sx={{ backgroundColor: 'black', color: 'white', borderRadius: 0, '&:hover': {backgroundColor: '#333'} }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>

          <Button  onClick={() => navigate('/ModernScrollDonation')}
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              padding: { xs: '5px 15px', sm: '8px 25px' }, 
              fontWeight: 'bold',
              borderRadius: COLORS.borderRadius,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            תרומות
          </Button>

          <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <IconButton 
        onClick={() => navigate('/admin/login')}
        sx={{ color: '#fff', ml: 1 }}
      >
        <AccountCircleOutlinedIcon fontSize="large"/>
      </IconButton>
        </Stack>
      </Toolbar>

      {/* תפריט מובייל */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 260, backgroundColor: COLORS.mainBg, height: '100%', direction: 'rtl' }}>
          <List sx={{ pt: 2 }}>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ color: 'white', textAlign: 'right', '& .MuiTypography-root': { fontWeight: activeTab === item.text ? 'bold' : 'normal' } }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;