
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box, Typography, Paper, IconButton, Checkbox, Tooltip, Select, MenuItem,
  Accordion, AccordionSummary, AccordionDetails, Stack, Skeleton, Drawer,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import LessonPlayer from './LessonPlayer';
import AppButton from './shared/AppButton';
import PageHeader from './shared/PageHeader';
import ActionButtons from './shared/ActionButtons';
import LessonThumb from './shared/LessonThumb';
import { cardHoverSx } from './shared/cardHover';

const DEFAULT_SORT = 'date:desc';
// שדה מיון + כיוון ברירת מחדל + תיאור הכיוון (לתיאור הכפתור)
const SORT_FIELDS: { value: string; label: string; defaultDir: 'asc' | 'desc'; asc: string; desc: string }[] = [
  { value: 'date', label: 'תאריך', defaultDir: 'desc', asc: 'מהישן לחדש', desc: 'מהחדש לישן' },
  { value: 'title', label: 'שם', defaultDir: 'asc', asc: 'א-ת', desc: 'ת-א' },
  { value: 'duration', label: 'אורך', defaultDir: 'asc', asc: 'מהקצר לארוך', desc: 'מהארוך לקצר' },
  { value: 'topic', label: 'נושא', defaultDir: 'asc', asc: 'א-ת', desc: 'ת-א' },
  { value: 'rabbi', label: 'רב', defaultDir: 'asc', asc: 'א-ת', desc: 'ת-א' },
  { value: 'views', label: 'צפיות', defaultDir: 'desc', asc: 'מהפחות לנצפה ביותר', desc: 'מהנצפה ביותר' },
];

