// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom"; // הוספתי רק את זה
// import Grid from '@mui/material/Grid'; 
// import { 
//   Box, Typography, Card, CardMedia, CardContent, 
//   Button, TextField, Checkbox, 
//   FormControlLabel, FormGroup, CircularProgress, Chip 
// } from '@mui/material';

// const FullBooksPage = () => {
//   const navigate = useNavigate(); // הגדרתי את הניווט כאן
//   const [books, setBooks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const MAIN_BROWN = '#9c6644';
//   const STRAPI_BASE_URL = 'http://localhost:1337';

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate=*`);
//         if (response.data?.data) {
//           setBooks(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, []);

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ p: { xs: 2, md: 10 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      
//       <Box sx={{ textAlign: 'center', mb: 10 }}>
//         <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'serif', mb: 1 }}>ספרים</Typography>
//         <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>הסבר קצר על חנות הספרים</Typography>
//       </Box>

//       {/* חזרה ל-Grid container המקורי שלך */}
//       <Grid container spacing={8}>
        
//         <Grid size={{ xs: 12, md: 3 }}>
//           <Box sx={{ 
//             p: 4, 
//             borderRadius: '24px', 
//             backgroundColor: '#fdfbe7', 
//             border: '1px solid #f0f0f0',
//             position: 'sticky',
//             top: '20px'
//           }}>
//             <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>סינון ספרים</Typography>
//             <TextField fullWidth label="ספרי ראש הישיבה" select sx={{ mb: 3 }} size="small" />
//             <TextField fullWidth label="חיפוש לפי מחבר" sx={{ mb: 3 }} size="small" />
//             <Typography sx={{ mt: 2, mb: 2, fontWeight: 800, fontSize: '0.9rem' }}>פרשות שבוע</Typography>
//             <FormGroup>
//               {['בראשית', 'נח', 'לך לך', 'וירא'].map((parsha) => (
//                 <FormControlLabel 
//                   key={parsha} 
//                   control={<Checkbox size="small" sx={{ color: MAIN_BROWN }} />} 
//                   label={<Typography sx={{ fontSize: '0.9rem' }}>{parsha}</Typography>} 
//                 />
//               ))}
//             </FormGroup>
//           </Box>
//         </Grid>

//         <Grid size={{ xs: 12, md: 9 }}>
//           <Grid container columnSpacing={6} rowSpacing={12}>
//             {books.map((book: any) => (
//               <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Card 
//                   elevation={0} 
//                   sx={{ 
//                     backgroundColor: '#fdfbe7', 
//                     borderRadius: '2.5rem', 
//                     p: 3, pt: 4, pb: 8,
//                     textAlign: 'center',
//                     position: 'relative',
//                     overflow: 'visible',
//                     maxWidth: '250px', 
//                     width: '100%',
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center'
//                   }}
//                 >
//                   <Chip 
//                     label="עטרת מרדכי" 
//                     size="small"
//                     sx={{ 
//                       position: 'absolute', top: 20, right: 20,
//                       backgroundColor: 'rgba(156, 102, 68, 0.08)', color: MAIN_BROWN, fontWeight: 700, fontSize: '0.65rem'
//                     }} 
//                   />

//                   <Box sx={{ width: '100%', height: '160px', mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
//                     <CardMedia
//                       component="img"
//                       image={book.image?.[0]?.url ? `${STRAPI_BASE_URL}${book.image[0].url}` : ''}
//                       sx={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.1))' }}
//                     />
//                   </Box>

//                   <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
//                     <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>
//                       {book.book_name}
//                     </Typography>
//                     <Typography sx={{ fontSize: '0.85rem', opacity: 0.6 }}>
//                       {book.rabbi}
//                     </Typography>
//                   </CardContent>
                  
//                   <Button 
//                     variant="contained" 
//                     onClick={() => navigate('/BookDetailsPage', { state: { book: book } })}
//                     sx={{ 
//                       backgroundColor: MAIN_BROWN, 
//                       borderRadius: '12px', px: 5,
//                       position: 'absolute', bottom: '-22px', 
//                       left: '50%', transform: 'translateX(-50%)',
//                       boxShadow: '0 8px 16px rgba(156, 102, 68, 0.3)',
//                       fontWeight: 700,
//                       '&:hover': { backgroundColor: '#7d5236' } 
//                     }}
//                   >
//                     לפרטים
//                   </Button>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default FullBooksPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import Grid from '@mui/material/Grid'; 
// import { 
//   Box, Typography, Card, CardMedia, CardContent, 
//   Button, TextField, Checkbox, 
//   FormControlLabel, FormGroup, CircularProgress, Chip 
// } from '@mui/material';

// const FullBooksPage = () => {
//   const navigate = useNavigate();
//   const [books, setBooks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // State לניהול החיפוש
//   const [searchTerm, setSearchTerm] = useState('');

//   const MAIN_BROWN = '#9c6644';
//   const STRAPI_BASE_URL = 'http://localhost:1337';

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate=*`);
//         if (response.data?.data) {
//           setBooks(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, []);

