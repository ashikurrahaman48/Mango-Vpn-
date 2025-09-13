
// pages/api/users.ts
import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../middleware/auth';
import connectDB from '../../utils/db';
import User from '../../models/User';
import { logger } from '../../utils/logger';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({}).sort({ createdAt: -1 });
        // The frontend expects an `id` field, so we map `_id` to `id`.
        const formattedUsers = users.map(u => ({
            id: u._id.toString(),
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt.toISOString()
        }));
        res.status(200).json(formattedUsers);
      } catch (error) {
        logger.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
      break;

    case 'POST':
      try {
        const { email, password, role, isActive } = req.body;
        logger.info(`Admin ${req.user?.email} creating new user: ${email}`);
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required for new users' });
        }
        const newUser = await User.create({ email, password, role, isActive });
        res.status(201).json(newUser);
      } catch (error: any) {
        logger.error(`Failed to create user ${req.body.email}:`, error);
        if (error.code === 11000) return res.status(409).json({ message: 'User with this email already exists.' });
        res.status(500).json({ message: 'Failed to create user', error: error.message });
      }
      break;

    case 'PUT':
      if (typeof id !== 'string') return res.status(400).json({ message: 'User ID is required' });
      try {
        // Exclude password from general updates
        const { email, role, isActive } = req.body;
        logger.info(`Admin ${req.user?.email} updating user ID: ${id}`);
        const updatedUser = await User.findByIdAndUpdate(id, { email, role, isActive }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
      } catch (error) {
        logger.error(`Failed to update user ID ${id}:`, error);
        res.status(500).json({ message: 'Failed to update user' });
      }
      break;
      
    case 'DELETE':
      if (typeof id !== 'string') return res.status(400).json({ message: 'User ID is required' });
      try {
        logger.info(`Admin ${req.user?.email} deleting user ID: ${id}`);
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(204).end();
      } catch (error) {
        logger.error(`Failed to delete user ID ${id}:`, error);
        res.status(500).json({ message: 'Failed to delete user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Protect user management routes with granular, method-based role permissions.
export default protect({
  GET: ['viewer', 'editor', 'administrator'],
  POST: ['editor', 'administrator'],
  PUT: ['editor', 'administrator'],
  DELETE: ['administrator'],
})(handler);
