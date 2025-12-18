import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

const RABBIS = [
  { value: 'rav-a', label: 'הרב הראשי' },
  { value: 'rav-b', label: 'הרב אלישיב' },
  { value: 'rav-c', label: 'הרב כהן' },
];

const EXPLANATION_TEXT =
  'לשם איסופם הולם דלור סטיס אמט, קונסקטטור אדיפיסינג אלית. טקסט לדוגמה שמדמה הסבר כללי על אופן שליחת השאלות, שמירה על ניסוח מכבד ומענה מסודר.';

const RabbiQuestionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    selectedRabbi: '',
    questionContent: '',
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const primaryColor = '#922b2b';
  const lightBgColor = '#f7f6dc';

  return (
    <Box component="main" sx={{ direction: 'rtl', py: 6, px: { xs: 2, sm: 3, md: 4 },}}>
      {/* כותרת */}
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        fontWeight={700}
        sx={{
          mb: 3,
          width: '95%',
          mx: 'auto',
        }}
      >
        שאל את הרב
      </Typography>

      {/* פס שחור */}
      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 },
          marginBottom: 10,
        }} 
      />

      {/* קונטיינר צהבהב */}
      <Box
        sx={{
          backgroundColor: lightBgColor,
          borderRadius: '20px',
          width: '85%',
          maxWidth: '950px',
          mx: 'auto',
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 5,
        }}
      >
        {/* הסבר */}
        <Box sx={{ flex: 1 ,  padding: 3,}}>
          <Typography fontWeight={600} fontSize="1.1rem" mb={2}>
            הסבר על שאלות
          </Typography>
          <Typography color="text.secondary" lineHeight={1.7}>
            {EXPLANATION_TEXT}
          </Typography>
        </Box>

        {/* טופס */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '14px',
            p: 3,
             display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* שם + מייל */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                name="fullName"
                label="שם מלא"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="email"
                label="דוא״ל"
                value={formData.email}
                onChange={handleChange}
              />
            </Box>

            {/* בחירת רב */}
            <FormControl fullWidth>
              <InputLabel>בחר רב</InputLabel>
              <Select
                name="selectedRabbi"
                value={formData.selectedRabbi}
                label="בחר רב"
                onChange={handleChange}
              >
                {RABBIS.map(r => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* תוכן שאלה */}
            <TextField
              multiline
              rows={7}
              name="questionContent"
              label="תוכן השאלה"
              value={formData.questionContent}
              onChange={handleChange}
            />

            {/* כפתור */}
            <Button
              type="submit"
              size="large"
              sx={{
                backgroundColor: primaryColor,
                color: '#fff',
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#7a2222',
                },
              }}
            >
              שליחה
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RabbiQuestionForm;
