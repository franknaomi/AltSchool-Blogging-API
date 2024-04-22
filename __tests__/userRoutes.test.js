const request = require('supertest');
const { app, closeServer } = require('../app');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');

describe('User Authentication', () => {
  afterAll(async () => {
    await User.deleteMany({});
    await closeServer();
  });

  let authToken;

  describe('POST /api/users/signup', () => {
    it('should sign up and return a 201 status', async () => {
      const res = await request(app).post('/api/users/signup').send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'password'
      });

      expect(res.status).toBe(201);
      expect(res.text).toBe('User created successfully.');
    }, 15000);
  });

  describe('POST /api/users/login', () => {
    it('should log in and return a valid token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');

      // Extract the token for further testing
      authToken = res.body.token;
    }, 15000);
  });

  describe('GET api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/users/profile');

      expect(res.status).toBe(401);
      expect(res.text).toBe(
        'Access denied. No token provided or invalid format.'
      );
    });
  });
});
