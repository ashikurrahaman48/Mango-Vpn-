
// tests/api/auth.test.ts
// Fix: Import Jest's global functions to resolve TypeScript errors.
import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import registerHandler from '../../pages/api/auth/register';
import loginHandler from '../../pages/api/auth/login';
import refreshHandler from '../../pages/api/auth/refresh';
import { userOne, insertUsers } from '../fixtures/user.fixture';
import User from '../../models/User';

// Helper to create a handler for supertest
const createHandler = (handler: any) => (req: any, res: any) => {
    return handler(req, res);
};

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(createHandler(registerHandler))
        .post('/api/auth/register')
        .send({ email: 'newuser@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      
      const dbUser = await User.findOne({ email: 'newuser@example.com' });
      expect(dbUser).not.toBeNull();
    });

    it('should return 409 if email already exists', async () => {
      await insertUsers([userOne]);
      const res = await request(createHandler(registerHandler))
        .post('/api/auth/register')
        .send({ email: userOne.email, password: userOne.password });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await insertUsers([userOne]);
    });

    it('should login an existing user and return tokens', async () => {
      const res = await request(createHandler(loginHandler))
        .post('/api/auth/login')
        .send({ email: userOne.email, password: userOne.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(createHandler(loginHandler))
        .post('/api/auth/login')
        .send({ email: userOne.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken = '';
    
    beforeEach(async () => {
      await insertUsers([userOne]);
      const res = await request(createHandler(loginHandler))
        .post('/api/auth/login')
        .send({ email: userOne.email, password: userOne.password });
      refreshToken = res.body.refreshToken;
    });

    it('should return a new access token with a valid refresh token', async () => {
      const res = await request(createHandler(refreshHandler))
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });
    
     it('should return 401 for an invalid refresh token', async () => {
      const res = await request(createHandler(refreshHandler))
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalidtoken' });

      expect(res.status).toBe(401);
    });
  });
});
