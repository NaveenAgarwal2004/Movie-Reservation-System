const express = require('express');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get user bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: req.user.userId };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster duration rating' },
          { path: 'theater', select: 'name location' }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by reference
router.get('/:reference', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.reference,
      user: req.user.userId
    })
    .populate({
      path: 'showtime',
      populate: [
        { path: 'movie', select: 'title poster duration rating' },
        { path: 'theater', select: 'name location' }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', authMiddleware, [
  body('showtimeId').isMongoId().withMessage('Valid showtime ID is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  body('seats.*.row').notEmpty().withMessage('Seat row is required'),
  body('seats.*.number').isNumeric().withMessage('Seat number must be numeric'),
  body('seats.*.type').isIn(['standard', 'premium', 'vip']).withMessage('Valid seat type is required'),
  body('paymentMethod').isIn(['card', 'paypal', 'cash', 'wallet']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { showtimeId, seats, paymentMethod, discountCode } = req.body;

    // Find showtime
    const showtime = await Showtime.findById(showtimeId)
      .populate('movie', 'title')
      .populate('theater', 'name');

    if (!showtime || !showtime.isActive) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if seats are available
    const seatKeys = seats.map(seat => `${seat.row}-${seat.number}`);
    const bookedSeatKeys = showtime.bookedSeats.map(seat => `${seat.row}-${seat.number}`);
    const reservedSeatKeys = showtime.reservedSeats
      .filter(seat => seat.expiresAt > new Date())
      .map(seat => `${seat.row}-${seat.number}`);

    const unavailableSeats = seatKeys.filter(key => 
      bookedSeatKeys.includes(key) || reservedSeatKeys.includes(key)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are no longer available',
        unavailableSeats
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    seats.forEach(seat => {
      const price = showtime.price[seat.type];
      seat.price = price;
      totalAmount += price;
    });

    // Apply discount if provided
    let discount = null;
    if (discountCode) {
      // Here you would implement discount logic
      // For now, we'll just add the structure
      discount = {
        code: discountCode,
        type: 'percentage',
        value: 10,
        amount: totalAmount * 0.1
      };
      totalAmount -= discount.amount;
    }

    // Generate booking reference
    const bookingReference = uuidv4().substr(0, 8).toUpperCase();

    // Create booking
    const booking = new Booking({
      user: req.user.userId,
      showtime: showtimeId,
      seats,
      totalAmount,
      bookingReference,
      paymentMethod,
      discount
    });

    await booking.save();

    // Reserve seats (temporary hold)
    const reservationExpiry = new Date();
    reservationExpiry.setMinutes(reservationExpiry.getMinutes() + 15); // 15 minutes to complete payment

    seats.forEach(seat => {
      showtime.reservedSeats.push({
        row: seat.row,
        number: seat.number,
        type: seat.type,
        userId: req.user.userId,
        expiresAt: reservationExpiry
      });
    });

    await showtime.save();

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster duration rating' },
          { path: 'theater', select: 'name location' }
        ]
      });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking,
      paymentRequired: true,
      expiresAt: reservationExpiry
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm booking (after payment)
router.post('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'pending'
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.paymentDetails = {
      transactionId,
      paymentDate: new Date()
    };

    await booking.save();

    // Move seats from reserved to booked
    const showtime = await Showtime.findById(booking.showtime);
    
    // Remove from reserved seats
    showtime.reservedSeats = showtime.reservedSeats.filter(seat => 
      !booking.seats.some(bookingSeat => 
        seat.row === bookingSeat.row && seat.number === bookingSeat.number
      )
    );

    // Add to booked seats
    booking.seats.forEach(seat => {
      showtime.bookedSeats.push({
        row: seat.row,
        number: seat.number,
        type: seat.type,
        userId: req.user.userId
      });
    });

    // Update available seats count
    showtime.availableSeats -= booking.seats.length;

    await showtime.save();

    res.json({
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check if cancellation is allowed (e.g., not too close to showtime)
    const showtime = await Showtime.findById(booking.showtime);
    const showtimeDate = new Date(`${showtime.date.toDateString()} ${showtime.time}`);
    const now = new Date();
    const hoursUntilShow = (showtimeDate - now) / (1000 * 60 * 60);

    if (hoursUntilShow < 2) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 2 hours before showtime' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Release seats
    if (booking.status === 'confirmed') {
      // Remove from booked seats
      showtime.bookedSeats = showtime.bookedSeats.filter(seat => 
        !booking.seats.some(bookingSeat => 
          seat.row === bookingSeat.row && seat.number === bookingSeat.number
        )
      );

      // Update available seats count
      showtime.availableSeats += booking.seats.length;
      await showtime.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;