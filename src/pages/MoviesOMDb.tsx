import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useMovieSearch } from '../hooks/useMovieData';
import useDebounce from '../hooks/useDebounce';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const MoviesOMDb = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { results: movies, loading, error, totalResults } = useMovieSearch(debouncedSearch, page);

  // Popular movies to show when no search
  const popularMovies = [
    'The Dark Knight',
    'Inception',
    'Interstellar',
    'The Shawshank Redemption',
    'Pulp Fiction',
    'The Godfather',
    'Fight Club',
    'Forrest Gump',
    'The Matrix',
    'Goodfellas',
    'The Lord of the Rings',
    'Star Wars',
    'Avengers Endgame',
    'Spider-Man',
    'Batman Begins',
    'Iron Man',
  ];

  const [defaultMovies, setDefaultMovies] = useState<typeof movies>([]);
  const [defaultLoading, setDefaultLoading] = useState(true);

  // Fetch popular movies on mount
  useState(() => {
    const fetchPopularMovies = async () => {
      setDefaultLoading(true);
      const fetchedMovies: typeof movies = [];

      for (const title of popularMovies.slice(0, 16)) {
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&t=${encodeURIComponent(title)}`
          );
          const data = await response.json();

          if (data.Response === 'True') {
            fetchedMovies.push({
              title: data.Title,
              year: data.Year,
              imdbID: data.imdbID,
              type: data.Type,
              poster:
                data.Poster !== 'N/A'
                  ? data.Poster
                  : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
            });
          }
        } catch (err) {
          console.error(`Failed to fetch ${title}:`, err);
        }
      }

      setDefaultMovies(fetchedMovies);
      setDefaultLoading(false);
    };

    fetchPopularMovies();
  });

  const displayMovies = debouncedSearch ? movies : defaultMovies;
  const isLoading = debouncedSearch ? loading : defaultLoading;

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Movies</h1>
          <p className="text-gray-400 text-lg">Discover amazing movies powered by OMDb</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="year">Sort by Year</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Searching for: <span className="text-white font-medium">{searchTerm}</span>
                {totalResults > 0 && ` (${totalResults} results)`}
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
        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={12} />
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && displayMovies.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayMovies.map((movie, index) => (
                <motion.div
                  key={movie.imdbID}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link to={`/movies/${movie.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Image';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {movie.year}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <div className="bg-red-600 rounded-full p-4">
                            <svg
                              className="h-8 w-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm capitalize">{movie.type}</span>
                        <span className="text-gray-400 text-sm">{movie.year}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {debouncedSearch && totalPages > 1 && (
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
              {debouncedSearch
                ? `Page ${page} of ${totalPages} • ${totalResults} total results`
                : `Showing ${displayMovies.length} popular movies`}
            </p>
          </>
        )}

        {/* No Results */}
        {!isLoading && displayMovies.length === 0 && debouncedSearch && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No movies found for "{searchTerm}"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="text-red-600 hover:text-red-400 font-semibold"
            >
              Clear search and browse popular movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesOMDb;
