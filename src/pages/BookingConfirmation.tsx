import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, TicketIcon, CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const { reference } = useParams<{ reference: string }>();

  // Mock booking data - in real app, this would be fetched based on reference
  const booking = {
    reference: reference || 'BK-2024-001',
    movie: {
      title: 'The Dark Knight',
      poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '152 min',
      rating: 9.0
    },
    theater: {
      name: 'CineMax Downtown',
      address: '123 Main Street, Downtown'
    },
    showtime: {
      date: '2024-01-15',
      time: '7:30 PM'
    },
    seats: [
      { row: 'H', number: 15, type: 'standard' },
      { row: 'H', number: 16, type: 'standard' }
    ],
    totalAmount: 28.50,
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-123456789',
    bookedAt: '2024-01-10T10:30:00Z'
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">
            Your tickets have been successfully booked
          </p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={booking.movie.poster}
                alt={booking.movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {booking.movie.title}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">{booking.theater.name}</p>
                      <p className="text-sm text-gray-400">{booking.theater.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <CalendarDaysIcon className="h-5 w-5 mr-3" />
                    <span>{new Date(booking.showtime.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    <span>{booking.showtime.time}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <TicketIcon className="h-5 w-5 mr-3" />
                    <span>
                      Seats: {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Reference */}
          <div className="bg-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Booking Reference</p>
                <p className="text-lg font-mono font-bold text-white">{booking.reference}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-green-400">${booking.totalAmount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Payment Method</p>
              <p className="text-white font-medium">{booking.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Transaction ID</p>
              <p className="text-white font-mono">{booking.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Booking Date</p>
              <p className="text-white">
                {new Date(booking.bookedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                Confirmed
              </span>
            </div>
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Important Information</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Please arrive at least 15 minutes before the showtime</li>
            <li>• Bring a valid ID for verification</li>
            <li>• Your booking reference will be required at the theater</li>
            <li>• Cancellations are allowed up to 2 hours before showtime</li>
            <li>• Outside food and beverages are not permitted</li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Download Ticket
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Add to Calendar
          </button>
          <Link
            to="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            View All Bookings
          </Link>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/"
            className="text-red-600 hover:text-red-400 font-medium"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;