
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, IconButton, Container, Stack,
  Checkbox, FormControlLabel
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { colors } from '../src/theme/tokens';
// --- תוספת קטנה עבור TypeScript כדי לפתור את השגיאה ב-App ---
interface AdminLoginProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const COLORS = {
  BROWN_DARK: '#9c6644',
  BROWN_LIGHT: colors.gold,
  BG_CREAM: colors.gold,
  BLACK: colors.gold
};

// הוספנו כאן את ה-setToken כ-Prop
const AdminLogin: React.FC<AdminLoginProps> = ({ setToken }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(''); // שומר הודעת שגיאה אם ההתחברות נכשלה

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // האם המערכת בתהליך שליחת הנתונים

  const handleLogin = async () => {
    // 1. בדיקת תקינות - האם השדות מלאים
    if (!credentials.identifier || !credentials.password) {
      setError('נא למלא את כל שדות החובה');
      return; 
    }

    // 2. הכנה לשליחה
    setLoading(true);
    setError(''); 

    try {
      // 3. שליחת בקשה ל-Strapi
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // 4. בדיקה אם השרת החזיר שגיאה
      if (!response.ok) {
        throw new Error('שם משתמש או סיסמה אינם תקינים');
      }

      // 5. הצלחה - שמירת טוקן
      if (rememberMe) {
        const expiry = Date.now() + 14 * 24 * 60 * 60 * 1000;
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('token_expiry', expiry.toString());
      } else {
        sessionStorage.setItem('token', data.jwt);
      }

      setToken(data.jwt);
      
      navigate('/manager/manage'); // מעבר לדף הניהול

    } catch (err: any) {
      // 6. טיפול בשגיאות
      setError(err.message);
    } finally {
      // 7. סיום מצב טעינה
      setLoading(false);
    }
  }; 

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: '#fafafa',
      direction: 'rtl' 
    }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: '24px', 
          border: '1px solid #ececec',
          textAlign: 'center',
          boxShadow: '0 15px 50px rgba(0,0,0,0.05)'
        }}>
          
          <Box sx={{ 
            width: 60, height: 60, bgcolor: COLORS.BG_CREAM, 
            borderRadius: '18px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', mx: 'auto', mb: 2 
          }}>
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 30 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: "'Yetzira-Regular', sans-serif" }}>
            כניסת מנהל
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, fontFamily: "'Yetzira-Regular', sans-serif" }}>
            הזן פרטי גישה לניהול מערכת "עטרת מרדכי"
          </Typography>

          {error && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#d32f2f', 
                display: 'block', 
                textAlign: 'right', 
                mt: -2, 
                mb: 2,  
                fontWeight: '500' 
              }}
            >
              * {error}
            </Typography>
          )}

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="שם משתמש / אימייל"
              variant="outlined"
              onChange={(e) => setCredentials({...credentials, identifier: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: colors.gold },
                  '&:hover fieldset': { borderColor: colors.gold },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: COLORS.BROWN_LIGHT }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
            />

            <TextField
              fullWidth
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: colors.gold },
                  '&:hover fieldset': { borderColor: colors.gold },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: COLORS.BROWN_LIGHT }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: COLORS.BROWN_LIGHT, '&.Mui-checked': { color: COLORS.BROWN_LIGHT } }}
                />
              }
              label="זכור אותי"
              sx={{ alignSelf: 'flex-start', '& .MuiFormControlLabel-label': { fontSize: '0.9rem', color: 'text.secondary' } }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading} // מניעת לחיצות כפולות
              onClick={handleLogin}
              sx={{ 
                bgcolor: '#000', 
                color: colors.gold,
                py: 1.5, 
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                '&:hover': { bgcolor: colors.gold, color: '#000', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(197, 160, 89, 0.4)' },
                transition: '0.3s'
              }}
            >
              {loading ? 'מתחבר...' : 'התחברות למערכת'}
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ display: 'block', mt: 4, color: 'text.disabled', fontFamily: "'Yetzira-Regular', sans-serif" }}>
            © {new Date().getFullYear()} ישיבת עטרת מרדכי - מערכת ניהול פנימית
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;