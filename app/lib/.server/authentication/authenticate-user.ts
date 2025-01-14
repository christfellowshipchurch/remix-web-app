import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/error-types";
import { generateToken } from "~/lib/.server/token";
import { encrypt } from "~/lib/.server/encrypt";
import { createRockSession, fetchUserCookie } from "./rock-authentication";

export type AuthenticationReturnType = {
  encryptedToken: string;
};

export const authenticateUser = async (
  identity: string,
  password: string
): Promise<AuthenticationReturnType> => {
  try {
    const cookie = await fetchUserCookie(identity, password);
    const sessionId = await createRockSession(cookie);
    const token = generateToken({ cookie, sessionId });

    try {
      const encryptedToken = encrypt(token);
      return { encryptedToken };
    } catch (error) {
      if (error instanceof EncryptionError) {
        throw new EncryptionError(error.message);
      }
      throw new Error("Failed to encrypt authentication token");
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw new AuthenticationError(error.message);
    }
    if (error instanceof RockAPIError) {
      throw new RockAPIError(error.message, error.statusCode);
    }
    console.error("Unhandled authentication error:", error);
    throw new Error("An unexpected error occurred during authentication");
  }
};
