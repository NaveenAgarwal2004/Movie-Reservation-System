import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TicketIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock booking data
  const bookings = [
    {
      id: '1',
      reference: 'BK-2024-001',
      movie: {
        title: 'The Dark Knight',
        poster:
          'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '152 min',
        rating: 9.0,
      },
      theater: {
        name: 'CineMax Downtown',
        address: '123 Main St, Downtown',
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
      status: 'confirmed',
      bookedAt: '2024-01-10T10:30:00Z',
    },
    {
      id: '2',
      reference: 'BK-2024-002',
      movie: {
        title: 'Inception',
        poster:
          'https://images.pexels.com/photos/7991664/pexels-photo-7991664.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '148 min',
        rating: 8.8,
      },
      theater: {
        name: 'CineMax Mall',
        address: '456 Shopping Center Blvd',
      },
      showtime: {
        date: '2024-01-20',
        time: '4:00 PM',
      },
      seats: [{ row: 'F', number: 12, type: 'premium' }],
      totalAmount: 18.0,
      status: 'confirmed',
      bookedAt: '2024-01-12T14:20:00Z',
    },
    {
      id: '3',
      reference: 'BK-2024-003',
      movie: {
        title: 'Interstellar',
        poster:
          'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: '169 min',
        rating: 8.6,
      },
      theater: {
        name: 'CineMax IMAX',
        address: '789 Entertainment District',
      },
      showtime: {
        date: '2024-01-05',
        time: '9:00 PM',
      },
      seats: [
        { row: 'J', number: 8, type: 'standard' },
        { row: 'J', number: 9, type: 'standard' },
      ],
      totalAmount: 25.0,
      status: 'completed',
      bookedAt: '2024-01-02T16:45:00Z',
    },
  ];

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.showtime.date) > new Date() && booking.status === 'confirmed'
  );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.showtime.date) <= new Date() || booking.status === 'completed'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <motion.div
      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start space-x-4">
        <img
          src={booking.movie.poster}
          alt={booking.movie.title}
          className="w-20 h-28 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{booking.movie.title}</h3>
              <p className="text-gray-400 text-sm mb-2">Booking Reference: {booking.reference}</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">${booking.totalAmount}</p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{booking.theater.name}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <CalendarDaysIcon className="h-4 w-4 mr-2" />
              <span>{new Date(booking.showtime.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{booking.showtime.time}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <TicketIcon className="h-4 w-4 mr-2" />
              <span>
                Seats: {booking.seats.map((seat) => `${seat.row}${seat.number}`).join(', ')}
              </span>
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <Link
              to={`/booking-confirmation/${booking.reference}`}
              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Details
            </Link>
            {booking.status === 'confirmed' && new Date(booking.showtime.date) > new Date() && (
              <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-400">Manage your movie bookings and preferences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gray-800 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl font-bold text-red-500 mb-2">{upcomingBookings.length}</div>
            <div className="text-gray-400">Upcoming Bookings</div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-blue-500 mb-2">{pastBookings.length}</div>
            <div className="text-gray-400">Movies Watched</div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-green-500 mb-2">
              ${bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toFixed(2)}
            </div>
            <div className="text-gray-400">Total Spent</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Past Bookings ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {activeTab === 'upcoming' ? (
            upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            ) : (
              <div className="text-center py-12">
                <TicketIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No upcoming bookings</h3>
                <p className="text-gray-500 mb-4">Book your next movie experience today!</p>
                <Link
                  to="/movies"
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Browse Movies
                </Link>
              </div>
            )
          ) : pastBookings.length > 0 ? (
            pastBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No past bookings</h3>
              <p className="text-gray-500">Your booking history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
