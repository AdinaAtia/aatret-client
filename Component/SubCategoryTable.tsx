// import React, { useState, useEffect } from 'react';
// import { 
//   TableRow, TableCell, Collapse, Box, Table, TableBody, 
//   Typography, IconButton, Stack, Tooltip, CircularProgress, DialogTitle,
//   DialogContent, Dialog, MenuItem, DialogActions, Button, TextField,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import axios from 'axios';

// const COLORS = {
//   SIDEBAR_BROWN: '#8c6644', 
//   BROWN_DARK: '#9c6644',    
//   BROWN_LIGHT: '#b48a66',   
//   BG_CREAM: '#fdfbe7',
//   TEXT_GRAY: '#5f6368'
// };

// // סטייל לשדות העריכה כפי שביקשת
// const editFieldStyle = {
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '12px',
//     '& fieldset': { borderColor: '#e0e0e0' },
//     '&:hover fieldset': { borderColor: COLORS.BROWN_LIGHT },
//     '&.Mui-focused fieldset': { borderColor: COLORS.SIDEBAR_BROWN },
//   }
// };

// interface SubCategoryTableProps {
//   open: boolean;
//   parentDocId: string;
//   onEditSub: (sub: any) => void;
// }

// const SubCategoryTable = ({ open, parentDocId, onEditSub }: SubCategoryTableProps) => {
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [selectedSub, setSelectedSub] = useState<any>(null);

// // 1. הוסף State לרשימת הקטגוריות הראשיות בתוך הקומפוננטה
// const [mainCategories, setMainCategories] = useState<any[]>([]);

// // 2. פונקציה להבאת הקטגוריות הראשיות (להריץ כשהדיאלוג נפתח)
// const fetchAllMainCategories = async () => {
//   try {
//     const res = await axios.get('http://localhost:1337/api/categories-mains');
//     setMainCategories(res.data.data || []);
//   } catch (error) {
//     console.error("Error fetching main categories:", error);
//   }
// };

// // 3. עדכון handleEditClick שיפעיל גם את הבאת הקטגוריות
// const handleEditClick = (sub: any) => {
//   const attr = sub.attributes || sub;
//   setSelectedSub({
//     documentId: sub.documentId || sub.id,
//     name: attr.name,
//     Priority: attr.Priority,
//     // שומרים את ה-ID של הקטגוריה הראשית הנוכחית
//     parentMainId: attr.main_category?.data?.documentId || attr.main_category?.documentId,
//     lessons: attr.lessons?.data || attr.lessons || []
//   });
//   fetchAllMainCategories(); // טעינת הרשימה לבחירה
//   setOpenEdit(true);
// };

// // 4. עדכון handleUpdateSub שישלח את האבא החדש
// const handleUpdateSub = async () => {
//   try {
//     const payload = {
//       data: {
//         name: selectedSub.name,
//         Priority: Number(selectedSub.Priority),
//         main_category: selectedSub.parentMainId // העדכון של האבא
//       }
//     };

//     await axios.put(
//       `http://localhost:1337/api/categories-subs/${selectedSub.documentId}?status=published`, 
//       payload
//     );

//     setOpenEdit(false);
//     window.location.reload(); 
//   } catch (error) {
//     console.error("שגיאה בעדכון תת קטגוריה:", error);
//   }
// };

//   useEffect(() => {
//     const fetchSubs = async () => {
//       if (!open || !parentDocId) return;
//       try {
//         setLoading(true);
//         const url = `http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${parentDocId}&populate[lessons]=*&populate[main_category][populate][rabbi]=*&sort[0]=Priority:asc`;
//         const response = await axios.get(url);
//         setSubCategories(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching sub-categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubs();
//   }, [open, parentDocId]);

//   return (
//     <>
//       <TableRow>
//         <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ 
//               py: 0.5, 
//               bgcolor: '#fdfdfd', 
//               borderRight: `4px solid ${COLORS.BROWN_LIGHT}`, 
//               width: '100%'
//             }}>
//               {loading ? (
//                 <Stack alignItems="center" py={2}><CircularProgress size={20} /></Stack>
//               ) : (
//                 <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
//                   <TableBody>
//                     {subCategories.map((sub) => {
//                       const attr = sub.attributes || sub;
//                       const lessonCount = Array.isArray(attr.lessons) 
//                         ? attr.lessons.length 
//                         : (attr.lessons?.data?.length || 0);  

