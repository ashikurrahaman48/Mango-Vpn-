// pages/api/dashboard-stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../utils/db';
import Session from '../../models/Session';
import Server from '../../models/Server';
import { protect, NextApiRequestWithUser } from '../../middleware/auth';
import { logger } from '../../utils/logger';
import type { DashboardStats } from '../../types/admin';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse<DashboardStats | { message: string }>) {
  // Fix: Added method check to ensure only GET requests are processed.
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();

  try {
    const activeUsers = await Session.countDocuments({ status: 'active' });
    const onlineServers = await Server.countDocuments({ status: 'online' });
    const totalServers = await Server.countDocuments();
    
    // Aggregating bandwidth is expensive, and peak usage is not tracked.
    // In a production system, this would likely come from a dedicated monitoring service.
    const totalBandwidthResult = await Session.aggregate([
      { $group: { _id: null, totalDownload: { $sum: '$dataUsed.download' }, totalUpload: { $sum: '$dataUsed.upload' } } }
    ]);

    const totalDownload = totalBandwidthResult[0]?.totalDownload || 0;
    const totalUpload = totalBandwidthResult[0]?.totalUpload || 0;
    const totalGB = (totalDownload + totalUpload) / 1024; // Assuming data is in MB

    const stats: DashboardStats = {
      activeUsers,
      onlineServers,
      totalServers,
      bandwidthUsage: {
        total: parseFloat(totalGB.toFixed(2)),
        peak: parseFloat((140 + Math.random() * 30).toFixed(1)), // Keep peak simulated
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    logger.error('Failed to fetch dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
  }
}

// Fix: The protect middleware expects a MethodRoles object, not an array of roles.
export default protect({
  GET: ['viewer', 'editor', 'administrator'],
})(handler);
