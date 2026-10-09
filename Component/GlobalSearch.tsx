
import React, { useState, useRef } from 'react';
import { Autocomplete, TextField, Box, Typography, CircularProgress, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import qs from 'qs';

// הגדרת ה-Props כדי שיעבוד עם ה-App וההדר
interface GlobalSearchProps {
  onSelectLesson: (lesson: any) => void;
  maxWidth?: string | number;
  height?: string | number;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelectLesson, maxWidth, height = '40px' }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const lastKeyWasSpace = useRef(false);

  const handleSpaceFilter = () => {
    const word = inputValue.trim();
    if (!word || word.length < 2) return;
    const wordRegex = new RegExp(`(^|[\\s\\-"',.:;!?])${word}($|[\\s\\-"',.:;!?])`, 'i');
    setOptions(prev => prev.filter((lesson: any) => {
      const title = lesson.attributes?.title || lesson.title || '';
      const rabbi = lesson.attributes?.rabbi?.data?.attributes?.name || lesson.rabbi?.name || '';
      const mainCat = lesson.attributes?.main_category?.data?.attributes?.name || '';
      const subCat = lesson.attributes?.sub_category?.data?.attributes?.name || '';
      return wordRegex.test(title) || wordRegex.test(rabbi) || wordRegex.test(mainCat) || wordRegex.test(subCat);
    }));
  };

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const trailingSpace = lastKeyWasSpace.current;
    const cleanQuery = query.trim();

    try {
      const queryString = qs.stringify({
        filters: {
          $or: [
            { rabbi: { name: { $contains: cleanQuery } } },
            { main_category: { name: { $contains: cleanQuery } } },
            { sub_category: { name: { $contains: cleanQuery } } },
            { title: { $contains: cleanQuery } },
          ],
        },
        sort: ['createdAt:desc'],
        populate: { rabbi: { fields: ['name'] } },
        pagination: { pageSize: 8 },
      }, { encodeValuesOnly: true });

      const url = `${import.meta.env.VITE_API_URL}/api/lessons?${queryString}`;
      const response = await axios.get(url);
      let results = response.data.data || [];

      if (trailingSpace) {
        const wordRegex = new RegExp(`(^|[\\s\\-"',.:;!?])${cleanQuery}($|[\\s\\-"',.:;!?])`, 'i');
        results = results.filter((lesson: any) => {
          const title = lesson.attributes?.title || lesson.title || '';
          const rabbi = lesson.attributes?.rabbi?.data?.attributes?.name || lesson.rabbi?.name || '';
          const mainCat = lesson.attributes?.main_category?.data?.attributes?.name || '';
          const subCat = lesson.attributes?.sub_category?.data?.attributes?.name || '';
          return wordRegex.test(title) || wordRegex.test(rabbi) || wordRegex.test(mainCat) || wordRegex.test(subCat);
        });
      }

      setOptions(results);
    } catch (err) {
      console.error("שגיאה בחיפוש:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      open={open}
      sx={{ width: maxWidth || 'auto' }}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      inputValue={inputValue}
      filterOptions={(x) => x} 
      onInputChange={(_, val_) => {        
        setInputValue(val_);
        handleSearch(val_);
      }}
      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.attributes?.title || opt.title || "")}
      onChange={(_event, value_: any) => {
        if (value_) {
          // עיבוד הנתונים בדיוק כפי שהנגן מצפה לקבל
          const attr = value_.attributes || value_;
          const formattedLesson = {
            ...attr,
            id: value_.id,
            rabbi: {
              name: attr.rabbi?.data?.attributes?.name || attr.rabbi?.name || "שיעור כללי"
            }
          };
          
          // במקום ניווט - מפעילים את הנגן ב-App
          onSelectLesson(formattedLesson); 
          
          setOpen(false);
          setInputValue('');
        }
      }}
      PaperComponent={(props) => (
        <Paper {...props} sx={{ direction: 'rtl', mt: 1, boxShadow: 3, minWidth: '100%' }} />
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
          onKeyDown={(e) => {
            lastKeyWasSpace.current = e.key === ' ';
            if (e.key === ' ') setTimeout(handleSpaceFilter, 0);
          }}
          sx={{
            display: 'flex',
            bgcolor: 'white',
            borderRadius: '8px',
            height: height,
            width: maxWidth ? '100%' : 'auto',
            minWidth: maxWidth ? '200px' : '100px',
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
    width: '40px',
    '&:hover': { bgcolor: '#333' },
    // השורות שצריך לשנות/להוסיף:
    borderRadius: '8px', // מעגל גם את הזווית של הרקע השחור
    border: '1px solid rgba(255, 255, 255, 0.3)', // מסגרת לבנה דקה ועדינה
    boxSizing: 'border-box', // שומר שהגודל יישאר מדויק
    marginRight: '-1px' // דוחף את זה מעט לתוך המסגרת החיצונית כדי שייראה חלק
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