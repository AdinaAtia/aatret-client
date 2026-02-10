import React from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Stack, Button, Checkbox, 
  Select, MenuItem, FormControl, IconButton
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';

// שימוש ב-COLORS המקוריים של האתר שלך
const COLORS = {
  SIDEBAR_BROWN: '#8c6644', // החום של הסיידבר
  BROWN_DARK: '#5d4037',    // חום כהה לטקסט
  GOLD_LIGHT: '#f4f1ee',    // רקע קרם בהיר לשורות
  WHITE: '#ffffff'
};

const ManageRabbis = () => {
  // נתוני דמו
  const dummyRabbis = [
    { id: 16, name: 'הרב מרדכי מלכה', priority: 1, hits: 1450, lessons: 15, views: '3,254,128', hpl: 216 },
    { id: 17, name: 'הרב אהרון לוי', priority: 2, hits: 890, lessons: 10, views: '45,000', hpl: 89 },
  ];

  return (
    <Box sx={{ p: 4, direction: 'rtl', minHeight: '100vh', bgcolor: '#fbfbfb' }}>
      
      {/* כותרת מעוצבת בפונט האתר */}
      <Typography variant="h4" sx={{ 
        fontFamily: "'YetziraCustom', sans-serif", 
        color: COLORS.SIDEBAR_BROWN,
        mb: 4,
        borderBottom: `2px solid ${COLORS.SIDEBAR_BROWN}`,
        display: 'inline-block',
        pb: 1
      }}>
        ניהול רבנים ומרצים
      </Typography>

      {/* כפתורי פעולה בסגנון האתר */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<DeleteOutlineIcon sx={{ ml: 1 }} />}
          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, borderRadius: '8px' }}
        >
          מחיקה
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PublishIcon sx={{ ml: 1 }} />}
          sx={{ bgcolor: COLORS.SIDEBAR_BROWN, '&:hover': { bgcolor: COLORS.BROWN_DARK }, borderRadius: '8px' }}
        >
          פרסום מהיר
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: COLORS.SIDEBAR_BROWN }}>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} /></TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', fontFamily: "'YetziraCustom', sans-serif" }}>שם הרב</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>קדימות</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>שיעורים</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>צפיות</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>מצב</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {dummyRabbis.map((rabbi) => (
              <TableRow key={rabbi.id} sx={{ '&:nth-of-type(even)': { bgcolor: COLORS.GOLD_LIGHT } }}>
                <TableCell padding="checkbox"><Checkbox size="small" sx={{ color: COLORS.SIDEBAR_BROWN }} /></TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK, fontSize: '1.1rem' }}>
                    {rabbi.name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <TextField 
                    size="small" 
                    defaultValue={rabbi.priority}
                    sx={{ 
                      width: 50, 
                      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      '& .MuiInputBase-input': { textAlign: 'center', fontWeight: 'bold' } 
                    }} 
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>{rabbi.lessons}</TableCell>
                <TableCell align="center" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>{rabbi.views}</TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    bgcolor: '#e8f5e9', color: '#2e7d32', px: 2, py: 0.5, borderRadius: '20px', 
                    display: 'inline-block', fontSize: '0.8rem', fontWeight: 'bold' 
                  }}>
                    מפורסם
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#999' }}>{rabbi.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* שליטה בכמות מוצגת */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, px: 2 }}>
        <Typography sx={{ alignSelf: 'center', ml: 2, fontSize: '0.9rem', color: '#666' }}>הצג רבנים:</Typography>
        <FormControl size="small">
          <Select defaultValue={20} sx={{ borderRadius: '8px', bgcolor: 'white' }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default ManageRabbis;