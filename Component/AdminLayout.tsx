import { type ReactNode } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// אייקונים מהספריה של MUI - תואם לצילום המסך
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderIcon from '@mui/icons-material/Folder';
import DraftsIcon from '@mui/icons-material/Drafts';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { colors } from '../src/theme/tokens';
// הגדרת ה-Props עבור TypeScript
interface AdminLayoutProps {
  children: ReactNode;
  token: string | null;
}

const AdminLayout = ({ children, token }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // הגדרת הצבעים המדויקת מהערות הקוד שלך
  const COLORS = {
    SIDEBAR_BROWN: '#fff',
    GOLD_LIGHT: colors.gold,
    TEXT_WHITE: '#000',
    BG_CONTENT: '#f4f6f8'
  };

  // רשימת פריטי התפריט
  const menuItems = [
    { text: 'הוספת שיעור חדש', icon: <AddCircleOutlineIcon />, path: '/manager/AudioUploader' },
    { text: 'ניהול שיעורים', icon: <FolderIcon />, path: '/manager/archive' },
    { text: 'הוספת קטגוריה', icon: <FolderIcon />, path: '/manager/AddNewCategory' },
    { text: 'ניהול קטגוריות', icon: <FolderIcon />, path: '/manager/categories' },
    { text: 'ניהול רבנים', icon: <PersonIcon />, path: '/manager/rabbis' },
    { text: 'ניהול ספרים', icon: <MenuBookIcon />, path: '/manager/books' },
    { text: 'צפייה בטיוטות', icon: <DraftsIcon />, path: '/manager/drafts' },
    { text: 'פרטים אישיים', icon: <PersonIcon />, path: '/manager/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // מחיקה מהזיכרון
    window.location.href = '/manager/login'; // ריענון והפניה להתחברות
  };

  // הגנה: אם אין טוקן, מציגים רק את התוכן (בדרך כלל דף התחברות)
  if (!token) {
    return <Box sx={{ minHeight: '100vh', width: '100%' }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: 'rtl', bgcolor: COLORS.BG_CONTENT }}>
      
      {/* --- תפריט צדדי (Sidebar) --- */}
      <Box sx={{ 
        width: 280, 
        bgcolor: COLORS.SIDEBAR_BROWN, 
        color: COLORS.TEXT_WHITE,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        
        {/* לוגו / כותרת תפריט */}
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, fontFamily: "'Yetzira-Regular', sans-serif", fontSize: '1rem', color: '#000' }}>
            תפריט מנהל
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5, fontFamily: "'Yetzira-Regular', sans-serif", fontSize: '1rem', color: '#000' }}>
ישיבת עטרת מרדכי          </Typography>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

        {/* רשימת הניווט */}
        <List sx={{ px: 2, mt: 2, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  disableRipple
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: '12px',
                    bgcolor: 'transparent',
                    '&:hover': { bgcolor: 'transparent' },
                    '&.Mui-focusVisible': { bgcolor: 'transparent' }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? COLORS.GOLD_LIGHT : COLORS.TEXT_WHITE, 
                    minWidth: 40,
                    transition: '0.3s'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                    '& .MuiTypography-root': { 
                        fontWeight: isActive ? 700 : 500, 
                        textAlign: 'right',
                        fontSize: '1rem',
                        fontFamily: "'Yetzira-Regular', sans-serif",
                        color: colors.gold
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* כפתור ניתוק בתחתית */}
        <Box sx={{ p: 2, pb: 4 }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              borderRadius: '12px', 
              color: '#000',
              '&:hover': { bgcolor: 'transparent' } 
            }}
          >
            <ListItemIcon sx={{ color: '#000', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="ניתוק" sx={{ '& .MuiTypography-root': { fontWeight: 'bold', textAlign: 'right', fontFamily: "'Yetzira-Regular', sans-serif", fontSize: '1rem', color: colors.gold } }} />
          </ListItemButton>
        </Box>
      </Box>

      {/* --- אזור התוכן המרכזי (הדפים שמתחלפים) --- */}
      <Box 
        component="div"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          overflowY: 'auto',
          minWidth: 0 // חשוב למניעת שבירת טבלאות
        }}
      >
        {children}
      </Box>

    </Box>
  );
};

export default AdminLayout;