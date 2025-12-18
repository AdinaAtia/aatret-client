// Header.tsx (קוד סופי: צמוד לימין, 10% רווח, גובה מוגדל)
import React, { useState } from 'react';
import { NavLink } from "react-router-dom"
import { Outlet, useNavigate } from "react-router-dom";

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
  type BoxProps // נדרש כדי שרכיב Logo יוכל לקבל sx
 // נדרש כדי שרכיב Logo יוכל לקבל sx
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu'; 

// --- 1. הגדרות צבעים ורוחב ---

const COLORS = {
  mainBg: '#922b2b', 
  searchBg: 'white',
  searchBtnBg: 'black',
  linkText: 'white',
  inputTextColor: 'black',
  // *** הערך הנכון והממוסגר ***
  contentMaxWidth: '95%', 
  indicatorBar: 'white',
  borderRadius: '8px', 
  linkGap: 4, 
  logoLinkGap: 0, // איפסנו כי נשתמש ב-margin 10%
  searchDonateGap: 2, 
  innerPadding: { xs: 1.5, sm: 2, md: 3 } 
};

// --- 2. רכיב הלוגו (מעודכן לקבלת sx) ---
interface LogoProps extends BoxProps {}

const Logo: React.FC<LogoProps> = ({ sx }) => (
  <Box 
    // הוספת ה-sx שהתקבל ל-Box החיצוני (כדי לקבל את ה-10% רווח)
    sx={{
      width: { xs: '45px', sm: '70px' }, 
      height: { xs: '45px', sm: '70px' }, 
      flexShrink: 0,
      cursor: 'pointer',
      ...sx // מיזוג המאפיינים החיצוניים (כמו ml: '10%')
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
   const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('שיעורים');
  
  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    console.log('מחפש:', searchTerm);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  }

  const navLinks = ['שיעורים', 'אודות', 'גלריה', 'ספרים', 'צור קשר','שאל את הרב']; 

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
          justifyContent: 'space-between', 
          alignItems: 'center', 
          
          padding: '0 !important', 
          // גובה מוגדל
          paddingY: { xs: '15px', sm: '20px' }, 
          minHeight: { xs: '60px', sm: '80px' }, 
          
          // הגבלת התוכן ל-1280px ומירוכזו
          maxWidth: COLORS.contentMaxWidth, 
          width: '100%', 
          margin: '0 auto', 
          direction: 'rtl', 
          px: 0, 
        }}
      >
        
        {/* === בלוק 1: צד ימין (לוגו וקישורים) === */}
        <Stack 
          direction="row"
          alignItems="center"
          // איפוס spacing כי נשתמש ב-margin-left: 10%
          spacing={0} 
          sx={{ 
            // הצמדה מוחלטת: ריווח ימין (pr) הוא 0
            pr: 0, 
            // שמירת ריווח משמאל לקישורים
            pl: COLORS.innerPadding, 
            flexShrink: 0,
          }}
        >
          {/* *** קריטי: הוספת מרווח שמאלי של 10% ללוגו *** */}
          <Logo sx={{ ml: { xs: 0, md: '10%' } }} />
            
          {/* 2. קישורים (מרווחים וגדולים) */}
          <Stack 
            direction="row" 
            gap={COLORS.linkGap} 
            sx={{ 
              height: '100%', 
              alignItems: 'center', 
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {navLinks.map((text, index) => (
              <Link 
                key={index}
                href={`/${text}`}
                onClick={(e) => {
                  if (text === 'שאל את הרב'){
                    navigate('/RabbiQuestionForm');
                  }
                    if (text === 'צור קשר'){
                    navigate('/ContactForm');
                  }
                  e.preventDefault();
                  setActiveTab(text);
                }}
                sx={{
                  color: COLORS.linkText,
                  textDecoration: 'none',
                  fontSize: { md: '1.05rem', lg: '1.2rem' }, 
                  fontWeight: 600, 
                  
                  // פאדינג אופקי ליצירת רוחב אחיד ומרווח
                  padding: '10px 18px', 
                  paddingY: '10px', 
                  
                  position: 'relative', 
                  height: '100%',
                  flexShrink: 0, 

                  '&:hover, &:active, &:visited': { color: COLORS.linkText },
                  
                  // פס אינדיקציה רחב ואחיד
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0, 
                    width: activeTab === text ? '100%' : '0%', 
                    height: '4px',
                    backgroundColor: COLORS.indicatorBar,
                    transition: 'width 0.2s ease-in-out', 
                    transformOrigin: 'bottom',
                  }
                }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Stack>
        
        {/* === שטח ריק מתרחב (הרווח האדום הגדול) === */}
        <Box sx={{ flexGrow: 1 }} /> 
        
        {/* === בלוק 2: צד שמאל (חיפוש ותרמות) - צמוד לשמאל ה-1280px === */}
        <Stack
          direction="row"
          alignItems="center"
          gap={COLORS.searchDonateGap} 
          sx={{ 
            // שמירת ריווח משמאל לחיפוש
            pl: COLORS.innerPadding, 
            // הצמדה מוחלטת: ריווח ימין (pr) הוא 0
            pr: 0, 
            flexShrink: 0,
          }}
        >
               {/* 2. כפתור 'תרמות' הלבן */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: COLORS.searchBg,
              color: COLORS.inputTextColor,
              border: '1px solid black',
              padding: { xs: '8px 12px', sm: '10px 18px' }, 
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
            תרומות
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
              height: { sm: '45px', md: '50px' }
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
                color: COLORS.inputTextColor,
                minWidth: { sm: '150px', md: '200px' }, 
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
                width: '45px', 
                height: '100%', 
                borderRadius: `${COLORS.borderRadius} 0 0 ${COLORS.borderRadius}`, 
                '&:hover': { backgroundColor: COLORS.searchBtnBg }
              }}
            >
              <SearchIcon sx={{ width: '24px', height: '24px', fill: COLORS.linkText }} />
            </IconButton>
          </Box>
            
     
          
          {/* 3. כפתור המבורגר לניווט (מופיע רק בטלפון) */}
          <IconButton 
            color="inherit" 
            aria-label="פתח תפריט ניווט"
            sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              color: COLORS.linkText
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* 4. אייקון חיפוש לטלפון (מופיע רק בטלפון) */}
          <IconButton 
            color="inherit" 
            aria-label="פתח חיפוש"
            sx={{ 
              display: { xs: 'flex', sm: 'none' }, 
              color: COLORS.linkText,
            }}
            onClick={() => console.log('פתח חיפוש במסך מלא')}
          >
            <SearchIcon />
          </IconButton>
        </Stack>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
