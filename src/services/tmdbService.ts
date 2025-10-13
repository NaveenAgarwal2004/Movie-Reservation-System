// src/services/tmdbService.ts - Enhanced with better error handling

import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  retry?: number;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// Create axios instance with timeout and retry logic
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000, // 10 seconds
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Request interceptor
tmdbApi.interceptors.request.use(
  (config) => {
    console.log('TMDB Request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
tmdbApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfigWithRetry;

    // Retry logic
    if (!config) {
      return Promise.reject(error);
    }

    // Ensure retry is a defined number
    let retryCount = typeof config.retry === 'number' ? config.retry : 0;

    if (retryCount < 3) {
      retryCount += 1;
      config.retry = retryCount;
      console.log(`Retrying TMDB request (${retryCount}/3):`, config.url);

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));

      return tmdbApi(config);
    }

    console.error('TMDB API Error:', error.message);
    return Promise.reject(error);
  }
);

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
      official: boolean;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
  original_language: string;
  popularity: number;
  adult: boolean;
}

export const tmdbService = {
  // Get image URL with fallback
  getImageUrl: (
    path: string | null,
    size: 'w200' | 'w500' | 'w780' | 'original' = 'w500'
  ): string => {
    if (!path) {
      return `https://via.placeholder.com/${size === 'w200' ? '200x300' : size === 'w500' ? '500x750' : '780x1170'}/374151/FFFFFF?text=No+Image`;
    }
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  // Get now playing movies with error handling
  getNowPlaying: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/now_playing', {
        params: { page, language: 'en-US' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page, language: 'en-US' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcoming: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/upcoming', {
        params: { page, language: 'en-US' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/top_rated', {
        params: { page, language: 'en-US' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get movie details with videos and credits
  getMovieDetails: async (movieId: number): Promise<TMDBMovie> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,credits',
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query: string, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page, language: 'en-US', include_adult: false },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list', {
        params: { language: 'en-US' },
      });
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Return fallback genres
      return [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' },
      ];
    }
  },

  // Discover movies by genre
  discoverByGenre: async (genreId: number, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          language: 'en-US',
          sort_by: 'popularity.desc',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error discovering by genre:', error);
      throw error;
    }
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number, page = 1) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page, language: 'en-US' },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return empty results instead of throwing
      return { results: [], page: 1, total_pages: 0, total_results: 0 };
    }
  },

  // Get movie trailer (YouTube only)
  getMovieTrailer: (movie: TMDBMovie): string | null => {
    if (!movie.videos?.results) return null;

    // Prioritize official trailers
    const trailer =
      movie.videos.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      ) ||
      movie.videos.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  },

  // Get embedded trailer URL
  getEmbedTrailerUrl: (movie: TMDBMovie): string | null => {
    if (!movie.videos?.results) return null;

    const trailer =
      movie.videos.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      ) ||
      movie.videos.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');

    return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0` : null;
  },

  // Check API health
  checkHealth: async (): Promise<boolean> => {
    try {
      await tmdbApi.get('/configuration');
      return true;
    } catch (error) {
      console.error('TMDB API health check failed:', error);
      return false;
    }
  },
};

export default tmdbService;
