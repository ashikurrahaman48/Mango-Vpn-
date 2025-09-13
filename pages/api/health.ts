
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectDB from '../../utils/db';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting';
      message: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Ensure a DB connection is attempted
    await connectDB();
    
    const dbState = mongoose.connection.readyState;
    let dbStatus: HealthStatus['services']['database']['status'];
    let dbMessage: string;
    let httpStatus = 200;

    switch (dbState) {
      case 0: // disconnected
        dbStatus = 'disconnected';
        dbMessage = 'Database is not connected.';
        httpStatus = 503;
        break;
      case 1: // connected
        dbStatus = 'connected';
        dbMessage = 'Database connection is healthy.';
        break;
      case 2: // connecting
        dbStatus = 'connecting';
        dbMessage = 'Database is currently connecting.';
        break;
      case 3: // disconnecting
        dbStatus = 'disconnecting';
        dbMessage = 'Database is currently disconnecting.';
        break;
      default:
        dbStatus = 'disconnected';
        dbMessage = 'Unknown database connection state.';
        httpStatus = 503;
        break;
    }

    const healthCheck: HealthStatus = {
      status: httpStatus === 200 ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          message: dbMessage,
        },
      },
    };
    
    res.status(httpStatus).json(healthCheck);
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'disconnected',
          message: error.message || 'Failed to connect to the database.',
        },
      },
    });
  }
}
