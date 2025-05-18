import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchMovies, deleteMovie } from '../movieSlice';

const AdminMovieList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies, isLoading, error } = useAppSelector((state) => state.movies);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);
  
  const handleDeleteClick = (id: number) => {
    setMovieToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (movieToDelete !== null) {
      dispatch(deleteMovie(movieToDelete));
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };
  
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Movies</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/movies/add"
        >
          Add Movie
        </Button>
      </Box>
      
      {movies.length === 0 ? (
        <Alert severity="info">No movies available. Add a new movie to get started.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Release Year</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={movie.rating} readOnly precision={0.5} size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({movie.rating.toFixed(1)})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="info"
                      component={RouterLink}
                      to={`/movies/${movie.id}`}
                      size="small"
                      title="View"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      component={RouterLink}
                      to={`/admin/movies/edit/${movie.id}`}
                      size="small"
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(movie.id)}
                      size="small"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this movie? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMovieList; 