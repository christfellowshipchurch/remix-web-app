// decrypt.tsx
import crypto from 'crypto';
import { EncryptionError } from './error-types';

export const decrypt = (encryptedId: string): string => {
  const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

  if (!CRYPTO_SECRET) {
    throw new Error('CRYPTO_SECRET environment variable must be set');
  }

  if (!encryptedId) {
    throw new EncryptionError('No data provided for decryption');
  }

  try {
    const [ivHex, data] = encryptedId.split(':');
    if (!ivHex || !data) {
      throw new EncryptionError('Invalid encrypted data format');
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(CRYPTO_SECRET),
      Buffer.from(ivHex, 'hex'),
    );
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    if (error instanceof EncryptionError) throw error;
    throw new EncryptionError(
      `Decryption failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
