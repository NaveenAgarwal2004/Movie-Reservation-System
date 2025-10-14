import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    poster: string;
    rating?: number;
    duration?: number;
    genre?: string[];
    year?: number;
    description?: string;
    isNowPlaying?: boolean;
  };
  index?: number;
  showDetails?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0, showDetails = true }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {movie.rating && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
            <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
            {movie.rating}
          </div>
        )}
        {movie.isNowPlaying && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Now Playing
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/movies/${movie.id}`}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            View Details
          </Link>
        </div>
      </div>

      {showDetails && (
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          {movie.genre && <p className="text-gray-400 text-sm mb-2">{movie.genre.join(', ')}</p>}
          {movie.duration && movie.year && (
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <ClockIcon className="h-4 w-4 mr-1" />
              {movie.duration} min • {movie.year}
            </div>
          )}
          {movie.description && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{movie.description}</p>
          )}
          <Link
            to={`/movies/${movie.id}`}
            className="block w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Book Now
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;
