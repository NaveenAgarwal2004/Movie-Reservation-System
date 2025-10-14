import React, { useState } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  content: string;
  likes: string[];
  dislikes: string[];
  isVerifiedPurchase: boolean;
  isSpoiler: boolean;
  createdAt: string;
}

interface ReviewSectionProps {
  movieId: string;
  reviews: Review[];
  stats: {
    avgRating: number;
    totalReviews: number;
  };
  onRefresh: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ movieId, reviews, stats, onRefresh }) => {
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('helpful');
  const [showSpoilers, setShowSpoilers] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    isSpoiler: false,
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          movieId,
          ...reviewForm,
        }),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewForm({ rating: 5, title: '', content: '', isSpoiler: false });
        onRefresh();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to submit review');
      }
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to like reviews');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        onRefresh();
      }
    } catch {
      toast.error('Failed to like review');
    }
  };

  const handleDislikeReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike reviews');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/dislike`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        onRefresh();
      }
    } catch {
      toast.error('Failed to dislike review');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Write a Review
          </button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{stats.avgRating.toFixed(1)}</div>
            {renderStars(Math.round(stats.avgRating), 'lg')}
            <p className="text-gray-400 text-sm mt-2">Based on {stats.totalReviews} reviews</p>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-400 w-12">{rating} star</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          className="bg-gray-800 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="focus:outline-none"
                  >
                    <StarIconSolid
                      className={`h-8 w-8 ${
                        star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Sum up your experience"
                required
                minLength={5}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Share your thoughts about this movie..."
                required
                minLength={20}
                maxLength={1000}
              ></textarea>
              <p className="text-sm text-gray-400 mt-1">
                {reviewForm.content.length}/1000 characters
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="spoiler"
                checked={reviewForm.isSpoiler}
                onChange={(e) => setReviewForm({ ...reviewForm, isSpoiler: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-600 rounded"
              />
              <label htmlFor="spoiler" className="ml-2 text-sm text-gray-300">
                This review contains spoilers
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm text-gray-400 mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showSpoilers}
            onChange={(e) => setShowSpoilers(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-300">Show spoilers</span>
        </label>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review._id}
              className="bg-gray-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {review.user.firstName[0]}
                        {review.user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {review.user.firstName} {review.user.lastName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {renderStars(review.rating, 'sm')}
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>

                  {review.isSpoiler && !showSpoilers ? (
                    <div className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm">
                        This review contains spoilers. Click to reveal.
                      </p>
                      <button
                        onClick={() => setShowSpoilers(true)}
                        className="text-red-400 text-sm mt-2 hover:text-red-300"
                      >
                        Show Spoilers
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-300 mb-4">{review.content}</p>
                  )}

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeReview(review._id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <HandThumbUpIcon className="h-5 w-5" />
                      <span className="text-sm">{review.likes.length}</span>
                    </button>
                    <button
                      onClick={() => handleDislikeReview(review._id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <HandThumbDownIcon className="h-5 w-5" />
                      <span className="text-sm">{review.dislikes.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
