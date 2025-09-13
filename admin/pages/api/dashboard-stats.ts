// admin/pages/api/dashboard-stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type { DashboardStats } from '../../types';

let lastStats: DashboardStats = {
  activeUsers: 1873,
  onlineServers: 10,
  totalServers: 12,
  bandwidthUsage: {
    total: 512.7,
    peak: 153.2,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats>
) {
  // Simulate real-time changes
  lastStats.activeUsers += Math.floor(Math.random() * 21) - 10; // Fluctuate by +/- 10
  if (lastStats.activeUsers < 1000) lastStats.activeUsers = 1000;
  
  lastStats.onlineServers = 10 + Math.floor(Math.random() * 3) -1; // 9, 10 or 11
  if (lastStats.onlineServers > 12) lastStats.onlineServers = 12;
  if (lastStats.onlineServers < 8) lastStats.onlineServers = 8;


  lastStats.bandwidthUsage.total += Math.random() * 0.5;
  lastStats.bandwidthUsage.peak = 140 + Math.random() * 30;

  res.status(200).json(lastStats);
}
