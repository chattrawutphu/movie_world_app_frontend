import React from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from '../../app/hooks';
import { useMovie } from '../../hooks/useMovieQueries';
import MovieDetailSkeleton from '../../components/skeletons/MovieDetailSkeleton';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

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
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error?.message || 'An error occurred'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={backPath}
          sx={{ mt: 2 }}
        >
          Back to {isFromAdmin ? 'Manage Movies' : 'Movies'}
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Movie not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={backPath}
          sx={{ mt: 2 }}
        >
          Back to {isFromAdmin ? 'Manage Movies' : 'Movies'}
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to={backPath}
        sx={{ mb: 2 }}
      >
        Back to {isFromAdmin ? 'Manage Movies' : 'Movies'}
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
            <img
              src={movie.imageUrl}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
              loading="lazy"
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '60%' } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={movie.rating} readOnly precision={0.5} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {movie.rating.toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip label={movie.genre} color="primary" sx={{ mr: 1 }} />
              <Chip label={movie.releaseYear} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>

            {user?.role === 'ADMIN' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to={`/admin/movies/edit/${movie.id}`}
                >
                  Edit Movie
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MovieDetail; 