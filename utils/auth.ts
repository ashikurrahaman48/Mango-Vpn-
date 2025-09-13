import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/authConfig';
import type { IUser } from '../models/User';

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateAccessToken = (user: IUser): string => {
  // Fix: Convert user._id to a string to match the TokenPayload interface.
  const payload: TokenPayload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (user: IUser): string => {
  // Fix: Convert user._id to a string to match the TokenPayload interface.
  const payload: TokenPayload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, AUTH_CONFIG.JWT_REFRESH_SECRET, {
    expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = (token: string, isRefresh = false): TokenPayload | null => {
  try {
    const secret = isRefresh ? AUTH_CONFIG.JWT_REFRESH_SECRET : AUTH_CONFIG.JWT_SECRET;
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
