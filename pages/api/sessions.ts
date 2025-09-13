
// pages/api/sessions.ts
import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../middleware/auth';
import connectDB from '../../utils/db';
import Session from '../../models/Session';
import { logger } from '../../utils/logger';
import mongoose from 'mongoose';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  await connectDB();
  const { method } = req;
  const { id, status, userId } = req.query;

  switch (method) {
    case 'GET':
      try {
        const query: any = {};
        if (status && typeof status === 'string') {
          query.status = status;
        }
        if (userId && typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
          query.userId = userId;
        }

        const sessions = await Session.find(query)
            .populate('userId', 'email')
            .populate('serverId', 'name location')
            .sort({ startTime: -1 })
            .limit(100);
        
        // Format the response to be more frontend-friendly
        const formattedSessions = sessions.map(s => ({
            id: s._id.toString(),
            user: (s.userId as any)?.email || 'N/A',
            server: (s.serverId as any)?.name || 'N/A',
            startTime: s.startTime.toISOString(),
            endTime: s.endTime?.toISOString(),
            dataUsed: s.dataUsed,
            status: s.status,
        }));
        
        res.status(200).json(formattedSessions);
      } catch (error) {
        logger.error('Failed to fetch sessions:', error);
        res.status(500).json({ message: 'Failed to fetch sessions' });
      }
      break;

    case 'PUT': // Used to terminate a session
      if (typeof id !== 'string') return res.status(400).json({ message: 'Session ID is required' });
      try {
        logger.info(`Admin ${req.user?.email} terminating session ID: ${id}`);
        const updatedSession = await Session.findOneAndUpdate(
            { _id: id, status: 'active' },
            { status: 'closed', endTime: new Date() },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ message: 'Active session not found or already closed' });
        }
        
        res.status(200).json({ message: 'Session terminated successfully.' });

      } catch (error) {
        logger.error(`Failed to terminate session ID ${id}:`, error);
        res.status(500).json({ message: 'Failed to terminate session' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Fix: The protect middleware expects a MethodRoles object, not an array of roles. Also corrected 'admin' to valid roles.
export default protect({
  GET: ['viewer', 'editor', 'administrator'],
  PUT: ['editor', 'administrator'],
})(handler);