const AllLessons = () => {
  const BLUE_TEXT = 'var(--ink-wine)';
  const GOLD_TEXT = 'var(--gold-text)';
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
  const [, setAllTopics] = useState<any[]>([]);
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
  const [sort, setSort] = useState(DEFAULT_SORT);
  const sortRef = useRef(DEFAULT_SORT);
  const sortField = SORT_FIELDS.find(f => f.value === sort.split(':')[0]) || SORT_FIELDS[0];
  const sortDir = sort.split(':')[1] === 'asc' ? 'asc' : 'desc';
  const applySort = (next: string) => {
    setSort(next);
    sortRef.current = next;
    setCurrentPage(1);
    fetchLessons(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
  const requestIdRef = useRef(0);

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
    // עמוד 1 מתחיל "דור" חדש של תוצאות; תשובות ישנות מדור קודם נזרקות
    const reqId = page === 1 ? ++requestIdRef.current : requestIdRef.current;
    try {
      if (page === 1) { setLoadingLessons(true); setLoadingMore(false); }
      else setLoadingMore(true);
      let url = `${import.meta.env.VITE_API_URL}/api/lessons/fast?page=${page}&pageSize=${size}`;
      if (rabbiIds.length > 0) url += `&rabbiId=${rabbiIds.join(',')}`;
      if (mainIds.length > 0) url += `&mainCategoryId=${mainIds.join(',')}`;
      if (subId) url += `&subCategoryId=${subId}`;
      if (exactCategoryRef.current) url += `&exact=1`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      const [sortBy, sortDir] = sortRef.current.split(':');
      if (sortRef.current !== DEFAULT_SORT) url += `&sortBy=${sortBy}&sortDir=${sortDir}`;

      const response = await axios.get(url);
      if (reqId !== requestIdRef.current) return;
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
      if (reqId === requestIdRef.current) {
        if (page === 1) setLoadingLessons(false);
        else setLoadingMore(false);
      }
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
      // רב של המרחב הקולי בלבד אין לו שיעורים באתר — לא מציגים אותו בסינון
      setLecturers((response.data.data || []).filter((r: any) => !r.phoneOnly));
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

  // observer חדש בכל שינוי ברשימה/מצב טעינה: observe() בודק מיד אם הסוף כבר בתצוגה
  // (אחרת, אם הוא נשאר גלוי אחרי טעינה — למשל בסינון — אין אירוע חדש והטעינה נעצרת)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMoreFnRef.current(); },
      { rootMargin: '400px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [lessons.length, hasMore, loadingLessons, loadingMore, selectedLesson]);

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
      border: `1.5px solid var(--gold)`,
      borderRadius: '4px',
      bgcolor: isSelected ? 'var(--wine)' : 'transparent',
      borderColor: isSelected ? 'var(--wine)' : 'var(--gold)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: '0.2s',
      flexShrink: 0,
    }}>
      {isSelected && <CheckIcon sx={{ fontSize: 14, color: 'var(--gold-light)' }} />}
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
      <Box sx={{ borderRight: level > 1 ? '1px solid var(--rule-soft)' : 'none', mr: level > 1 ? 2 : 0, pr: 1 }}>
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
                  color: isSelected ? 'var(--gold-text)' : 'var(--ink)',
                  fontWeight: isSelected ? '600' : '400',
                  '&:hover': { color: 'var(--gold-text)' },
                }}
              >
                <Box sx={{
                  width: 5, height: 5,
                  bgcolor: isSelected ? 'var(--gold-text)' : 'var(--rule-soft)',
                  borderRadius: '50%', ml: 1.5, flexShrink: 0
                }} />
                <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                  {name}
                  {hasChildren && !isOpen && (
                    <Box component="span" sx={{ mr: 0.8, fontSize: '0.75rem', color: 'var(--muted)' }}>
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
        bgcolor: 'var(--wine)', border: `1px solid var(--gold)`, borderRadius: 'var(--dedication-card-radius)',
        p: 2, textAlign: 'center', flexShrink: 0,
      }}>
        <Typography sx={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--dedication-card-title-size)', mb: 1,
          backgroundImage: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          הקדשת שיעור
        </Typography>
        <Typography sx={{ color: 'var(--dedication-card-sub-color)', fontSize: 'var(--dedication-card-sub-size)', mb: 2 }}>
          אפשר להקדיש שיעור לעילוי נשמת, לרפואה או להצלחה.
        </Typography>
        <AppButton onClick={() => navigate('/ContactForm')} fullWidth>
          לפרטים
        </AppButton>
      </Box>
  );

  const renderSidebarContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, px: 0.5 }}>
        <Typography component="h2" sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--filter-title-size)', color: 'var(--ink-wine)', m: 0 }}>
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
              fontFamily: 'var(--font-body)', fontSize: 'var(--filter-clear-size)', fontWeight: 600, color: GOLD_TEXT,
              '&::after': {
                content: '""', position: 'absolute', left: 0, right: 0, bottom: '-4px',
                height: '2px', borderRadius: '999px', bgcolor: 'currentColor',
              },
              '&:hover': { color: 'var(--wine)' },
            }}
          >
            ניקוי
          </Box>
        )}
      </Box>

      <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'var(--surface)', borderRadius: '12px !important', border: `1px solid var(--gold)`, mb: 1.5, flexShrink: 0, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: GOLD_TEXT }} />} sx={{ px: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Typography component="h2" sx={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--filter-group-title-size)', color: 'var(--ink-wine)', m: 0 }}>
              הרב המוסר
            </Typography>
            <Box sx={{ width: '30px', height: '2px', bgcolor: 'var(--gold)', mt: 1 }} />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 2 }}>
          {loadingLecturers ? <Skeleton height={30} /> : (
            sortedRabbis.map((item) => (
              <Box key={item.id}>
                <Box
                  onClick={() => { handleLecturerClick(item.id); setMobileFilterOpen(false); }}
                  sx={{ fontFamily: 'var(--font-body)', fontSize: 'var(--filter-label-size)', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', fontWeight: selectedLecturerIds.includes(item.id) ? 'bold' : 'normal', color: 'var(--filter-label-color)' }}
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
                            sx={{ fontSize: 'var(--filter-label-size)', py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', color: 'var(--filter-label-color)', fontWeight: isMainSelected ? 'bold' : 'normal', fontFamily: 'var(--font-body)' }}
                          >
                            <SquareIcon isSelected={isMainSelected} />
                            {data.name}
                          </Box>
                          {isMainSelected && (
                            <Box sx={{ borderRight: '2px solid var(--rule-soft)', mr: 1, pr: 0.5 }}>
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
    <Box sx={{ direction: 'rtl', backgroundColor: 'var(--parchment)' }}>
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
            <Box ref={sidebarRef} sx={{ position: { md: 'sticky' }, top: { md: '90px' }, maxHeight: { md: 'calc(100vh - 100px)' }, overflowY: { md: 'auto' }, direction: { md: 'ltr' }, pr: { md: 1.5 }, '& > *': { direction: 'rtl' }, scrollbarWidth: 'thin', scrollbarColor: `var(--gold) transparent`, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'var(--gold)', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { background: 'var(--wine)' }, display: { md: 'flex' }, flexDirection: 'column' }}>
              {renderSidebarContent()}
              {renderDedicationCard()}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }} sx={{ order: { md: 1 } }}>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, gap: 1, alignItems: 'center' }}>
              <AppButton
                variant="outline"
                onClick={() => setMobileFilterOpen(true)}
                startIcon={<FilterListIcon />}
              >
                סינון{selectedLecturerIds.length > 0 ? ' (פעיל)' : ''}
              </AppButton>
              {selectedLecturerIds.length > 0 && (
                <AppButton
                  variant="dark"
                  onClick={clearFilter}
                  startIcon={<RestartAltIcon />}
                >
                  נקה
                </AppButton>
              )}
            </Box>

            <Drawer
              anchor="right"
              open={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{ sx: { width: '280px', direction: 'ltr', p: 2, pr: 1.5, overflowY: 'auto', '& > *': { direction: 'rtl' }, scrollbarWidth: 'thin', scrollbarColor: `var(--gold) transparent`, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'var(--gold)', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { background: 'var(--wine)' } } }}
            >
              {renderSidebarContent()}
              {renderDedicationCard()}
            </Drawer>

            <Box
              sx={{
                mb: 2, maxWidth: '980px', mx: 'auto',
                display: 'flex', flexDirection: 'row', bgcolor: 'var(--surface)',
                borderRadius: '12px', border: `1px solid var(--gold)`, overflow: 'hidden',
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
                  backgroundImage: 'var(--gradient-gold-button)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}
              >
                <SearchIcon size={18} strokeWidth={2} color={'var(--ink-dark)'} aria-hidden />
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
                  fontFamily: 'var(--font-body)', background: 'transparent', color: 'var(--ink)',
                  '&::placeholder': { color: 'var(--search-placeholder-color)', opacity: 1 },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: 'var(--t2)', color: 'var(--muted)' }}>
                {totalCount > 0 && `מציג ${Math.min(lessons.length, totalCount).toLocaleString('he-IL')} מתוך ${totalCount.toLocaleString('he-IL')} שיעורים`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Tooltip title={`כיוון: ${sortField[sortDir]} — לחצי להיפוך`}>
                  <IconButton
                    onClick={() => applySort(`${sortField.value}:${sortDir === 'asc' ? 'desc' : 'asc'}`)}
                    aria-label={`היפוך כיוון המיון, כרגע ${sortField[sortDir]}`}
                    sx={{
                      color: GOLD_TEXT, border: '1px solid var(--gold)', borderRadius: 'var(--btn-radius)',
                      bgcolor: 'var(--surface)', width: 'var(--btn-h)', height: 'var(--btn-h)',
                      '&:hover': { bgcolor: 'color-mix(in srgb, var(--gold) 12%, transparent)' },
                    }}
                  >
                    {sortDir === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Select
                  value={sortField.value}
                  onChange={(e) => {
                    const field = SORT_FIELDS.find(f => f.value === e.target.value);
                    if (field) applySort(`${field.value}:${field.defaultDir}`);
                  }}
                  renderValue={() => `מיון: ${sortField.label} (${sortField[sortDir]})`}
                  size="small"
                  inputProps={{ 'aria-label': 'מיון' }}
                  IconComponent={ExpandMoreIcon}
                  MenuProps={{
                    PaperProps: { sx: { bgcolor: 'var(--surface)', border: `1px solid var(--gold)`, borderRadius: '8px', boxShadow: 'var(--lesson-card-shadow)', mt: 0.5 } },
                    MenuListProps: { sx: { p: 0.5 } },
                  }}
                  sx={{
                    minHeight: 'var(--btn-h)', bgcolor: 'var(--surface)', borderRadius: 'var(--btn-radius)', color: GOLD_TEXT,
                    fontSize: 'var(--t2)', fontFamily: 'var(--font-body)',
                    '& .MuiOutlinedInput-notchedOutline': { border: `1px solid var(--gold)` },
                    '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': { border: `1px solid var(--gold)` },
                    '& .MuiSelect-icon': { color: GOLD_TEXT },
                  }}
                >
                  {SORT_FIELDS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      sx={{
                        color: GOLD_TEXT, fontSize: 'var(--t2)', fontFamily: 'var(--font-body)', borderRadius: '6px',
                        '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible, &.Mui-focusVisible': { bgcolor: `color-mix(in srgb, var(--gold) 20%, transparent)` },
                        '&:hover': { bgcolor: `color-mix(in srgb, var(--gold) 12.157%, transparent)` },
                      }}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
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
                lessons.filter((l) => (l.attributes || l).title?.trim()).map((lesson) => {
                  const attr = lesson.attributes || lesson;
                  const { title, youtube_id, lesson_date_hebrew, lesson_date_gregorian, rabbi, duration, views, AudioDir, AudioFileName } = attr;
                  const rabbiName = rabbi?.data?.attributes?.name || rabbi?.name || "";
                  const hasYoutube = youtube_id && youtube_id.trim() !== "";
                  const rabbiId = rabbi?.data?.id || rabbi?.id;
                  const lecturerData = lecturers.find(l => l.id === rabbiId);
                  const rabbiPhotoPath = lecturerData?.photo_url?.[0]?.url;
                  const thumbnailUrl = hasYoutube
                    ? `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`
                    : rabbiPhotoPath
                      ? (rabbiPhotoPath.startsWith('http') ? rabbiPhotoPath : `${import.meta.env.VITE_API_URL}${rabbiPhotoPath}`)
                      : undefined;
                  const topic = getCategoryDisplay(attr);
                  const isChecked = selectedIds.includes(String(lesson.documentId || lesson.id));
                  return (
                    <Paper
                      component="a"
                      href={`/AllLessons/${lesson.id}`}
                      aria-label={`שיעור: ${title}${rabbiName ? `, ${rabbiName}` : ''}`}
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
                        gap: { xs: '10px', md: '14px' },
                        borderRadius: `var(--lesson-card-radius)`,
                        bgcolor: 'var(--surface)',
                        px: 1.5, py: 1,
                        border: isChecked ? `1.5px solid ${GOLD_TEXT}` : `1px solid var(--gold)`,
                        boxShadow: 'var(--lesson-card-shadow)',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit',
                        ...cardHoverSx,
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
                          flexShrink: 0,
                          color: GOLD_TEXT, '&.Mui-checked': { color: GOLD_TEXT },
                          '&.Mui-disabled': { opacity: 0.3 },
                          p: 0.3, borderRadius: '4px',
                        }}
                      />

                      <LessonThumb
                        src={thumbnailUrl}
                        crownWidth={44}
                        sx={{
                          flex: { xs: '0 0 96px', md: '0 0 130px' },
                          aspectRatio: '16/9',
                          borderRadius: '8px',
                        }}
                      >
                        {duration && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: 'var(--lesson-card-duration-badge-bottom)', right: 'var(--lesson-card-duration-badge-right)',
                            bgcolor: 'var(--wine)', color: 'var(--gold-light)',
                            border: `1px solid var(--lesson-card-duration-badge-border)`,
                            fontSize: `var(--lesson-card-duration-badge-size)`, fontWeight: 700, px: '8px', py: '2px',
                            borderRadius: `var(--lesson-card-duration-badge-radius)`, lineHeight: 1.5,
                            direction: 'ltr', fontVariantNumeric: 'tabular-nums',
                          }}>
                            {duration}
                          </Box>
                        )}
                      </LessonThumb>

                      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', textAlign: 'right', gap: '6px' }}>
                        <Typography sx={{
                          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: { xs: '15px', md: '18px' },
                          color: 'var(--ink-wine)', lineHeight: 1.3,
                          overflow: 'hidden', overflowWrap: 'anywhere',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <Typography sx={{ fontFamily: 'var(--font-body)', color: 'var(--gold-text)', fontSize: 'var(--t2)', fontWeight: 700, flexShrink: 0 }}>
                            {rabbiName && (rabbiName.includes('שליט"א') ? rabbiName : `${rabbiName} שליט"א`)}
                          </Typography>
                          {topic && (
                            <>
                              <Box aria-hidden sx={{ width: '1px', height: '16px', bgcolor: 'var(--gold)', flexShrink: 0 }} />
                              <Box sx={{
                                bgcolor: 'var(--sand)', border: `1px solid var(--gold)`,
                                color: 'var(--wine)', borderRadius: '999px',
                                fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, px: '13px', py: '4px', lineHeight: 1.5,
                              }}>
                                {topic}
                              </Box>
                            </>
                          )}
                          <Box aria-hidden sx={{ width: '1px', height: '16px', bgcolor: 'var(--gold)', flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '13px', color: 'var(--muted)' }} title={lesson_date_gregorian || undefined}>
                            {lesson_date_hebrew || lesson_date_gregorian}
                          </Typography>
                          {Number(views) > 0 && (
                            <>
                              <Box aria-hidden sx={{ width: '1px', height: '16px', bgcolor: 'var(--gold)', flexShrink: 0 }} />
                              <Typography
                                sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}
                                title={`${Number(views).toLocaleString('he-IL')} צפיות`}
                              >
                                <VisibilityOutlinedIcon sx={{ fontSize: 15 }} aria-hidden />
                                {Number(views).toLocaleString('he-IL')}
                              </Typography>
                            </>
                          )}
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
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'var(--surface)', borderRadius: '1.5rem', border: `1px dashed ${GOLD_TEXT}` }}>
                  <SearchOffIcon sx={{ fontSize: 60, color: GOLD_TEXT, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ color: BLUE_TEXT, fontWeight: 'bold' }}>לא נמצאו שיעורים</Typography>
                </Box>
              )}
            </Stack>

            {loadingMore && (
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                {[1, 2].map(i => <Skeleton key={i} variant="rectangular" height={110} sx={{ borderRadius: `var(--lesson-card-radius)` }} />)}
              </Stack>
            )}
            <Box ref={loaderRef} sx={{ height: '20px', mt: 1 }} />
            {!hasMore && !loadingLessons && !loadingMore && lessons.length > 0 && (
              <Typography sx={{ textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--t2)', py: 2 }}>
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
