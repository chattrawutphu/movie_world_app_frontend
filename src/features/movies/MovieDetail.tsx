import React, { useState } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Typography,
  Container,
  Paper,
  Box,
  Chip,
  Rating,
  Button,
  Alert,
  Divider,
  Card,
  Grid,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarIcon from '@mui/icons-material/Star';
import { useAppSelector } from '../../app/hooks';
import { useMovie } from '../../hooks/useMovieQueries';
import MovieDetailSkeleton from '../../components/skeletons/MovieDetailSkeleton';
import { useTranslation } from 'react-i18next';

const MovieDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [imageLoaded, setImageLoaded] = useState(false);

  const movieId = id ? parseInt(id) : 0;
  const { data: movie, isLoading, isError, error } = useMovie(movieId);

  // Determine if user came from admin page
  const isFromAdmin = location.state?.from === 'admin' || location.pathname.includes('/admin/movies');
  const backPath = isFromAdmin ? '/admin/movies' : '/movies';

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || t('errors.somethingWentWrong')}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={backPath}
          variant="contained"
          sx={{ mt: 2 }}
        >
          {isFromAdmin ? t('movies.backToManageMovies') : t('movies.backToMovies')}
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('errors.movieNotFound')}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={backPath}
          variant="contained"
          sx={{ mt: 2 }}
        >
          {isFromAdmin ? t('movies.backToManageMovies') : t('movies.backToMovies')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={backPath}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {isFromAdmin ? t('movies.backToManageMovies') : t('movies.backToMovies')}
        </Button>
      </Box>

      <Card elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 4 }} sx={{ position: 'relative' }}>
            {!imageLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Box
              component="img"
              src={movie.imageUrl || '/placeholder-image.jpg'}
              alt={movie.title}
              sx={{
                width: '100%',
                height: { xs: '300px', md: '500px' },
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none',
              }}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  color: 'primary.main' 
                }}
              >
                {movie.title}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Chip
                  icon={<MovieIcon />}
                  label={movie.genre ? t(`genres.${movie.genre.toLowerCase().replace(/-/g, '')}`) || movie.genre : t('movies.genre')}
                  color="primary"
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  icon={<CalendarMonthIcon />}
                  label={movie.releaseYear}
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${movie.rating.toFixed(1)}/10`}
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
                  {t('movies.rating')}:
                </Typography>
                <Rating 
                  value={movie.rating / 2} 
                  readOnly 
                  precision={0.5} 
                  sx={{ color: 'secondary.main' }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                {t('movies.description')}
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  lineHeight: 1.7,
                  color: 'text.secondary',
                  mb: 4
                }}
              >
                {movie.description}
              </Typography>

              {user?.role === 'ADMIN' && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to={`/admin/movies/edit/${movie.id}`}
                    sx={{ 
                      fontWeight: 500,
                      px: 3
                    }}
                  >
                    {t('movies.editMovie')}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default MovieDetail; 