
// tests/unit/encryption.test.ts
// Fix: Import Jest's global functions to resolve TypeScript errors.
import { describe, it, expect } from '@jest/globals';
import { encrypt, decrypt } from '../../utils/encryption';
import { Buffer } from 'buffer';

describe('Encryption Utility', () => {
  it('should encrypt and then decrypt data successfully', () => {
    const originalText = 'this is a secret message';
    const originalBuffer = Buffer.from(originalText);

    const encrypted = encrypt(originalBuffer);
    expect(encrypted).toBeInstanceOf(Buffer);
    expect(encrypted).not.toEqual(originalBuffer);

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBeInstanceOf(Buffer);
    expect(decrypted?.toString()).toBe(originalText);
  });

  it('should return null when decrypting malformed data', () => {
    const malformedBuffer = Buffer.from('this is not properly encrypted data');
    const decrypted = decrypt(malformedBuffer);
    expect(decrypted).toBeNull();
  });
  
  it('should return null when decrypting a buffer that is too short', () => {
    const shortBuffer = Buffer.from('short');
    const decrypted = decrypt(shortBuffer);
    expect(decrypted).toBeNull();
  });
});