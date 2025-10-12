const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  seats: [{
    row: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['standard', 'premium', 'vip'],
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'cash', 'wallet'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    refundId: String,
    refundDate: Date
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: Number,
    code: String,
    amount: {
      type: Number,
      default: 0
    }
  },
  additionalServices: [{
    type: {
      type: String,
      enum: ['food', 'parking', 'insurance']
    },
    description: String,
    price: Number
  }],
  qrCode: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
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

// Efficient indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 }, { unique: true });
bookingSchema.index({ showtime: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'seats.row': 1, 'seats.number': 1, showtime: 1 });
bookingSchema.index({ createdAt: -1 });

// Update updatedAt before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);