//   // לוגיקת הסינון בזמן אמת לפי שם המחבר
//   const filteredBooks = books.filter((book) => 
//     (book.rabbi || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ p: { xs: 2, md: 10 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      
//       <Box sx={{ textAlign: 'center', mb: 10 }}>
//         <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'serif', mb: 1 }}>ספרים</Typography>
//         <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>הסבר קצר על חנות הספרים</Typography>
//       </Box>

//       {/* שמירה על Grid container המקורי שלך */}
//       <Grid container spacing={8}>
        
//         <Grid size={{ xs: 12, md: 3 }}>
//           <Box sx={{ 
//             p: 4, 
//             borderRadius: '24px', 
//             backgroundColor: '#fdfbe7', 
//             border: '1px solid #f0f0f0',
//             position: 'sticky',
//             top: '20px'
//           }}>
//             <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>סינון ספרים</Typography>
//             <TextField fullWidth label="ספרי ראש הישיבה" select sx={{ mb: 3 }} size="small" />
            
//             {/* שדה חיפוש מעודכן: צבע חום ולוגיקת onChange */}
//             <TextField 
//               fullWidth 
//               label="חיפוש לפי מחבר" 
//               sx={{ 
//                 mb: 3,
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': { borderColor: MAIN_BROWN },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': { color: MAIN_BROWN },
//               }} 
//               size="small" 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <Typography sx={{ mt: 2, mb: 2, fontWeight: 800, fontSize: '0.9rem' }}>פרשות שבוע</Typography>
//             <FormGroup>
//               {['בראשית', 'נח', 'לך לך', 'וירא'].map((parsha) => (
//                 <FormControlLabel 
//                   key={parsha} 
//                   control={<Checkbox size="small" sx={{ color: MAIN_BROWN, '&.Mui-checked': { color: MAIN_BROWN } }} />} 
//                   label={<Typography sx={{ fontSize: '0.9rem' }}>{parsha}</Typography>} 
//                 />
//               ))}
//             </FormGroup>
//           </Box>
//         </Grid>

//         <Grid size={{ xs: 12, md: 9 }}>
//           <Grid container columnSpacing={6} rowSpacing={12}>
//             {/* מעבר על הרשימה המסוננת במקום הרשימה המלאה */}
//             {filteredBooks.map((book: any) => (
//               <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id} sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Card 
//                   elevation={0} 
//                   sx={{ 
//                     backgroundColor: '#fdfbe7', 
//                     borderRadius: '2.5rem', 
//                     p: 3, pt: 4, pb: 8,
//                     textAlign: 'center',
//                     position: 'relative',
//                     overflow: 'visible',
//                     maxWidth: '250px', 
//                     width: '100%',
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center'
//                   }}
//                 >
//                   <Chip 
//                     label="עטרת מרדכי" 
//                     size="small"
//                     sx={{ 
//                       position: 'absolute', top: 20, right: 20,
//                       backgroundColor: 'rgba(156, 102, 68, 0.08)', color: MAIN_BROWN, fontWeight: 700, fontSize: '0.65rem'
//                     }} 
//                   />

//                   <Box sx={{ width: '100%', height: '160px', mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
//                     <CardMedia
//                       component="img"
//                       image={book.image?.[0]?.url ? `${STRAPI_BASE_URL}${book.image[0].url}` : ''}
//                       sx={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.1))' }}
//                     />
//                   </Box>

