
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { 
  Box, Typography, Paper, IconButton, 
  Accordion, AccordionSummary, AccordionDetails, Stack, Skeleton, Button 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // שימוש ב-Grid2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
interface AllLessonsProps {
  onLessonSelect: (lessons: any) => void;
}
const AllLessons = ({ onLessonSelect }: AllLessonsProps) => {
  const location = useLocation();
  const [lessons, setLessons] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 30;

  const hasFetched = useRef(false);
console.log(lessons[0]);
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'auto' });
}, []);

  const fetchLessons = async (page: number, rabbiId: number | string | null = null) => {
    try {
      setLoadingLessons(true);
      let url = `http://localhost:1337/api/lessons?populate=*&sort=lesson_date_gregorian:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      
      if (rabbiId) {
        url += `&filters[rabbi][id][$eq]=${rabbiId}`;
      }
      
      const response = await axios.get(url);
      setLessons(response.data.data || []);
      
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      
      if (pagination?.total === 0) {
        setCurrentPage(0);
      } else {
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
    
  };

  const fetchLecturers = async () => {
    try {
      setLoadingLecturers(true);
      const response = await axios.get('http://localhost:1337/api/rabbis?fields[0]=name');
      setLecturers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    } finally {
      setLoadingLecturers(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      const initialRabbiId = location.state?.rabbiId;
      if (initialRabbiId) {
        setSelectedLecturerId(initialRabbiId);
        fetchLessons(1, initialRabbiId);
      } else {
        fetchLessons(1);
      }
      fetchLecturers();
      hasFetched.current = true;
    }
  }, [location.state]);

  const handleLecturerClick = (id: number | string) => {
    const newId = selectedLecturerId === id ? null : id;
    setSelectedLecturerId(newId);
    setCurrentPage(1); 
    fetchLessons(1, newId);
  };

  const clearFilter = () => {
    setSelectedLecturerId(null);
    setCurrentPage(1);
    fetchLessons(1, null);
  };

  const handlePageChange = (newPage: number) => {
    fetchLessons(newPage, selectedLecturerId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SquareIcon = ({ isSelected }: { isSelected: boolean }) => (
    <Box sx={{ width: 9, height: 9, border: '1px solid #b0b0b0', borderRadius: '1px', bgcolor: isSelected ? '#9c6644': 'transparent', flexShrink: 0 }} />
  );

  return (
    <Box sx={{ direction: 'rtl', maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 }, backgroundColor: '#fff' }}>
      <Grid container spacing={3}>
        
        {/* סרגל צדי */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ p: 1, bgcolor: '#fdfbe6', borderRadius: '1.25rem', border: '1px solid #f0edcf' }}>
            
            {/* כפתור נקה סינון */}
            {selectedLecturerId && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button 
                  onClick={clearFilter}
                  variant="contained"
                  startIcon={<RestartAltIcon sx={{ fontSize: '1.1rem !important' }} />} 
                  sx={{ 
                    bgcolor:'#9c6644', color: '#fff', borderRadius: '50px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold',
                    '&:hover': { bgcolor: '#8b5a3c' }, textTransform: 'none', gap: 0.5
                  }}
                >
                  נקה סינון
                </Button>
              </Box>
            )}

            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', mb: 1, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontSize="1rem" fontWeight="bold">הרב המוסר</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {loadingLecturers ? <Skeleton height={30} /> : (
                  lecturers.map((item) => (
                    <Typography 
                      key={item.id} 
                      onClick={() => handleLecturerClick(item.id)}
                      sx={{ 
                        fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                        fontWeight: selectedLecturerId === item.id ? 'bold' : 'normal',
                        color: '#9c6644',
                      }}
                    >
                      <SquareIcon isSelected={selectedLecturerId === item.id} />
                      {item.attributes?.name || item.name}
                    </Typography>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* רשימת שיעורים */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={3}>
            {loadingLessons ? (
               [1, 2].map(i => <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: '1.5rem' }} />)
            ) : lessons.length > 0 ? (
              lessons.map((lesson) => {
                const attributes = lesson.attributes || lesson;
                const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi,duration } = attributes;
                const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "הרב מרדכי עטייה";
                const thumbnailUrl = `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`;

                return (
                  <Paper key={lesson.id} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: '1.5rem', bgcolor: '#fdfbe6', p: 3, gap: 3, border: '1px solid #f0edcf' }}>
                    <Box sx={{ width: { xs: '100%', md: '17.5rem' }, height: '12.5rem', backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '1.1rem', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'right', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: '700', fontSize: '1.4rem', mb: 0.5 }}>{title}</Typography>
                        <Typography sx={{ fontWeight: '500', fontSize: '1.1rem', mb: 2 }}>{rabbiName}</Typography>
                      </Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Stack direction="row" gap={3}>
<Stack direction="row" alignItems="center" gap={1}>
  <AccessTimeIcon sx={{ fontSize: 18, color: '#000' }} />
  <Typography fontSize="0.9rem" fontWeight="600">
    {duration || "00:00"} 
  </Typography>
</Stack>                          <Stack direction="row" alignItems="center" gap={1}><CalendarTodayIcon sx={{ fontSize: 18 }} /><Typography fontSize="0.9rem" fontWeight="600">{lesson_date_gregorian}</Typography></Stack>
                          <Stack direction="row" alignItems="center" gap={1}><CalendarTodayIcon sx={{ fontSize: 18 }} /><Typography fontSize="0.9rem" fontWeight="600">{lesson_date_hebrew}</Typography></Stack>
                        </Stack>
                        <Stack direction="row" gap={1.5}>
                          <IconButton  onClick={() => onLessonSelect(attributes)} sx={{ bgcolor: '#9c6644', color: '#fff', borderRadius: '0.6rem', width: 44, height: 44 }}><PlayCircleOutlineIcon /></IconButton>
                          <IconButton sx={{ bgcolor: '#9c6644', color: '#fff', borderRadius: '0.6rem', width: 44, height: 44 }}><FileDownloadOutlinedIcon /></IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </Paper>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fdfbe6', borderRadius: '1.5rem', border: '1px dashed #9c6644', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <SearchOffIcon sx={{ fontSize: 60, color: '#9c6644', opacity: 0.5 }} />
                <Typography variant="h6" sx={{ color: '#9c6644', fontWeight: 'bold' }}>לא נמצאו שיעורים</Typography>
                <Button onClick={clearFilter} sx={{ color: '#9c6644', textDecoration: 'underline' }}>חזור לכל השיעורים</Button>
              </Box>
            )}

            {/* דפדוף */}
            {totalPages > 1 && (
              <Stack direction="row" justifyContent="center" alignItems="center" gap={3} sx={{ mt: 4, mb: 4 }}>
                <Button 
                  variant="outlined" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}
                  sx={{ borderRadius: '1rem', px: 4, py: 1, borderColor: '#9c6644', color: '#9c6644', fontWeight: 'bold' }}
                >
                  הקודם
                </Button>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>עמוד {currentPage} מתוך {totalPages}</Typography>
                <Button 
                  variant="outlined" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}
                  sx={{ borderRadius: '1rem', px: 4, py: 1, borderColor: '#9c6644', color: '#9c6644', fontWeight: 'bold' }}
                >
                  הבא
                </Button>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllLessons;