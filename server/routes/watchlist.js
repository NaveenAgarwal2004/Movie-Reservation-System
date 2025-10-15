/* eslint-env node */
import express from 'express';
import axios from 'axios';
import Watchlist from '../models/Watchlist.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// OMDB and TMDB configuration
const OMDB_API_KEY = import.meta.env.OMDB_API_KEY;
const TMDB_API_KEY = import.meta.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to fetch movie data from OMDB with TMDB fallback
const fetchMovieData = async (imdbId) => {
  try {
    // Try OMDB first
    if (OMDB_API_KEY) {
      const omdbResponse = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: OMDB_API_KEY,
          i: imdbId,
          plot: 'short',
        },
        timeout: 5000,
      });

      if (omdbResponse.data && omdbResponse.data.Response === 'True') {
        return {
          _id: omdbResponse.data.imdbID,
          title: omdbResponse.data.Title,
          poster:
            omdbResponse.data.Poster !== 'N/A'
              ? omdbResponse.data.Poster
              : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
          genre: omdbResponse.data.Genre ? omdbResponse.data.Genre.split(', ') : [],
        };
      }
    }

    // Fallback to TMDB if OMDB fails or no API key
    if (TMDB_API_KEY) {
      // Convert IMDB ID to TMDB ID (this is a simplified approach)
      // In a real implementation, you might need a mapping service
      const tmdbResponse = await axios.get(`${TMDB_BASE_URL}/find/${imdbId}`, {
        params: {
          api_key: TMDB_API_KEY,
          external_source: 'imdb_id',
        },
        timeout: 5000,
      });

      if (
        tmdbResponse.data &&
        tmdbResponse.data.movie_results &&
        tmdbResponse.data.movie_results.length > 0
      ) {
        const movie = tmdbResponse.data.movie_results[0];
        return {
          _id: imdbId, // Keep IMDB ID as _id for consistency
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
          genre: movie.genre_ids || [], // TMDB uses genre IDs, frontend will handle mapping
        };
      }
    }

    // Final fallback
    return {
      _id: imdbId,
      title: 'Unknown Movie',
      poster: 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
      genre: [],
    };
  } catch (error) {
    console.warn(`Failed to fetch movie data for ${imdbId}:`, error.message);
    return {
      _id: imdbId,
      title: 'Unknown Movie',
      poster: 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
      genre: [],
    };
  }
};

// Get user's watchlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.userId }).sort({ addedAt: -1 });

    // Fetch movie details for each watchlist item
    const watchlistWithMovies = await Promise.all(
      watchlist.map(async (item) => {
        const movieData = await fetchMovieData(item.movieTmdbId);
        return {
          ...item.toObject(),
          movie: movieData,
        };
      })
    );

    res.json(watchlistWithMovies);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to watchlist
router.post('/:movieId', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;

    const exists = await Watchlist.findOne({ user: req.user.userId, movieTmdbId: movieId });
    if (exists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    const watchlistItem = new Watchlist({
      user: req.user.userId,
      movieTmdbId: movieId,
    });

    await watchlistItem.save();

    res.status(201).json({
      message: 'Added to watchlist',
      item: watchlistItem,
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from watchlist
router.delete('/:movieId', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;

    const result = await Watchlist.findOneAndDelete({
      user: req.user.userId,
      movieTmdbId: movieId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Movie not in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle notification
router.patch('/:movieId/notify', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { notifyOnAvailable } = req.body;

    const watchlistItem = await Watchlist.findOne({
      user: req.user.userId,
      movieTmdbId: movieId,
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Movie not in watchlist' });
    }

    watchlistItem.notifyOnAvailable = notifyOnAvailable;
    await watchlistItem.save();

    res.json({
      message: 'Notification preference updated',
      notifyOnAvailable: watchlistItem.notifyOnAvailable,
    });
  } catch (error) {
    console.error('Toggle notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if movie is in watchlist
router.get('/check/:movieId', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.params;

    const exists = await Watchlist.findOne({
      user: req.user.userId,
      movieTmdbId: movieId,
    });

    res.json({ inWatchlist: !!exists });
  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
