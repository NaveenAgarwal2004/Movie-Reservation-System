import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  FilmIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  TicketIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon, id: 'dashboard' },
    { name: 'Movies', href: '/admin/movies', icon: FilmIcon, id: 'movies' },
    { name: 'Theaters', href: '/admin/theaters', icon: BuildingOfficeIcon, id: 'theaters' },
    { name: 'Bookings', href: '/admin/bookings', icon: TicketIcon, id: 'bookings' },
    { name: 'Users', href: '/admin/users', icon: UsersIcon, id: 'users' },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon, id: 'settings' }
  ];

  // Mock data for dashboard
  const stats = [
    { name: 'Total Movies', value: '24', change: '+2', changeType: 'increase' },
    { name: 'Active Theaters', value: '8', change: '+1', changeType: 'increase' },
    { name: 'Today\'s Bookings', value: '156', change: '+12%', changeType: 'increase' },
    { name: 'Total Revenue', value: '$12,450', change: '+8%', changeType: 'increase' }
  ];

  const recentBookings = [
    {
      id: 'BK-001',
      user: 'John Doe',
      movie: 'The Dark Knight',
      theater: 'CineMax Downtown',
      amount: '$28.50',
      status: 'confirmed',
      date: '2024-01-15'
    },
    {
      id: 'BK-002',
      user: 'Jane Smith',
      movie: 'Inception',
      theater: 'CineMax Mall',
      amount: '$18.00',
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'BK-003',
      user: 'Mike Johnson',
      movie: 'Interstellar',
      theater: 'CineMax IMAX',
      amount: '$25.00',
      status: 'confirmed',
      date: '2024-01-14'
    }
  ];

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`text-sm ${
                stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <Link
            to="/admin/bookings"
            className="text-red-600 hover:text-red-400 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking ID
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {booking.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {booking.movie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MoviesManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Movies Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Movie
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Movies management interface will be implemented here.</p>
      </div>
    </div>
  );

  const TheatersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Theaters Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Theater
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Theaters management interface will be implemented here.</p>
      </div>
    </div>
  );

  const BookingsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Bookings management interface will be implemented here.</p>
      </div>
    </div>
  );

  const UsersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Users management interface will be implemented here.</p>
      </div>
    </div>
  );

  const Settings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Settings interface will be implemented here.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <div className="p-6">
            <div className="flex items-center">
              <FilmIcon className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
            </div>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href === '/admin' && location.pathname === '/admin');
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white border-r-4 border-red-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<MoviesManagement />} />
            <Route path="/theaters" element={<TheatersManagement />} />
            <Route path="/bookings" element={<BookingsManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/settings" element={<Settings />} />
            {/* Redirect /theaters to /admin/theaters */}
            <Route path="/theaters" element={<Navigate to="/admin/theaters" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;