//                   <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
//                     <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>
//                       {book.book_name}
//                     </Typography>
//                     <Typography sx={{ fontSize: '0.85rem', opacity: 0.6 }}>
//                       {book.rabbi}
//                     </Typography>
//                   </CardContent>
                  
//                   <Button 
//                     variant="contained" 
//                     onClick={() => navigate('/BookDetailsPage', { state: { book: book } })}
//                     sx={{ 
//                       backgroundColor: MAIN_BROWN, 
//                       borderRadius: '12px', px: 5,
//                       position: 'absolute', bottom: '-22px', 
//                       left: '50%', transform: 'translateX(-50%)',
//                       boxShadow: '0 8px 16px rgba(156, 102, 68, 0.3)',
//                       fontWeight: 700,
//                       '&:hover': { backgroundColor: '#7d5236' } 
//                     }}
//                   >
//                     לפרטים
//                   </Button>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default FullBooksPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import Grid from '@mui/material/Grid'; 
// import { 
//   Box, Typography, Card, CardMedia, CardContent, 
//   Button, TextField, Checkbox, 
//   FormControlLabel, FormGroup, CircularProgress, Chip, MenuItem
// } from '@mui/material';

// const FullBooksPage = () => {
//   const navigate = useNavigate();
//   const [books, setBooks] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(true);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('הכל');

//   const MAIN_BROWN = '#9c6644';
//   const STRAPI_BASE_URL = 'http://localhost:1337';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // שליפת הספרים עם ה-Relation של הקטגוריה
//         const booksRes = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate=*`);
//         if (booksRes.data?.data) {
//           setBooks(booksRes.data.data);
//         }
        
//         // שליפת הקטגוריות מטבלת book-categories
//         const categoriesRes = await axios.get(`${STRAPI_BASE_URL}/api/book-categories`);
//         if (categoriesRes.data?.data) {
//           setCategories(categoriesRes.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredBooks = books.filter((book: any) => {
//     const item = book.attributes || book;
    
//     // חיפוש לפי מחבר
//     const matchesAuthor = (item.rabbi || "").toLowerCase().includes(searchTerm.toLowerCase());
    
//     // סינון לפי קטגוריה - גישה לפי המבנה של Strapi (book_categorie -> data -> attributes -> name)
//     const bookCatName = item.book_categorie?.data?.attributes?.name;
//     const matchesCategory = selectedCategory === 'הכל' || bookCatName === selectedCategory;

