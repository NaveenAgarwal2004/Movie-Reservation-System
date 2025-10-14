const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

// ROUTES
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const watchlistRoutes = require('./routes/watchlist');
const loyaltyRoutes = require('./routes/loyalty');

// MIDDLEWARE
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeBody } = require('./middleware/inputValidator');

// SERVICES
const socketHandler = require('./services/socketHandler');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://movie-reservation-system-nine.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(sanitizeBody);

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
});
app.use('/api/', limiter);

// DATABASE CONNECTION (with test mode support)
const connectDB = async () => {
  const MONGODB_URI =
    process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost:27017/movie-reservation-test'
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/cinemax';

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

connectDB();

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

// Initialize Redis only in non-test environments
if (process.env.NODE_ENV !== 'test') {
  try {
    const redisClient = require('./services/redis');
    console.log('✅ Redis initialized');
  } catch (error) {
    console.warn('⚠️ Redis not available, using in-memory fallback');
  }
}

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', authMiddleware, watchlistRoutes);
app.use('/api/loyalty', authMiddleware, loyaltyRoutes);

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({
    name: 'CineMax API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      movies: '/api/movies/*',
      bookings: '/api/bookings/*',
    },
  });
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };
  res.status(200).json(healthcheck);
});

// Socket.io handler
socketHandler(io);

// ERROR HANDLER
app.use(errorHandler);

// 404 NOT FOUND
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║      🎬 CineMax API Server 🎬         ║
╠════════════════════════════════════════╣
║  Status: ✅ Running                   ║
║  Port: ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}        ║
║  CORS: ${allowedOrigins.length} origins allowed       ║
╚════════════════════════════════════════╝
    `);
  });
}

module.exports = { app, server, io };
