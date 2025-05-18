import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../app/api';

export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateMovieDto {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
}

interface MovieState {
  movies: Movie[];
  currentMovie: Movie | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  currentMovie: null,
  isLoading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/movies');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies');
  }
});

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movie');
    }
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: CreateMovieDto, { rejectWithValue }) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create movie');
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async (
    { id, movieData }: { id: number; movieData: Partial<Movie> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/movies/${id}`, movieData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update movie');
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete movie');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.isLoading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        state.movies.push(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.isLoading = false;
        const index = state.movies.findIndex((movie) => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.currentMovie = action.payload;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
        if (state.currentMovie?.id === action.payload) {
          state.currentMovie = null;
        }
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer; 