const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  genre: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    default: null
  },
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  director: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  country: {
    type: String,
    required: true
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  budget: {
    type: Number,
    default: 0
  },
  boxOffice: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
movieSchema.index({ title: 'text', description: 'text', genre: 'text' });

module.exports = mongoose.model('Movie', movieSchema);