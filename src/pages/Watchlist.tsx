import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrashIcon, BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import { useWatchlist, useRemoveFromWatchlist } from '../hooks/useWatchlist';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Watchlist = () => {
  const { data: watchlist, isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">{watchlist?.length || 0} movies in your watchlist</p>
        </div>

        {!watchlist || watchlist.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400 mb-6">Start adding movies you want to watch!</p>
            <Link
              to="/movies"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {watchlist.map((item: any, index: number) => {
              // Defensive check for movie data
              if (!item.movie) {
                console.warn('Watchlist item missing movie data:', item);
                return null;
              }

              return (
                <motion.div
                  key={item._id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/movies/${item.movie._id}`}>
                    <img
                      src={
                        item.movie.poster ||
                        'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster'
                      }
                      alt={item.movie.title || 'Unknown Movie'}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => removeFromWatchlist.mutate(item.movie._id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                      title="Remove from watchlist"
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                    </button>

                    {item.notifyOnAvailable ? (
                      <button
                        className="p-2 bg-green-600 rounded-full"
                        title="Notifications enabled"
                      >
                        <BellIcon className="h-4 w-4 text-white" />
                      </button>
                    ) : (
                      <button
                        className="p-2 bg-gray-600 rounded-full"
                        title="Notifications disabled"
                      >
                        <BellSlashIcon className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <Link to={`/movies/${item.movie._id}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {item.movie.title || 'Unknown Movie'}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-2">
                      {Array.isArray(item.movie.genre) ? item.movie.genre.join(', ') : 'N/A'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
