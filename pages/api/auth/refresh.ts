
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import User from '../../../models/User';
import { verifyToken, generateAccessToken } from '../../../utils/auth';
import { logger } from '../../../utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const decoded = verifyToken(refreshToken, true);
  if (!decoded) {
    logger.warn(`Token refresh failed: invalid or expired refresh token provided.`);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  await connectDB();
  
  try {
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      logger.warn(`Token refresh failed for user ID ${decoded.id}: user not found or inactive.`);
      return res.status(401).json({ message: 'User not found or is inactive' });
    }

    const newAccessToken = generateAccessToken(user);
    logger.info(`Access token refreshed for user ID: ${user._id}`);
    res.status(200).json({ accessToken: newAccessToken });

  } catch (error: any) {
    logger.error(`Server error during token refresh for user ID ${decoded.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
