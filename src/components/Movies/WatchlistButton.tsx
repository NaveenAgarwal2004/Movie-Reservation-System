import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useCheckWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../../hooks/useWatchlist';
import toast from 'react-hot-toast';

interface WatchlistButtonProps {
  movieId: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ 
  movieId, 
  variant = 'button',
  size = 'md' 
}) => {
  const { isAuthenticated } = useAuth();
  const { data: watchlistStatus } = useCheckWatchlist(movieId);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const isInWatchlist = watchlistStatus?.inWatchlist || false;

  const handleToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add movies to watchlist');
      return;
    }

    if (isInWatchlist) {
      removeFromWatchlist.mutate(movieId);
    } else {
      addToWatchlist.mutate(movieId);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isInWatchlist ? (
          <HeartIconSolid className={`${sizeClasses[size]} text-red-500`} />
        ) : (
          <HeartIcon className={`${sizeClasses[size]} text-white`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isInWatchlist
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-gray-800 hover:bg-gray-700 text-white'
      }`}
    >
      {isInWatchlist ? (
        <>
          <HeartIconSolid className={sizeClasses[size]} />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <HeartIcon className={sizeClasses[size]} />
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
};

export default WatchlistButton;