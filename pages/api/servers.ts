// pages/api/servers.ts
import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../middleware/auth';
import connectDB from '../../utils/db';
import Server from '../../models/Server';
import { logger } from '../../utils/logger';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        if (id && typeof id === 'string') {
          // Get a single server
          const server = await Server.findById(id);
          if (!server) return res.status(404).json({ message: 'Server not found' });
          res.status(200).json({
            id: server._id,
            ...server.toObject(),
          });
        } else {
          // Get all servers
          const servers = await Server.find({}).sort({ name: 1 });
          const formattedServers = servers.map(s => ({
            id: s._id.toString(),
            name: s.name,
            location: s.location,
            ip: s.host, // Map host to ip for frontend
            status: s.status,
            currentClients: s.currentClients,
            maxClients: s.maxClients,
          }));
          res.status(200).json(formattedServers);
        }
      } catch (error) {
        logger.error('Failed to fetch servers:', error);
        res.status(500).json({ message: 'Failed to fetch servers' });
      }
      break;

    case 'POST':
      try {
        logger.info(`Admin ${req.user?.email} creating new server.`);
        const newServer = await Server.create(req.body);
        res.status(201).json(newServer);
      } catch (error: any) {
        logger.error('Failed to create server:', error);
        res.status(400).json({ message: 'Failed to create server', error: error.message });
      }
      break;

    case 'PUT':
      if (typeof id !== 'string') return res.status(400).json({ message: 'Server ID is required' });
      try {
        logger.info(`Admin ${req.user?.email} updating server ID: ${id}`);
        const updatedServer = await Server.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedServer) return res.status(404).json({ message: 'Server not found' });
        res.status(200).json(updatedServer);
      } catch (error) {
        logger.error(`Failed to update server ID ${id}:`, error);
        res.status(500).json({ message: 'Failed to update server' });
      }
      break;

    case 'DELETE':
      if (typeof id !== 'string') return res.status(400).json({ message: 'Server ID is required' });
      try {
        logger.info(`Admin ${req.user?.email} deleting server ID: ${id}`);
        const deletedServer = await Server.findByIdAndDelete(id);
        if (!deletedServer) return res.status(404).json({ message: 'Server not found' });
        res.status(204).end();
      } catch (error) {
        logger.error(`Failed to delete server ID ${id}:`, error);
        res.status(500).json({ message: 'Failed to delete server' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Fix: The protect middleware expects a MethodRoles object, not an array of roles. Also corrected 'admin' to valid roles.
export default protect({
  GET: ['viewer', 'editor', 'administrator'],
  POST: ['editor', 'administrator'],
  PUT: ['editor', 'administrator'],
  DELETE: ['administrator'],
})(handler);
