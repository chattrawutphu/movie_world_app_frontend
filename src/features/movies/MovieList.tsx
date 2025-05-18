import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Box,
  Rating,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useMovies } from '../../hooks/useMovieQueries';
import MovieCardSkeleton from '../../components/skeletons/MovieCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';

const ITEMS_PER_PAGE = 12;

interface MovieCardProps {
  movie: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '150%' }}>
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
            <MovieCardSkeleton />
          </Box>
        )}
        <CardMedia
          component="img"
          image={movie.imageUrl || '/placeholder-image.jpg'}
          alt={movie.title || 'Movie'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none',
          }}
          onLoad={() => setImageLoaded(true)}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.2,
            height: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.title || 'Untitled'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={movie.rating || 0} 
            readOnly 
            precision={0.5} 
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({(movie.rating || 0).toFixed(1)})
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={movie.genre || 'Unknown'} 
            size="small" 
            color="primary" 
            sx={{ fontSize: '0.75rem', mr: 1 }}
          />
          <Chip 
            label={movie.releaseYear || 'N/A'} 
            size="small" 
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            height: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {movie.description || 'No description available'}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/movies/${movie.id}`}
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const MovieList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useMovies(1, ITEMS_PER_PAGE);

  const movies = data?.pages.flatMap((page) => page.movies) ?? [];
  const skeletonArray = Array(ITEMS_PER_PAGE).fill(null);

  if (isError) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : 'An error occurred while fetching movies'}
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movies
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {skeletonArray.map((_, index) => (
            <Box 
              key={`skeleton-${index}`}
              sx={{
                flexGrow: 1,
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(33.33% - 16px)',
                  lg: 'calc(25% - 18px)',
                  xl: 'calc(20% - 19.2px)',
                },
              }}
            >
              <MovieCardSkeleton />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          mb: 3
        }}
      >
        Movies
      </Typography>

      <InfiniteScroll
        dataLength={movies.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ my: 4 }}>
            No more movies to load.
          </Typography>
        }
        style={{ overflow: 'visible' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {movies.map((movie) => {
            if (!movie) return null;
            return (
              <Box 
                key={movie.id}
                sx={{
                  flexGrow: 1,
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.33% - 16px)',
                    lg: 'calc(25% - 18px)',
                    xl: 'calc(20% - 19.2px)',
                  },
                }}
              >
                <MovieCard movie={movie} />
              </Box>
            );
          })}
        </Box>
      </InfiniteScroll>

      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default MovieList; 