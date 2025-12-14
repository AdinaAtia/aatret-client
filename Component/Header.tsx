// Header.tsx
import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; 
import {
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  InputBase, 
  IconButton, 
  Stack, 
  Link, 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// --- 1. הגדרות צבעים ורוחב ---

const COLORS = {
  mainBg: '#922b2b', 
  searchBg: 'white',
  searchBtnBg: 'black',
  linkText: 'white',
  inputTextColor: 'black',
  contentMaxWidth: '1280px', 
  indicatorBar: 'white',
  borderRadius: '8px', 
  linkGap: 4, // חזר לגודל קטן יותר כפי שנראה בתמונה
  logoLinkGap: 4, 
  searchDonateGap: 2, 
};

// --- 2. רכיב הלוגו ---
const Logo: React.FC = () => (
  <Box 
    sx={{
      // *** גודל הלוגו כפי שנראה בתמונה (קטן יחסית) ***
      width: { xs: '40px', sm: '50px' }, 
      height: { xs: '40px', sm: '50px' }, 
      flexShrink: 0,
    }}
  >
    <Box 
      component="img"
      src="/logo.jpg.jpg" 
      alt="לוגו האתר" 
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
      }} 
    />
  </Box>
);

// --- 3. רכיב ה-Header הראשי ---
const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('שיעורים');
  
  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    console.log('מחפש:', searchTerm);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  }

  const navLinks = ['שיעורים', 'אודות', 'גלריה', 'ספרים', 'צור קשר']; 

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: COLORS.mainBg,
        width: '100%', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          display: 'flex',
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          
          // *** התיקון הקריטי לצמידות לקצוות ***
          padding: '0 !important', // מבטל כל פאדינג פנימי ב-MUI
          paddingY: '10px', // מחזיר רק את הפאדינג האנכי 
          
          minHeight: '55px', 
          maxWidth: COLORS.contentMaxWidth, 
          width: '100%', 
          margin: '0 auto', 
          direction: 'rtl', 
        }}
      >
        
        {/* === בלוק 1: צד ימין (לוגו וקישורים) - צמוד לימין === */}
        <Stack 
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{ 
            flexShrink: 0, 
            height: '100%', 
          }}
        >
            <Logo />
            
            {/* 2. קישורים */}
            <Stack 
              direction="row" 
              marginLeft={COLORS.logoLinkGap} 
              gap={COLORS.linkGap} 
              sx={{ 
                height: '100%', 
                alignItems: 'center', 
                display: { xs: 'none', md: 'flex' } 
              }}
            >
              {navLinks.map((text, index) => (
                <Link 
                  key={index}
                  href={`/${text}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(text);
                  }}
                  sx={{
                    flexShrink: 0, 
                    color: COLORS.linkText,
                    textDecoration: 'none',
                    // *** גודל גופן כפי שנראה בתמונה (קטן יחסית) ***
                    fontSize: { xs: '14px', sm: '16px' }, 
                    padding: '8px 0', 
                    fontWeight: 500,
                    position: 'relative', 
                    height: '100%',
                    
                    '&:hover, &:active, &:visited': { color: COLORS.linkText },
                    
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%', 
                      transform: activeTab === text ? 'translate(-50%) scaleX(1)' : 'translate(-50%) scaleX(0)',
                      height: '4px',
                      width: '70%',
                      backgroundColor: COLORS.indicatorBar,
                      transition: 'transform 0.2s ease-in-out',
                      transformOrigin: 'bottom',
                    }
                  }}
                >
                  {text}
                </Link>
              ))}
            </Stack>
        </Stack>
        
        {/* === *** שטח ריק מתרחב ודוחף את הבלוק השמאלי לקצה *** === */}
        <Box sx={{ flexGrow: 1 }} /> 
        
        {/* === בלוק 2: צד שמאל (חיפוש ותרמות) - צמוד לשמאל === */}
        <Stack
          direction="row"
          alignItems="center"
          gap={COLORS.searchDonateGap} 
          sx={{ 
            flexShrink: 0,
            paddingLeft: 0, 
            marginLeft: 0, 
          }}
        >
          
            {/* 2. כפתור 'תרמות' הלבן */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.searchBg,
                color: COLORS.inputTextColor,
                border: '1px solid black',
                padding: { xs: '6px 10px', sm: '8px 15px' }, 
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 'bold',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: 'none',
                borderRadius: COLORS.borderRadius, 
                '&:hover': { backgroundColor: COLORS.searchBg, boxShadow: 'none' }
              }}
              aria-label="תרמו עכשיו"
            >
                תרמות
            </Button>

            {/* 1. טופס חיפוש */}
            <Box 
              component="form" 
              onSubmit={handleSearch} 
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'stretch',
                overflow: 'hidden',
                borderRadius: COLORS.borderRadius, 
                border: '1px solid black',
              }}
            >
                
                {/* שדה טקסט לחיפוש */}
                <InputBase
                    type="text"
                    placeholder="חפש שיעור" 
                    value={searchTerm}
                    onChange={handleInputChange} 
                    aria-label="הזן מילות חיפוש"
                    sx={{
                      flexGrow: 1,
                      padding: '8px 15px', 
                      fontSize: { xs: '14px', sm: '16px' },
                      backgroundColor: COLORS.searchBg,
                      minWidth: { xs: '100px', sm: '200px' }, 
                      color: COLORS.inputTextColor,
                      direction: 'rtl',
                      textAlign: 'right',
                    }}
                />
                
                {/* כפתור חיפוש שחור */}
                <IconButton 
                  type="submit" 
                  aria-label="לחץ לחיפוש"
                  sx={{
                    backgroundColor: COLORS.searchBtnBg,
                    color: COLORS.linkText,
                    width: '40px', 
                    height: 'auto', 
                    borderRadius: `${COLORS.borderRadius} 0 0 ${COLORS.borderRadius}`, 
                    '&:hover': { backgroundColor: COLORS.searchBtnBg }
                  }}
                >
                    <SearchIcon sx={{ width: '24px', height: '24px', fill: COLORS.linkText }} />
                </IconButton>
            </Box>
        </Stack>

      </Toolbar>
    </AppBar>
  );
};

export default Header;