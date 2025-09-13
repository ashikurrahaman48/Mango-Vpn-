// Fix: Add import for Buffer to resolve issue with Buffer not being defined in some environments.
import { Buffer } from 'buffer';

// It's highly recommended to use environment variables for sensitive data
// For simplicity, we are defining them here.
// In a real application, use something like `dotenv` and `process.env`

// Ensure this key is 32 bytes (256 bits) long for AES-256
export const ENCRYPTION_KEY = process.env.VPN_ENCRYPTION_KEY || 'a_very_secret_key_that_is_32_bytes';

if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes long.');
}

export const SERVER_CONFIG = {
    PORT: 41234,
    HOST: '0.0.0.0',
    VPN_IP_SUBNET: '10.8.0.0/24',
    VPN_IP_POOL_START: '10.8.0.2',
    VPN_IP_POOL_END: '10.8.0.254',
    CLIENT_TIMEOUT_MS: 60000, // 1 minute
};

export const CRYPTO_CONFIG = {
    ALGORITHM: 'aes-256-gcm' as const,
    IV_LENGTH: 16, // For GCM, this is typically 12, but 16 is also common
    AUTH_TAG_LENGTH: 16,
};