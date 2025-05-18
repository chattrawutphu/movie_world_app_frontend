import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Alert,
  MenuItem,
  Rating,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  createMovie, 
  updateMovie, 
  fetchMovieById, 
  clearCurrentMovie,
  Movie
} from '../movieSlice';
import { Link as RouterLink } from 'react-router-dom';

const genres = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Western',
];

interface MovieFormData {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
}

const initialFormData: MovieFormData = {
  title: '',
  description: '',
  releaseYear: new Date().getFullYear(),
  genre: '',
  rating: 0,
  imageUrl: 'https://picsum.photos/seed/default/300/450',
};

const StyledGrid = styled(Grid)({}) as typeof Grid;

const MovieForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentMovie, isLoading, error } = useAppSelector((state) => state.movies);
  
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchMovieById(parseInt(id)));
    }
    
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id, isEditMode]);
  
  useEffect(() => {
    if (isEditMode && currentMovie) {
      setFormData({
        title: currentMovie.title,
        description: currentMovie.description,
        releaseYear: currentMovie.releaseYear,
        genre: currentMovie.genre,
        rating: currentMovie.rating,
        imageUrl: currentMovie.imageUrl,
      });
    }
  }, [currentMovie, isEditMode]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.releaseYear) {
      errors.releaseYear = 'Release year is required';
    } else if (
      formData.releaseYear < 1900 ||
      formData.releaseYear > new Date().getFullYear() + 5
    ) {
      errors.releaseYear = 'Release year is invalid';
    }
    
    if (!formData.genre) {
      errors.genre = 'Genre is required';
    }
    
    if (formData.rating < 0 || formData.rating > 5) {
      errors.rating = 'Rating must be between 0 and 5';
    }

    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) : value,
    }));
  };
  
  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue || 0,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode && id) {
      await dispatch(updateMovie({ id: parseInt(id), movieData: formData }));
      navigate(`/movies/${id}`);
    } else {
      const resultAction = await dispatch(createMovie(formData));
      if (createMovie.fulfilled.match(resultAction)) {
        const newMovie = resultAction.payload as Movie;
        navigate(`/movies/${newMovie.id}`);
      }
    }
  };
  
  const generateImageUrl = () => {
    const seed = Math.random().toString(36).substring(7);
    setFormData(prev => ({
      ...prev,
      imageUrl: `https://picsum.photos/seed/${seed}/300/450`
    }));
  };
  
  if (isLoading && isEditMode) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Movie' : 'Add New Movie'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Box>
            
            <Box>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Release Year"
                name="releaseYear"
                type="number"
                fullWidth
                value={formData.releaseYear}
                onChange={handleChange}
                error={!!formErrors.releaseYear}
                helperText={formErrors.releaseYear}
                inputProps={{
                  min: 1900,
                  max: new Date().getFullYear() + 5,
                }}
              />
              
              <TextField
                select
                label="Genre"
                name="genre"
                fullWidth
                value={formData.genre}
                onChange={handleChange}
                error={!!formErrors.genre}
                helperText={formErrors.genre}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                precision={0.5}
                onChange={handleRatingChange}
              />
              {formErrors.rating && (
                <Typography color="error" variant="caption">
                  {formErrors.rating}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Image URL"
                name="imageUrl"
                fullWidth
                value={formData.imageUrl}
                onChange={handleChange}
                error={!!formErrors.imageUrl}
                helperText={formErrors.imageUrl}
              />
              <Button
                variant="outlined"
                onClick={generateImageUrl}
                sx={{ minWidth: '120px', height: '56px' }}
              >
                Generate New
              </Button>
            </Box>

            {formData.imageUrl && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Image Preview:</Typography>
                <img
                  src={formData.imageUrl}
                  alt="Movie preview"
                  style={{
                    width: '200px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  'Update Movie'
                ) : (
                  'Create Movie'
                )}
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/admin/movies"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MovieForm; 