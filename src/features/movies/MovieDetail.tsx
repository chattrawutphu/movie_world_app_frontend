import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Container,
  Paper,
  Box,
  Chip,
  Rating,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMovieById, clearCurrentMovie } from './movieSlice';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentMovie, isLoading, error } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/movies"
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  if (!currentMovie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Movie not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/movies"
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to="/movies"
        sx={{ mb: 2 }}
      >
        Back to Movies
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
            <img
              src={currentMovie.imageUrl}
              alt={currentMovie.title}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '60%' } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentMovie.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={currentMovie.rating} readOnly precision={0.5} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentMovie.rating.toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip label={currentMovie.genre} color="primary" sx={{ mr: 1 }} />
              <Chip label={currentMovie.releaseYear} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {currentMovie.description}
            </Typography>

            {user?.role === 'ADMIN' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to={`/admin/movies/edit/${currentMovie.id}`}
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