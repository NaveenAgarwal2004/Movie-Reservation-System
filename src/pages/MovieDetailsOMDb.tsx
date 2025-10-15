import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ClockIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PlayIcon,
  StarIcon as StarIconSolid,
  TrophyIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useMovieData } from '../hooks/useMovieData';
import TrailerModal from '../components/Movies/TrailerModal';
import WatchlistButton from '../components/Movies/WatchlistButton';
import ShareButton from '../components/UI/ShareButton';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import ErrorMessage from '../components/UI/ErrorMessage';

const MovieDetailsOMDb = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  // Extract movie title from URL or state
  // In a real app, you'd store movie title/IMDb ID mapping
  const movieTitle = id?.replace(/-/g, ' ') || '';

  const { movie, loading, error } = useMovieData(movieTitle);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton type="card" count={1} />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <ErrorMessage
          message={error || 'Failed to load movie details'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Mock showtimes (integrate with your existing showtime system)
  const showtimes = [
    {
      date: new Date().toISOString().split('T')[0],
      theaters: [
        {
          id: 1,
          name: 'CineMax Downtown',
          address: '123 Main St, Downtown',
          times: ['10:00 AM', '1:30 PM', '4:00 PM', '7:30 PM', '10:00 PM'],
          amenities: ['IMAX', 'Dolby Atmos', 'Recliner Seats'],
        },
        {
          id: 2,
          name: 'CineMax Mall',
          address: '456 Shopping Center Blvd',
          times: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
          amenities: ['3D', 'Premium Sound', 'Food Service'],
        },
      ],
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : `url(${movie.poster})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8 w-full">
            <motion.img
              src={movie.poster}
              alt={movie.title}
              className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl border-4 border-gray-700"
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

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* IMDb Rating */}
                <div className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-lg">
                  <StarIconSolid className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">{movie.imdbRating}</span>
                  <span className="text-sm ml-1">/ 10</span>
                </div>

                {/* Other Ratings */}
                {movie.ratings.map(
                  (rating, index) =>
                    rating.source === 'Rotten Tomatoes' && (
                      <div
                        key={index}
                        className="flex items-center bg-red-600 px-3 py-1 rounded-lg"
                      >
                        <TrophyIcon className="h-5 w-5 mr-1" />
                        <span className="font-semibold">{rating.value}</span>
                      </div>
                    )
                )}

                {/* Metascore */}
                {movie.metascore !== 'N/A' && (
                  <div className="flex items-center bg-green-600 px-3 py-1 rounded-lg">
                    <span className="font-bold">{movie.metascore}</span>
                    <span className="text-sm ml-1">Metascore</span>
                  </div>
                )}

                <div className="flex items-center text-gray-300">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{movie.runtime}</span>
                </div>

                <span className="text-gray-300">{movie.year}</span>
                <span className="px-2 py-1 border border-gray-400 rounded text-sm">
                  {movie.rated}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((g) => (
                  <span key={g} className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-lg text-gray-200 mb-6 max-w-3xl">{movie.plot}</p>

              <div className="flex flex-wrap gap-4">
                {/* IMDb Link */}
                <a
                  href={movie.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors"
                >
                  View on IMDb
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
                </a>

                {/* Trailer Button */}
                {movie.trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </button>
                )}

                <WatchlistButton movieId={id || ''} variant="button" />

                <ShareButton
                  title={movie.title}
                  text={`Check out ${movie.title} on CineMax!`}
                  url={window.location.href}
                  className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Cast & Crew */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Cast & Crew</h2>
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Director</h3>
                  <p className="text-white font-semibold text-lg">{movie.director}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Writers</h3>
                  <p className="text-white">{movie.writers.join(', ')}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Stars</h3>
                  <p className="text-white">{movie.actors.join(', ')}</p>
                </div>
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
                    <h3 className="text-gray-400 text-sm mb-1">Release Date</h3>
                    <p className="text-white font-semibold">{movie.released}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Language</h3>
                    <p className="text-white font-semibold">{movie.language}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Country</h3>
                    <p className="text-white font-semibold">{movie.country}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Box Office</h3>
                    <p className="text-white font-semibold">{movie.boxOffice}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Production</h3>
                    <p className="text-white font-semibold">{movie.production}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">IMDb Votes</h3>
                    <p className="text-white font-semibold">{movie.imdbVotes}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Awards */}
            {movie.awards !== 'N/A' && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-600/30 rounded-lg p-6"
              >
                <div className="flex items-center mb-3">
                  <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-bold text-white">Awards & Recognition</h2>
                </div>
                <p className="text-yellow-100">{movie.awards}</p>
              </motion.section>
            )}
          </div>

          {/* Sidebar - Showtimes */}
          <div className="lg:col-span-1">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>
              <div className="space-y-6">
                {showtimes.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {formatDate(day.date)}
                    </h3>

                    {day.theaters.map((theater, theaterIndex) => (
                      <div key={theaterIndex} className="mb-6 last:mb-0">
                        <div className="mb-3">
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
      </div>

      {/* Trailer Modal */}
      {movie.trailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerUrl={movie.trailer.embedUrl}
          movieTitle={movie.title}
        />
      )}
    </div>
  );
};

export default MovieDetailsOMDb;
