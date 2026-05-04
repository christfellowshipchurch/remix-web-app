/** Custom Error Classes */
export class AuthenticationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AuthenticationError";
  }
}

export class RockAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "RockAPIError";
  }
}

export class EncryptionError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "EncryptionError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RateLimitError";
  }
}
