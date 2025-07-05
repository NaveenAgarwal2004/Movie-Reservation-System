import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Movies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const movies = [
    {
      id: 1,
      title: 'The Dark Knight',
      poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 9.0,
      duration: '152 min',
      genre: ['Action', 'Crime', 'Drama'],
      year: 2008,
      language: 'English',
      description: 'Batman faces his greatest challenge yet when the Joker wreaks havoc on Gotham City.',
      isNowPlaying: true
    },
    {
      id: 2,
      title: 'Inception',
      poster: 'https://images.pexels.com/photos/7991664/pexels-photo-7991664.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.8,
      duration: '148 min',
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      year: 2010,
      language: 'English',
      description: 'A skilled thief enters the subconscious of his targets to steal their secrets.',
      isNowPlaying: true
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.6,
      duration: '169 min',
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      year: 2014,
      language: 'English',
      description: 'A team of explorers travel through a wormhole in space to save humanity.',
      isNowPlaying: false
    },
    {
      id: 4,
      title: 'Avatar: The Way of Water',
      poster: 'https://images.pexels.com/photos/7991730/pexels-photo-7991730.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.1,
      duration: '192 min',
      genre: ['Action', 'Adventure', 'Fantasy'],
      year: 2022,
      language: 'English',
      description: 'Jake Sully and Neytiri face new challenges as they protect their family.',
      isNowPlaying: true
    },
    {
      id: 5,
      title: 'Top Gun: Maverick',
      poster: 'https://images.pexels.com/photos/7991492/pexels-photo-7991492.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.3,
      duration: '130 min',
      genre: ['Action', 'Drama'],
      year: 2022,
      language: 'English',
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
      isNowPlaying: true
    },
    {
      id: 6,
      title: 'Black Panther',
      poster: 'https://images.pexels.com/photos/7991546/pexels-photo-7991546.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 7.3,
      duration: '134 min',
      genre: ['Action', 'Adventure', 'Sci-Fi'],
      year: 2018,
      language: 'English',
      description: 'T\'Challa returns home to Wakanda to take his rightful place as king.',
      isNowPlaying: false
    },
    {
      id: 7,
      title: 'Spider-Man: No Way Home',
      poster: 'https://images.pexels.com/photos/7991609/pexels-photo-7991609.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.4,
      duration: '148 min',
      genre: ['Action', 'Adventure', 'Fantasy'],
      year: 2021,
      language: 'English',
      description: 'Spider-Man seeks help from Doctor Strange to make people forget his identity.',
      isNowPlaying: true
    },
    {
      id: 8,
      title: 'Dune',
      poster: 'https://images.pexels.com/photos/7991688/pexels-photo-7991688.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.0,
      duration: '155 min',
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      year: 2021,
      language: 'English',
      description: 'Paul Atreides leads nomadic tribes in a revolt against the padishah emperor.',
      isNowPlaying: false
    }
  ];

  const genres = ['all', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre.includes(selectedGenre);
    const matchesRating = selectedRating === 'all' || 
      (selectedRating === 'high' && movie.rating >= 8.0) ||
      (selectedRating === 'medium' && movie.rating >= 7.0 && movie.rating < 8.0) ||
      (selectedRating === 'low' && movie.rating < 7.0);
    
    return matchesSearch && matchesGenre && matchesRating;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Movies</h1>
          <p className="text-gray-400 text-lg">
            Discover amazing movies and book your tickets today
          </p>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="all">All Ratings</option>
              <option value="high">8.0+ Rating</option>
              <option value="medium">7.0-7.9 Rating</option>
              <option value="low">Below 7.0</option>
            </select>

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
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {movie.rating}
                </div>
                {movie.isNowPlaying && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Now Playing
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">{movie.genre.join(', ')}</p>
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {movie.duration} • {movie.year}
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {movie.description}
                </p>
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

        {/* No Results */}
        {sortedMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setSelectedRating('all');
              }}
              className="mt-4 text-red-600 hover:text-red-400 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;