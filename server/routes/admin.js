const express = require('express');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalTheaters = await Theater.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalMovies,
      totalTheaters,
      totalUsers,
      todayBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recent bookings
router.get('/dashboard/recent-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'theater', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(bookings);
  } catch (error) {
    console.error('Recent bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Movies management
router.get('/movies', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Movie.countDocuments();
    
    res.json({
      movies,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/movies', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('genre').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('rating').isIn(['G', 'PG', 'PG-13', 'R', 'NC-17']).withMessage('Valid rating is required'),
  body('releaseDate').isISO8601().withMessage('Valid release date is required'),
  body('poster').isURL().withMessage('Valid poster URL is required'),
  body('director').trim().notEmpty().withMessage('Director is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Theaters management
router.get('/theaters', async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ createdAt: -1 });
    res.json(theaters);
  } catch (error) {
    console.error('Get theaters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/theaters', async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json({ message: 'Theater created successfully', theater });
  } catch (error) {
    console.error('Create theater error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings management
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) filter.status = status;
    
    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'theater', select: 'name' }
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
        total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;