//     return matchesAuthor && matchesCategory;
//   });

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ p: { xs: 2, md: 10 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      
//       <Box sx={{ textAlign: 'center', mb: 10 }}>
//         <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'serif', mb: 1 }}>ספרים</Typography>
//         <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>הסבר קצר על חנות הספרים</Typography>
//       </Box>

//       <Grid container spacing={8}>
        
//         <Grid size={{ xs: 12, md: 3 }}>
//           <Box sx={{ 
//             p: 4, 
//             borderRadius: '24px', 
//             backgroundColor: '#fdfbe7', 
//             border: '1px solid #f0f0f0',
//             position: 'sticky',
//             top: '20px'
//           }}>
//             <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>סינון ספרים</Typography>
            
//             <TextField 
//               fullWidth 
//               label="ספרי ראש הישיבה" 
//               select 
//               sx={{ 
//                 mb: 3,
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': { borderColor: MAIN_BROWN },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': { color: MAIN_BROWN },
//               }} 
//               size="small"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <MenuItem value="הכל">הכל</MenuItem>
//               {categories.map((cat: any) => {
//                 const name = cat.attributes?.name || cat.name;
//                 return (
//                   <MenuItem key={cat.id} value={name}>{name}</MenuItem>
//                 );
//               })}
//             </TextField>
            
//             <TextField 
//               fullWidth 
//               label="חיפוש לפי מחבר" 
//               sx={{ 
//                 mb: 3,
//                 '& .MuiOutlinedInput-root': {
//                   '&.Mui-focused fieldset': { borderColor: MAIN_BROWN },
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': { color: MAIN_BROWN },
//               }} 
//               size="small" 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <Typography sx={{ mt: 2, mb: 2, fontWeight: 800, fontSize: '0.9rem' }}>פרשות שבוע</Typography>
//             <FormGroup>
//               {['בראשית', 'נח', 'לך לך', 'וירא'].map((parsha) => (
//                 <FormControlLabel 
//                   key={parsha} 
//                   control={<Checkbox size="small" sx={{ color: MAIN_BROWN, '&.Mui-checked': { color: MAIN_BROWN } }} />} 
//                   label={<Typography sx={{ fontSize: '0.9rem' }}>{parsha}</Typography>} 
//                 />
//               ))}
//             </FormGroup>
//           </Box>
//         </Grid>

//         <Grid size={{ xs: 12, md: 9 }}>
//           <Grid container columnSpacing={6} rowSpacing={12}>
//             {filteredBooks.map((book: any) => {
//               const item = book.attributes || book;
//               // נתיב התמונה המקורי שלך
//               const imageUrl = item.image?.[0]?.url || item.image?.data?.[0]?.attributes?.url || '';
              
//               return (
//                 <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id} sx={{ display: 'flex', justifyContent: 'center' }}>
//                   <Card 
//                     elevation={0} 
//                     sx={{ 
//                       backgroundColor: '#fdfbe7', 
//                       borderRadius: '2.5rem', 
//                       p: 3, pt: 4, pb: 8,
//                       textAlign: 'center',
//                       position: 'relative',
//                       overflow: 'visible',
//                       maxWidth: '250px', 
//                       width: '100%',
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <Chip 
//                       label="עטרת מרדכי" 
//                       size="small"
//                       sx={{ 
//                         position: 'absolute', top: 20, right: 20,
//                         backgroundColor: 'rgba(156, 102, 68, 0.08)', color: MAIN_BROWN, fontWeight: 700, fontSize: '0.65rem'
//                       }} 
//                     />

//                     <Box sx={{ width: '100%', height: '160px', mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
//                       <CardMedia
//                         component="img"
//                         image={imageUrl ? `${STRAPI_BASE_URL}${imageUrl}` : ''}
//                         sx={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.1))' }}
//                       />
//                     </Box>

//                     <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
//                       <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>
//                         {item.book_name}
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.85rem', opacity: 0.6 }}>
//                         {item.rabbi}
//                       </Typography>
//                     </CardContent>
                    
//                     <Button 
//                       variant="contained" 
//                       onClick={() => navigate('/BookDetailsPage', { state: { book: book } })}
//                       sx={{ 
//                         backgroundColor: MAIN_BROWN, 
//                         borderRadius: '12px', px: 5,
//                         position: 'absolute', bottom: '-22px', 
//                         left: '50%', transform: 'translateX(-50%)',
//                         boxShadow: '0 8px 16px rgba(156, 102, 68, 0.3)',
//                         fontWeight: 700,
//                         '&:hover': { backgroundColor: '#7d5236' } 
//                       }}
//                     >
//                       לפרטים
//                     </Button>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default FullBooksPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import Grid from '@mui/material/Grid'; 
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import SearchOffIcon from '@mui/icons-material/SearchOff';
// import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import { 
//   Box, Typography, Card, CardMedia, CardContent, 
//   Button, TextField, Checkbox, 
//   FormControlLabel, FormGroup, CircularProgress, Chip, MenuItem,
//   Accordion,
//   AccordionSummary,
  
//   AccordionDetails
// } from '@mui/material';

// const FullBooksPage = () => {
//   const navigate = useNavigate();
//   const [books, setBooks] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(true);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('הכל');
//     const MAIN_BROWN = '#9c6644';
// const SquareIcon = ({ isSelected }: { isSelected: boolean }) => (
//   <Box
//     sx={{
//       width: 12,
//       height: 12,
//       border: '2px solid #9c6644',
//       borderRadius: '3px',
//       backgroundColor: isSelected ? '#9c6644' : 'transparent',
//       transition: 'all 0.2s ease',
//       flexShrink: 0
//     }}
//   />
// );
// const commonFieldStyle = {
//   mb: 3,
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': { borderColor: 'rgba(156, 102, 68, 0.3)' }, // חום עדין
//     '&.Mui-focused fieldset': { borderColor: MAIN_BROWN },     // מונע כחול - הופך לחום בפוקוס
//   },
//   '& .MuiInputLabel-root.Mui-focused': { color: MAIN_BROWN },  // טקסט תווית חום
//   '& .MuiSvgIcon-root': { color: MAIN_BROWN },                 // חץ של ה-Select חום
// };
//   const STRAPI_BASE_URL = 'http://localhost:1337';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // שליפת הספרים עם populate עמוק יותר
//         const booksRes = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate[book_categorie][populate]=*&populate[image][populate]=*`);
//         if (booksRes.data?.data) {
//           setBooks(booksRes.data.data);
//         }
        
//         // שליפת הקטגוריות
//         const categoriesRes = await axios.get(`${STRAPI_BASE_URL}/api/book-categories`);
//         if (categoriesRes.data?.data) {
//           setCategories(categoriesRes.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredBooks = books.filter((book: any) => {
//     const item = book.attributes || book;
    
//     // סינון לפי מחבר
//     const matchesAuthor = (item.rabbi || "").toLowerCase().includes(searchTerm.toLowerCase());
    
//     // חילוץ שם הקטגוריה - בדיקה של כל האופציות האפשריות מ-Strapi
//     const bookCatName = 
//       item.book_categorie?.data?.attributes?.name || 
//       item.book_categorie?.name || 
//       item.book_categorie?.data?.name;
    
//     // אם בחרנו "הכל", אל תסנן. אם בחרנו קטגוריה, תשווה לשם שחילצנו
//     const matchesCategory = selectedCategory === 'הכל' || bookCatName === selectedCategory;

//     return matchesAuthor && matchesCategory;
//   });

//   if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ p: { xs: 2, md: 10 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      
//       <Box sx={{ textAlign: 'center', mb: 10 }}>
//         <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'serif', mb: 1 }}>ספרים</Typography>
//         <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>הסבר קצר על חנות הספרים</Typography>
//       </Box>

// <Grid size={{ xs: 12, md: 3 }}>
//   <Box sx={{ 
//     p: 1, // צמצום הפדינג שיהיה עדין כמו הראשון
//     bgcolor: '#fdfbe6', 
//     borderRadius: '1.25rem', 
//     border: '1px solid #f0edcf',
//     position: 'sticky',
//     top: '20px'
//   }}>
    
//     {/* כותרת ראשית של הסינון */}
//     <Typography variant="h6" sx={{ p: 1.5, pb: 0.5, fontWeight: 'bold', fontSize: '1.1rem', color: '#9c6644' }}>
//       סינון ספרים
//     </Typography>

//     {/* כפתור נקה סינון - מופיע רק אם נבחרה קטגוריה או הוקלד חיפוש */}
//     {(selectedCategory !== "הכל" || searchTerm) && (
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, px: 1 }}>
//         <Button 
//           onClick={() => { setSelectedCategory("הכל"); setSearchTerm(""); }}
//           variant="contained"
//           startIcon={<RestartAltIcon sx={{ fontSize: '1.1rem !important' }} />} 
//           sx={{ 
//             bgcolor:'#9c6644', color: '#fff', borderRadius: '50px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold',
//             '&:hover': { bgcolor: '#8b5a3c' }, textTransform: 'none', gap: 0.5
//           }}
//         >
//           נקה סינון
//         </Button>
//       </Box>
//     )}

