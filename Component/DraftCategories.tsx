import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip,
  Stack, Button, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import axios from 'axios';

import { colors } from '../src/theme/tokens';
const COLORS = {
  SIDEBAR_BROWN: '#000',
  BROWN_DARK: colors.gold,
  BG_CREAM: '#fff',
};

const DraftCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [publishingId, setPublishingId] = React.useState<string | null>(null);
  const pageSize = 30;

  const fetchDrafts = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories-mains/drafts?page=${page}&pageSize=${pageSize}`
      );
      setCategories(res.data.data || []);
      const pagination = res.data.meta?.pagination;
      if (pagination) {
        setTotalPages(pagination.pageCount);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('שגיאה בשליפת טיוטות:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (documentId: string) => {
    setPublishingId(documentId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories-mains/publish/${documentId}`);
      await fetchDrafts(currentPage);
    } catch (err: any) {
      alert(`שגיאה בפרסום: ${err.response?.data?.error?.message || err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  useEffect(() => {
    fetchDrafts(1);
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 500, fontSize: '2rem', color: COLORS.SIDEBAR_BROWN, mb: 4, fontFamily: "'Yetzira-Regular', sans-serif" }}>
        טיוטות קטגוריות
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 0, overflow: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>שם הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מזהה (Slug)</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>הרב</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>מס שיעורים</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>קדימות הקטגוריה</TableCell>
              <TableCell align="center" sx={{ bgcolor: colors.gold, color: '#000', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>טוען נתונים...</TableCell></TableRow>
            ) : categories.map((category) => {
              return (
                <TableRow key={category.id} hover sx={{ '& td': { py: 2 } }}>
                  <TableCell sx={{ textAlign: 'justify' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{category.name || 'ללא שם'}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.id}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.rabbiName || '---'}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{category.lessonCount || 0}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.BROWN_DARK }}>{category.Priority || 0}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <Tooltip title="פרסם קטגוריה">
                        <IconButton
                          onClick={() => handlePublish(category.documentId)}
                          disabled={publishingId === category.documentId}
                          sx={{ color: colors.gold }}
                        >
                          {publishingId === category.documentId
                            ? <CircularProgress size={18} />
                            : <PublishIcon />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="ערוך פרטים">
                        <IconButton
                          sx={{ color: COLORS.SIDEBAR_BROWN }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 4 }}>
        <Button disabled={currentPage <= 1} onClick={() => fetchDrafts(currentPage - 1)} variant="outlined" sx={{ color: colors.gold, borderColor: colors.gold, '&:hover': { bgcolor: colors.gold, color: '#000' } }}>הקודם</Button>
        <Typography fontWeight="bold">עמוד {currentPage} מתוך {totalPages}</Typography>
        <Button disabled={currentPage >= totalPages} onClick={() => fetchDrafts(currentPage + 1)} variant="outlined" sx={{ color: colors.gold, borderColor: colors.gold, '&:hover': { bgcolor: colors.gold, color: '#000' } }}>הבא</Button>
      </Stack>
    </Box>
  );
};

export default DraftCategories;
