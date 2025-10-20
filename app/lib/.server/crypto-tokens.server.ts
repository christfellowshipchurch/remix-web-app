import { randomBytes } from "crypto";

/**
 * Generates a random cryptographic token using Node's crypto module
 * @param length The length of the token in bytes
 * @returns A hex string representation of the token
 */
const generateCryptoToken = (length: number = 32): string => {
  // For AES, key length must be 16, 24, or 32 bytes (128, 192, or 256 bits)
  if (length !== 16 && length !== 24 && length !== 32) {
    throw new Error(
      "Key length must be 16, 24, or 32 bytes for AES encryption"
    );
  }
  // Each byte becomes 2 hex characters, so divide desired length by 2
  const token = randomBytes(length / 2).toString("hex");
  return token.toLowerCase();
};

/**
 * Generates a random initialization vector
 * @returns A 16 digit initialization vector string
 */
const generateIV = (): string => {
  // Generate 8 bytes (64 bits) and pad with zeros if needed
  const hex = randomBytes(8).toString("hex");
  const num = BigInt("0x" + hex);
  // Ensure the number is positive and less than 10^16 to get exactly 16 digits
  const maxValue = BigInt("9999999999999999");
  const normalizedNum = num % maxValue;
  return normalizedNum.toString().padStart(16, "0");
};

/**
 * Generates and logs crypto tokens for development purposes
 * This should only be used during development/setup
 */
export const generateAndLogCryptoTokens = (): void => {
  const cryptoSecret = generateCryptoToken(32); // 256 bits
  const cryptoIv = generateIV(); // 16 digit IV

  // Only log in development environment
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("\n=== Generated Crypto Tokens ===");
    // eslint-disable-next-line no-console
    console.log(`CRYPTO_SECRET=${cryptoSecret}`);
    // eslint-disable-next-line no-console, no-console
    console.log(`CRYPTO_IV=${cryptoIv}`);
    // eslint-disable-next-line no-console
    console.log("===============================\n");
  }
};
