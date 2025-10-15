import React from 'react';
import { User, Mail, Calendar, Ticket } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-blue-100">Manage your account and booking history</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                    <User className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="text-white font-medium">John Doe</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email Address</p>
                      <p className="text-white font-medium">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="text-white font-medium">January 2024</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Booking History */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Avengers: Endgame</p>
                          <p className="text-sm text-gray-400">Screen 1 • Seats A1, A2</p>
                          <p className="text-sm text-gray-400">Dec 15, 2024 • 7:30 PM</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Spider-Man: No Way Home</p>
                          <p className="text-sm text-gray-400">Screen 2 • Seat B5</p>
                          <p className="text-sm text-gray-400">Dec 10, 2024 • 9:00 PM</p>
                        </div>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">The Batman</p>
                          <p className="text-sm text-gray-400">Screen 3 • Seats C3, C4</p>
                          <p className="text-sm text-gray-400">Dec 5, 2024 • 6:00 PM</p>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  View All Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
