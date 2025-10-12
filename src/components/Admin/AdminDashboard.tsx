import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FilmIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  TicketIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useDashboardStats, useRecentBookings } from '../../hooks/useAdmin';
import LoadingSkeleton from '../UI/LoadingSkeleton';
import ErrorMessage from '../UI/ErrorMessage';

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentBookings, isLoading: bookingsLoading, error: bookingsError } = useRecentBookings();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data for charts
  const revenueData = [
    { name: 'Mon', revenue: 1200, bookings: 45 },
    { name: 'Tue', revenue: 1900, bookings: 67 },
    { name: 'Wed', revenue: 1600, bookings: 58 },
    { name: 'Thu', revenue: 2200, bookings: 78 },
    { name: 'Fri', revenue: 3100, bookings: 105 },
    { name: 'Sat', revenue: 3800, bookings: 128 },
    { name: 'Sun', revenue: 3400, bookings: 115 }
  ];

  const genreData = [
    { name: 'Action', value: 35, color: '#EF4444' },
    { name: 'Drama', value: 25, color: '#3B82F6' },
    { name: 'Comedy', value: 20, color: '#10B981' },
    { name: 'Sci-Fi', value: 15, color: '#8B5CF6' },
    { name: 'Horror', value: 5, color: '#F59E0B' }
  ];

  const moviePerformance = [
    { name: 'The Dark Knight', bookings: 245, revenue: 3675 },
    { name: 'Inception', bookings: 198, revenue: 2970 },
    { name: 'Interstellar', bookings: 167, revenue: 2505 },
    { name: 'Avatar', bookings: 156, revenue: 2340 },
    { name: 'Spider-Man', bookings: 134, revenue: 2010 }
  ];

  const theaterOccupancy = [
    { name: 'Downtown', occupancy: 85 },
    { name: 'Mall', occupancy: 78 },
    { name: 'IMAX', occupancy: 92 },
    { name: 'Uptown', occupancy: 65 }
  ];

  if (statsLoading || bookingsLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  if (statsError || bookingsError) {
    return (
      <ErrorMessage 
        message="Failed to load dashboard data" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  const statCards = [
    { 
      name: 'Total Revenue', 
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, 
      icon: CurrencyDollarIcon, 
      change: '+12.5%',
      trend: 'up',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      name: 'Total Movies', 
      value: stats?.totalMovies || 0, 
      icon: FilmIcon, 
      change: '+2',
      trend: 'up',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      name: 'Active Theaters', 
      value: stats?.totalTheaters || 0, 
      icon: BuildingOfficeIcon, 
      change: '+1',
      trend: 'up',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      name: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: UsersIcon, 
      change: '+15.3%',
      trend: 'up',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      name: 'Today\'s Bookings', 
      value: stats?.todayBookings || 0, 
      icon: TicketIcon, 
      change: '+8.2%',
      trend: 'up',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          
          return (
            <motion.div
              key={stat.name}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Revenue & Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Popular Genres</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movie Performance */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Movies by Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moviePerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="bookings" fill="#EF4444" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Theater Occupancy */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Theater Occupancy Rate</h3>
          <div className="space-y-4">
            {theaterOccupancy.map((theater, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{theater.name}</span>
                  <span className="text-gray-400">{theater.occupancy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      theater.occupancy >= 80 ? 'bg-green-500' :
                      theater.occupancy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${theater.occupancy}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
            View All →
          </button>
        </div>
        
        {recentBookings && recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentBookings.slice(0, 5).map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                      {booking.bookingReference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {booking.showtime?.movie?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No recent bookings found</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;