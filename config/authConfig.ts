// It's highly recommended to use environment variables for sensitive data.
// For simplicity, we define them here.

export const AUTH_CONFIG = {
  // Use strong, unique secrets stored in environment variables in production
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-access-token-key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-token-key',
  
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',

  // Rate Limiting for auth routes
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 10, // Max requests per window per IP
};
