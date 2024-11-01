// decrypt.tsx
import crypto from "crypto";
import { EncryptionError } from "./errorTypes";

const CRYPTO_IV = process.env.CRYPTO_IV;
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

// Validate environment variables at startup
if (!CRYPTO_IV || !CRYPTO_SECRET) {
  throw new Error(
    "CRYPTO_IV and CRYPTO_SECRET environment variables must be set"
  );
}

export const decrypt = (encryptedId: string): string => {
  if (!encryptedId) {
    throw new EncryptionError("No data provided for decryption");
  }

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(CRYPTO_SECRET),
      Buffer.from(CRYPTO_IV)
    );
    let decrypted = decipher.update(encryptedId, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new EncryptionError(
      `Decryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
