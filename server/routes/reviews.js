const express = require('express');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const { sanitizeBody } = require('../middleware/inputValidator');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10, sortBy = 'helpful' } = req.query;
    const skip = (page - 1) * limit;

    let sortOption = {};
    switch (sortBy) {
      case 'helpful':
        sortOption = { likes: -1 };
        break;
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'rating-high':
        sortOption = { rating: -1 };
        break;
      case 'rating-low':
        sortOption = { rating: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ movie: movieId, isActive: true })
      .populate('user', 'firstName lastName avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ movie: movieId, isActive: true });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { movie: mongoose.Types.ObjectId(movieId), isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      stats: avgRating[0] || { avgRating: 0, totalReviews: 0 },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review
router.post(
  '/',
  authMiddleware,
  sanitizeBody,
  [
    body('movieId').isMongoId().withMessage('Valid movie ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be 5-100 characters'),
    body('content')
      .trim()
      .isLength({ min: 20, max: 1000 })
      .withMessage('Content must be 20-1000 characters'),
    body('isSpoiler').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { movieId, rating, title, content, isSpoiler } = req.body;

      // Check if movie exists
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      // Check if user already reviewed this movie
      const existingReview = await Review.findOne({ user: req.user.userId, movie: movieId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this movie' });
      }

      // Check if user has booked this movie (verified purchase)
      const hasBooked = await Booking.findOne({
        user: req.user.userId,
        'showtime.movie': movieId,
        status: 'confirmed',
      });

      const review = new Review({
        user: req.user.userId,
        movie: movieId,
        rating,
        title,
        content,
        isSpoiler: isSpoiler || false,
        isVerifiedPurchase: !!hasBooked,
      });

      await review.save();

      const populatedReview = await Review.findById(review._id).populate(
        'user',
        'firstName lastName avatar'
      );

      res.status(201).json({
        message: 'Review created successfully',
        review: populatedReview,
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update review
router.put(
  '/:id',
  authMiddleware,
  sanitizeBody,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ min: 5, max: 100 }),
    body('content').optional().trim().isLength({ min: 20, max: 1000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const review = await Review.findOne({ _id: req.params.id, user: req.user.userId });
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      const { rating, title, content, isSpoiler } = req.body;

      if (rating) review.rating = rating;
      if (title) review.title = title;
      if (content) review.content = content;
      if (isSpoiler !== undefined) review.isSpoiler = isSpoiler;

      await review.save();

      const updatedReview = await Review.findById(review._id).populate(
        'user',
        'firstName lastName avatar'
      );

      res.json({
        message: 'Review updated successfully',
        review: updatedReview,
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isActive = false;
    await review.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like review
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user.userId;

    // Remove from dislikes if exists
    review.dislikes = review.dislikes.filter((id) => id.toString() !== userId);

    // Toggle like
    const likeIndex = review.likes.findIndex((id) => id.toString() === userId);
    if (likeIndex > -1) {
      review.likes.splice(likeIndex, 1);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.json({
      message: 'Review liked',
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike review
router.post('/:id/dislike', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user.userId;

    // Remove from likes if exists
    review.likes = review.likes.filter((id) => id.toString() !== userId);

    // Toggle dislike
    const dislikeIndex = review.dislikes.findIndex((id) => id.toString() === userId);
    if (dislikeIndex > -1) {
      review.dislikes.splice(dislikeIndex, 1);
    } else {
      review.dislikes.push(userId);
    }

    await review.save();

    res.json({
      message: 'Review disliked',
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });
  } catch (error) {
    console.error('Dislike review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
