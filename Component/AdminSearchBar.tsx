import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Stack, Button, Typography, CircularProgress, Autocomplete, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
interface AdminSearchBarProps {
  type: 'lessons' | 'categories';
  onResults: (items: any[], rabbiDocId?: string) => void;
  onClear: () => void;
}

const AdminSearchBar = ({ type, onResults, onClear }: AdminSearchBarProps) => {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [rabbiSelectValue, setRabbiSelectValue] = useState('');
  const [selectedRabbiDocId, setSelectedRabbiDocId] = useState('');

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name`);
        const data: any[] = res.data.data || [];
        setLecturers(data.sort((a, b) => {
          const na = a.name || a.attributes?.name || '';
          const nb = b.name || b.attributes?.name || '';
          if (na.includes('מרדכי עטייה')) return -1;
          if (nb.includes('מרדכי עטייה')) return 1;
          return na.localeCompare(nb, 'he');
        }));
      } catch (e) { console.error(e); }
    };
    fetchLecturers();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) return setSearchOptions([]);
    setSearchLoading(true);
    try {
      const q = encodeURIComponent(query.trim());
      const rabbiFilter = selectedRabbiDocId ? `&filters[rabbi][documentId][$eq]=${selectedRabbiDocId}` : '';

      if (type === 'lessons') {
        const filters = `&filters[$or][0][rabbi][name][$contains]=${q}` +
                        `&filters[$or][1][main_category][name][$contains]=${q}` +
                        `&filters[$or][2][sub_category][name][$contains]=${q}` +
                        `&filters[$or][3][title][$contains]=${q}` +
                        `&sort[0]=createdAt:desc`;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lessons?${filters}${rabbiFilter}&populate[rabbi][fields][0]=name&pagination[pageSize]=8`);
        setSearchOptions(res.data.data || []);
      } else {
        const rabbiFilterSub = selectedRabbiDocId ? `&filters[main_category][rabbi][documentId][$eq]=${selectedRabbiDocId}` : '';
        const [mainsRes, subsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/categories-mains?filters[name][$contains]=${q}${rabbiFilter}&fields[0]=name&fields[1]=documentId&populate[rabbi][fields][0]=name&pagination[pageSize]=10`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/categories-subs?filters[name][$contains]=${q}${rabbiFilterSub}&fields[0]=name&fields[1]=documentId&populate[main_category][fields][0]=name&populate[main_category][fields][1]=documentId&populate[main_category][populate][rabbi][fields][0]=name&pagination[pageSize]=10`)
        ]);
        const mains = (mainsRes.data.data || []).map((c: any) => ({ ...c, _type: 'main' }));
        const subs = (subsRes.data.data || []).map((c: any) => ({ ...c, _type: 'sub' }));
        setSearchOptions([...mains, ...subs]);
      }
    } catch (e) { console.error(e); }
    finally { setSearchLoading(false); }
  };

  const handleSelectItem = (item: any) => {
    if (!item) return;
    setSearchInput('');
    setSearchOptions([]);
    onResults([item]);
  };

  const handleRabbiFilter = (rabbiDocId: string) => {
    setSelectedRabbiDocId(rabbiDocId);
    setRabbiSelectValue(rabbiDocId);
    onResults([], rabbiDocId);
  };

  const handleClear = () => {
    setSelectedRabbiDocId('');
    setRabbiSelectValue('');
    setSearchInput('');
    setSearchOptions([]);
    setAutocompleteKey(k => k + 1);
    onClear();
  };

  return (
    <Stack direction="row" gap={2} sx={{ mb: 4, width: '100%' }}>
      <Box sx={{ width: '50%' }}>
        <Autocomplete
          key={autocompleteKey}
          sx={{ width: '100%' }}
          options={searchOptions}
          loading={searchLoading}
          inputValue={searchInput}
          filterOptions={(x) => x}
          getOptionLabel={(opt) => (type === 'lessons' ? opt.title : opt.name) || ''}
          onInputChange={(_, val) => { setSearchInput(val); handleSearch(val); }}
          onChange={(_, val) => handleSelectItem(val)}
          noOptionsText="לא נמצאו תוצאות"
          groupBy={type === 'categories' ? (opt) => opt._type === 'main' ? 'קטגוריות ראשיות' : 'תת קטגוריות' : undefined}
          renderOption={(props, option) => {
            const isLesson = type === 'lessons';
            const attr = option.attributes || option;
            const name = isLesson ? (attr.title || '') : (attr.name || '');
            const rabbiName = isLesson
              ? (option.rabbi?.name || attr.rabbi?.data?.attributes?.name || '')
              : (option._type === 'main' ? (option.rabbi?.name || '') : (option.main_category?.rabbi?.name || ''));
            const parentName = !isLesson && option._type === 'sub' ? (option.main_category?.name || '') : null;
            return (
              <Box component="li" {...props} sx={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{name}</Typography>
                  {(rabbiName || parentName) && (
                    <Typography variant="caption" sx={{ color: colors.gold }}>
                      {rabbiName}{parentName && ` ← ${parentName}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <Box ref={params.InputProps.ref} sx={{ display: 'flex', bgcolor: 'white', borderRadius: '8px', height: '45px', width: '100%', overflow: 'hidden' }}>
              <TextField
                {...params}
                placeholder={type === 'lessons' ? 'חפש שיעור...' : 'חפש קטגוריה...'}
                variant="standard"
                InputProps={{ ...params.InputProps, disableUnderline: true, sx: { px: 2, height: '100%', fontSize: '0.9rem', '& input': { padding: '0 !important' } }, endAdornment: null }}
                sx={{ flex: 1 }}
              />
              <IconButton size="small" sx={{ bgcolor: 'black', color: 'white', width: '45px', borderRadius: '8px', '&:hover': { bgcolor: '#333' } }}>
                {searchLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon fontSize="small" />}
              </IconButton>
            </Box>
          )}
        />
      </Box>

      <TextField
        select
        value={rabbiSelectValue}
        onChange={(e) => handleRabbiFilter(e.target.value)}
        label="סנן לפי רב"
        sx={{
          width: '25%', bgcolor: 'white', borderRadius: '8px',
          '& .MuiOutlinedInput-root': { borderRadius: '8px', height: '45px', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold } },
          '& .MuiInputLabel-root': { right: 14, left: 'auto', transformOrigin: 'right', color: '#000', '&.Mui-focused': { color: colors.gold } },
          '& .MuiInputLabel-shrink': { right: 14, left: 'auto', transform: 'translate(0, -9px) scale(0.75)' },
          '& .MuiSelect-icon': { left: 7, right: 'auto' },
          '& .MuiSelect-select': { paddingRight: '16px !important', paddingLeft: '32px !important', textAlign: 'right', display: 'flex', alignItems: 'center' },
        }}
      >
        <MenuItem value="">כל הרבנים</MenuItem>
        {lecturers.map((l) => (
          <MenuItem key={l.id} value={l.documentId || l.id}>{l.name || l.attributes?.name}</MenuItem>
        ))}
      </TextField>

      <Button
        onClick={handleClear}
        variant="outlined"
        sx={{ height: '45px', borderColor: colors.gold, color: colors.gold, borderRadius: '8px', whiteSpace: 'nowrap', '&:hover': { bgcolor: colors.gold, color: '#000' } }}
      >
        נקה סינון
      </Button>
    </Stack>
  );
};

export default AdminSearchBar;
