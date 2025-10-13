// src/pages/Theaters.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Theaters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  const theaters = [
    {
      id: 1,
      name: 'CineMax Downtown IMAX',
      address: '123 Main Street, Downtown',
      city: 'New York',
      phone: '+1 (555) 123-4567',
      screens: 8,
      seats: 1200,
      amenities: [
        'IMAX',
        'Dolby Atmos',
        '4K Projection',
        'Recliner Seats',
        'Food Court',
        'Parking',
      ],
      image:
        'https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=600',
      timing: '9:00 AM - 11:00 PM',
      rating: 4.5,
      nowShowing: ['The Dark Knight', 'Inception', 'Interstellar'],
    },
    {
      id: 2,
      name: 'CineMax Shopping Mall',
      address: '456 Shopping Center Blvd',
      city: 'Los Angeles',
      phone: '+1 (555) 234-5678',
      screens: 6,
      seats: 900,
      amenities: ['3D', 'Premium Sound', 'Food Service', 'Parking', 'Gaming Zone'],
      image:
        'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
      timing: '10:00 AM - 12:00 AM',
      rating: 4.3,
      nowShowing: ['Avatar', 'Top Gun: Maverick', 'Spider-Man'],
    },
    {
      id: 3,
      name: 'CineMax Premium',
      address: '789 Entertainment District',
      city: 'Chicago',
      phone: '+1 (555) 345-6789',
      screens: 10,
      seats: 1500,
      amenities: [
        'IMAX',
        '4K Projection',
        'VIP Lounge',
        'Recliner Seats',
        'Restaurant',
        'Bar',
        'Parking',
      ],
      image:
        'https://images.pexels.com/photos/7991688/pexels-photo-7991688.jpeg?auto=compress&cs=tinysrgb&w=600',
      timing: '9:30 AM - 11:30 PM',
      rating: 4.7,
      nowShowing: ['Dune', 'Black Panther', 'The Batman'],
    },
    {
      id: 4,
      name: 'CineMax Express',
      address: '321 Quick Plaza',
      city: 'New York',
      phone: '+1 (555) 456-7890',
      screens: 4,
      seats: 600,
      amenities: ['Digital Projection', 'Food Service', 'Parking'],
      image:
        'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=600',
      timing: '11:00 AM - 10:00 PM',
      rating: 4.0,
      nowShowing: ['Inception', 'Tenet', 'Dunkirk'],
    },
  ];

  const cities = ['all', 'New York', 'Los Angeles', 'Chicago'];
  const amenities = [
    'all',
    'IMAX',
    'Dolby Atmos',
    '3D',
    '4K Projection',
    'Recliner Seats',
    'Food Court',
  ];

  const filteredTheaters = theaters.filter((theater) => {
    const matchesSearch =
      theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theater.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || theater.city === selectedCity;
    const matchesAmenity = selectedAmenity === 'all' || theater.amenities.includes(selectedAmenity);

    return matchesSearch && matchesCity && matchesAmenity;
  });

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Our Theaters</h1>
          <p className="text-xl text-gray-400">
            Find the perfect cinema near you with state-of-the-art facilities
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search theaters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* City Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Amenity Filter */}
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {amenities.map((amenity) => (
                <option key={amenity} value={amenity}>
                  {amenity === 'all' ? 'All Amenities' : amenity}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Theater Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTheaters.map((theater, index) => (
            <motion.div
              key={theater.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="relative h-48">
                <img
                  src={theater.image}
                  alt={theater.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold flex items-center">
                  ⭐ {theater.rating}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{theater.name}</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-3 flex-shrink-0 text-red-400" />
                    <span>{theater.address}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <PhoneIcon className="h-5 w-5 mr-3 text-green-400" />
                    <span>{theater.phone}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <ClockIcon className="h-5 w-5 mr-3 text-blue-400" />
                    <span>{theater.timing}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-gray-700">
                  <span>{theater.screens} Screens</span>
                  <span>{theater.seats} Seats</span>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {theater.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full flex items-center"
                      >
                        <CheckCircleIcon className="h-3 w-3 mr-1 text-green-400" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Now Showing */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Now Showing:</h4>
                  <div className="flex flex-wrap gap-2">
                    {theater.nowShowing.map((movie, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full"
                      >
                        {movie}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to={`/movies?theater=${theater.id}`}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    View Movies
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTheaters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No theaters found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setSelectedAmenity('all');
              }}
              className="text-red-600 hover:text-red-400 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
            <p className="text-gray-400">
              State-of-the-art sound and projection systems for the best viewing experience
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Convenient Locations</h3>
            <p className="text-gray-400">Multiple theaters across the city for easy access</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Flexible Timings</h3>
            <p className="text-gray-400">
              Multiple showtimes throughout the day to fit your schedule
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Theaters;
