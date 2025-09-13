
import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_CONFIG } from '../config/authConfig';
import { logger } from '../utils/logger';

interface RequestLog {
  count: number;
  firstRequestTime: number;
}

const requests = new Map<string, RequestLog>();

export const rateLimiter = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    if (!ip) {
        return res.status(400).json({ message: 'Could not identify client IP.' });
    }

    const now = Date.now();
    const log = requests.get(ip);
    
    if (log && now - log.firstRequestTime < AUTH_CONFIG.RATE_LIMIT_WINDOW_MS) {
      if (log.count >= AUTH_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
        logger.warn(`Rate limit exceeded for IP: ${ip} on URL: ${req.url}`);
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
      }
      requests.set(ip, { ...log, count: log.count + 1 });
    } else {
      requests.set(ip, { count: 1, firstRequestTime: now });
    }

    // Clean up old entries periodically (or use a more robust solution like Redis in production)
    if (Math.random() < 0.01) { // 1% chance on any request
        for (const [key, value] of requests.entries()) {
            if (now - value.firstRequestTime > AUTH_CONFIG.RATE_LIMIT_WINDOW_MS) {
                requests.delete(key);
            }
        }
    }

    return handler(req, res);
  };
};
