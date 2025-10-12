const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieTmdbId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  notifyOnAvailable: {
    type: Boolean,
    default: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
});

// Compound index
watchlistSchema.index({ user: 1, movieTmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
