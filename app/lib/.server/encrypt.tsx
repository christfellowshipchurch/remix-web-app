// encrypt.tsx
import crypto from "crypto";
import { EncryptionError } from "./error-types";

const CRYPTO_IV = process.env.CRYPTO_IV;
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

// Validate environment variables at startup
if (!CRYPTO_IV || !CRYPTO_SECRET) {
  throw new Error(
    "CRYPTO_IV and CRYPTO_SECRET environment variables must be set"
  );
}

export const encrypt = (id: string): string => {
  if (!id) {
    throw new EncryptionError("No data provided for encryption");
  }

  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(CRYPTO_SECRET),
      Buffer.from(CRYPTO_IV)
    );
    let encrypted = cipher.update(id, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    throw new EncryptionError(
      `Encryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
