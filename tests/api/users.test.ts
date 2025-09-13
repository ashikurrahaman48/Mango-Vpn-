
// tests/api/users.test.ts
// Fix: Import Jest's global functions to resolve TypeScript errors.
import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import usersHandler from '../../pages/api/users';
import loginHandler from '../../pages/api/auth/login';
import { userOne, adminUser, insertUsers } from '../fixtures/user.fixture';
import User from '../../models/User';

// Helper to create a handler for supertest
const createHandler = (handler: any) => (req: any, res: any) => {
    return handler(req, res);
};


describe('Users API', () => {
  let adminToken: string;

  beforeEach(async () => {
    await insertUsers([userOne, adminUser]);
    
    // Log in as admin to get token for protected routes
    const res = await request(createHandler(loginHandler))
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = res.body.accessToken;
  });

  describe('GET /api/users', () => {
    it('should return all users for an admin', async () => {
      const res = await request(createHandler(usersHandler))
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(2);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const res = await request(createHandler(usersHandler)).get('/api/users');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should allow an admin to create a new user', async () => {
      const newUser = { email: 'new@example.com', password: 'password123', role: 'user' };
      const res = await request(createHandler(usersHandler))
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);
      
      expect(res.status).toBe(201);
      const dbUser = await User.findOne({ email: newUser.email });
      expect(dbUser).not.toBeNull();
    });
  });

  describe('PUT /api/users?id=', () => {
    it('should allow an admin to update a user', async () => {
      const updates = { role: 'admin' };
      const res = await request(createHandler(usersHandler))
        .put(`/api/users?id=${userOne._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);
      
      expect(res.status).toBe(200);
      const dbUser = await User.findById(userOne._id);
      expect(dbUser?.role).toBe('admin');
    });
  });

  describe('DELETE /api/users?id=', () => {
    it('should allow an admin to delete a user', async () => {
       const res = await request(createHandler(usersHandler))
        .delete(`/api/users?id=${userOne._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
      const dbUser = await User.findById(userOne._id);
      expect(dbUser).toBeNull();
    });
  });
});
