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
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 12;

interface MovieCardProps {
  movie: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { t } = useTranslation();
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
          />
        )}
        <CardMedia
          component="img"
          image={movie.imageUrl || '/placeholder-image.jpg'}
          alt={movie.title || t('movies.imagePlaceholder')}
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
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
          {movie.title || t('movies.imagePlaceholder')}
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
            label={movie.genre ? t(`genres.${movie.genre.toLowerCase().replace(/-/g, '')}`) || movie.genre : t('movies.genre')} 
            size="small" 
            color="primary" 
            sx={{ fontSize: '0.75rem', mr: 1 }}
          />
          <Chip 
            label={movie.releaseYear || t('movies.releaseYear')} 
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
          {movie.description || t('movies.description')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/movies/${movie.id}`}
          variant="outlined"
          fullWidth
        >
          {t('common.viewDetails')}
        </Button>
      </CardActions>
    </Card>
  );
};

const MovieList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useMovies(1, ITEMS_PER_PAGE);
  
  const movies = data?.pages.flatMap(page => page.movies) || [];
  const totalCount = data?.pages[0]?.total || 0;
  
  const loadMoreMovies = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
      fetchNextPage();
    }
  };

  const resetMovieList = () => {
    queryClient.removeQueries({ queryKey: ['movies'] });
    setPage(1);
    window.location.reload();
  };
  
  if (isLoading && page === 1) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('movies.movies')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
          {Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ width: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' }, p: 1.5 }}>
              <MovieCardSkeleton />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }
  
  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          {error?.message || t('errors.somethingWentWrong')}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={resetMovieList}>
            {t('common.retry')}
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (movies.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('movies.movies')}
        </Typography>
        <Alert severity="info">{t('common.noResults')}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={resetMovieList}>
            {t('common.resetPage')}
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('movies.movies')}
      </Typography>
      
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={!!hasNextPage}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 4 }}
          >
            {totalCount > 0
              ? `${t('movies.movies')} (${movies.length}/${totalCount})`
              : t('common.noResults')}
          </Typography>
        }
        style={{ overflow: 'visible', height: 'auto' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
          {movies.map((movie) => (
            <Box key={movie.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' }, p: 1.5 }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Box>
      </InfiniteScroll>
    </Container>
  );
};

export default MovieList; 