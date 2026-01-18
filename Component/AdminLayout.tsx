import React, { type ReactNode } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// אייקונים מהספריה של MUI - תואם לצילום המסך
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

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
    SIDEBAR_BROWN: '#fdfbe7', // החום הכהה
    GOLD_LIGHT: '#b48a66',    // זהב/ברונזה לאייקונים
    TEXT_WHITE: '#000',
    BG_CONTENT: '#f4f6f8'
  };

  // רשימת פריטי התפריט
  const menuItems = [
    { text: 'הוספת שיעור חדש', icon: <AddCircleOutlineIcon />, path: '/admin/add-lesson' },
    { text: 'הוספת קטגוריה', icon: <FolderIcon />, path: '/admin/add-category' },
    { text: 'ניהול ארכיון', icon: <FolderIcon />, path: '/admin/archive' },
    { text: 'ניהול רבני הישיבה', icon: <PeopleIcon />, path: '/admin/rabbis' },
    { text: 'ניהול קטגוריות', icon: <FolderIcon />, path: '/admin/categories' },
    { text: 'פרטים אישיים', icon: <PersonIcon />, path: '/admin/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // מחיקה מהזיכרון
    window.location.href = '/admin/login'; // ריענון והפניה להתחברות
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
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fdfbe7' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
            תפריט מנהל
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
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
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: '12px',
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                    } 
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
                        fontSize: '0.9rem'
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
              color: '#ffccbc',
              '&:hover': { bgcolor: 'rgba(255, 87, 34, 0.1)' } 
            }}
          >
            <ListItemIcon sx={{ color: '#ffccbc', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="ניתוק" sx={{ '& .MuiTypography-root': { fontWeight: 600, textAlign: 'right' } }} />
          </ListItemButton>
        </Box>
      </Box>

      {/* --- אזור התוכן המרכזי (הדפים שמתחלפים) --- */}
      <Box 
        component="main" 
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