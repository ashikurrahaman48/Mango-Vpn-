import crypto from 'crypto';
// Fix: Add import for Buffer to resolve issue with Buffer not being defined in some environments.
import { Buffer } from 'buffer';
import { ENCRYPTION_KEY, CRYPTO_CONFIG } from '../config/serverConfig';
import { logger } from './logger';

const key = Buffer.from(ENCRYPTION_KEY);

/**
 * Encrypts a buffer using AES-256-GCM.
 * @param plaintext The buffer to encrypt.
 * @returns A single buffer containing [iv][authTag][ciphertext].
 */
export function encrypt(plaintext: Buffer): Buffer {
  try {
    const iv = crypto.randomBytes(CRYPTO_CONFIG.IV_LENGTH);
    const cipher = crypto.createCipheriv(CRYPTO_CONFIG.ALGORITHM, key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, ciphertext]);
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Encryption failed.');
  }
}

/**
 * Decrypts a buffer using AES-256-GCM.
 * @param encrypted The buffer to decrypt, in the format [iv][authTag][ciphertext].
 * @returns The decrypted plaintext buffer, or null if decryption fails.
 */
export function decrypt(encrypted: Buffer): Buffer | null {
  try {
    const iv = encrypted.subarray(0, CRYPTO_CONFIG.IV_LENGTH);
    const authTag = encrypted.subarray(
      CRYPTO_CONFIG.IV_LENGTH,
      CRYPTO_CONFIG.IV_LENGTH + CRYPTO_CONFIG.AUTH_TAG_LENGTH
    );
    const ciphertext = encrypted.subarray(
      CRYPTO_CONFIG.IV_LENGTH + CRYPTO_CONFIG.AUTH_TAG_LENGTH
    );

    const decipher = crypto.createDecipheriv(CRYPTO_CONFIG.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return plaintext;
  } catch (error) {
    logger.warn('Decryption failed. The packet might be malformed or the key is incorrect.');
    return null;
  }
}