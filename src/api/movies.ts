import api from './auth';

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: string;
  releaseDate: string;
  poster: string;
  trailer?: string;
  cast: Array<{
    name: string;
    role: string;
    image?: string;
  }>;
  director: string;
  language: string;
  country: string;
  imdbRating?: number;
  budget?: number;
  boxOffice?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Showtime {
  id: string;
  movie: string | Movie;
  theater: string | Theater;
  date: string;
  time: string;
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
  availableSeats: number;
  bookedSeats: Array<{
    row: string;
    number: number;
    type: string;
    userId: string;
    bookedAt: string;
  }>;
  reservedSeats: Array<{
    row: string;
    number: number;
    type: string;
    userId: string;
    reservedAt: string;
    expiresAt: string;
  }>;
  isActive: boolean;
  specialOffers: Array<{
    type: string;
    description: string;
    value: number;
    isActive: boolean;
  }>;
}

export interface Theater {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    aisles: number[];
  };
  seats: Array<{
    row: string;
    number: number;
    type: string;
    price: number;
    isAvailable: boolean;
  }>;
  amenities: string[];
  isActive: boolean;
}

export const moviesAPI = {
  getMovies: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
    rating?: string;
    language?: string;
    sortBy?: string;
    sortOrder?: string;
    featured?: boolean;
  }) => {
    const response = await api.get('/api/movies', { params });
    return response.data;
  },

  getMovie: async (id: string) => {
    const response = await api.get(`/api/movies/${id}`);
    return response.data;
  },

  getFeaturedMovies: async () => {
    const response = await api.get('/api/movies/featured/list');
    return response.data;
  },

  getNowPlayingMovies: async () => {
    const response = await api.get('/api/movies/now-playing/list');
    return response.data;
  },

  getUpcomingMovies: async () => {
    const response = await api.get('/api/movies/upcoming/list');
    return response.data;
  },

  getMovieRecommendations: async (id: string) => {
    const response = await api.get(`/api/movies/${id}/recommendations`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/api/movies/meta/genres');
    return response.data;
  },

  getLanguages: async () => {
    const response = await api.get('/api/movies/meta/languages');
    return response.data;
  },
};

export default moviesAPI;