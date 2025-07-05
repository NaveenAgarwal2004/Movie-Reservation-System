const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    standard: {
      type: Number,
      required: true
    },
    premium: {
      type: Number,
      required: true
    },
    vip: {
      type: Number,
      required: true
    }
  },
  availableSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    row: String,
    number: Number,
    type: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reservedSeats: [{
    row: String,
    number: Number,
    type: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reservedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  specialOffers: [{
    type: {
      type: String,
      enum: ['discount', 'combo', 'early-bird']
    },
    description: String,
    value: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
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
showtimeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
showtimeSchema.index({ movie: 1, date: 1, time: 1 });
showtimeSchema.index({ theater: 1, date: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);