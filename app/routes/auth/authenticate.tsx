import { data } from "@remix-run/node";
import { authenticateUser } from "~/lib/.server/authentication/authenticateUser";

import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/errorTypes";

type AuthenticateData = {
  identity: string;
  password: string;
};

export const authenticate = async ({
  identity,
  password,
}: AuthenticateData) => {
  try {
    if (!identity || !password) {
      return data(
        { error: "Identity and password are required" },
        { status: 400 }
      );
    }

    const { encryptedToken } = await authenticateUser(
      identity as string,
      password as string
    );

    return { encryptedToken };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return data({ error: error.message }, { status: 401 });
    }
    if (error instanceof RockAPIError) {
      return data({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof EncryptionError) {
      return data({ error: error.message }, { status: 400 });
    }
    console.error("Unhandled authentication error:", error);
    return data(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
};
