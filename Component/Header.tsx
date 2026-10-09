import React, { useState, useEffect, useRef, useId } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
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

import {
  colors,
  gradients,
  goldTextFill,
  fonts,
  fontSize,
  logoTitleMobile,
  radius,
  headerHeight,
  headerPadX,
  headerControls,
} from '../src/theme/tokens';

/**
 * הכתר — הלוגו המקורי של הישיבה (logo.png), צבוע בזהב מתכתי.
 *
 * הקובץ בנוי ממילוי לבן אטום עם קווים כהים (#211E1E) על רקע שקוף, ולכן
 * מסכת שקיפות רגילה הייתה נותנת כתם זהב מלא. במקומה: feColorMatrix הופך
 * את הצבעים, ואז מסכת luminance מעבירה את הזהב רק במקום שבו היו הקווים
 * הכהים — המילוי הלבן נחסם. כל הפרטים נשמרים, כולל הכיתוב שבתוך הכתר.
 */
export const Crown: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const uid = useId().replace(/:/g, '');
  const gid = `crown-g-${uid}`;
  const mid = `crown-m-${uid}`;
  const fid = `crown-f-${uid}`;
  return (
    <Box
      component="svg"
      viewBox="0 0 184 156"
      sx={{ width: `${width}px`, height: `${height}px`, flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={fid} colorInterpolationFilters="sRGB">
          {/* היפוך צבע, שמירה על ערוץ השקיפות */}
          <feColorMatrix
            type="matrix"
            values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
          />
        </filter>
        <mask id={mid}>
          <image href="/logo.png" x="0" y="0" width="184" height="156" filter={`url(#${fid})`} />
        </mask>
        <linearGradient id={gid} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#D9BC7F" />
          <stop offset="42%" stopColor={colors.gold} />
          <stop offset="100%" stopColor={colors.goldDeep} />
        </linearGradient>
      </defs>
      <rect width="184" height="156" fill={`url(#${gid})`} mask={`url(#${mid})`} />
    </Box>
  );
};

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
      stroke={colors.gold}
      strokeWidth="1.6"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </Box>
);

