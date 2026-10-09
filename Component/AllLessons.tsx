
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
  Box, Typography, Paper, IconButton, Checkbox, Tooltip, Select, MenuItem,
  Accordion, AccordionSummary, AccordionDetails, Stack, Skeleton, Button, Drawer,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import LessonPlayer from './LessonPlayer';
import PageHeader from './shared/PageHeader';
import ActionButtons from './shared/ActionButtons';
import { colors, fonts, fontSize, gradients, goldButtonStyle, lessonCard } from '../src/theme/tokens';

const AllLessons = () => {
  const BLUE_TEXT = lessonCard.titleColor;
  const GOLD_TEXT = colors.goldText;
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any[]>>({});
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const [selectedLecturerIds, setSelectedLecturerIds] = useState<(number | string)[]>([]);
  const [selectedMainCatIds, setSelectedMainCatIds] = useState<(number | string)[]>([]);
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<number | string | null>(null);
  const [expandedRabbiIds, setExpandedRabbiIds] = useState<(number | string)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(30);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [allTopics, setAllTopics] = useState<any[]>([]);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBulkDownload = () => {
    const toDownload = lessons.filter(lesson => {
      const id = String(lesson.documentId || lesson.id);
      const attr = lesson.attributes || lesson;
      return selectedIds.includes(id) && attr.AudioFileName;
    });
    toDownload.forEach((lesson, index) => {
      setTimeout(() => {
        const attr = lesson.attributes || lesson;
        const cleanDir = (attr.AudioDir || '').replace(/^\/+|\/+$/g, '');
        const encodedPath = cleanDir.split('/').map((p: string) => encodeURIComponent(p)).join('/');
        const url = `${import.meta.env.VITE_MEDIA_URL}/${encodedPath}/${encodeURIComponent(attr.AudioFileName)}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = attr.title || attr.AudioFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 3000);
    });
  };

  const hasFetched = useRef(false);
  const prevRabbiIdRef = useRef<number | null>(null);
  const prevSearchRef = useRef<string>('');
  const exactCategoryRef = useRef(false); // true רק אחרי "לכל הסדרה" — התאמה מדויקת לקטגוריה
  const prevSeriesKeyRef = useRef<string | undefined>(undefined);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // הגעה מכפתור "חיפוש בשיעורים" בדף הבית — פוקוס אוטומטי בשדה החיפוש
  useEffect(() => {
    if (location.state?.focusSearch) searchInputRef.current?.focus();
  }, [location.state]);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadMoreFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // טעינת שיעור לפי URL param
  useEffect(() => {
    if (!lessonId) {
      setSelectedLesson(null);
      return;
    }
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons?filters[id][$eq]=${lessonId}&populate=rabbi`)
      .then(res => {
        const data = res.data.data[0];
        if (!data) { navigate('/AllLessons', { replace: true }); return; }
        const attr = data.attributes || data;
        setSelectedLesson({
          ...attr,
          id: data.id,
          documentId: data.documentId,
          rabbi: { name: attr.rabbi?.data?.attributes?.name || attr.rabbi?.name || '' }
        });
      })
      .catch(() => navigate('/AllLessons', { replace: true }));
  }, [lessonId]);

  const fetchLessons = async (
    page: number,
    rabbiIds = selectedLecturerIds,
    mainIds = selectedMainCatIds,
    subId = selectedSubCatId,
    query = searchQuery,
    size = pageSize
  ) => {
    try {
      if (page === 1) setLoadingLessons(true);
      else setLoadingMore(true);
      let url = `${import.meta.env.VITE_API_URL}/api/lessons/fast?page=${page}&pageSize=${size}`;
      if (rabbiIds.length > 0) url += `&rabbiId=${rabbiIds.join(',')}`;
      if (mainIds.length > 0) url += `&mainCategoryId=${mainIds.join(',')}`;
      if (subId) url += `&subCategoryId=${subId}`;
      if (exactCategoryRef.current) url += `&exact=1`;
      if (query) url += `&search=${encodeURIComponent(query)}`;

      const response = await axios.get(url);
      const newData = response.data.data || [];
      setLessons(prev => page === 1 ? newData : [...prev, ...newData]);

      const pagination = response.data.meta?.pagination;
      const pageCount = pagination ? pagination.pageCount : 0;
      setTotalCount(pagination?.total || 0);
      setCurrentPage(pagination?.total === 0 ? 0 : page);
      setHasMore(page < pageCount);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      if (page === 1) setLoadingLessons(false);
      else setLoadingMore(false);
    }
  };

  const fetchTree = async (rabbiId: number | string | null) => {
    if (!rabbiId) return;
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/categories-mains?filters[rabbi][id][$eq]=${rabbiId}&pagination[pageSize]=100&populate[subs][populate][parent_sub]=*&populate[subs][populate][child_subs][populate]=*`;
      const { data } = await axios.get(url);
      setCategoriesMap(prev => ({ ...prev, [String(rabbiId)]: data.data }));
    } catch (error) {
      console.error('fetchTree error:', error);
    }
  };

  const fetchLecturers = async () => {
    try {
      setLoadingLecturers(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name&populate[photo_url][fields][0]=url`);
      setLecturers(response.data.data);
      console.log("1", response.data.data);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    } finally {
      setLoadingLecturers(false);
    }
  };

  const fetchAllTopics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?fields[0]=name&sort[0]=name:asc&pagination[pageSize]=100`);
      setAllTopics(response.data.data || []);
    } catch (error) {
      console.error('fetchAllTopics error:', error);
    }
  };

  const sortedRabbis = [...lecturers].sort((a, b) => {
    const valA = a.Priority || 0;
    const valB = b.Priority || 0;
    return valA - valB;
  });

  console.log("Sorted:", sortedRabbis);

  useEffect(() => {
    const incomingRabbiId = location.state?.rabbiId ?? null;
    const initialSearch = location.state?.searchQuery || '';

    const seriesSubId = location.state?.subCategoryId ?? null;
    const seriesMainId = location.state?.mainCategoryId ?? null;

    if ((seriesSubId || seriesMainId) && location.key !== prevSeriesKeyRef.current) {
      // מעבר מדף שיעור — "לכל הסדרה": סינון לפי אותה קטגוריה
      prevSeriesKeyRef.current = location.key;
      exactCategoryRef.current = true;
      const rabbiIds = incomingRabbiId ? [incomingRabbiId] : [];
      const mainIds = seriesSubId ? [] : [seriesMainId];
      setSelectedLecturerIds(rabbiIds);
      setExpandedRabbiIds(rabbiIds);
      setSelectedMainCatIds(mainIds);
      setSelectedSubCatId(seriesSubId);
      setExpandedSubId(seriesSubId);
      setSearchQuery('');
      setCurrentPage(1);
      fetchLessons(1, rabbiIds, mainIds, seriesSubId, '');
      if (incomingRabbiId) fetchTree(incomingRabbiId);
      if (!hasFetched.current) { fetchLecturers(); fetchAllTopics(); hasFetched.current = true; }
      prevRabbiIdRef.current = incomingRabbiId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!hasFetched.current) {
      if (initialSearch) setSearchQuery(initialSearch);
      if (incomingRabbiId) {
        setSelectedLecturerIds([incomingRabbiId]);
        setExpandedRabbiIds([incomingRabbiId]);
        fetchLessons(1, [incomingRabbiId], [], null, initialSearch);
        fetchTree(incomingRabbiId);
      } else {
        fetchLessons(1, [], [], null, initialSearch);
      }
      fetchLecturers();
      fetchAllTopics();
      hasFetched.current = true;
      prevRabbiIdRef.current = incomingRabbiId;
    } else if (incomingRabbiId && incomingRabbiId !== prevRabbiIdRef.current) {
      prevRabbiIdRef.current = incomingRabbiId;
      exactCategoryRef.current = false;
      setSelectedLecturerIds([incomingRabbiId]);
      setExpandedRabbiIds([incomingRabbiId]);
      setSelectedMainCatIds([]);
      setSelectedSubCatId(null);
      setExpandedSubId(null);
      setCurrentPage(1);
      fetchLessons(1, [incomingRabbiId], [], null, '');
      fetchTree(incomingRabbiId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (sidebarRef.current) sidebarRef.current.scrollTop = 0;
    } else if (initialSearch && initialSearch !== prevSearchRef.current) {
      prevSearchRef.current = initialSearch;
      setSearchQuery(initialSearch);
      setCurrentPage(1);
      fetchLessons(1, selectedLecturerIds, selectedMainCatIds, selectedSubCatId, initialSearch);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  useEffect(() => {
    loadMoreFnRef.current = () => {
      if (hasMore && !loadingLessons && !loadingMore) {
        fetchLessons(currentPage + 1, selectedLecturerIds, selectedMainCatIds, selectedSubCatId, searchQuery, pageSize);
      }
    };
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMoreFnRef.current(); },
      { rootMargin: '400px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLecturerClick = (id: number | string) => {
    exactCategoryRef.current = false;
    const newIds = selectedLecturerIds.includes(id)
      ? selectedLecturerIds.filter(x => x !== id)
      : [...selectedLecturerIds, id];
    setSelectedLecturerIds(newIds);
    setSelectedMainCatIds([]);
    setSelectedSubCatId(null);
    setExpandedSubId(null);
    setCurrentPage(1);
    fetchLessons(1, newIds, [], null);
    if (expandedRabbiIds.includes(id)) {
      setExpandedRabbiIds(prev => prev.filter(x => x !== id));
    } else {
      setExpandedRabbiIds(prev => [...prev, id]);
      if (!categoriesMap[String(id)]) fetchTree(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopicClick = (id: number | string) => {
    exactCategoryRef.current = false;
    const newIds = selectedMainCatIds.includes(id)
      ? selectedMainCatIds.filter(x => x !== id)
      : [...selectedMainCatIds, id];
    setSelectedMainCatIds(newIds);
    setSelectedSubCatId(null);
    setExpandedSubId(null);
    setCurrentPage(1);
    fetchLessons(1, selectedLecturerIds, newIds, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilter = () => {
    exactCategoryRef.current = false;
    setSelectedLecturerIds([]);
    setExpandedRabbiIds([]);
    setSelectedMainCatIds([]);
    setSelectedSubCatId(null);
    setExpandedSubId(null);
    setCategoriesMap({});
    setCurrentPage(1);
    fetchLessons(1, [], [], null);
  };

  const SquareIcon = ({ isSelected }: { isSelected: boolean }) => (
    <Box sx={{
      width: 18,
      height: 18,
      border: `1.5px solid ${colors.gold}`,
      borderRadius: '4px',
      bgcolor: isSelected ? colors.wine : 'transparent',
      borderColor: isSelected ? colors.wine : colors.gold,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: '0.2s',
      flexShrink: 0,
    }}>
      {isSelected && <CheckIcon sx={{ fontSize: 14, color: colors.goldLight }} />}
    </Box>
  );

  const getCategoryDisplay = (attr: any) => {
    if (!attr) return "";
    const names: string[] = [];
    const mainName = attr.main_category?.data?.attributes?.name || attr.main_category?.name;
    if (mainName) names.push(mainName);
    const sub = attr.sub_category?.data?.attributes || attr.sub_category;
    const collectSubNames = (s: any) => {
      if (!s) return;
      const parentData = s.parent_sub?.data?.attributes || s.parent_sub;
      if (parentData) collectSubNames(parentData);
      if (s.name) names.push(s.name);
    };
    collectSubNames(sub);
    const uniqueNames = names.filter((name, index) => names.indexOf(name) === index);
    return uniqueNames.length > 0 ? uniqueNames.join(" » ") : "";
  };

  const renderSubCategories = (allSubs: any[], parentId: number | null = null, level = 1) => {
    const currentLevelItems = allSubs.filter((sub: any) => {
      const parent = sub.parent_sub;
      const pId = parent?.id || parent?.data?.id || null;
      if (parentId === null) return pId === null;
      return Number(pId) === Number(parentId);
    }).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'he'));

    if (currentLevelItems.length === 0) return null;

    return (
      <Box sx={{ borderRight: level > 1 ? '1px solid #eee' : 'none', mr: level > 1 ? 2 : 0, pr: 1 }}>
        {currentLevelItems.map((sub: any) => {
          const subId = sub.id;
          const name = sub.name;
          const hasChildren = allSubs.some((x: any) => {
            const childParentId = x.parent_sub?.id || x.parent_sub?.data?.id || null;
            return Number(childParentId) === Number(subId);
          });
          const isSelected = selectedSubCatId === subId;
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
                  exactCategoryRef.current = false;
                  setSelectedSubCatId(subId);
                  if (hasChildren) {
                    setExpandedSubId(expandedSubId === subId ? null : subId);
                  }
                  fetchLessons(1, selectedLecturerIds, selectedMainCatIds, subId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  fontSize: '0.9rem',
                  py: 0.6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: isSelected ? '#9c6644' : colors.ink,
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
              {isOpen && renderSubCategories(allSubs, subId, level + 1)}
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderDedicationCard = () => (
      <Box sx={{
        bgcolor: colors.wine, border: `1px solid ${colors.gold}`, borderRadius: '24px',
        p: 2, textAlign: 'center', flexShrink: 0,
      }}>
        <Typography sx={{
          fontFamily: fonts.heading, fontWeight: 700, fontSize: '18px', mb: 1,
          backgroundImage: gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          הקדשת שיעור
        </Typography>
        <Typography sx={{ color: '#D6B7AE', fontSize: '13px', mb: 2 }}>
          אפשר להקדיש שיעור לעילוי נשמת, לרפואה או להצלחה.
        </Typography>
        <Button
          onClick={() => navigate('/ContactForm')}
          fullWidth
          sx={{
            ...goldButtonStyle, fontWeight: 700,
            borderRadius: '6px', minHeight: '44px', textTransform: 'none',
          }}
        >
          לפרטים
        </Button>
      </Box>
  );

  const renderSidebarContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, px: 0.5 }}>
        <Typography component="h2" sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '20px', color: lessonCard.titleColor, m: 0 }}>
          סינון
        </Typography>
        {selectedLecturerIds.length > 0 && (
          <Box
            component="button"
            type="button"
            onClick={() => { clearFilter(); setMobileFilterOpen(false); }}
            sx={{
              position: 'relative',
              border: 'none', background: 'none', cursor: 'pointer', p: 0,
              fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: GOLD_TEXT,
              '&::after': {
                content: '""', position: 'absolute', left: 0, right: 0, bottom: '-4px',
                height: '2px', borderRadius: '999px', bgcolor: 'currentColor',
              },
              '&:hover': { color: colors.wine },
            }}
          >
            ניקוי
          </Box>
        )}
      </Box>

      <Accordion defaultExpanded elevation={0} sx={{ bgcolor: lessonCard.bg, borderRadius: '12px !important', border: `1px solid ${colors.gold}`, mb: 1.5, flexShrink: 0, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: GOLD_TEXT }} />} sx={{ px: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Typography component="h2" sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '16px', color: lessonCard.titleColor, m: 0 }}>
              הרב המוסר
            </Typography>
            <Box sx={{ width: '30px', height: '2px', bgcolor: colors.gold, mt: 1 }} />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 2 }}>
          {loadingLecturers ? <Skeleton height={30} /> : (
            sortedRabbis.map((item) => (
              <Box key={item.id}>
                <Box
                  onClick={() => { handleLecturerClick(item.id); setMobileFilterOpen(false); }}
                  sx={{ fontFamily: fonts.body, fontSize: '1rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', fontWeight: selectedLecturerIds.includes(item.id) ? 'bold' : 'normal', color: colors.ink }}
                >
                  <SquareIcon isSelected={selectedLecturerIds.includes(item.id)} />
                  {item.attributes?.name || item.name}
                </Box>
                {expandedRabbiIds.includes(item.id) && (categoriesMap[String(item.id)]?.length ?? 0) > 0 && (
                  <Box sx={{ mr: 1, mb: 0.5 }}>
                    {[...(categoriesMap[String(item.id)] || [])].sort((a, b) => {
                      const nameA = a.name || a.attributes?.name || '';
                      const nameB = b.name || b.attributes?.name || '';
                      return nameA.localeCompare(nameB, 'he');
                    }).map((cat: any) => {
                      const data = cat.attributes || cat;
                      const isMainSelected = selectedMainCatIds.includes(cat.id);
                      const allSubs = data.subs?.data || data.subs || [];
                      return (
                        <Box key={cat.id}>
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              exactCategoryRef.current = false;
                              const newIds = isMainSelected
                                ? selectedMainCatIds.filter(x => x !== cat.id)
                                : [...selectedMainCatIds, cat.id];
                              setSelectedMainCatIds(newIds);
                              setSelectedSubCatId(null);
                              setExpandedSubId(null);
                              fetchLessons(1, selectedLecturerIds, newIds, null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            sx={{ fontSize: '1rem', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', color: colors.ink, fontWeight: isMainSelected ? 'bold' : 'normal', fontFamily: fonts.body }}
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
                  </Box>
                )}
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );

  return (
    <Box sx={{ direction: 'rtl', backgroundColor: colors.creamAlt }}>
      {selectedLesson ? (
        <LessonPlayer
          lesson={selectedLesson}
          onBack={() => navigate('/AllLessons')}
          onLessonSelect={(lesson) => { navigate(`/AllLessons/${lesson.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      ) : (
      <>
        <PageHeader
          eyebrow={totalCount > 0 ? `${totalCount.toLocaleString('he-IL')} שיעורים · מתעדכן מדי שבוע` : undefined}
          title="ארכיון השיעורים"
        />
        <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 3 }} sx={{ position: 'relative', display: { xs: 'none', md: 'block' }, order: { md: 2 }, alignSelf: 'stretch' }}>
            <Box ref={sidebarRef} sx={{ position: { md: 'sticky' }, top: { md: '90px' }, maxHeight: { md: 'calc(100vh - 100px)' }, overflowY: { md: 'auto' }, direction: { md: 'ltr' }, pr: { md: 1.5 }, '& > *': { direction: 'rtl' }, scrollbarWidth: 'thin', scrollbarColor: `${colors.gold} transparent`, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: colors.gold, borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { background: colors.wine }, display: { md: 'flex' }, flexDirection: 'column' }}>
              {renderSidebarContent()}
              {renderDedicationCard()}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }} sx={{ order: { md: 1 } }}>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, gap: 1, alignItems: 'center' }}>
              <Button
                onClick={() => setMobileFilterOpen(true)}
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  borderColor: GOLD_TEXT,
                  color: GOLD_TEXT,
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(197,160,89,0.08)', borderColor: GOLD_TEXT },
                }}
              >
                סינון{selectedLecturerIds.length > 0 ? ' (פעיל)' : ''}
              </Button>
              {selectedLecturerIds.length > 0 && (
                <Button
                  onClick={clearFilter}
                  variant="contained"
                  startIcon={<RestartAltIcon />}
                  sx={{ bgcolor: GOLD_TEXT, color: '#fff', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, '&:hover': { bgcolor: '#000', color: GOLD_TEXT } }}
                >
                  נקה
                </Button>
              )}
            </Box>

            <Drawer
              anchor="right"
              open={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{ sx: { width: '280px', direction: 'ltr', p: 2, pr: 1.5, overflowY: 'auto', '& > *': { direction: 'rtl' }, scrollbarWidth: 'thin', scrollbarColor: `${colors.gold} transparent`, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: colors.gold, borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { background: colors.wine } } }}
            >
              {renderSidebarContent()}
              {renderDedicationCard()}
            </Drawer>

            <Box
              sx={{
                mb: 2, maxWidth: '980px', mx: 'auto',
                display: 'flex', flexDirection: 'row', bgcolor: lessonCard.bg,
                borderRadius: '12px', border: `1px solid ${colors.gold}`, overflow: 'hidden',
                height: '50px', boxShadow: '0 2px 10px rgba(44,14,16,.07)',
              }}
            >
              <Box
                component="button"
                type="button"
                aria-label="חיפוש"
                onClick={() => fetchLessons(1, selectedLecturerIds, selectedMainCatIds, selectedSubCatId, searchQuery)}
                sx={{
                  width: '48px', height: '48px', border: 'none', cursor: 'pointer',
                  backgroundImage: gradients.goldButton, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}
              >
                <SearchIcon size={18} strokeWidth={2} color={colors.inkDark} aria-hidden />
              </Box>
              <Box
                component="input"
                type="text"
                ref={searchInputRef}
                placeholder="חיפוש לפי שם שיעור, רב, מסכת או נושא..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                  searchDebounceRef.current = setTimeout(() => {
                    fetchLessons(1, selectedLecturerIds, selectedMainCatIds, selectedSubCatId, val);
                  }, 400);
                }}
                sx={{
                  flex: 1, minWidth: 0, border: 'none', outline: 'none', px: '22px',
                  fontSize: '18px', direction: 'rtl', textAlign: 'right',
                  fontFamily: fonts.body, background: 'transparent', color: colors.ink,
                  '&::placeholder': { color: '#8B8272', opacity: 1 },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: fontSize.sm, color: lessonCard.dateColor }}>
                {totalCount > 0 && `מציג ${Math.min(lessons.length, totalCount).toLocaleString('he-IL')} מתוך ${totalCount.toLocaleString('he-IL')} שיעורים`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Select
                  value="newest"
                  onChange={() => {}}
                  size="small"
                  inputProps={{ 'aria-label': 'מיון' }}
                  IconComponent={ExpandMoreIcon}
                  MenuProps={{
                    PaperProps: { sx: { bgcolor: lessonCard.bg, border: `1px solid ${colors.gold}`, borderRadius: '8px', boxShadow: lessonCard.shadow, mt: 0.5 } },
                    MenuListProps: { sx: { p: 0.5 } },
                  }}
                  sx={{
                    minHeight: '42px', bgcolor: lessonCard.bg, borderRadius: '8px', color: GOLD_TEXT,
                    fontSize: fontSize.sm, fontFamily: fonts.body,
                    '& .MuiOutlinedInput-notchedOutline': { border: `1px solid ${colors.gold}` },
                    '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': { border: `1px solid ${colors.gold}` },
                    '& .MuiSelect-icon': { color: GOLD_TEXT },
                  }}
                >
                  <MenuItem
                    value="newest"
                    sx={{
                      color: GOLD_TEXT, fontSize: fontSize.sm, fontFamily: fonts.body, borderRadius: '6px',
                      '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible, &.Mui-focusVisible': { bgcolor: `${colors.gold}33` },
                      '&:hover': { bgcolor: `${colors.gold}1F` },
                    }}
                  >
                    מיון: החדשים ביותר
                  </MenuItem>
                </Select>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="בחר הכל">
                  <Checkbox
                    size="small"
                    inputProps={{ 'aria-label': 'בחירת כל השיעורים עם קובץ שמע' }}
                    checked={lessons.filter(l => (l.attributes || l).AudioFileName).length > 0 && lessons.filter(l => (l.attributes || l).AudioFileName).every(l => selectedIds.includes(String(l.documentId || l.id)))}
                    indeterminate={selectedIds.length > 0 && !lessons.filter(l => (l.attributes || l).AudioFileName).every(l => selectedIds.includes(String(l.documentId || l.id)))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allAudioIds = lessons.filter(l => (l.attributes || l).AudioFileName).map(l => String(l.documentId || l.id));
                        setSelectedIds(allAudioIds);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    sx={{ color: GOLD_TEXT, '&.Mui-checked': { color: GOLD_TEXT }, '&.MuiCheckbox-indeterminate': { color: GOLD_TEXT }, p: 0.3 }}
                  />
                </Tooltip>
                <Tooltip title={selectedIds.length > 0 ? `הורד ${selectedIds.length} שיעורים נבחרים` : 'הורד נבחרים'}>
                  <IconButton onClick={handleBulkDownload} aria-label="הורדת השיעורים הנבחרים" sx={{ color: GOLD_TEXT, '&:hover': { bgcolor: 'rgba(197,160,89,0.1)' } }}>
                    <FileDownloadOutlinedIcon />
                  </IconButton>
                </Tooltip>
                {selectedIds.length > 0 && (
                  <Typography variant="caption" sx={{ color: GOLD_TEXT, fontWeight: 600 }}>
                    {selectedIds.length} נבחרו
                  </Typography>
                )}
              </Box>
            </Box>

            <Stack spacing={0.5}>
              {loadingLessons ? (
                [1, 2].map(i => <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: '1.5rem' }} />)
              ) : lessons.length > 0 ? (
                lessons.map((lesson) => {
                  const attr = lesson.attributes || lesson;
                  const { title, youtube_id, lesson_date_hebrew, lesson_date_gregorian, rabbi, duration, AudioDir, AudioFileName } = attr;
                  const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "";
                  const hasYoutube = youtube_id && youtube_id.trim() !== "";
                  const rabbiId = rabbi?.data?.id || rabbi?.id;
                  const lecturerData = lecturers.find(l => l.id === rabbiId);
                  const rabbiPhotoPath = lecturerData?.photo_url?.[0]?.url;
                  const thumbnailUrl = hasYoutube
                    ? `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`
                    : rabbiPhotoPath
                      ? (rabbiPhotoPath.startsWith('http') ? rabbiPhotoPath : `${import.meta.env.VITE_API_URL}${rabbiPhotoPath}`)
                      : "/default-rabbi-placeholder.png";
                  const topic = getCategoryDisplay(attr);
                  const isChecked = selectedIds.includes(String(lesson.documentId || lesson.id));
                  return (
                    <Paper
                      component="a"
                      href={`/AllLessons/${lesson.id}`}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        navigate(`/AllLessons/${lesson.id}`);
                      }}
                      key={lesson.id}
                      elevation={0}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                        alignItems: 'center',
                        gap: { xs: '12px', md: '20px' },
                        borderRadius: `${lessonCard.radius}px`,
                        bgcolor: lessonCard.bg,
                        p: 2,
                        border: isChecked ? `1.5px solid ${GOLD_TEXT}` : `1px solid ${lessonCard.border}`,
                        boxShadow: lessonCard.shadow,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <Checkbox
                        size="small"
                        disabled={!AudioFileName}
                        checked={isChecked}
                        inputProps={{ 'aria-label': `בחירת השיעור "${title}" להורדה` }}
                        onChange={(e) => {
                          e.stopPropagation();
                          const id = String(lesson.documentId || lesson.id);
                          setSelectedIds(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          position: 'absolute', top: 8, left: 8, zIndex: 1,
                          color: GOLD_TEXT, '&.Mui-checked': { color: GOLD_TEXT },
                          '&.Mui-disabled': { opacity: 0.3 },
                          p: 0.3, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '4px',
                        }}
                      />

                      <Box sx={{
                        position: 'relative',
                        flex: { xs: '0 0 96px', md: '0 0 190px' },
                        aspectRatio: '16/9',
                        backgroundImage: `url(${thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '8px',
                        bgcolor: '#f5f5f5',
                      }}>
                        {duration && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: lessonCard.durationBadge.bottom, right: lessonCard.durationBadge.right,
                            bgcolor: lessonCard.durationBadge.bg, color: lessonCard.durationBadge.color,
                            border: `1px solid ${lessonCard.durationBadge.border}`,
                            fontSize: `${lessonCard.durationBadge.size}px`, fontWeight: 700, px: '8px', py: '2px',
                            borderRadius: `${lessonCard.durationBadge.radius}px`, lineHeight: 1.5,
                            direction: 'ltr', fontVariantNumeric: 'tabular-nums',
                          }}>
                            {duration}
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', textAlign: 'right', gap: '6px' }}>
                        <Typography sx={{
                          fontFamily: fonts.heading, fontWeight: 700, fontSize: { xs: '15px', md: '20px' },
                          color: lessonCard.titleColor, lineHeight: 1.3,
                          overflow: 'hidden', overflowWrap: 'anywhere',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <Typography sx={{ fontFamily: fonts.body, color: lessonCard.rabbiColor, fontSize: fontSize.sm, fontWeight: 700, flexShrink: 0 }}>
                            {rabbiName && (rabbiName.includes('שליט"א') ? rabbiName : `${rabbiName} שליט"א`)}
                          </Typography>
                          {topic && (
                            <>
                              <Box aria-hidden sx={{ width: '1px', height: '16px', bgcolor: lessonCard.topicChip.border, flexShrink: 0 }} />
                              <Box sx={{
                                bgcolor: lessonCard.topicChip.bg, border: `1px solid ${lessonCard.topicChip.border}`,
                                color: lessonCard.topicChip.textColor, borderRadius: '999px',
                                fontFamily: fonts.body, fontSize: '12px', fontWeight: 700, px: '13px', py: '4px', lineHeight: 1.5,
                              }}>
                                {topic}
                              </Box>
                            </>
                          )}
                          <Box aria-hidden sx={{ width: '1px', height: '16px', bgcolor: lessonCard.topicChip.border, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '13px', color: lessonCard.dateColor }} title={lesson_date_gregorian || undefined}>
                            {lesson_date_hebrew || lesson_date_gregorian}
                          </Typography>
                        </Box>

                      </Box>

                      <Box sx={{ flex: { xs: '1 0 100%', md: 'none' }, alignSelf: 'center', display: 'flex', justifyContent: { xs: 'flex-start', md: 'initial' } }}>
                        <ActionButtons
                          onPlayVideo={hasYoutube ? () => navigate(`/AllLessons/${lesson.id}`) : undefined}
                          onPlayAudio={AudioFileName ? () => navigate(`/AllLessons/${lesson.id}`) : undefined}
                          onDownload={AudioFileName ? () => {
                            const cleanDir = (AudioDir || '').replace(/^\/+|\/+$/g, '');
                            const file = `${cleanDir}/${AudioFileName}`;
                            const params = new URLSearchParams({ key: 'ATERET_DL_2026', file, title: title || AudioFileName });
                            const a = document.createElement('a');
                            a.href = `https://ateretmordechaifiles.com/download.php?${params}`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          } : undefined}
                        />
                      </Box>
                    </Paper>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', borderRadius: '1.5rem', border: `1px dashed ${GOLD_TEXT}` }}>
                  <SearchOffIcon sx={{ fontSize: 60, color: GOLD_TEXT, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ color: BLUE_TEXT, fontWeight: 'bold' }}>לא נמצאו שיעורים</Typography>
                </Box>
              )}
            </Stack>

            {loadingMore && (
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                {[1, 2].map(i => <Skeleton key={i} variant="rectangular" height={110} sx={{ borderRadius: `${lessonCard.radius}px` }} />)}
              </Stack>
            )}
            <Box ref={loaderRef} sx={{ height: '20px', mt: 1 }} />
            {!hasMore && !loadingLessons && !loadingMore && lessons.length > 0 && (
              <Typography sx={{ textAlign: 'center', color: lessonCard.dateColor, fontSize: fontSize.sm, py: 2 }}>
                הגעת לסוף הרשימה
              </Typography>
            )}
          </Grid>
        </Grid>
        </Box>
      </>
      )}
    </Box>
  );
};

export default AllLessons;
