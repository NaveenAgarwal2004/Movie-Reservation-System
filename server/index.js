const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

// ROUTES

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

// MIDDLEWARE

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// SERVICES 

const redisClient = require('./services/redis');
const socketHandler = require('./services/socketHandler');
const { timeStamp } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors:{
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods:["GET", "POST"]
    }
});

app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//RATE LIMITER

const limiter = rateLimit({
    windowMs : 15*60*1000, // 15 minutes
    max : 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use('/api/',limiter);

//DATABASE CONNECTION

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-reservation',{
    useNewUrlParser : true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () =>{
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

//ROUTES

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

//HEALTH CHECK

app.get('/api/health', (req , res) => {
    res.json({
        status: 'OK',
        timeStamp: new Date().toISOString()
    });
});

// ERROR HANDLER MIDDLEWARE

app.use(errorHandler);

//404 NOT FOUND HANDLER

app.use('*', (req , res) =>{
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource could not be found.'
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server, io };