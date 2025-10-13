// src/pages/HomeWithTMDB.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import {
  useNowPlayingMovies,
  usePopularMovies,
  useTMDBGenres,
  convertTMDBToAppMovie,
} from '../hooks/useTMDB';
import TrailerModal from '../components/Movies/TrailerModal';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import type { TMDBMovie } from '../services/tmdbService';

interface AppMovie {
  id: string;
  title: string;
  backdrop: string;
  poster: string;
  rating: number;
  description: string;
  genre: string[];
  duration: string;
  trailerUrl?: string;
  year: number;
  language: string;
  releaseDate: string;
  director: string;
  cast?: Array<{ name: string; role: string; image: string }>;
  embedTrailerUrl?: string;
}

const HomeWithTMDB = () => {
  const [selectedTrailer, setSelectedTrailer] = useState<{ url: string; title: string } | null>(
    null
  );

  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useNowPlayingMovies();
  const { data: popularData, isLoading: popularLoading } = usePopularMovies();
  const { data: genres } = useTMDBGenres();

  const featuredMovies =
    popularData?.results
      .slice(0, 3)
      .map((movie: TMDBMovie) => convertTMDBToAppMovie(movie, genres || [])) || [];

  const nowPlaying =
    nowPlayingData?.results
      .slice(0, 8)
      .map((movie: TMDBMovie) => convertTMDBToAppMovie(movie, genres || [])) || [];

  const handlePlayTrailer = (movie: AppMovie) => {
    const trailerUrl = movie.embedTrailerUrl;
    if (trailerUrl) {
      setSelectedTrailer({ url: trailerUrl, title: movie.title });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {featuredMovies[0] && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${featuredMovies[0].backdrop})`,
            }}
          ></div>
        )}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Experience Cinema
            <span className="text-red-600"> Like Never Before</span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Book your favorite movies, select your perfect seats, and immerse yourself in the magic
            of cinema.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center transition-colors"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Book Now
            </Link>
            {featuredMovies[0]?.trailerUrl && (
              <button
                onClick={() => handlePlayTrailer(featuredMovies[0])}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Watch Trailer
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
            <Link
              to="/movies?filter=popular"
              className="text-red-600 hover:text-red-400 font-semibold flex items-center"
            >
              View All
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <LoadingSkeleton type="card" count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredMovies.map((movie: AppMovie, index: number) => (
                <motion.div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x600?text=No+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {movie.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{movie.genre.join(', ')}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{movie.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {movie.duration}
                      </div>
                      <Link
                        to={`/movies/${movie.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Now Playing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Now Playing</h2>
            <Link
              to="/movies"
              className="text-red-600 hover:text-red-400 font-semibold flex items-center"
            >
              View All
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {nowPlayingLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <LoadingSkeleton type="card" count={8} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {nowPlaying.map((movie: AppMovie, index: number) => (
                <motion.div
                  key={movie.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={`/movies/${movie.id}`}>
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-64 sm:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/300x450?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {movie.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-white font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {movie.duration}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose CineMax?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of movie booking with our advanced features and seamless user
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-400">
                Book your favorite movies in just a few clicks with our intuitive booking system.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Experience</h3>
              <p className="text-gray-400">
                Enjoy premium seating options and state-of-the-art sound and picture quality.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Flexible Timings</h3>
              <p className="text-gray-400">
                Choose from multiple showtimes throughout the day to fit your schedule.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          trailerUrl={selectedTrailer.url}
          movieTitle={selectedTrailer.title}
        />
      )}
    </div>
  );
};

export default HomeWithTMDB;
