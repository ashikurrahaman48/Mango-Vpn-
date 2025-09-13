
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import User from '../../../models/User';
import { generateAccessToken, generateRefreshToken } from '../../../utils/auth';
import { rateLimiter } from '../../../middleware/rateLimiter';
import { logger } from '../../../utils/logger';

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Use a generic message to prevent email enumeration attacks
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      logger.warn(`Login failed for ${email}: account inactive.`);
      return res.status(403).json({ message: 'Account is inactive.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`User ${email} logged in successfully.`);
    res.status(200).json({ accessToken, refreshToken });

  } catch (error: any) {
    logger.error(`Server error during login for ${email}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export default rateLimiter(loginHandler);
