import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Home = () => {
  const featuredMovies = [
    {
      id: 1,
      title: 'The Dark Knight',
      poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 9.0,
      duration: '152 min',
      genre: 'Action, Crime, Drama',
      description: 'Batman faces his greatest challenge yet when the Joker wreaks havoc on Gotham City.'
    },
    {
      id: 2,
      title: 'Inception',
      poster: 'https://images.pexels.com/photos/7991664/pexels-photo-7991664.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.8,
      duration: '148 min',
      genre: 'Action, Sci-Fi, Thriller',
      description: 'A skilled thief enters the subconscious of his targets to steal their secrets.'
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 8.6,
      duration: '169 min',
      genre: 'Adventure, Drama, Sci-Fi',
      description: 'A team of explorers travel through a wormhole in space to save humanity.'
    }
  ];

  const nowPlaying = [
    {
      id: 4,
      title: 'Avatar: The Way of Water',
      poster: 'https://images.pexels.com/photos/7991730/pexels-photo-7991730.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.1,
      duration: '192 min'
    },
    {
      id: 5,
      title: 'Top Gun: Maverick',
      poster: 'https://images.pexels.com/photos/7991492/pexels-photo-7991492.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.3,
      duration: '130 min'
    },
    {
      id: 6,
      title: 'Black Panther',
      poster: 'https://images.pexels.com/photos/7991546/pexels-photo-7991546.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 7.3,
      duration: '134 min'
    },
    {
      id: 7,
      title: 'Spider-Man',
      poster: 'https://images.pexels.com/photos/7991609/pexels-photo-7991609.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.4,
      duration: '148 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        ></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl sm:text-6xl font-bold text-indigo-500 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Experience Cinema
            <span className="text-red-600"> Like Never Before</span>
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Book your favorite movies, select your perfect seats, and immerse yourself in the magic of cinema.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center transition-colors"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Book Now
            </Link>
            <Link
              to="/movies?filter=upcoming"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View Trailers
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
            <Link
              to="/movies?filter=featured"
              className="text-red-600 hover:text-red-400 font-semibold flex items-center"
            >
              View All
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredMovies.map((movie, index) => (
              <motion.div 
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    {movie.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{movie.genre}</p>
                  <p className="text-gray-300 text-sm mb-4">{movie.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {movie.duration}
                    </div>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Playing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Now Playing</h2>
            <Link
              to="/movies"
              className="text-red-600 hover:text-red-400 font-semibold flex items-center"
            >
              View All
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {nowPlaying.map((movie, index) => (
              <motion.div 
                key={movie.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    {movie.rating}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-semibold mb-1">{movie.title}</h3>
                  <p className="text-gray-400 text-sm flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {movie.duration}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose CineMax?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of movie booking with our advanced features and seamless user experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-400">
                Book your favorite movies in just a few clicks with our intuitive booking system.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Experience</h3>
              <p className="text-gray-400">
                Enjoy premium seating options and state-of-the-art sound and picture quality.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Flexible Timings</h3>
              <p className="text-gray-400">
                Choose from multiple showtimes throughout the day to fit your schedule.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;