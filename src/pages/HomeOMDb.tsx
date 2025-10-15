import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, StarIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Movie {
  title: string;
  year: string;
  imdbID: string;
  poster: string;
  imdbRating?: string;
  runtime?: string;
  genre?: string;
  plot?: string;
}

const HomeOMDb = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Popular movies to feature
  const popularTitles = [
    'The Dark Knight',
    'Inception',
    'Interstellar',
    'The Shawshank Redemption',
    'Pulp Fiction',
    'The Godfather',
    'Fight Club',
    'Forrest Gump',
    'The Matrix',
    'Goodfellas',
    'Avatar',
    'Avengers Endgame',
    'Spider-Man: No Way Home',
    'Top Gun: Maverick',
    'Dune',
    'The Batman',
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
        const fetchedMovies: Movie[] = [];

        // Fetch movies in parallel
        const promises = popularTitles.slice(0, 16).map(async (title) => {
          try {
            const response = await axios.get('https://www.omdbapi.com/', {
              params: {
                apikey: OMDB_KEY,
                t: title,
                plot: 'short',
              },
            });

            if (response.data.Response === 'True') {
              return {
                title: response.data.Title,
                year: response.data.Year,
                imdbID: response.data.imdbID,
                poster:
                  response.data.Poster !== 'N/A'
                    ? response.data.Poster
                    : 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Poster',
                imdbRating: response.data.imdbRating,
                runtime: response.data.Runtime,
                genre: response.data.Genre,
                plot: response.data.Plot,
              };
            }
            return null;
          } catch (err) {
            console.error(`Failed to fetch ${title}:`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validMovies = results.filter((m): m is Movie => m !== null);

        setFeaturedMovies(validMovies.slice(0, 3));
        setNowPlaying(validMovies.slice(0, 12));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {featuredMovies[0] && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${featuredMovies[0].poster})`,
            }}
          ></div>
        )}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
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
            Book your favorite movies, select your perfect seats, and immerse yourself in the magic
            of cinema.
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
              to="/movies"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Browse Movies
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
              to="/movies"
              className="text-red-600 hover:text-red-400 font-semibold flex items-center"
            >
              View All
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredMovies.map((movie, index) => (
              <motion.div
                key={movie.imdbID}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img src={movie.poster} alt={movie.title} className="w-full h-96 object-cover" />
                  {movie.imdbRating && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-lg flex items-center font-bold">
                      <StarIcon className="h-5 w-5 mr-1" />
                      {movie.imdbRating}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                  {movie.genre && <p className="text-gray-400 text-sm mb-3">{movie.genre}</p>}
                  {movie.plot && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{movie.plot}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {movie.runtime && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {movie.runtime}
                      </div>
                    )}
                    <Link
                      to={`/movies/${movie.title.toLowerCase().replace(/\s+/g, '-')}`}
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {nowPlaying.map((movie, index) => (
              <motion.div
                key={movie.imdbID}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/movies/${movie.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-64 sm:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {movie.imdbRating && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-black px-2 py-1 rounded text-sm flex items-center font-bold">
                        <StarIcon className="h-4 w-4 mr-1" />
                        {movie.imdbRating}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-white font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{movie.year}</p>
                      {movie.runtime && (
                        <p className="text-gray-400 text-sm flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {movie.runtime}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
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
              Experience the future of movie booking with our advanced features and seamless user
              experience.
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

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready for Your Next Movie Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Browse our collection and book your tickets today!
            </p>
            <Link
              to="/movies"
              className="inline-block bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-lg text-lg font-bold transition-colors"
            >
              Explore Movies Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeOMDb;