//                       return (
//                         <TableRow key={sub.id} sx={{ '& td': { border: 'none' }, '&:hover': { bgcolor: '#f5f5f5' } }}>
//                           <TableCell align="center" sx={{ width: '50px' }}></TableCell>
//                           <TableCell sx={{ textAlign: 'justify' }}>
//                             <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
//                               {attr.name || 'ללא שם'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell sx={{ textAlign: 'center' }}>
//                             <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#999' }}>
//                               {sub.id}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Typography sx={{ fontSize: '0.875rem', color: COLORS.TEXT_GRAY }}>
//                               {attr.main_category?.data?.attributes?.rabbi?.data?.attributes?.name || 
//                                attr.main_category?.rabbi?.name || '—'}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
//                               {lessonCount}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK, fontSize: '0.875rem' }}>
//                               {attr.Priority || 0}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Stack direction="row" justifyContent="center" spacing={1}>
//                               <Tooltip title="עריכה">
//                                 <IconButton size="small" onClick={() => handleEditClick(sub)} sx={{ color: COLORS.SIDEBAR_BROWN }}>
//                                   <EditIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="מחיקה">
//                                 <IconButton size="small" sx={{ color: '#d32f2f' }}>
//                                   <DeleteOutlineIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                               <IconButton size="small" sx={{ visibility: 'hidden' }}>
//                                 <EditIcon fontSize="small" />
//                               </IconButton>
//                             </Stack>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               )}
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>

//       {/* הדיאלוג המעוצב לפי הבקשה שלך */}
//       <Dialog 
//         open={openEdit} 
//         onClose={() => setOpenEdit(false)} 
//         dir="rtl"
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
//       >
//         <DialogTitle sx={{ 
//           fontWeight: 900, 
//           color: COLORS.SIDEBAR_BROWN, 
//           fontSize: '1.5rem',
//           textAlign: 'center',
//           pb: 1
//         }}>
//           עריכת תת קטגוריה
//         </DialogTitle>

//         <DialogContent>
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             <TextField
//               fullWidth
//               label="שם תת הקטגוריה"
//               value={selectedSub?.name || ''}
//               onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, name: e.target.value }))}
//               sx={editFieldStyle}
//             />

//             <TextField
//               select
//               fullWidth
//               value=""
//               SelectProps={{
//                 displayEmpty: true,
//                 renderValue: () => `שיעורי הקטגוריה (${selectedSub?.lessons?.length || 0})`
//               }}
//               sx={editFieldStyle}
//             >
//               {selectedSub?.lessons?.length > 0 ? (
//                 selectedSub.lessons.map((lesson: any) => (
//                   <MenuItem key={lesson.id} value={lesson.id}>
//                     <Typography variant="body2">{lesson.attributes?.title || lesson.title}</Typography>
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem disabled>אין שיעורים משויכים</MenuItem>
//               )}
//             </TextField>

//             <TextField
//               fullWidth
//               label="קדימות"
//               type="number"
//               value={selectedSub?.Priority || 0}
//               onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, Priority: e.target.value }))}
//               sx={editFieldStyle}
//             />
//             <TextField
//   select
//   fullWidth
//   label="שיוך לקטגוריה ראשית"
//   value={selectedSub?.parentMainId || ''}
//   onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, parentMainId: e.target.value }))}
//   sx={editFieldStyle}
// >
//   {mainCategories.map((main) => (
//     <MenuItem key={main.id} value={main.documentId || main.id}>
//       {main.attributes?.name || main.name}
//     </MenuItem>
//   ))}
// </TextField>
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
//           <Button 
//             onClick={() => setOpenEdit(false)} 
//             variant="outlined"
//             sx={{ color: COLORS.TEXT_GRAY, borderColor: COLORS.TEXT_GRAY, borderRadius: '10px' }}
//           >
//             ביטול
//           </Button>
//           <Button 
//             onClick={handleUpdateSub} 
//             variant="contained" 
//             sx={{ 
//               bgcolor: COLORS.SIDEBAR_BROWN, 
//               px: 4,
//               borderRadius: '10px',
//               fontWeight: 'bold',
//               '&:hover': { bgcolor: COLORS.BROWN_DARK } 
//             }}
//           >
//             שמור שינויים
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default SubCategoryTable;
import React, { useState, useEffect } from 'react';
import { 
  TableRow, TableCell, Collapse, Box, Table, TableBody, 
  Typography, IconButton, Stack, Tooltip, CircularProgress, DialogTitle,
  DialogContent, Dialog, MenuItem, DialogActions, Button, TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';

const COLORS = {
  SIDEBAR_BROWN: '#8c6644', 
  BROWN_DARK: '#9c6644',    
  BROWN_LIGHT: '#b48a66',   
  BG_CREAM: '#fdfbe7',
  TEXT_GRAY: '#5f6368'
};

const editFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: COLORS.BROWN_LIGHT },
    '&.Mui-focused fieldset': { borderColor: COLORS.SIDEBAR_BROWN },
  }
};

