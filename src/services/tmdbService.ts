// src/services/tmdbService.ts
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };
  credits?: {
    cast: Array<{
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      name: string;
      job: string;
    }>;
  };
}

export const tmdbService = {
  // Get image URL
  getImageUrl: (path: string, size: 'w200' | 'w500' | 'original' = 'w500') => {
    return path
      ? `${TMDB_IMAGE_BASE}/${size}${path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
  },

  // Get now playing movies
  getNowPlaying: async (page = 1) => {
    const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcoming: async (page = 1) => {
    const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get movie details with videos and credits
  getMovieDetails: async (movieId: number): Promise<TMDBMovie> => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits',
      },
    });
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page = 1) => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movie genres
  getGenres: async () => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  },

  // Discover movies by genre
  discoverByGenre: async (genreId: number, page = 1) => {
    const response = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number, page = 1) => {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  // Get movie trailer
  getMovieTrailer: (movie: TMDBMovie) => {
    const trailer = movie.videos?.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  },

  // Get embedded trailer URL
  getEmbedTrailerUrl: (movie: TMDBMovie) => {
    const trailer = movie.videos?.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  },
};

export default tmdbService;
