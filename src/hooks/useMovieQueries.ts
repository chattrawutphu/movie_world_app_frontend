import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '../api/api';

export interface Movie {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  releaseYear: number;
  genre: string;
  rating: number;
}

interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

// Preload images function
const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload images for a batch of movies
const preloadMovieImages = async (movies: Movie[]) => {
  const imagePromises = movies
    .filter(movie => movie.imageUrl)
    .map(movie => preloadImage(movie.imageUrl));
  await Promise.all(imagePromises);
};

export const useMovies = (initialPage: number = 1, limit: number = 12) => {
  return useInfiniteQuery({
    queryKey: ['movies'],
    queryFn: async ({ pageParam = initialPage }) => {
      try {
        const response = await api.get<MoviesResponse>(`/movies?page=${pageParam}&limit=${limit}`);
        // Preload images in the background
        preloadMovieImages(response.data.movies).catch(console.error);
        return response.data;
      } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
      }
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in garbage collection for 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useMovie = (id: number) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await api.get<Movie>(`/movies/${id}`);
      // Preload the movie image
      if (response.data.imageUrl) {
        preloadImage(response.data.imageUrl).catch(console.error);
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useAdminMovies = () => {
  return useQuery({
    queryKey: ['admin-movies'],
    queryFn: async () => {
      const response = await api.get<Movie[]>('/movies/admin');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}; 