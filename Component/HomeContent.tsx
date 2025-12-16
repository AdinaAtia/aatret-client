import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Grid,
} from '@mui/material';

import Header from './Header';
import LatestLessonCard from './LatestLessonCard';

/* ================== CONSTANTS ================== */
const COLORS = {
  mainBg: '#922b2b',
  inputTextColor: 'black',
  contentMaxWidth: '95%',
  borderRadius: '8px',
  rabbiBg: 'white',
};

/* ================== RABBI CARD ================== */
interface RabbiCardProps {
  name: string;
  title: string;
  imageSrc: string;
}

const RabbiCard: React.FC<RabbiCardProps> = ({ name, title, imageSrc }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      height: '100%',
      borderRadius: COLORS.borderRadius,
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 1,
        }}
      />
      <Box>
        <Typography fontWeight="bold">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Stack>

    <Button
      variant="contained"
      size="small"
      sx={{
        mt: 2,
        alignSelf: 'flex-start',
        backgroundColor: COLORS.mainBg,
        '&:hover': { backgroundColor: '#7a2222' },
      }}
    >
      לשיעורי הרב
    </Button>
  </Paper>
);

/* ================== HOME CONTENT ================== */
const HomeContent: React.FC = () => {
  const [centralSearchTerm] = useState('');

  const cardActions = [
    { label: 'הוצאות ספרים' },
    { label: 'שיעורי קבלה' },
    { label: 'כללי דינאות' },
  ];

  const rabbiCardsData = [
    { name: 'הרב יואל בלומנפלד שליט"א', title: 'טקסט תיאור', imageSrc: 'https://via.placeholder.com/100' },
    { name: 'הרב בנימין עובדיה שליט"א', title: 'טקסט תיאור', imageSrc: 'https://via.placeholder.com/100' },
    { name: 'הרב ירחמיאל ביסמוט שליט"א', title: 'טקסט תיאור', imageSrc: 'https://via.placeholder.com/100' },
    { name: 'הרב יואל חזקן שליט"א', title: 'טקסט תיאור', imageSrc: 'https://via.placeholder.com/100' },
  ];

  return (
    <Box dir="rtl" minHeight="100vh" bgcolor="white">
      <Header />

      {/* ===== HERO ===== */}
      <Box maxWidth={COLORS.contentMaxWidth} mx="auto" textAlign="center" py={{ xs: 4, md: 8 }}>
        <Typography variant="h1" fontWeight={900}>
          עטרת מרדכי
        </Typography>
        <Typography mt={1}>
          ישיבה ללימוד קבלה עפ"י תורת האר"י ז"ל
        </Typography>
      </Box>

      <Box borderBottom="3px solid black" mb={10} />

      <LatestLessonCard />

      {/* ===== BOOKS SECTION ===== */}
      <Box maxWidth={COLORS.contentMaxWidth} mx="auto" py={8}>
        <Typography variant="h4" mb={4} fontWeight={700}>
          ספרי הישיבה
        </Typography>

        <Paper
          elevation={0}
          sx={{
            height: 400,
            border: '1px solid #ccc',
            mb: 5,
          }}
        />

        <Grid container spacing={3}>
          {cardActions.map((action) => (
            <Grid item xs={12} sm={4} key={action.label}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  minHeight: 120,
                  backgroundColor: COLORS.mainBg,
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#7a2222' },
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box borderBottom="3px solid black" mb={10} />

      {/* ===== ROSH YESHIVA ===== */}
      <Box maxWidth={COLORS.contentMaxWidth} mx="auto" py={8}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                width: '100%',
                paddingTop: '30%',
                backgroundImage: 'url(/DSC_5195.JPG)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2} height="100%" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  מרן ראש הישיבה
                </Typography>
                <Typography variant="h6" mb={2}>
                  הרה"ג הרב מרדכי עטייה שליט"א
                </Typography>
                <Typography color="text.secondary">
                  טקסט תיאור ארוך על ראש הישיבה.
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: COLORS.mainBg,
                  '&:hover': { backgroundColor: '#7a2222' },
                }}
              >
                לשיעורי הרב
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box borderBottom="3px solid black" mb={10} />

      {/* ===== RABBIS GRID ===== */}
    <Box px={{ xs: 2, md: 4 }} pb={8}>
  <Grid
    container
    spacing={4}
    alignItems="stretch"
  >
    {rabbiCardsData.map((rabbi, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <RabbiCard {...rabbi} />
      </Grid>
    ))}
  </Grid>
</Box>

    </Box>
  );
};

export default HomeContent;
