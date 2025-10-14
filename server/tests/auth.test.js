const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

// Import app without starting server
const { app } = require('../index');

describe('Auth API', () => {
  beforeAll(async () => {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/movie-reservation-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '1234567890',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '1234567890',
      };

      await request(app).post('/api/auth/register').send(userData);
      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '1234567890',
      });
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'Password123!',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 400 for incorrect password', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
});