/** כתובית המותג. בדסקטופ עם שורת המשנה, בנייד בלעדיה — לפי קובץ העיצוב. */
const Wordmark: React.FC<{ onClick?: () => void; withSubtitle?: boolean }> = ({ onClick, withSubtitle = true }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      lineHeight: 1,
      minWidth: 0,
    }}
  >
    <Box
      component="span"
      sx={{
        ...goldTextFill,
        fontFamily: fonts.heading,
        fontSize: withSubtitle ? fontSize.xl : logoTitleMobile,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      עטרת מרדכי
    </Box>
    {withSubtitle && (
      <Box
        component="span"
        sx={{
          fontFamily: fonts.body,
          fontSize: fontSize.xs,
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: colors.ink,
          mt: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        ישיבת החיים והשלום
      </Box>
    )}
  </Box>
);

/** כפתור התרומות — מילוי מתכתי אלכסוני, בלי מסגרת, טקסט כהה. נמדד מהקובץ. */
const donateButtonSx = {
  background: gradients.goldButton,
  color: colors.ink,
  fontFamily: fonts.body,
  fontWeight: 700,
  fontSize: fontSize.sm,
  borderRadius: radius.control,
  border: 'none',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  minWidth: 0,
  p: 0,
  '&:hover': {
    background: gradients.goldButton,
    filter: 'brightness(1.05)',
    boxShadow: `0 4px 12px ${colors.goldDeep}40`,
  },
  transition: 'filter 0.2s ease, box-shadow 0.2s ease',
};

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
    // { text: 'שאל את הרב', path: '/RabbiQuestionForm' },
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
    <Stack
      direction="row"
      alignItems="center"
      sx={{ gap: '12px', flexShrink: 0, cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      <Wordmark withSubtitle={withSubtitle} />
      <Crown
        width={withSubtitle ? headerControls.crown.md.w : headerControls.crown.xs.w}
        height={withSubtitle ? headerControls.crown.md.h : headerControls.crown.xs.h}
      />
    </Stack>
  );

  return (
    <>

    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: colors.cream,
        width: '100%',
        height: { xs: `${headerHeight.xs}px`, md: `${headerHeight.md}px` },
        borderBottom: `1px solid ${colors.gold}`,
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
          px: { xs: `${headerPadX.xs}px`, md: `${headerPadX.md}px` },
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
            sx={{ display: { xs: 'flex', md: 'none' }, color: colors.ink, p: 1 }}
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: `${headerControls.navGap}px` }}>
            {navLinks.map((item) => {
              const isActive = activeTab === item.text;
              return (
                <Link
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive ? colors.goldDeep : colors.ink,
                    textDecoration: 'none',
                    fontFamily: fonts.body,
                    fontSize: fontSize.md,
                    fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    paddingBottom: '11px',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: colors.goldDeep },
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
              width: searchOpen ? `${headerControls.search.openWidth}px` : `${headerControls.search.size}px`,
              height: `${headerControls.search.size}px`,
              border: `1px solid ${colors.gold}`,
              borderRadius: radius.control,
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
                fontSize: fontSize.sm,
                fontFamily: fonts.body,
                color: colors.ink,
                background: 'transparent',
                opacity: searchOpen ? 1 : 0,
                transition: 'opacity 0.2s ease',
                direction: 'rtl',
              }}
            />
            <Box
              onClick={() => (searchOpen ? goToSearch() : setSearchOpen(true))}
              role="button"
              aria-label={searchOpen ? 'חיפוש' : 'פתיחת חיפוש'}
              sx={{
                width: `${headerControls.search.size - 2}px`,
                height: `${headerControls.search.size - 2}px`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.goldDeep,
                '&:hover': { color: colors.gold },
                transition: 'color 0.2s ease',
              }}
            >
              <SearchIcon sx={{ fontSize: '20px' }} />
            </Box>
          </Box>
          )}

          {/* תרומות */}
          <Button
            onClick={() => navigate('/ModernScrollDonation')}
            variant="contained"
            disableElevation
            sx={{
              ...donateButtonSx,
              width: { xs: `${headerControls.donate.xs.w}px`, md: `${headerControls.donate.md.w}px` },
              height: { xs: `${headerControls.donate.xs.h}px`, md: `${headerControls.donate.md.h}px` },
            }}
          >
            תרומות
          </Button>

          {/* פרופיל - מחשב בלבד, רק למנהל מחובר */}
          {isAdmin && (
            <IconButton
              onClick={() => navigate('/manager/manage')}
              sx={{
                color: colors.goldDeep,
                display: { xs: 'none', md: 'flex' },
                '&:hover': { color: colors.ink, bgcolor: `${colors.gold}1F` },
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
        PaperProps={{ sx: { backgroundColor: colors.cream, backgroundImage: 'none' } }}
      >
        <Box sx={{ width: 280, backgroundColor: colors.cream, height: '100%', direction: 'rtl', p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" sx={{ gap: '10px' }}>
              <Wordmark withSubtitle={false} />
              <Crown width={headerControls.crown.xs.w} height={headerControls.crown.xs.h} />
            </Stack>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: colors.ink }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: `${colors.gold}59`, mb: 3 }} />

          {/* כפתור תרומות בולט בתוך התפריט */}
          <Box sx={{ px: 1, mb: 3 }}>
             <Button
                fullWidth
                onClick={() => { navigate('/ModernScrollDonation'); setMobileMenuOpen(false); }}
                variant="contained"
                disableElevation
                sx={{ ...donateButtonSx, height: `${headerControls.donate.xs.h}px`, fontSize: fontSize.md }}
              >
                תרומות
              </Button>
          </Box>

          {/* חיפוש בתוך התפריט — מוסתר בארכיון השיעורים, ששם כבר יש שדה חיפוש בגוף העמוד */}
          {!isArchivePage && (
          <Box sx={{
            mx: 1,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${colors.gold}`,
            borderRadius: radius.control,
            height: `${headerControls.donate.xs.h}px`,
            overflow: 'hidden',
          }}>
            <input
              type="text"
              placeholder="חפש שיעור..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', padding: '0 12px', fontSize: fontSize.md, direction: 'rtl', fontFamily: fonts.body, color: colors.ink, background: 'transparent' }}
            />
            <Box onClick={goToSearch} sx={{
              width: `${headerControls.donate.xs.h - 2}px`,
              height: `${headerControls.donate.xs.h - 2}px`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.goldDeep,
              '&:hover': { color: colors.gold },
            }}>
              <SearchIcon sx={{ fontSize: '20px' }} />
            </Box>
          </Box>
          )}

          <List>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                   onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                   sx={{
                     py: 1.5,
                     borderRadius: radius.control,
                     borderRight: activeTab === item.text ? `3px solid ${colors.gold}` : '3px solid transparent',
                     bgcolor: activeTab === item.text ? `${colors.sand}80` : 'transparent',
                     '&:hover': { bgcolor: `${colors.sand}66` },
                   }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textAlign: 'right',
                      '& .MuiTypography-root': {
                        fontFamily: fonts.body,
                        color: activeTab === item.text ? colors.goldDeep : colors.ink,
                        fontWeight: activeTab === item.text ? 700 : 400,
                        fontSize: fontSize.md
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ borderColor: `${colors.gold}59`, my: 2 }} />

            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { navigate('/manager/manage'); setMobileMenuOpen(false); }}
                  sx={{ borderRadius: radius.control, '&:hover': { bgcolor: `${colors.sand}66` } }}
                >
                  <AccountCircleOutlinedIcon sx={{ color: colors.goldDeep, ml: 2 }} />
                  <ListItemText
                    primary="ניהול"
                    sx={{ textAlign: 'right', '& .MuiTypography-root': { fontFamily: fonts.body, color: colors.ink, fontSize: fontSize.md } }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
    {/* spacer — חייב להיות זהה בדיוק לגובה ה-AppBar */}
    <Box sx={{ height: { xs: `${headerHeight.xs}px`, md: `${headerHeight.md}px` }, flexShrink: 0 }} />
  </>
  );
};

export default Header;
