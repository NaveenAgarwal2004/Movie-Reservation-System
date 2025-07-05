const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const { Phone } = require('lucide-react');

require('dotenv').config();

const seedDatabase = async () =>{
    try{
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI ||
            'mongodb://localhost:27017/movie-reservation'
        );
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await Showtime.deleteMany({});
        console.log('Cleared existing data');

        console.log('Starting admin user creation...');
        //Create admin user
        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@cinemax.com',
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
            phone: '1234567890'
        });
        try {
          await adminUser.save();
          console.log('Admin user created');
        } catch (saveError) {
          console.error('Error saving admin user:', saveError);
        }

        // Create regular user
        const regularUser = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user',
            phone: '9876543210'
        });
        await regularUser.save();
        console.log('Regular user created');

        //Create movies
        const movies = [
            {
        title: 'The Dark Knight',
        description: 'Batman faces his greatest challenge yet when the Joker wreaks havoc on Gotham City.',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 152,
        rating: 'PG-13',
        releaseDate: new Date('2008-07-18'),
        poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'Christopher Nolan',
        language: 'English',
        country: 'USA',
        imdbRating: 9.0,
        isFeatured: true,
        cast: [
          { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
          { name: 'Heath Ledger', role: 'Joker' },
          { name: 'Aaron Eckhart', role: 'Harvey Dent' }
        ]
      },
      {
        title: 'Inception',
        description: 'A skilled thief enters the subconscious of his targets to steal their secrets.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        duration: 148,
        rating: 'PG-13',
        releaseDate: new Date('2010-07-16'),
        poster: 'https://images.pexels.com/photos/7991664/pexels-photo-7991664.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'Christopher Nolan',
        language: 'English',
        country: 'USA',
        imdbRating: 8.8,
        isFeatured: true,
        cast: [
          { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
          { name: 'Marion Cotillard', role: 'Mal' },
          { name: 'Ellen Page', role: 'Ariadne' }
        ]
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space to save humanity.',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        duration: 169,
        rating: 'PG-13',
        releaseDate: new Date('2014-11-07'),
        poster: 'https://images.pexels.com/photos/7991465/pexels-photo-7991465.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'Christopher Nolan',
        language: 'English',
        country: 'USA',
        imdbRating: 8.6,
        isFeatured: true,
        cast: [
          { name: 'Matthew McConaughey', role: 'Cooper' },
          { name: 'Anne Hathaway', role: 'Brand' },
          { name: 'Jessica Chastain', role: 'Murph' }
        ]
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully and Neytiri face new challenges as they protect their family.',
        genre: ['Action', 'Adventure', 'Fantasy'],
        duration: 192,
        rating: 'PG-13',
        releaseDate: new Date('2022-12-16'),
        poster: 'https://images.pexels.com/photos/7991730/pexels-photo-7991730.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'James Cameron',
        language: 'English',
        country: 'USA',
        imdbRating: 8.1,
        isFeatured: false,
        cast: [
          { name: 'Sam Worthington', role: 'Jake Sully' },
          { name: 'Zoe Saldana', role: 'Neytiri' },
          { name: 'Sigourney Weaver', role: 'Dr. Grace Augustine' }
        ]
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
        genre: ['Action', 'Drama'],
        duration: 130,
        rating: 'PG-13',
        releaseDate: new Date('2022-05-27'),
        poster: 'https://images.pexels.com/photos/7991492/pexels-photo-7991492.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'Joseph Kosinski',
        language: 'English',
        country: 'USA',
        imdbRating: 8.3,
        isFeatured: false,
        cast: [
          { name: 'Tom Cruise', role: 'Pete "Maverick" Mitchell' },
          { name: 'Miles Teller', role: 'Bradley "Rooster" Bradshaw' },
          { name: 'Jennifer Connelly', role: 'Penny Benjamin' }
        ]
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'Spider-Man seeks help from Doctor Strange to make people forget his identity.',
        genre: ['Action', 'Adventure', 'Fantasy'],
        duration: 148,
        rating: 'PG-13',
        releaseDate: new Date('2021-12-17'),
        poster: 'https://images.pexels.com/photos/7991609/pexels-photo-7991609.jpeg?auto=compress&cs=tinysrgb&w=600',
        director: 'Jon Watts',
        language: 'English',
        country: 'USA',
        imdbRating: 8.4,
        isFeatured: false,
        cast: [
          { name: 'Tom Holland', role: 'Peter Parker / Spider-Man' },
          { name: 'Zendaya', role: 'MJ' },
          { name: 'Benedict Cumberbatch', role: 'Doctor Strange' }
        ]
      }
        ];

        const savedMovies = await Movie.insertMany(movies);
        console.log('Movies created:', savedMovies.length);

        // Create theaters
        const theaters = [
            {
        name: 'CineMax Downtown',
        location: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        },
        capacity: 150,
        layout: {
          rows: 10,
          seatsPerRow: 15,
          aisles: [5, 10]
        },
        amenities: ['ac', 'dolby', 'recliner', 'food-service', 'parking']
      },
      {
        name: 'CineMax Mall',
        location: {
          address: '456 Shopping Center Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          coordinates: {
            latitude: 34.0522,
            longitude: -118.2437
          }
        },
        capacity: 200,
        layout: {
          rows: 12,
          seatsPerRow: 17,
          aisles: [6, 12]
        },
        amenities: ['ac', 'imax', '3d', 'food-service', 'parking']
      },
      {
        name: 'CineMax IMAX',
        location: {
          address: '789 Entertainment District',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          coordinates: {
            latitude: 41.8781,
            longitude: -87.6298
          }
        },
        capacity: 300,
        layout: {
          rows: 15,
          seatsPerRow: 20,
          aisles: [7, 14]
        },
        amenities: ['ac', 'imax', 'dolby', 'recliner', 'food-service', 'parking']
      }
        ];

        //Generate seats for each theater

        theaters.forEach(theater =>{
            theater.seats = [];
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

            for(let i = 0; i<theater.layout.rows; i++){
                for(let j=1; j<= theater.layout.seatsPerRow;j++){
                    let seatType = 'standard';
                    let price = 12;
                    if(theater.amenities.includes('recliner')){
                        seatType = 'recliner';
                        price = 15;
                    } else if(theater.amenities.includes('dolby')){
                        seatType = 'dolby';
                        price = 18;
                    } else if(theater.amenities.includes('imax')){
                        seatType = 'imax';
                        price = 20;
                    }
                    theater.seats.push({
                        seatNumber: `${rows[i]}${j}`,
                        seatType: seatType,
                        price: price,
                        isBooked: false
                    });
                }
            }
        });
        const savedTheaters = await Theater.insertMany(theaters);
        console.log('Theaters created:', savedTheaters.length);

        // Create showtimes
        const today = new Date();
        const showtimes = [];

        savedMovies.forEach(movie =>{
            savedTheaters.forEach(theater =>{
                // Generate showtimes for the next 7 days
                for(let day = 0; day<7; day++){
                    const showDate = new Date(today);
                    showDate.setDate(today.getDate() + day);
                    const timeSlots = ['10:00 AM', '13:30 PM', '17:00 PM', '20:30 PM', '23:00 PM'];

                    timesToInjectAfter.forEach(time =>{
                        showtimes.push({
                            movie: movie._id,
                            theater: theater._id,
                            date: showDate,
                            time: time,
                            availableSeats: theater.seats.filter(seat => !seat.isBooked).length,
                            totalSeats: theater.seats.length,
                            price: theater.seats[0].price,
                            is3D: theater.amenities.includes('3d'),
                            isIMAX: theater.amenities.includes('imax'),
                            isDolby: theater.amenities.includes('dolby'),
                            isRecliner: theater.amenities.includes('recliner')
                        });
                    });
                }
            });
        });

        await Showtime.insertMany(showtimes);
        console.log('Showtimes created:', showtimes.length);

        console.log('Database seeded successfully');
        process.exit(0);
    }catch(error){
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}