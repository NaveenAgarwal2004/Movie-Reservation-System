const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Showtime = require('../models/Showtime');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join showtime room for real-time seat updates
    socket.on('join-showtime', (showtimeId) => {
      socket.join(`showtime-${showtimeId}`);
      console.log(`User ${socket.userId} joined showtime ${showtimeId}`);
    });

    // Leave showtime room
    socket.on('leave-showtime', (showtimeId) => {
      socket.leave(`showtime-${showtimeId}`);
      console.log(`User ${socket.userId} left showtime ${showtimeId}`);
    });

    // Handle seat selection
    socket.on('select-seat', async (data) => {
      try {
        const { showtimeId, seat } = data;
        
        // Temporary seat hold (30 seconds)
        const tempHold = {
          showtimeId,
          seat,
          userId: socket.userId,
          expiresAt: new Date(Date.now() + 30000) // 30 seconds
        };

        // Broadcast to all users in the showtime room
        socket.to(`showtime-${showtimeId}`).emit('seat-selected', {
          seat,
          userId: socket.userId,
          expiresAt: tempHold.expiresAt
        });

        // Set timer to release seat if not booked
        setTimeout(() => {
          socket.to(`showtime-${showtimeId}`).emit('seat-released', {
            seat,
            userId: socket.userId
          });
        }, 30000);

      } catch (error) {
        console.error('Select seat error:', error);
        socket.emit('error', { message: 'Failed to select seat' });
      }
    });

    // Handle seat deselection
    socket.on('deselect-seat', (data) => {
      const { showtimeId, seat } = data;
      
      socket.to(`showtime-${showtimeId}`).emit('seat-deselected', {
        seat,
        userId: socket.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = socketHandler;