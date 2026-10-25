import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import PageHeader from './shared/PageHeader';
import AppButton from './shared/AppButton';

interface NotFoundProps {
  title?: string;
  message?: string;
  showSearch?: boolean;
  showHome?: boolean;
  actionLabel?: string;
  actionPath?: string;
}

/**
 * עמוד "לא נמצא" — משותף לכתובת לא קיימת, שיעור שנמחק וספר שלא קיים.
 * החיפוש מעביר לארכיון דרך location.state.searchQuery, כמו שאר הכניסות לארכיון.
 */
const NotFound: React.FC<NotFoundProps> = ({
  title = 'העמוד לא נמצא',
  message = 'הכתובת שהוקלדה אינה קיימת, או שהעמוד הוסר. אפשר לחפש שיעור בארכיון או לחזור לדף הבית.',
  showSearch = true,
  showHome = true,
  actionLabel = 'לארכיון השיעורים',
  actionPath = '/AllLessons',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate('/AllLessons', { state: q ? { searchQuery: q } : undefined });
  };

  return (
    <Box sx={{ direction: 'rtl', backgroundColor: 'var(--parchment)', minHeight: '60vh' }}>
      <Helmet>
        <title>{`${title} | ישיבת עטרת מרדכי`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <PageHeader title={title} />
      <Box sx={{ maxWidth: '640px', mx: 'auto', px: 2, py: { xs: 5, md: 8 }, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 'var(--t4)', color: 'var(--ink)', mb: 4, lineHeight: 1.7 }}>
          {message}
        </Typography>

        {showSearch && (
          <Box
            component="form"
            onSubmit={submitSearch}
            role="search"
            sx={{
              mb: 3, display: 'flex', flexDirection: 'row', bgcolor: 'var(--surface)',
              borderRadius: '12px', border: '1px solid var(--gold)', overflow: 'hidden',
              height: '50px', boxShadow: '0 2px 10px rgba(44,14,16,.07)',
            }}
          >
            <Box
              component="button"
              type="submit"
              aria-label="חיפוש"
              sx={{
                width: '48px', height: '48px', border: 'none', cursor: 'pointer',
                backgroundImage: 'var(--gradient-gold-button)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}
            >
              <SearchIcon size={18} strokeWidth={2} color="var(--ink-dark)" aria-hidden />
            </Box>
            <Box
              component="input"
              type="text"
              aria-label="חיפוש שיעור"
              placeholder="חיפוש שיעור, רב או נושא"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              sx={{
                flex: 1, minWidth: 0, border: 'none', outline: 'none', px: '22px',
                fontSize: '18px', direction: 'rtl', textAlign: 'right',
                fontFamily: 'var(--font-body)', background: 'transparent', color: 'var(--ink)',
                '&::placeholder': { color: 'var(--search-placeholder-color)', opacity: 1 },
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <AppButton variant="dark" onClick={() => navigate(actionPath)}>{actionLabel}</AppButton>
          {showHome && <AppButton variant="outline" onClick={() => navigate('/')}>לדף הבית</AppButton>}
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
