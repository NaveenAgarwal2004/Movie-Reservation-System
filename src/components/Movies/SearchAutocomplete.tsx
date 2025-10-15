import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface SearchResult {
  _id: string;
  title: string;
  poster: string;
  releaseDate: string;
  genre: string[];
}

const SearchAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/movies?search=${searchQuery}&limit=5`);
      setResults(response.data.movies || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: SearchResult) => {
    addToRecentSearches(movie.title);
    setQuery('');
    setIsOpen(false);
    navigate(`/movies/${movie._id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToRecentSearches(query);
      setIsOpen(false);
      navigate(`/movies?search=${encodeURIComponent(query)}`);
    }
  };

  const addToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for movies..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : query.length >= 2 && results.length > 0 ? (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                  Search Results
                </div>
                {results.map((movie) => (
                  <button
                    key={movie._id}
                    onClick={() => handleSelectMovie(movie)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{movie.title}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(movie.releaseDate).getFullYear()} • {movie.genre.join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-400">No movies found</div>
            ) : null}

            {query.length < 2 && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors"
                  >
                    <button
                      onClick={() => {
                        setQuery(search);
                        performSearch(search);
                      }}
                      className="flex items-center space-x-3 flex-1 text-left"
                    >
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{search}</span>
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAutocomplete;
