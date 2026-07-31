/** Custom Error Classes */
export class AuthenticationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AuthenticationError';
  }
}

/**
 * The caller is authenticated but not permitted to perform the action.
 * Distinct from AuthenticationError (401) — this maps to a 403.
 */
export class AuthorizationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AuthorizationError';
  }
}

export class RockAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'RockAPIError';
  }
}

export class EncryptionError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'EncryptionError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'RateLimitError';
  }
}
