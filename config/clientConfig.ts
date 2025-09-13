// For a real application, these should come from a config file or environment variables.
export const CLIENT_CONFIG = {
    SERVER_HOST: '127.0.0.1', // The public IP of your VPN server
    SERVER_PORT: 41234,
    
    // Auto-reconnect settings
    RECONNECT_INTERVAL_MS: 5000, // 5 seconds
    MAX_RECONNECT_ATTEMPTS: 10,

    // Keep-alive settings
    HEARTBEAT_INTERVAL_MS: 20000, // 20 seconds
    CONNECTION_TIMEOUT_MS: 60000, // 1 minute (must be same or higher than server's CLIENT_TIMEOUT_MS)
};
