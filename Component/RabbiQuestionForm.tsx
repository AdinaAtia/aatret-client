
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
  useTheme, // שימוש ב-useTheme לצורך גישה לסרגלי מרווחים
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

// נתונים קבועים
const RABBIS = [
  { value: 'rav-a', label: 'הרב הראשי' },
  { value: 'rav-b', label: 'הרב אלישיב' },
  { value: 'rav-c', label: 'הרב כהן' },
];

const EXPLANATION_TEXT = 
  'לשם איסופם הולם דלור סטיס אמט, קונסקטטור אדיפיסינג אלית קליטם מוביטס ארכום פלורטס, מודרן ועדתמכס. ומחליף קובידס לטיחוסן בלוקי קולר מחויב לדעת. לאנשי שש בלאק, מנסומו בלבולי כנף מברר, בטנחפזן בקלמטה שרצהמה ברור. להתאמת פונט וטקסט.';


const RabbiQuestionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        selectedRabbi: '',
        questionContent: '',
    });

    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('טופס נשלח:', formData);
    };

    // הגדרת מרווח אחיד (שוות ערך ל-MUI spacing 3)
    const formItemSpacing = theme.spacing(3); 
    // מרווח פנימי בין האלמנטים בשורה (שוות ערך ל-MUI spacing 2)
    const innerSpacing = theme.spacing(2); 

    // הגדרת הצבע הראשי של הכפתור לפי התמונה
    const primaryColor = '#922b2b';
    // רקע אפור בהיר לשדות הקלט ולבלוק ההסבר
    const lightBgColor = '#f9f9f9';


    return (
        <Box 
            component="main"
            sx={{ 
                direction: 'rtl',
                paddingY: 5,
                maxWidth: '1000px',
                margin: '0 auto',
                px: { xs: 2, sm: 3, md: 4 },
                // שינוי הרקע הכללי אם נדרש (כאן שומרים על רקע ברירת מחדל של Body/Theme)
            }}
        >
            {/* כותרת ראשית - "שאל את הרב" */}
            <Typography 
                variant="h3" 
                component="h1" 
                textAlign="center" 
                fontWeight={700}
                sx={{ 
                    marginBottom: 6, 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } 
                }}
            >
                שאל את הרב
            </Typography>

            {/* קונטיינר לבן ראשי לטופס ולהסבר */}
            <Box 
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '15px',
                    padding: { xs: 3, sm: 5 },
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: theme.spacing(4), // מרווח בין בלוק הטופס לבלוק ההסבר
                }}
            >
                
                {/* בלוק הסבר (שמאל) */}
                <Box 
                    sx={{ 
                        flex: 1, 
                        padding: 3,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px', 
                        backgroundColor: lightBgColor, // רקע אפור בהיר
                        order: { xs: 1, md: 2 } // בהתאם לתמונה: הסבר בצד ימין (Order 1 במובייל) או שמאל (Order 2 בדסקטופ)
                    }}
                >
                    <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        marginBottom={2}
                        textAlign="right"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                    >
                        הסבר על שאלות
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="textSecondary"
                        textAlign="right"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                        {EXPLANATION_TEXT}
                    </Typography>
                </Box>

                {/* בלוק שאלות (טופס - ימין) */}
                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ 
                        flex: 1, 
                        order: { xs: 2, md: 1 } // הטופס בצד שמאל (Order 2 במובייל) או ימין (Order 1 בדסקטופ)
                    }}
                >
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: formItemSpacing, // מרווח בין רכיבי הטופס
                        }}
                    >
                        
                        {/* 1. שדות שם ואימייל - Flexbox לשורה דו-עמודתית */}
                        <Box 
                            sx={{ 
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: innerSpacing, // מרווח קטן יותר בין השדות
                            }}
                        > 
                            {/* שם מלא */}
                            <TextField
                                sx={{ 
                                    flex: 1, // תופס חצי רוחב בשורה
                                    // במובייל (xs), חייב מרווח תחתון בתוך הטור
                                    mb: { xs: innerSpacing, sm: 0 }, 
                                    '& .MuiOutlinedInput-root': { backgroundColor: lightBgColor } 
                                }}
                                fullWidth
                                variant="outlined"
                                name="fullName"
                                label="שם מלא"
                                value={formData.fullName}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                            
                            {/* דוא"ל */}
                            <TextField
                                sx={{ 
                                    flex: 1, // תופס חצי רוחב בשורה
                                    '& .MuiOutlinedInput-root': { backgroundColor: lightBgColor } 
                                }}
                                fullWidth
                                variant="outlined"
                                name="email"
                                label="דוא''ל"
                                value={formData.email}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        {/* 2. בחירת רב - שורה מלאה */}
                        <FormControl 
                            fullWidth 
                            variant="outlined" 
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: lightBgColor,
                                },
                            }}
                        >
                            <InputLabel 
                                shrink 
                                htmlFor="selectedRabbi"
                                sx={{ 
                                    backgroundColor: 'white', 
                                    paddingLeft: '5px', 
                                    paddingRight: 0,
                                }}
                            >
                                בחר רב
                            </InputLabel>
                            <Select
                                id="selectedRabbi"
                                name="selectedRabbi"
                                value={formData.selectedRabbi}
                                onChange={handleChange}
                                displayEmpty 
                                sx={{ textAlign: 'right' }}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <Typography color="textSecondary" variant="body1">בחר רב</Typography>;
                                    }
                                    const selectedRabbi = RABBIS.find(r => r.value === selected);
                                    return selectedRabbi ? selectedRabbi.label : '';
                                }}
                            >
                                {RABBIS.map((rabbi) => (
                                    <MenuItem key={rabbi.value} value={rabbi.value} sx={{ direction: 'rtl' }}>
                                        {rabbi.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 3. תוכן השאלה (TextArea) - שורה מלאה */}
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            variant="outlined"
                            name="questionContent"
                            label="תוכן השאלה"
                            value={formData.questionContent}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: lightBgColor,
                                }
                            }}
                        />

                        {/* 4. כפתור שליחה */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large"
                            sx={{
                                backgroundColor: primaryColor, 
                                color: 'white',
                                paddingY: '12px',
                                fontSize: '1.2rem',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#7a2222', // גוון כהה יותר בריחוף
                                }
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