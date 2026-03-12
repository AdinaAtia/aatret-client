
import{ useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { 
  Box, Typography, Paper, IconButton, 
  Accordion, AccordionSummary, AccordionDetails, Stack, Skeleton, Button 
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
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
  const [categories, setCategories] = useState<any[]>([]); 
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | string | null>(null);
  const [selectedMainCatId, setSelectedMainCatId] = useState<number | string | null>(null);
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<number | string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 30;

  const hasFetched = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const fetchLessons = async (page: number, rabbiId = selectedLecturerId, mainId = selectedMainCatId, subId = selectedSubCatId) => {
    try {
      setLoadingLessons(true);
     let url = `http://localhost:1337/api/lessons?` + 
          `populate[rabbi][populate]=photo_url` + // מביא את הרב + התמונה שלו
                   // מביא את תת הקטגוריה
          `&sort[0]=lesson_date_gregorian:desc` + 
          `&pagination[page]=${page}` + 
          `&pagination[pageSize]=${pageSize}`;
      if (rabbiId) url += `&filters[rabbi][id][$eq]=${rabbiId}`;
      if (mainId) url += `&filters[main_category][id][$eq]=${mainId}`;
      if (subId) url += `&filters[sub_category][id][$eq]=${subId}`;
      
      const response = await axios.get(url);
      setLessons(response.data.data || []);
      console.log(response.data.data);
      
      const pagination = response.data.meta?.pagination;
      setTotalPages(pagination ? pagination.pageCount : 0);
      setCurrentPage(pagination?.total === 0 ? 0 : page);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };
const fetchTree = async (rabbiId: number | string | null) => {
  if (!rabbiId) {
    setCategories([]);
    return;
  }

  try {
const url = `http://localhost:1337/api/categories-mains?filters[rabbi][id][$eq]=${rabbiId}&pagination[pageSize]=100&populate[subs][populate][parent_sub]=*&populate[subs][populate][child_subs][populate]=*`;   const { data } = await axios.get(url);

    setCategories(data.data);
    console.log("csghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",data.data);
    
  } catch (error) {
    console.error('fetchTree error:', error);
  }
};





  const fetchLecturers = async () => {
    try {
      setLoadingLecturers(true);
      const response = await axios.get('http://localhost:1337/api/rabbis?fields[0]=name');
      setLecturers(response.data.data );
            console.log("1",response.data.data);

    } catch (error) {
      console.error("Error fetching lecturers:", error);
    } finally {
      setLoadingLecturers(false);
    }
  };
const sortedRabbis = [...lecturers].sort((a, b) => {
  // שימוש ב-Priority עם P גדולה
  const valA = a.Priority || 0; 
  const valB = b.Priority || 0;
  return valA - valB;
});

console.log("Sorted:", sortedRabbis);

  useEffect(() => {
    if (!hasFetched.current) {
      const initialRabbiId = location.state?.rabbiId;
      if (initialRabbiId) {
        setSelectedLecturerId(initialRabbiId);
        fetchLessons(1, initialRabbiId);
        fetchTree(initialRabbiId);
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
    setSelectedMainCatId(null);
    setSelectedSubCatId(null);
    setExpandedSubId(null);
    setCurrentPage(1); 
    fetchLessons(1, newId, null, null);
    fetchTree(newId);
  };

  const clearFilter = () => {
    setSelectedLecturerId(null);
    setSelectedMainCatId(null);
    setSelectedSubCatId(null);
    setExpandedSubId(null);
    setCategories([]);
    setCurrentPage(1);
    fetchLessons(1, null, null, null);
  };

  const SquareIcon = ({ isSelected }: { isSelected: boolean }) => (
    <Box sx={{ width: 9, height: 9, border: '1px solid #b0b0b0', borderRadius: '1px', bgcolor: isSelected ? '#9c6644': 'transparent', flexShrink: 0 }} />
  );
const renderSubCategories = (allSubs: any[], parentId: number | null = null, level = 1) => {
  // סינון הפריטים לרמה הנוכחית
  const currentLevelItems = allSubs.filter((sub: any) => {
    const parent = sub.parent_sub;
    const pId = parent?.id || parent?.data?.id || null;

    if (parentId === null) return pId === null;
    return Number(pId) === Number(parentId);
  });

  if (currentLevelItems.length === 0) return null;

  return (
    <Box sx={{ borderRight: level > 1 ? '1px solid #eee' : 'none', mr: level > 1 ? 2 : 0, pr: 1 }}>
      {currentLevelItems.map((sub: any) => {
        const subId = sub.id;
        const name = sub.name;

        // בדיקה האם יש ילדים בתוך המערך הכללי
        const hasChildren = allSubs.some((x: any) => {
          const childParentId = x.parent_sub?.id || x.parent_sub?.data?.id || null;
          return Number(childParentId) === Number(subId);
        });

        const isSelected = selectedSubCatId === subId;
        
        // כאן הקסם: האם הפריט הנוכחי הוא אבא של הפריט המורחב? 
        // זה מאפשר לעץ להישאר פתוח גם כשלוחצים על הילדים
        const isChildExpanded = allSubs.some(x => 
            x.id === expandedSubId && 
            (x.parent_sub?.id === subId || x.parent_sub?.data?.id === subId)
        );
        const isOpen = expandedSubId === subId || isChildExpanded;

        return (
          <Box key={subId}>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSubCatId(subId);
                // לחיצה על פריט עם ילדים תפתח/תסגור אותו
                if (hasChildren) {
                  setExpandedSubId(expandedSubId === subId ? null : subId);
                }
                fetchLessons(1, selectedLecturerId, selectedMainCatId, subId);
              }}
              sx={{
                fontSize: '0.85rem',
                py: 0.6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: isSelected ? '#9c6644' : '#555',
                fontWeight: isSelected ? '600' : '400',
                '&:hover': { color: '#9c6644' },
              }}
            >
              <Box sx={{ 
                width: 5, height: 5, 
                bgcolor: isSelected ? '#9c6644' : '#ccc', 
                borderRadius: '50%', ml: 1.5, flexShrink: 0 
              }} />
              <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                {name}
                {hasChildren && !isOpen && (
                  <Box component="span" sx={{ mr: 0.8, fontSize: '0.75rem', color: '#bdbdbd' }}>
                    (+)
                  </Box>
                )}
              </Typography>
            </Box>

            {/* רקורסיה: מציגים את הילדים רק אם האבא פתוח */}
            {isOpen && renderSubCategories(allSubs, subId, level + 1)}
          </Box>
        );
      })}
    </Box>
  );
};
  return (
    <Box sx={{ direction: 'rtl', maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 }, backgroundColor: '#fff' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* צד שמאל - סינון */}
          <Box sx={{ p: 1, bgcolor: '#fdfbe6', borderRadius: '1.25rem', border: '1px solid #f0edcf' }}>
            {selectedLecturerId && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button onClick={clearFilter} variant="contained" startIcon={<RestartAltIcon />} 
                  sx={{ bgcolor:'#9c6644', color: '#fff', borderRadius: '50px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold' }}>
                  נקה סינון
                </Button>
              </Box>
            )}

            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">הרב המוסר</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {loadingLecturers ? <Skeleton height={30} /> : (
                  sortedRabbis.map((item) => (
                    <Box key={item.id} onClick={() => handleLecturerClick(item.id)}
                      sx={{ fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', fontWeight: selectedLecturerId === item.id ? 'bold' : 'normal', color: '#9c6644' }}
                    >
                      <SquareIcon isSelected={selectedLecturerId === item.id} />
                      {item.attributes?.name || item.name}
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>

            {selectedLecturerId && categories.length > 0 && (
              <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'white', borderRadius: '0.8rem !important', border: '1px solid #e0e0e0', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">נושאי השיעור</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {categories.map((cat: any) => {
    const data = cat.attributes || cat;
    const isMainSelected = selectedMainCatId === cat.id;

    // במקום subs, נשתמש ב-child_subs
const allSubs = data.subs?.data || data.subs || [];
 console.log('Child subs:', allSubs);

    // מסננים תתי קטגוריות ללא אב
const directSubs = allSubs.filter((s: any) => !s.parent_sub);


                    return (
                      <Box key={cat.id}>
                        <Box onClick={() => {
                            const newId = isMainSelected ? null : cat.id;
                            setSelectedMainCatId(newId);
                            setSelectedSubCatId(null);
                            setExpandedSubId(null);
                            fetchLessons(1, selectedLecturerId, newId, null);
                          }}
                          sx={{ fontSize: '0.85rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', color: isMainSelected ? '#9c6644' : '#555', fontWeight: isMainSelected ? 'bold' : 'normal' }}
                        >
                          <SquareIcon isSelected={isMainSelected} />
                          {data.name}
                        </Box>
                        
                  {isMainSelected && (
  <Box sx={{ borderRight: '2px solid #eee', mr: 1, pr: 0.5 }}>
    {renderSubCategories(allSubs, null)}
  </Box>
)}

                      </Box>
                    );
                  })}
              </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {/* צד ימין - שיעורים */}
          <Stack spacing={3}>
            {loadingLessons ? (
               [1, 2].map(i => <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: '1.5rem' }} />)
            ) : lessons.length > 0 ? (
              lessons.map((lesson) => {
                const attr = lesson.attributes || lesson;
                const { title, youtube_id, lesson_date_gregorian, lesson_date_hebrew, rabbi, duration } = attr;
                const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "הרב מרדכי עטייה";
console.log(rabbi);
const STRAPI_URL = "http://localhost:1337";

  // חילוץ הנתיב לפי המבנה ששלחת: rabbi -> photo_url[0] -> url
  const photoPath = rabbi?.photo_url?.[0]?.url;

  // בניית ה-URL המלא של תמונת הרב
  const rabbiPhotoUrl = photoPath 
    ? (photoPath.startsWith('http') ? photoPath : `${STRAPI_URL}${photoPath}`)
    : "/default-rabbi-placeholder.png";

  // קביעת ה-Thumbnail הסופי
  const hasYoutube = youtube_id && youtube_id.trim() !== "";
  const thumbnailUrl = hasYoutube 
    ? `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg` 
    : rabbiPhotoUrl;
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
                          <Stack direction="row" alignItems="center" gap={1}><AccessTimeIcon sx={{ fontSize: 18, color: '#000' }} /><Typography fontSize="0.9rem" fontWeight="600">{duration || "00:00"}</Typography></Stack>
                          <Stack direction="row" alignItems="center" gap={1}><CalendarTodayIcon sx={{ fontSize: 18 }} /><Typography fontSize="0.9rem" fontWeight="600">{lesson_date_gregorian}</Typography></Stack>
                          <Stack direction="row" alignItems="center" gap={1}><CalendarTodayIcon sx={{ fontSize: 18 }} /><Typography fontSize="0.9rem" fontWeight="600">{lesson_date_hebrew}</Typography></Stack>
                        </Stack>
                        <Stack direction="row" gap={1.5}>
                          <IconButton onClick={() => onLessonSelect(attr)} sx={{ bgcolor: '#9c6644', color: '#fff', borderRadius: '0.6rem', width: 44, height: 44 }}><PlayCircleOutlineIcon /></IconButton>
                          <IconButton sx={{ bgcolor: '#9c6644', color: '#fff', borderRadius: '0.6rem', width: 44, height: 44 }}><FileDownloadOutlinedIcon /></IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </Paper>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fdfbe6', borderRadius: '1.5rem', border: '1px dashed #9c6644' }}>
                <SearchOffIcon sx={{ fontSize: 60, color: '#9c6644', opacity: 0.5 }} />
                <Typography variant="h6" sx={{ color: '#9c6644', fontWeight: 'bold' }}>לא נמצאו שיעורים</Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllLessons;
