const express = require('express');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Theater = require('../models/Theater');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all movies with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      rating,
      language,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (genre) {
      filter.genre = { $in: genre.split(',') };
    }
    
    if (rating) {
      filter.rating = { $in: rating.split(',') };
    }
    
    if (language) {
      filter.language = language;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(filter);

    res.json({
      movies,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single movie with showtimes
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get showtimes for this movie (next 7 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const showtimes = await Showtime.find({
      movie: movie._id,
      date: { $gte: startDate, $lte: endDate },
      isActive: true
    })
    .populate('theater', 'name location amenities')
    .sort({ date: 1, time: 1 });

    res.json({
      movie,
      showtimes
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie genres
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genre', { isActive: true });
    res.json(genres);
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie languages
router.get('/meta/languages', async (req, res) => {
  try {
    const languages = await Movie.distinct('language', { isActive: true });
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured movies
router.get('/featured/list', async (req, res) => {
  try {
    const movies = await Movie.find({ isFeatured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(movies);
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get now playing movies
router.get('/now-playing/list', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const movieIds = await Showtime.distinct('movie', {
      date: { $gte: today },
      isActive: true
    });

    const movies = await Movie.find({
      _id: { $in: movieIds },
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(movies);
  } catch (error) {
    console.error('Get now playing movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming movies
router.get('/upcoming/list', async (req, res) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const movies = await Movie.find({
      releaseDate: { $gt: today, $lte: futureDate },
      isActive: true
    }).sort({ releaseDate: 1 });

    res.json(movies);
  } catch (error) {
    console.error('Get upcoming movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Simple recommendation based on genre
    const recommendations = await Movie.find({
      _id: { $ne: movie._id },
      genre: { $in: movie.genre },
      isActive: true
    })
    .sort({ imdbRating: -1 })
    .limit(6);

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;