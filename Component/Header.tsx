import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Stack,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import SearchIcon from '@mui/icons-material/Search';
import Logo, { Crown } from './shared/Logo';
import AppButton from './shared/AppButton';

export { Crown };

/**
 * הקשת שמתחת לפריט הניווט הפעיל.
 * נמדדה מהקובץ: שטוחה באמצע, הקצוות מתרוממים. רוחב מלא, עומק 4px.
 */
const ActiveArc: React.FC = () => (
  <Box
    component="svg"
    viewBox="0 0 100 6"
    preserveAspectRatio="none"
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '6px',
      display: 'block',
      pointerEvents: 'none',
    }}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1 0.8 Q1 4.8 10 4.8 L90 4.8 Q99 4.8 99 0.8"
      stroke={'var(--gold)'}
      strokeWidth="1.6"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </Box>
);

const getStoredToken = (): string | null => {
  const localToken = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');
  if (localToken && expiry) {
    if (Date.now() < parseInt(expiry)) return localToken;
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
  }
  return sessionStorage.getItem('token');
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('דף הבית');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean>(!!getStoredToken());
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isArchivePage = location.pathname.startsWith('/AllLessons');

  const goToSearch = () => {
    if (!headerSearch.trim()) return;
    navigate('/AllLessons', { state: { searchQuery: headerSearch.replace(/^\s+/, '') } });
    setHeaderSearch('');
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const navLinks = [
    { text: 'דף הבית', path: '/' },
    { text: 'שיעורים', path: '/AllLessons' },
    { text: 'אודות הישיבה', path: '/About' },
    // { text: 'גלריה', path: '/Gallery' },
    { text: 'ספרים', path: '/FullBooksPage' },
    { text: 'צור קשר', path: '/ContactForm' },
  ];

  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === location.pathname);
    setActiveTab(currentLink ? currentLink.text : '');
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => setIsAdmin(!!getStoredToken());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /* פוקוס אוטומטי כשריבוע החיפוש נפתח */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const logoLockup = (withSubtitle: boolean) => (
    <Logo variant={withSubtitle ? 'horizontal' : 'compact'} onClick={() => navigate('/')} />
  );

  return (
    <>

    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'var(--surface)',
        width: '100%',
        height: { xs: `var(--header-height-xs)`, md: `var(--header-height-md)` },
        borderBottom: `1px solid var(--gold)`,
        boxShadow: 'none',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          minHeight: 'unset !important',
          px: { xs: `var(--header-pad-x-xs)`, md: `var(--header-pad-x-md)` },
          width: '100%',
          direction: 'rtl',
        }}
      >
        {/* צד ימין: לוגו בדסקטופ, המבורגר בנייד */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>{logoLockup(true)}</Box>
          <IconButton
            onClick={() => setMobileMenuOpen(true)}
            aria-label="פתיחת תפריט"
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'var(--ink)', p: 1 }}
          >
            <MenuIcon sx={{ fontSize: '22px' }} />
          </IconButton>
        </Box>

        {/* מרכז הדף: ניווט בדסקטופ, לוגו בנייד. ממוקם אבסולוטית כדי שיתמרכז
            ביחס לדף ולא ביחס לרוחב שני הצדדים. */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            direction: 'rtl',
          }}
        >
          {/* ניווט — דסקטופ */}
          <Box component="nav" aria-label="ניווט ראשי" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: `var(--header-controls-nav-gap)` }}>
            {navLinks.map((item) => {
              const isActive = activeTab === item.text;
              return (
                <Link
                  key={item.text}
                  href={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e: React.MouseEvent) => {
                    // קליק רגיל — ניווט פנימי בלי רענון; Ctrl/Shift/קליק אמצעי נשארים לדפדפן
                    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  sx={{
                    color: isActive ? 'var(--gold-deep)' : 'var(--ink)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--t3)',
                    fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    paddingBottom: '11px',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: 'var(--gold-deep)' },
                  }}
                >
                  {item.text}
                  {isActive && <ActiveArc />}
                </Link>
              );
            })}
          </Box>

          {/* לוגו — נייד, בלי שורת המשנה */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>{logoLockup(false)}</Box>
        </Box>

        {/* צד שמאל: חיפוש וכפתור תרומות */}
        <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, gap: '16px' }}>
          {/* ריבוע חיפוש שנפתח בלחיצה — מחשב בלבד. מוסתר בארכיון השיעורים, ששם כבר יש שדה חיפוש בגוף העמוד */}
          {!isArchivePage && (
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              width: searchOpen ? `var(--header-controls-search-open-width)` : `var(--header-controls-search-size)`,
              height: `var(--header-controls-search-size)`,
              border: `1px solid var(--gold)`,
              borderRadius: 'var(--radius-control)',
              overflow: 'hidden',
              backgroundColor: 'transparent',
              transition: 'width 0.28s ease',
            }}
          >
            <Box
              component="input"
              ref={searchInputRef}
              type="text"
              placeholder="חפש שיעור..."
              value={headerSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderSearch(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') goToSearch();
                if (e.key === 'Escape') setSearchOpen(false);
              }}
              onBlur={() => { if (!headerSearch) setSearchOpen(false); }}
              tabIndex={searchOpen ? 0 : -1}
              sx={{
                flex: 1,
                minWidth: 0,
                width: 0,
                border: 'none',
                outline: 'none',
                px: searchOpen ? '12px' : 0,
                fontSize: 'var(--t2)',
                fontFamily: 'var(--font-body)',
                color: 'var(--ink)',
                background: 'transparent',
                opacity: searchOpen ? 1 : 0,
                transition: 'opacity 0.2s ease',
                direction: 'rtl',
              }}
            />
            <IconButton
              onClick={() => (searchOpen ? goToSearch() : setSearchOpen(true))}
              aria-label={searchOpen ? 'חיפוש' : 'פתיחת חיפוש'}
              aria-expanded={searchOpen}
              disableRipple
              sx={{
                width: 'calc(var(--header-controls-search-size) - 2px)',
                height: 'calc(var(--header-controls-search-size) - 2px)',
                flexShrink: 0,
                p: 0,
                borderRadius: 0,
                color: 'var(--gold-deep)',
                '&:hover': { color: 'var(--gold)', bgcolor: 'transparent' },
                transition: 'color 0.2s ease',
              }}
            >
              <SearchIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
          )}

          {/* תרומות */}
          <AppButton
            onClick={() => navigate('/ModernScrollDonation')}
            sx={{
              width: { xs: `var(--header-controls-donate-xs-w)`, md: `var(--header-controls-donate-md-w)` },
              minWidth: 0,
              px: 0,
            }}
          >
            תרומות
          </AppButton>

          {/* פרופיל - מחשב בלבד, רק למנהל מחובר */}
          {isAdmin && (
            <IconButton
              onClick={() => navigate('/manager/manage')}
              aria-label="ניהול האתר"
              sx={{
                color: 'var(--gold-deep)',
                display: { xs: 'none', md: 'flex' },
                '&:hover': { color: 'var(--ink)', bgcolor: `color-mix(in srgb, var(--gold) 12.157%, transparent)` },
              }}
            >
              <AccountCircleOutlinedIcon sx={{ fontSize: '28px' }} />
            </IconButton>
          )}
        </Stack>
      </Toolbar>

      {/* תפריט צד (Drawer) - מכיל הכל במובייל */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        aria-label="תפריט ראשי"
        PaperProps={{ sx: { backgroundColor: 'var(--surface)', backgroundImage: 'none' } }}
      >
        <Box sx={{ width: 280, backgroundColor: 'var(--surface)', height: '100%', direction: 'rtl', p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Logo variant="compact" gap="10px" />
            <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="סגירת תפריט" sx={{ color: 'var(--ink)' }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: `color-mix(in srgb, var(--gold) 34.902%, transparent)`, mb: 3 }} />

          {/* כפתור תרומות בולט בתוך התפריט */}
          <Box sx={{ px: 1, mb: 3 }}>
             <AppButton
                fullWidth
                onClick={() => { navigate('/ModernScrollDonation'); setMobileMenuOpen(false); }}
              >
                תרומות
              </AppButton>
          </Box>

          {/* חיפוש בתוך התפריט — מוסתר בארכיון השיעורים, ששם כבר יש שדה חיפוש בגוף העמוד */}
          {!isArchivePage && (
          <Box sx={{
            mx: 1,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid var(--gold)`,
            borderRadius: 'var(--radius-control)',
            height: `var(--header-controls-donate-xs-h)`,
            overflow: 'hidden',
          }}>
            <input
              type="text"
              placeholder="חפש שיעור..."
              aria-label="חיפוש שיעור"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', padding: '0 12px', fontSize: 'var(--t3)', direction: 'rtl', fontFamily: 'var(--font-body)', color: 'var(--ink)', background: 'transparent' }}
            />
            <IconButton onClick={goToSearch} aria-label="חיפוש" disableRipple sx={{
              width: 'calc(var(--header-controls-donate-xs-h) - 2px)',
              height: 'calc(var(--header-controls-donate-xs-h) - 2px)',
              flexShrink: 0,
              p: 0,
              borderRadius: 0,
              color: 'var(--gold-deep)',
              '&:hover': { color: 'var(--gold)', bgcolor: 'transparent' },
            }}>
              <SearchIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
          )}

          <List>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                   onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                   sx={{
                     py: 1.5,
                     borderRadius: 'var(--radius-control)',
                     borderRight: activeTab === item.text ? `3px solid var(--gold)` : '3px solid transparent',
                     bgcolor: activeTab === item.text ? `color-mix(in srgb, var(--sand) 50.196%, transparent)` : 'transparent',
                     '&:hover': { bgcolor: `color-mix(in srgb, var(--sand) 40%, transparent)` },
                   }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textAlign: 'right',
                      '& .MuiTypography-root': {
                        fontFamily: 'var(--font-body)',
                        color: activeTab === item.text ? 'var(--gold-deep)' : 'var(--ink)',
                        fontWeight: activeTab === item.text ? 700 : 400,
                        fontSize: 'var(--t3)'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ borderColor: `color-mix(in srgb, var(--gold) 34.902%, transparent)`, my: 2 }} />

            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { navigate('/manager/manage'); setMobileMenuOpen(false); }}
                  sx={{ borderRadius: 'var(--radius-control)', '&:hover': { bgcolor: `color-mix(in srgb, var(--sand) 40%, transparent)` } }}
                >
                  <AccountCircleOutlinedIcon sx={{ color: 'var(--gold-deep)', ml: 2 }} />
                  <ListItemText
                    primary="ניהול"
                    sx={{ textAlign: 'right', '& .MuiTypography-root': { fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: 'var(--t3)' } }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
    {/* spacer — חייב להיות זהה בדיוק לגובה ה-AppBar */}
    <Box sx={{ height: { xs: `var(--header-height-xs)`, md: `var(--header-height-md)` }, flexShrink: 0 }} />
  </>
  );
};

export default Header;
