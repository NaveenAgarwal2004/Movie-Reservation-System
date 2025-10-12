const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/movie-reservation-test',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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
        password: 'Password123',
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
        password: 'Password123',
        phone: '1234567890',
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'weak',
        phone: '1234567890',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        firstName: 'John',
        email: 'john@example.com',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        phone: '1234567890',
      });
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'Password123',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(credentials.email);
    });

    it('should return 400 for incorrect password', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'WrongPassword123',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 400 for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        phone: '1234567890',
      });
      await user.save();

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'Password123' });

      token = loginResponse.body.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'john@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });
});
