import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  TicketIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { generateTicketPDF, generateQRCode } from '../utils/ticketGenerator';
import { useAuth } from '../contexts/AuthContext';

const BookingConfirmation = () => {
  const { reference } = useParams<{ reference: string }>();
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string>('');

  const booking = {
    reference: reference || 'BK-2024-001',
    movie: {
      title: 'The Dark Knight',
      poster:
        'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '152 min',
      rating: 9.0,
    },
    theater: {
      name: 'CineMax Downtown',
      address: '123 Main Street, Downtown',
    },
    showtime: {
      date: '2024-01-15',
      time: '7:30 PM',
    },
    seats: [
      { row: 'H', number: 15, type: 'standard' },
      { row: 'H', number: 16, type: 'standard' },
    ],
    totalAmount: 28.5,
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-123456789',
    bookedAt: '2024-01-10T10:30:00Z',
  };

  useEffect(() => {
    generateQRCode(booking.reference)
      .then((qr) => setQrCode(qr))
      .catch((err) => console.error('QR generation failed:', err));
  }, [booking.reference]);

  const handleDownloadTicket = () => {
    if (user) {
      generateTicketPDF({
        ...booking,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }
  };

  const handleAddToCalendar = () => {
    const event = {
      title: `${booking.movie.title} - CineMax`,
      description: `Movie: ${booking.movie.title}\nTheater: ${booking.theater.name}\nSeats: ${booking.seats.map((s) => `${s.row}${s.number}`).join(', ')}`,
      location: booking.theater.address,
      startDate: new Date(`${booking.showtime.date} ${booking.showtime.time}`),
      duration: 180, // minutes
    };

    const startDate = event.startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(event.startDate.getTime() + event.duration * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${booking.movie.title} - Movie Booking`,
          text: `I just booked tickets for ${booking.movie.title} at ${booking.theater.name}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 text-lg">Your tickets have been successfully booked</p>
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          className="bg-gray-800 rounded-lg p-8 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {qrCode && <img src={qrCode} alt="Booking QR Code" className="w-48 h-48 mx-auto mb-4" />}
          <p className="text-white font-mono font-bold text-xl mb-2">{booking.reference}</p>
          <p className="text-gray-400 text-sm">Show this QR code at the theater entrance</p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={booking.movie.poster}
                alt={booking.movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">{booking.movie.title}</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{booking.theater.name}</p>
                      <p className="text-sm text-gray-400">{booking.theater.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <CalendarDaysIcon className="h-5 w-5 mr-3" />
                    <span>
                      {new Date(booking.showtime.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    <span>{booking.showtime.time}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <TicketIcon className="h-5 w-5 mr-3" />
                    <span>
                      Seats: {booking.seats.map((seat) => `${seat.row}${seat.number}`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Amount Paid</p>
              <p className="text-2xl font-bold text-green-400">${booking.totalAmount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Payment Method</p>
              <p className="text-white font-medium">{booking.paymentMethod}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Download Ticket</span>
          </button>

          <button
            onClick={handleAddToCalendar}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <CalendarDaysIcon className="h-5 w-5" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                ✓ Confirmed
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Number of Tickets</p>
              <p className="text-white">{booking.seats.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            Important Information
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please arrive at least 15 minutes before the showtime</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bring a valid ID for verification</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Show the QR code or booking reference at the theater entrance</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Cancellations allowed up to 2 hours before showtime</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Outside food and beverages are not permitted</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please maintain theater etiquette during the show</span>
            </li>
          </ul>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            to="/dashboard"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            View All Bookings
          </Link>
          <Link
            to="/movies"
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            Book Another Movie
          </Link>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          className="text-center mt-8 p-6 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p className="text-gray-400 text-sm mb-2">Need help with your booking?</p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@cinemax.com"
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Email Support
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="tel:1800-123-4567"
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Call 1800-123-4567
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
