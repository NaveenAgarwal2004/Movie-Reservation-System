const express = require('express');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user's watchlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.userId }).sort({ addedAt: -1 });

    res.json(watchlist);
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
      movie: movieId,
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

module.exports = router;
