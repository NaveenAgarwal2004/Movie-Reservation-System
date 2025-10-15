import { useState, useEffect } from 'react';
import axios from 'axios';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_KEY;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_KEY;

interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

interface YouTubeTrailer {
  videoId: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
}

interface UnsplashImage {
  url: string;
  photographer: string;
}

interface MovieData {
  // Basic Info
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string[];

  // People
  director: string;
  writers: string[];
  actors: string[];

  // Content
  plot: string;
  language: string;
  country: string;
  awards: string;

  // Media
  poster: string;
  backdrop?: string;
  trailer?: YouTubeTrailer;

  // Ratings
  imdbRating: string;
  imdbVotes: string;
  imdbId: string;
  imdbUrl: string;
  metascore: string;
  ratings: Array<{ source: string; value: string }>;

  // Additional
  boxOffice: string;
  production: string;
  type: string;
}

export const useMovieData = (movieTitle: string, movieYear?: string) => {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieTitle) {
      setLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch movie details from OMDb
        const omdbParams: Record<string, string> = {
          apikey: OMDB_API_KEY,
          t: movieTitle,
          plot: 'full',
        };

        if (movieYear) {
          omdbParams.y = movieYear;
        }

        const omdbResponse = await axios.get<OMDbMovie>('https://www.omdbapi.com/', {
          params: omdbParams,
        });

        if (omdbResponse.data.Response === 'False') {
          throw new Error('Movie not found');
        }

        const omdbData = omdbResponse.data;

        // 2. Fetch trailer from YouTube
        let trailerData: YouTubeTrailer | undefined;
        try {
          const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: `${movieTitle} ${omdbData.Year} official trailer`,
              key: YOUTUBE_API_KEY,
              type: 'video',
              maxResults: 1,
              videoDuration: 'medium',
            },
          });

          if (youtubeResponse.data.items && youtubeResponse.data.items.length > 0) {
            const video = youtubeResponse.data.items[0];
            trailerData = {
              videoId: video.id.videoId,
              title: video.snippet.title,
              thumbnail: video.snippet.thumbnails.high.url,
              embedUrl: `https://www.youtube.com/embed/${video.id.videoId}?autoplay=0&rel=0`,
            };
          }
        } catch (youtubeError) {
          console.warn('Failed to fetch YouTube trailer:', youtubeError);
        }

        // 3. Fetch backdrop image from Unsplash (optional)
        let backdropUrl: string | undefined;
        if (UNSPLASH_API_KEY) {
          try {
            const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
              params: {
                query: `${movieTitle} movie`,
                client_id: UNSPLASH_API_KEY,
                per_page: 1,
                orientation: 'landscape',
              },
            });

            if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
              backdropUrl = unsplashResponse.data.results[0].urls.regular;
            }
          } catch (unsplashError) {
            console.warn('Failed to fetch Unsplash backdrop:', unsplashError);
          }
        }

        // 4. Transform and combine data
        const movieData: MovieData = {
          title: omdbData.Title,
          year: omdbData.Year,
          rated: omdbData.Rated,
          released: omdbData.Released,
          runtime: omdbData.Runtime,
          genre: omdbData.Genre.split(', '),

          director: omdbData.Director,
          writers: omdbData.Writer.split(', '),
          actors: omdbData.Actors.split(', '),

          plot: omdbData.Plot,
          language: omdbData.Language,
          country: omdbData.Country,
          awards: omdbData.Awards,

          poster:
            omdbData.Poster !== 'N/A'
              ? omdbData.Poster
              : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
          backdrop: backdropUrl,
          trailer: trailerData,

          imdbRating: omdbData.imdbRating,
          imdbVotes: omdbData.imdbVotes,
          imdbId: omdbData.imdbID,
          imdbUrl: `https://www.imdb.com/title/${omdbData.imdbID}`,
          metascore: omdbData.Metascore,
          ratings: omdbData.Ratings.map((r) => ({
            source: r.Source,
            value: r.Value,
          })),

          boxOffice: omdbData.BoxOffice || 'N/A',
          production: omdbData.Production || 'N/A',
          type: omdbData.Type,
        };

        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch movie data');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieTitle, movieYear]);

  return { movie, loading, error };
};

// Search hook for movie search functionality
export const useMovieSearch = (query: string, page: number = 1) => {
  const [results, setResults] = useState<
    Array<{
      title: string;
      year: string;
      imdbID: string;
      type: string;
      poster: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('https://www.omdbapi.com/', {
          params: {
            apikey: OMDB_API_KEY,
            s: query,
            page,
            type: 'movie',
          },
        });

        if (response.data.Response === 'False') {
          setResults([]);
          setTotalResults(0);
          return;
        }

        const movies = response.data.Search.map((movie: any) => ({
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID,
          type: movie.Type,
          poster:
            movie.Poster !== 'N/A'
              ? movie.Poster
              : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
        }));

        setResults(movies);
        setTotalResults(parseInt(response.data.totalResults));
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [query, page]);

  return { results, loading, error, totalResults };
};
