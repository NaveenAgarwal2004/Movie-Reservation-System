const mongoose = require('mongoose');

const loyaltyPointsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['earned', 'redeemed', 'expired', 'bonus'],
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      description: String,
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
      },
    },
  ],
  lifetimePoints: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate tier based on lifetime points
loyaltyPointsSchema.methods.updateTier = function () {
  const points = this.lifetimePoints;

  if (points >= 10000) {
    this.tier = 'platinum';
  } else if (points >= 5000) {
    this.tier = 'gold';
  } else if (points >= 2000) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
};

// Add points
loyaltyPointsSchema.methods.addPoints = function (points, description, booking) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Points expire in 1 year

  this.transactions.push({
    type: 'earned',
    points,
    description,
    booking,
    expiresAt: expiryDate,
  });

  this.totalPoints += points;
  this.lifetimePoints += points;
  this.updateTier();
};

// Redeem points
loyaltyPointsSchema.methods.redeemPoints = function (points, description) {
  if (this.totalPoints < points) {
    throw new Error('Insufficient points');
  }

  this.transactions.push({
    type: 'redeemed',
    points: -points,
    description,
  });

  this.totalPoints -= points;
};

// Update updatedAt before saving
loyaltyPointsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index
loyaltyPointsSchema.index({ user: 1 });

module.exports = mongoose.model('LoyaltyPoints', loyaltyPointsSchema);
