import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Box,
  Rating,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMovies } from './movieSlice';

const MovieList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, isLoading, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

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
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Movies
      </Typography>

      {movies.length === 0 ? (
        <Alert severity="info">No movies available.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {movies.map((movie) => (
            <Box
              key={movie.id}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(33.333% - 16px)',
                },
              }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.imageUrl}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Rating value={movie.rating} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({movie.rating.toFixed(1)})
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={movie.genre} size="small" color="primary" />
                    <Chip label={movie.releaseYear} size="small" sx={{ ml: 1 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {movie.description.length > 120
                      ? `${movie.description.substring(0, 120)}...`
                      : movie.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/movies/${movie.id}`}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MovieList; 