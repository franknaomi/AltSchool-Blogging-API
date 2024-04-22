const request = require('supertest');
const { app, closeServer } = require('../app');
const Blog = require('../Model/blogModel');
const User = require('../Model/userModel');

let token;
let blogId;

describe('Blog Routes', () => {
  afterAll(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await closeServer();
  });

  describe('create and login user', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'test2@example.com',
          password: 'password'
        })
        .expect(201);
    });

    it('should login a user', async () => {
      let res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test2@example.com', password: 'password' })
        .expect(200);

      token = res.body.token;
    });
  });

  describe('POST /api/blogs', () => {
    it('should create a new blog when authenticated', async () => {
      const res = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Blog',
          description: 'Test Description',
          body: 'Test Body',
          tags: ['tag1', 'tag2']
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Blog created successfully.');
      blogId = res.body.blog._id;
    });

    it('should not allow blog creation without authentication', async () => {
      const res = await request(app)
        .post('/api/blogs')
        .send({
          title: 'Test Blog',
          description: 'Test Description',
          body: 'Test Body',
          tags: ['tag1', 'tag2']
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/blogs', () => {
    it('should get all blogs when authenticated', async () => {
      const res = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/blogs/:id', () => {
    it('should get a single blog when authenticated', async () => {
      const res = await request(app)
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });
});
