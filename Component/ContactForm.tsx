import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useTheme } from '@mui/material';

const EXPLANATION_TEXT = 
  'לכן הסבר על פניות: לכל שאלה שיש לך, אפשר למלא את הטופס ונחזור אליך בהקדם האפשרי. אנא הקפידי למלא את כל השדות הדרושים.';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('טופס נשלח:', formData);
  };

  const primaryColor = '#000'; // שחור
  const lightBgColor = '#f9f9e0'; // רקע בהיר צהבהב

  return (
    <Box
      component="main"
      sx={{
        direction: 'rtl',
        paddingY: 6,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* כותרת */}
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        fontWeight={700}
        sx={{ marginBottom: 5,width: '95%',
          mx: 'auto', }}
      >
        צור קשר
      </Typography>

      {/* קו הפרדה רוחב מלא */}
      <Box 
        sx={{ 
          borderBottom: '3px solid black', 
          width: '100%',
          marginTop: { xs: 5, md: 8 },
          marginBottom: 10,
        }} 
      />

      {/* קונטיינר מרכזי לטופס והסבר */}
      <Box
        sx={{
          maxWidth: '950px', // רוחב מוגבל
          margin: '0 auto',  // ממורכז
          backgroundColor: lightBgColor,
          borderRadius: '20px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: theme.spacing(4),
          padding: { xs: 3, md: 5 },
                    width: '85%',
        }}
      >
    

        {/* טופס בצד שמאל */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '14px',
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
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

          <TextField
            fullWidth
            // variant="outlined"
            name="subject"
            label="נושא"
            value={formData.subject}
            onChange={handleChange}
            // InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            multiline
            rows={7}
            // variant="outlined"
            name="message"
            label="תוכן הפנייה"
            value={formData.message}
            onChange={handleChange}
            // InputLabelProps={{ shrink: true }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: primaryColor,
              color: 'white',
              paddingY: '12px',
              fontSize: '1.1rem',
              borderRadius: '6px',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            שליחה
          </Button>
        </Box>
            {/* הסבר בצד ימין */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} marginBottom={2}>
            הסבר על פניות
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
            {EXPLANATION_TEXT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactForm;