interface SubCategoryTableProps {
  open: boolean;
  parentDocId: string;
  onEditSub: (sub: any) => void;
}

const SubCategoryTable = ({ open, parentDocId, onEditSub }: SubCategoryTableProps) => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  // --- States לניהול בחירת רב וקטגוריות ---
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [filteredMains, setFilteredMains] = useState<any[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');

  // 1. שליפת רשימת כל הרבנים
  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/rabbis?fields[0]=name');
      setLecturers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
  };
  // 2. שליפת קטגוריות ראשיות לפי הרב שנבחר
  const fetchMainsByLecturer = async (lecturerId: string) => {
    if (!lecturerId) return;
    try {
      const res = await axios.get(`http://localhost:1337/api/categories-mains?filters[rabbi][documentId][$eq]=${lecturerId}`);
      setFilteredMains(res.data.data || []);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  };

  // 3. פתיחת הדיאלוג וטעינת נתוני הפתיחה
  const handleEditClick = (sub: any) => {
    const attr = sub.attributes || sub;
    
    // שליפת הנתונים מה-Populate הקיים
    const currentLecturerId = attr.main_category?.data?.attributes?.rabbi?.data?.documentId || 
                             attr.main_category?.rabbi?.documentId || '';
    const currentMainId = attr.main_category?.data?.documentId || attr.main_category?.documentId || '';

    setSelectedSub({
      documentId: sub.documentId || sub.id,
      name: attr.name,
      Priority: attr.Priority,
      parentMainId: currentMainId,
      lessons: attr.lessons?.data || attr.lessons || []
    });

    setSelectedLecturerId(currentLecturerId);
    
    if (currentLecturerId) {
      fetchMainsByLecturer(currentLecturerId);
    }
    
    setOpenEdit(true);
  };

  // 4. שליחת העדכון לשרת
 const handleUpdateSub = async () => {
  try {
    // 1. עדכון התת-קטגוריה עצמה (מה שכבר עשית)
    const payload = {
      data: {
        name: selectedSub.name,
        Priority: Number(selectedSub.Priority),
        main_category: selectedSub.parentMainId 
      }
    };

    await axios.put(
      `http://localhost:1337/api/categories-subs/${selectedSub.documentId}?status=published`, 
      payload
    );

    // 2. עדכון כל השיעורים ששייכים לתת-הקטגוריה הזו
    // אנחנו עוברים על כל השיעורים שהיו בתת-קטגוריה ומעדכנים להם את ה-main_category
    if (selectedSub.lessons && selectedSub.lessons.length > 0) {
      const updatePromises = selectedSub.lessons.map((lesson: any) => {
        const lessonId = lesson.documentId || lesson.id;
        return axios.put(`http://localhost:1337/api/lessons/${lessonId}`, {
          data: {
            main_category: selectedSub.parentMainId // האבא החדש
          }
        });
      });

      await Promise.all(updatePromises);
    }

    setOpenEdit(false);
    window.location.reload(); 
  } catch (error) {
    console.error("Update error:", error);
  }
};

  useEffect(() => {
    fetchLecturers();
  }, []);

  // טעינת תתי הקטגוריות לטבלה הראשית
  useEffect(() => {
    const fetchSubs = async () => {
      if (!open || !parentDocId) return;
      try {
        setLoading(true);
        const url = `http://localhost:1337/api/categories-subs?filters[main_category][documentId][$eq]=${parentDocId}&populate[lessons]=*&populate[main_category][populate][rabbi]=*&sort[0]=Priority:asc`;
        const response = await axios.get(url);
        setSubCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, [open, parentDocId]);

  return (
    <>
      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 0.5, bgcolor: '#fdfdfd', borderRight: `4px solid ${COLORS.BROWN_LIGHT}`, width: '100%' }}>
              {loading ? (
                <Stack alignItems="center" py={2}><CircularProgress size={20} /></Stack>
              ) : (
                <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableBody>
                    {subCategories.map((sub) => {
                      const attr = sub.attributes || sub;
                      const lessonCount = Array.isArray(attr.lessons) ? attr.lessons.length : (attr.lessons?.data?.length || 0);  
                      return (
                        <TableRow key={sub.id} sx={{ '& td': { border: 'none' }, '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell sx={{ width: '50px' }}></TableCell>
                          <TableCell sx={{ textAlign: 'justify' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{attr.name || 'ללא שם'}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#999' }}>{sub.id}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontSize: '0.875rem', color: COLORS.TEXT_GRAY }}>
                              {attr.main_category?.data?.attributes?.rabbi?.data?.attributes?.name || 
                               attr.main_category?.rabbi?.name || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                             <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{lessonCount}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 800, color: COLORS.BROWN_DARK, fontSize: '0.875rem' }}>{attr.Priority || 0}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" justifyContent="center" spacing={1}>
                              <Tooltip title="עריכה">
                                <IconButton size="small" onClick={() => handleEditClick(sub)} sx={{ color: COLORS.SIDEBAR_BROWN }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="מחיקה">
                                <IconButton size="small" sx={{ color: '#d32f2f' }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* דיאלוג העריכה */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)} 
        dir="rtl"
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: COLORS.SIDEBAR_BROWN, fontSize: '1.5rem', textAlign: 'center', pb: 1 }}>
          עריכת תת קטגוריה
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="שם תת הקטגוריה"
              value={selectedSub?.name || ''}
              onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, name: e.target.value }))}
              sx={editFieldStyle}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ color: COLORS.SIDEBAR_BROWN, fontWeight: 'bold', mb: 1 }}>
                שיוך היררכי:
              </Typography>
              <Stack spacing={2}>
                {/* שלב 1: בחירת רב */}
                <TextField
                  select
                  fullWidth
                  label="1. בחר רב"
                  value={selectedLecturerId || ''}
                  onChange={(e) => {
                    const rabbiId = e.target.value;
                    setSelectedLecturerId(rabbiId);
                    fetchMainsByLecturer(rabbiId); // טעינת הקטגוריות של הרב הספציפי
                    setSelectedSub((prev: any) => ({ ...prev, parentMainId: '' })); // איפוס קטגוריה קודמת
                  }}
                  sx={editFieldStyle}
                >
                  {lecturers.map((lec) => (
                    <MenuItem key={lec.id} value={lec.documentId || lec.id}>
                      {lec.attributes?.name || lec.name}
                    </MenuItem>
                  ))}
                </TextField>

                {/* שלב 2: בחירת קטגוריה ראשית (מסונן) */}
                <TextField
                  select
                  fullWidth
                  label="2. שיוך לקטגוריה ראשית"
                  disabled={!selectedLecturerId}
                  value={selectedSub?.parentMainId || ''}
                  onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, parentMainId: e.target.value }))}
                  sx={editFieldStyle}
                  helperText={!selectedLecturerId ? "יש לבחור רב תחילה" : ""}
                >
                  {filteredMains.map((main) => (
                    <MenuItem key={main.id} value={main.documentId || main.id}>
                      {main.attributes?.name || main.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>

            <TextField
              fullWidth
              label="קדימות בתצוגה"
              type="number"
              value={selectedSub?.Priority || 0}
              onChange={(e) => setSelectedSub((prev: any) => ({ ...prev, Priority: e.target.value }))}
              sx={editFieldStyle}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ borderRadius: '10px', color: COLORS.TEXT_GRAY }}>
            ביטול
          </Button>
          <Button 
            onClick={handleUpdateSub} 
            variant="contained" 
            disabled={!selectedSub?.parentMainId}
            sx={{ bgcolor: COLORS.SIDEBAR_BROWN, px: 4, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: COLORS.BROWN_DARK } }}
          >
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubCategoryTable;