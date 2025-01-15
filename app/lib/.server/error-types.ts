/** Custom Error Classes */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class RockAPIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "RockAPIError";
  }
}

export class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncryptionError";
  }
}
