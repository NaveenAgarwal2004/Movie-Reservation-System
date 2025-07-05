import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  StarIcon, 
  ClockIcon, 
  CalendarDaysIcon, 
  MapPinIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');

  // Mock movie data - in real app, this would come from API
  const movie = {
    id: 1,
    title: 'The Dark Knight',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
    backdrop: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920',
    rating: 9.0,
    duration: '152 min',
    genre: ['Action', 'Crime', 'Drama'],
    year: 2008,
    language: 'English',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Heath Ledger', role: 'Joker', image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
      { name: 'Michael Caine', role: 'Alfred', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150' }
    ],
    description: 'Batman faces his greatest challenge yet when the Joker wreaks havoc on Gotham City. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the city streets.',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
  };

  const showtimes = [
    {
      date: '2024-01-15',
      theaters: [
        {
          id: 1,
          name: 'CineMax Downtown',
          address: '123 Main St, Downtown',
          times: ['10:00 AM', '1:30 PM', '4:00 PM', '7:30 PM', '10:00 PM'],
          amenities: ['IMAX', 'Dolby Atmos', 'Recliner Seats']
        },
        {
          id: 2,
          name: 'CineMax Mall',
          address: '456 Shopping Center Blvd',
          times: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
          amenities: ['3D', 'Premium Sound', 'Food Service']
        }
      ]
    },
    {
      date: '2024-01-16',
      theaters: [
        {
          id: 1,
          name: 'CineMax Downtown',
          address: '123 Main St, Downtown',
          times: ['10:30 AM', '2:00 PM', '5:30 PM', '8:30 PM'],
          amenities: ['IMAX', 'Dolby Atmos', 'Recliner Seats']
        },
        {
          id: 3,
          name: 'CineMax IMAX',
          address: '789 Entertainment District',
          times: ['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM'],
          amenities: ['IMAX', '4K Projection', 'Premium Seating']
        }
      ]
    }
  ];

  const recommendations = [
    {
      id: 2,
      title: 'Inception',
      poster: 'https://images.pexels.com/photos/7991664/pexels-photo-7991664.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.8,
      year: 2010
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.6,
      year: 2014
    },
    {
      id: 4,
      title: 'Batman Begins',
      poster: 'https://images.pexels.com/photos/7991546/pexels-photo-7991546.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 8.2,
      year: 2005
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
            <motion.img
              src={movie.poster}
              alt={movie.title}
              className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
            
            <motion.div
              className="flex-1 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <StarIconSolid className="h-6 w-6 text-yellow-400 mr-2" />
                  <span className="text-xl font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{movie.duration}</span>
                </div>
                <span className="text-gray-300">{movie.year}</span>
                <span className="text-gray-300">{movie.language}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-200 mb-6 max-w-3xl">{movie.description}</p>
              
              <div className="flex space-x-4">
                <button className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Watch Trailer
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 mr-2" />
                  )}
                  {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                </button>
                <button className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Cast */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="text-white font-semibold text-sm">{actor.name}</h3>
                    <p className="text-gray-400 text-xs">{actor.role}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Movie Details */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Movie Details</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Director</h3>
                    <p className="text-white font-semibold">{movie.director}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Duration</h3>
                    <p className="text-white font-semibold">{movie.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Language</h3>
                    <p className="text-white font-semibold">{movie.language}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Release Year</h3>
                    <p className="text-white font-semibold">{movie.year}</p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Showtimes */}
          <div className="lg:col-span-1">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Showtimes</h2>
              <div className="space-y-6">
                {showtimes.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {formatDate(day.date)}
                    </h3>
                    
                    {day.theaters.map((theater, theaterIndex) => (
                      <div key={theaterIndex} className="mb-6 last:mb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-medium">{theater.name}</h4>
                            <p className="text-gray-400 text-sm flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {theater.address}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {theater.amenities.map((amenity, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {theater.times.map((time, timeIndex) => (
                            <Link
                              key={timeIndex}
                              to={`/seat-selection/1?date=${day.date}&time=${time}&theater=${theater.id}`}
                              className="block text-center py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                            >
                              {time}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Recommendations */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={`/movies/${rec.id}`}
                className="group bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={rec.poster}
                  alt={rec.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-red-400 transition-colors">
                    {rec.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                      {rec.rating}
                    </div>
                    <span className="text-gray-400 text-sm">{rec.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default MovieDetails;