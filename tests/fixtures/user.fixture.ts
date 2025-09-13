
// tests/fixtures/user.fixture.ts
import mongoose from 'mongoose';
import User from '../../models/User';

export const userOne = {
  _id: new mongoose.Types.ObjectId(),
  email: 'user@example.com',
  password: 'password123',
  role: 'user' as const,
  isActive: true,
};

export const adminUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin' as const,
  isActive: true,
};

export const insertUsers = async (users: any[]) => {
  await User.insertMany(users.map(user => ({ ...user })));
};
