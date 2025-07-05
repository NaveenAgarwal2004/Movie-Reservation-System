import { useQuery } from '@tanstack/react-query';
import { moviesAPI } from '../api/movies';

export const useMovies = (params?: any) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => moviesAPI.getMovies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesAPI.getMovie(id),
    enabled: !!id,
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: moviesAPI.getFeaturedMovies,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNowPlayingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: moviesAPI.getNowPlayingMovies,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: moviesAPI.getUpcomingMovies,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMovieRecommendations = (id: string) => {
  return useQuery({
    queryKey: ['movie', id, 'recommendations'],
    queryFn: () => moviesAPI.getMovieRecommendations(id),
    enabled: !!id,
  });
};