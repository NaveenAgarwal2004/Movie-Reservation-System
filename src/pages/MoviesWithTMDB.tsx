// src/pages/MoviesWithTMDB.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import {
  useNowPlayingMovies,
  useSearchTMDBMovies,
  useTMDBGenres,
  useDiscoverByGenre,
  convertTMDBToAppMovie,
} from '../hooks/useTMDB';
import useDebounce from '../hooks/useDebounce';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import ErrorMessage from '../components/UI/ErrorMessage';

interface TMDBMovie {
  id: number;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  runtime?: number;
}

interface AppMovie {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
  rating: number;
  description: string;
  genre: string[];
  duration: string;
  year: number;
  language: string;
  releaseDate: string;
  director: string;
}

interface Genre {
  id: number;
  name: string;
}

const MoviesWithTMDB = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: genres } = useTMDBGenres();
  const {
    data: nowPlayingData,
    isLoading: nowPlayingLoading,
    error: nowPlayingError,
  } = useNowPlayingMovies(page);
  const { data: searchData, isLoading: searchLoading } = useSearchTMDBMovies(debouncedSearch, page);
  const { data: genreData, isLoading: genreLoading } = useDiscoverByGenre(
    selectedGenre !== 'all' ? parseInt(selectedGenre) : 0,
    page
  );

  // Determine which data to use
  let moviesData;
  let isLoading;

  if (debouncedSearch) {
    moviesData = searchData;
    isLoading = searchLoading;
  } else if (selectedGenre !== 'all') {
    moviesData = genreData;
    isLoading = genreLoading;
  } else {
    moviesData = nowPlayingData;
    isLoading = nowPlayingLoading;
  }

  const movies =
    moviesData?.results.map((movie: TMDBMovie) => convertTMDBToAppMovie(movie, genres || [])) || [];

  // Sort movies
  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return b.year - a.year;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalPages = moviesData?.total_pages || 1;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Movies</h1>
          <p className="text-gray-400 text-lg">Discover amazing movies from The Movie Database</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={!!searchTerm}
              >
                <option value="all">All Genres</option>
                {genres?.map((genre: Genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="rating">Sort by Rating</option>
              <option value="year">Sort by Year</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Searching for: <span className="text-white font-medium">{searchTerm}</span>
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {nowPlayingError && !searchTerm && (
          <ErrorMessage
            message="Failed to load movies. Please check your TMDB API key configuration."
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={8} />
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && sortedMovies.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedMovies.map((movie: AppMovie, index: number) => (
                <motion.div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {movie.rating.toFixed(1)}
                    </div>
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {movie.year}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                      {movie.genre.join(', ')}
                    </p>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {movie.duration}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{movie.description}</p>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="block w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = page <= 3 ? idx + 1 : page - 2 + idx;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            <p className="text-center text-gray-400 text-sm mt-4">
              Page {page} of {totalPages} • {moviesData?.total_results || 0} total results
            </p>
          </>
        )}

        {/* No Results */}
        {!isLoading && sortedMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No movies found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setPage(1);
              }}
              className="text-red-600 hover:text-red-400 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesWithTMDB;