//     {/* אקורדיון קטגוריות ספרים */}
//     <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', mb: 1, '&:before': { display: 'none' } }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography fontSize="1rem" fontWeight="bold">ספרי ראש הישיבה</Typography>
//       </AccordionSummary>
//       <AccordionDetails sx={{ pt: 0 }}>
//         {/* אופציית "הכל" */}
//         <Typography 
//           onClick={() => setSelectedCategory("הכל")}
//           sx={{ 
//             fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
//             fontWeight: selectedCategory === "הכל" ? 'bold' : 'normal',
//             color: '#9c6644',
//           }}
//         >
//           <SquareIcon isSelected={selectedCategory === "הכל"} />
//           הכל
//         </Typography>

//         {/* רשימת הקטגוריות מה-API */}
//         {categories.map((cat: any) => {
//           const name = cat.attributes?.name || cat.name;
//           const isSelected = selectedCategory === name;
//           return (
//             <Typography 
//               key={cat.id} 
//               onClick={() => setSelectedCategory(name)}
//               sx={{ 
//                 fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
//                 fontWeight: isSelected ? 'bold' : 'normal',
//                 color: '#9c6644',
//               }}
//             >
//               <SquareIcon isSelected={isSelected} />
//               {name}
//             </Typography>
//           );
//         })}
//       </AccordionDetails>
//     </Accordion>

