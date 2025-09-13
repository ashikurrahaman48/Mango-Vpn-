import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import User from '../../../models/User';
import { logger } from '../../../utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fix: Cast req to 'any' to access properties that TypeScript cannot find due to type resolution issues.
  if ((req as any).method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  const { email, password } = req.body;

  logger.info(`Registration attempt for email: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }


  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed for ${email}: user already exists.`);
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Role can be optionally passed, defaults to 'user'
    const newUser = new User({ email, password, role: req.body.role || 'user' });
    await newUser.save();

    logger.info(`User ${email} registered successfully.`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    logger.error(`Server error during registration for ${email}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}