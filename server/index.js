// server/index.js - Fixed with proper CORS configuration

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
const redisClient = require('./services/redis');
const socketHandler = require('./services/socketHandler');

const app = express();
const server = http.createServer(app);

// CORS Configuration - CRITICAL FIX
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://movie-reservation-system-nine.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests
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
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Compression middleware
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
  })
);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sanitize all request bodies
app.use(sanitizeBody);

// RATE LIMITER
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/api/health';
  },
});
app.use('/api/', limiter);

// DATABASE CONNECTION
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinemax';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't exit in production, allow retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', authMiddleware, watchlistRoutes);
app.use('/api/loyalty', authMiddleware, loyaltyRoutes);

// ROOT ROUTE - API Info
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
      users: '/api/users/*',
      admin: '/api/admin/*',
      reviews: '/api/reviews/*',
      watchlist: '/api/watchlist/*',
      loyalty: '/api/loyalty/*',
    },
    documentation: '/api/docs',
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
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
    },
  };

  res.status(200).json(healthcheck);
});

// Socket.io handler
socketHandler(io);

// ERROR HANDLER MIDDLEWARE (must be last)
app.use(errorHandler);

// 404 NOT FOUND HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/health', '/api/auth/*', '/api/movies/*', '/api/bookings/*'],
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
  console.log('🌐 Allowed Origins:', allowedOrigins.join(', '));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, log to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Log to Sentry or similar
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server, io };
