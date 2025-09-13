
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/auth';
import User, { IUser } from '../models/User';
import { logger } from '../utils/logger';

// Add a custom property to the NextApiRequest type
// Fix: Changed from an interface extending NextApiRequest to a type intersection. This resolves a subtle TypeScript issue where properties of the base request were not being recognized.
export type NextApiRequestWithUser = NextApiRequest & {
  user?: IUser;
};

type Role = 'user' | 'viewer' | 'editor' | 'administrator';
type ApiHandler = (req: NextApiRequestWithUser, res: NextApiResponse) => Promise<void> | void;

type MethodRoles = {
  [method: string]: Role[];
};

export const protect = (methodRoles: MethodRoles) => 
  (handler: ApiHandler) => {
    return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn(`Unauthorized access attempt to ${req.url}: No token provided.`);
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);

      if (!decoded) {
        logger.warn(`Unauthorized access attempt to ${req.url}: Invalid token.`);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        logger.warn(`Unauthorized access attempt to ${req.url}: User ${decoded.id} not found or inactive.`);
        return res.status(401).json({ message: 'Unauthorized: User not found or inactive' });
      }

      const requiredRoles = req.method ? methodRoles[req.method] : undefined;
      
      if (!requiredRoles || requiredRoles.length === 0) {
        logger.warn(`Configuration error: No roles defined for method ${req.method} on ${req.url}.`);
        return res.status(403).json({ message: 'Forbidden: Access to this resource is not configured.' });
      }

      if (!requiredRoles.includes(user.role)) {
        logger.warn(`Forbidden access attempt to ${req.url} (Method: ${req.method}) by user ${user.email} (role: ${user.role}). Required: ${requiredRoles.join(', ')}`);
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
      }
      
      req.user = user;
      return handler(req, res);
    };
};