// src/hooks/useTMDB.ts
import { useQuery } from '@tanstack/react-query';
import tmdbService from '../services/tmdbService';
import type { TMDBMovie } from '../services/tmdbService';

// Get Now Playing Movies
export const useNowPlayingMovies = (page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'now-playing', page],
    queryFn: () => tmdbService.getNowPlaying(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Popular Movies
export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'popular', page],
    queryFn: () => tmdbService.getPopular(page),
    staleTime: 10 * 60 * 1000,
  });
};

// Get Upcoming Movies
export const useUpcomingMovies = (page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'upcoming', page],
    queryFn: () => tmdbService.getUpcoming(page),
    staleTime: 10 * 60 * 1000,
  });
};

// Get Top Rated Movies
export const useTopRatedMovies = (page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'top-rated', page],
    queryFn: () => tmdbService.getTopRated(page),
    staleTime: 10 * 60 * 1000,
  });
};

// Get Movie Details
export const useTMDBMovieDetails = (movieId: number | null) => {
  return useQuery({
    queryKey: ['tmdb', 'movie', movieId],
    queryFn: () => tmdbService.getMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Search Movies
export const useSearchTMDBMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'search', query, page],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Genres
export const useTMDBGenres = () => {
  return useQuery({
    queryKey: ['tmdb', 'genres'],
    queryFn: () => tmdbService.getGenres(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Discover by Genre
export const useDiscoverByGenre = (genreId: number, page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'discover', 'genre', genreId, page],
    queryFn: () => tmdbService.discoverByGenre(genreId, page),
    enabled: !!genreId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get Movie Recommendations
export const useTMDBRecommendations = (movieId: number | null, page = 1) => {
  return useQuery({
    queryKey: ['tmdb', 'recommendations', movieId, page],
    queryFn: () => tmdbService.getRecommendations(movieId!, page),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000,
  });
};

// Helper function to convert TMDB movie to app format
export const convertTMDBToAppMovie = (
  tmdbMovie: TMDBMovie,
  genres: Array<{ id: number; name: string }>
) => {
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    poster: tmdbService.getImageUrl(tmdbMovie.poster_path),
    backdrop: tmdbService.getImageUrl(tmdbMovie.backdrop_path, 'original'),
    rating: tmdbMovie.vote_average,
    duration: tmdbMovie.runtime ? `${tmdbMovie.runtime} min` : 'N/A',
    genre: tmdbMovie.genre_ids
      ? tmdbMovie.genre_ids
          .map((id) => {
            const genre = genres.find((g) => g.id === id);
            return genre ? genre.name : '';
          })
          .filter(Boolean)
      : tmdbMovie.genres?.map((g) => g.name) || [],
    year: new Date(tmdbMovie.release_date).getFullYear(),
    language: 'English',
    releaseDate: tmdbMovie.release_date,
    trailerUrl: tmdbService.getMovieTrailer(tmdbMovie),
    embedTrailerUrl: tmdbService.getEmbedTrailerUrl(tmdbMovie),
    cast:
      tmdbMovie.credits?.cast.slice(0, 8).map((actor) => ({
        name: actor.name,
        role: actor.character,
        image: tmdbService.getImageUrl(actor.profile_path, 'w200'),
      })) || [],
    director: tmdbMovie.credits?.crew.find((c) => c.job === 'Director')?.name || 'Unknown',
  };
};
