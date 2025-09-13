// pages/api/logs.ts
import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../middleware/auth';
import connectDB from '../../utils/db';
import Log from '../../models/Log';
import { logger } from '../../utils/logger';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  await connectDB();
  const { method } = req;
  const { level, q, limit = '100', aiFilter } = req.query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    let query: any = {};

    if (typeof aiFilter === 'string') {
        try {
            query = JSON.parse(aiFilter);
            // Basic sanitization for date queries
            if (query.timestamp) {
                if (query.timestamp.$gte) query.timestamp.$gte = new Date(query.timestamp.$gte);
                if (query.timestamp.$lt) query.timestamp.$lt = new Date(query.timestamp.$lt);
            }
        } catch (e) {
            return res.status(400).json({ message: 'Invalid AI filter format.' });
        }
    } else {
        if (typeof level === 'string' && level !== 'all') {
            query.level = level;
        }
        if (typeof q === 'string' && q.trim() !== '') {
            query.message = { $regex: q.trim(), $options: 'i' };
        }
    }
    
    const parsedLimit = parseInt(limit as string, 10);

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(isNaN(parsedLimit) ? 100 : parsedLimit);
      
    const formattedLogs = logs.map(log => ({
        id: log._id.toString(),
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        message: log.message,
        source: log.source,
        userId: log.userId?.toString(),
    }));

    res.status(200).json(formattedLogs);
  } catch (error) {
    logger.error('Failed to fetch logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
}

export default protect({
  GET: ['viewer', 'editor', 'administrator'],
})(handler);