//     {/* אקורדיון חיפוש חופשי (במקום TextField) */}
//     <Accordion elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography fontSize="1rem" fontWeight="bold">חיפוש לפי שם</Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         <TextField 
//           fullWidth 
//           placeholder="הקלד שם מחבר או ספר..." 
//           size="small" 
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ 
//             '& .MuiOutlinedInput-root': { borderRadius: '10px' },
//             '& .MuiInputBase-input': { fontSize: '0.85rem' }
//           }}
//         />
//       </AccordionDetails>
//     </Accordion>

//   </Box>
// </Grid>

//         <Grid size={{ xs: 12, md: 9 }}>
//           <Grid container columnSpacing={6} rowSpacing={12}>
//             {filteredBooks.map((book: any) => {
//               const item = book.attributes || book;
//               const imageUrl = item.image?.[0]?.url || item.image?.data?.[0]?.attributes?.url || '';
              
//               return (
//                 <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id} sx={{ display: 'flex', justifyContent: 'center' }}>
//                   <Card 
//                     elevation={0} 
//                     sx={{ 
//                       backgroundColor: '#fdfbe7', 
//                       borderRadius: '2.5rem', 
//                       p: 3, pt: 4, pb: 8,
//                       textAlign: 'center',
//                       position: 'relative',
//                       overflow: 'visible',
//                       maxWidth: '250px', 
//                       width: '100%',
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center'
//                     }}
//                   >
//                     <Chip 
//                       label="עטרת מרדכי" 
//                       size="small"
//                       sx={{ 
//                         position: 'absolute', top: 20, right: 20,
//                         backgroundColor: 'rgba(156, 102, 68, 0.08)', color: MAIN_BROWN, fontWeight: 700, fontSize: '0.65rem'
//                       }} 
//                     />

//                     <Box sx={{ width: '100%', height: '160px', mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
//                       <CardMedia
//                         component="img"
//                         image={imageUrl ? `${STRAPI_BASE_URL}${imageUrl}` : ''}
//                         sx={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.1))' }}
//                       />
//                     </Box>

//                     <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
//                       <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>
//                         {item.book_name}
//                       </Typography>
//                       <Typography sx={{ fontSize: '0.85rem', opacity: 0.6 }}>
//                         {item.rabbi}
//                       </Typography>
//                     </CardContent>
                    
//                     <Button 
//                       variant="contained" 
//                       onClick={() => navigate('/BookDetailsPage', { state: { book: book } })}
//                       sx={{ 
//                         backgroundColor: MAIN_BROWN, 
//                         borderRadius: '12px', px: 5,
//                         position: 'absolute', bottom: '-22px', 
//                         left: '50%', transform: 'translateX(-50%)',
//                         boxShadow: '0 8px 16px rgba(156, 102, 68, 0.3)',
//                         fontWeight: 700,
//                         '&:hover': { backgroundColor: '#7d5236' } 
//                       }}
//                     >
//                       לפרטים
//                     </Button>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default FullBooksPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { 
  Box, Typography, Card, CardMedia, CardContent, 
  Button, TextField, CircularProgress, Chip,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';

// רכיב הריבוע לסינון
const SquareIcon = ({ isSelected }: { isSelected: boolean }) => (
  <Box
    sx={{
      width: 12,
      height: 12,
      border: '2px solid #9c6644',
      borderRadius: '3px',
      backgroundColor: isSelected ? '#9c6644' : 'transparent',
      transition: 'all 0.2s ease',
      flexShrink: 0
    }}
  />
);

const FullBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const MAIN_BROWN = '#9c6644';
  const STRAPI_BASE_URL = 'http://localhost:1337';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await axios.get(`${STRAPI_BASE_URL}/api/rabbi-books?populate[book_categorie][populate]=*&populate[image][populate]=*`);
        if (booksRes.data?.data) setBooks(booksRes.data.data);
        const categoriesRes = await axios.get(`${STRAPI_BASE_URL}/api/book-categories`);
        if (categoriesRes.data?.data) setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter((book: any) => {
    const item = book.attributes || book;
    const matchesSearch = (item.rabbi || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.book_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const bookCatName = item.book_categorie?.data?.attributes?.name || item.book_categorie?.name;
    const matchesCategory = selectedCategory === 'הכל' || bookCatName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 10 }, direction: 'rtl', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'serif', mb: 1 }}>ספרים</Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>הסבר קצר על חנות הספרים</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* סרגל צדי */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ p: 1, bgcolor: '#fdfbe6', borderRadius: '1.25rem', border: '1px solid #f0edcf', position: 'sticky', top: '20px' }}>
            <Typography variant="h6" sx={{ p: 1.5, pb: 0.5, fontWeight: 'bold', fontSize: '1.1rem', color: MAIN_BROWN }}>סינון ספרים</Typography>

            {(selectedCategory !== "הכל" || searchTerm) && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, px: 1 }}>
                <Button 
                  onClick={() => { setSelectedCategory("הכל"); setSearchTerm(""); }}
                  variant="contained"
                  startIcon={<RestartAltIcon sx={{ fontSize: '1.1rem !important' }} />} 
                  sx={{ bgcolor: MAIN_BROWN, color: '#fff', borderRadius: '50px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', '&:hover': { bgcolor: '#8b5a3c' }, textTransform: 'none' }}
                >
                  נקה סינון
                </Button>
              </Box>
            )}

            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', mb: 1, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontSize="1rem" fontWeight="bold">ספרי ראש הישיבה</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography 
                  onClick={() => setSelectedCategory("הכל")}
                  sx={{ fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', fontWeight: selectedCategory === "הכל" ? 'bold' : 'normal', color: MAIN_BROWN }}
                >
                  <SquareIcon isSelected={selectedCategory === "הכל"} /> הכל
                </Typography>
                {categories.map((cat: any) => {
                  const name = cat.attributes?.name || cat.name;
                  return (
                    <Typography 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(name)}
                      sx={{ fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', fontWeight: selectedCategory === name ? 'bold' : 'normal', color: MAIN_BROWN }}
                    >
                      <SquareIcon isSelected={selectedCategory === name} /> {name}
                    </Typography>
                  );
                })}
              </AccordionDetails>
            </Accordion>

            <Accordion elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontSize="1rem" fontWeight="bold">חיפוש לפי שם</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField fullWidth placeholder="חיפוש..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* הצגת הספרים - העיצוב המקורי שלך */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container columnSpacing={6} rowSpacing={12}>
            {filteredBooks.map((book: any) => {
              const item = book.attributes || book;
              const imageUrl = item.image?.data?.[0]?.attributes?.url || item.image?.[0]?.url || '';
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      backgroundColor: '#fdfbe7', borderRadius: '2.5rem', p: 3, pt: 4, pb: 8, textAlign: 'center', position: 'relative', overflow: 'visible', maxWidth: '250px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' 
                    }}
                  >
                    <Chip label="עטרת מרדכי" size="small" sx={{ position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(156, 102, 68, 0.08)', color: MAIN_BROWN, fontWeight: 700, fontSize: '0.65rem' }} />
                    <Box sx={{ width: '100%', height: '160px', mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <CardMedia component="img" image={imageUrl ? `${STRAPI_BASE_URL}${imageUrl}` : ''} sx={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.1))' }} />
                    </Box>
                    <CardContent sx={{ p: 0, textAlign: 'center', flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>{item.book_name}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', opacity: 0.6 }}>{item.rabbi}</Typography>
                    </CardContent>
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/BookDetailsPage', { state: { book } })}
                      sx={{ backgroundColor: MAIN_BROWN, borderRadius: '12px', px: 5, position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 8px 16px rgba(156, 102, 68, 0.3)', fontWeight: 700, '&:hover': { backgroundColor: '#7d5236' } }}
                    >
                      לפרטים
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FullBooksPage;