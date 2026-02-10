import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, Typography, CircularProgress, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHelpers, setSearchHelpers] = useState<{ name: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  // 1. טעינת המילון לתיקון שגיאות (נשאר כפי שהיה)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [rabbis, mainCats, subCats] = await Promise.all([
          axios.get('http://localhost:1337/api/rabbis?fields[0]=name'),
          axios.get('http://localhost:1337/api/categories-mains?fields[0]=name'),
          axios.get('http://localhost:1337/api/categories-subs?fields[0]=name')
        ]);
        
        const allNames = [
          ...rabbis.data.data.map((r: any) => r.attributes?.name || r.name),
          ...mainCats.data.data.map((c: any) => c.attributes?.name || c.name),
          ...subCats.data.data.map((s: any) => s.attributes?.name || s.name)
        ].filter(Boolean);
        
        const uniqueNames = Array.from(new Set(allNames)).map(name => ({ name }));
        setSearchHelpers(uniqueNames);
      } catch (e) {
        console.error("שגיאה בטעינת המילון:", e);
      }
    };
    loadMetadata();
  }, []);

  // 2. פונקציית החיפוש הלוגית - מתוקנת לחיפוש רציף
  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const cleanQuery = query.trim(); 
    
    try {
      const encodedQuery = encodeURIComponent(cleanQuery);
      
      // הוספנו את הפרמטר sort[0]=createdAt:desc כדי שהכי חדש יהיה ראשון
      let filters = `&filters[$or][0][rabbi][name][$contains]=${encodedQuery}` +
                    `&filters[$or][1][main_category][name][$contains]=${encodedQuery}` +
                    `&filters[$or][2][sub_category][name][$contains]=${encodedQuery}` +
                    `&filters[$or][3][title][$contains]=${encodedQuery}` +
                    `&sort[0]=createdAt:desc`; // <--- המיון החדש כאן

      const url = `http://localhost:1337/api/lessons?${filters}&populate[rabbi][fields][0]=name&pagination[pageSize]=8`;
      const response = await axios.get(url);
      setOptions(response.data.data || []);
    } catch (err) {
      console.error("שגיאה בחיפוש:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      inputValue={inputValue}
      // הוספת השורה הזו חשובה כדי ש-MUI לא יסתיר תוצאות שהשרת מצא
      filterOptions={(x) => x} 
      onInputChange={(e, val) => {
        setInputValue(val);
        handleSearch(val);
      }}
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.attributes?.title || opt.title || "")}
      onChange={(event, value: any) => {
        if (value && value.id) {
          navigate(`/lesson/${value.id}`);
        }
      }}
      PaperComponent={(props) => (
        <Paper {...props} sx={{ direction: 'rtl', mt: 1, boxShadow: 3 }} />
      )}
      noOptionsText="לא נמצאו תוצאות"
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ direction: 'rtl', textAlign: 'right' }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {option.attributes?.title || option.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               {option.attributes?.rabbi?.data?.attributes?.name || option.rabbi?.name || "שיעור כללי"}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <Box
          ref={params.InputProps.ref}
          sx={{
            display: 'flex',
            bgcolor: 'white',
            borderRadius: '8px',
            height: '40px',
            width: { sm: '150px', md: '220px' },
            overflow: 'hidden'
          }}
        >
          <TextField
            {...params}
            placeholder="חפש שיעור..."
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: { 
                px: 2, 
                height: '100%', 
                fontSize: '0.9rem',
                '& input': { padding: '0 !important' } 
              },
              endAdornment: null
            }}
            sx={{ flex: 1 }}
          />
          <IconButton 
            size="small"
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              borderRadius: 0,
              width: '40px',
              '&:hover': { bgcolor: '#333' }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon fontSize="small" />}
          </IconButton>
        </Box>
      )}
    />
  );
};

export default GlobalSearch;