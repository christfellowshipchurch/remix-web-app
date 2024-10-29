import { ActionFunction, json } from "@remix-run/node";
import { authenticateUser } from "~/lib/.server/authentication/authenticateUser";

import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/errorTypes";

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  try {
    const formData = await request.formData();
    const identity = formData.get("identity");
    const password = formData.get("password");

    if (!identity || !password) {
      return json(
        { error: "Identity and password are required" },
        { status: 400 }
      );
    }

    const { encryptedToken } = await authenticateUser(
      identity as string,
      password as string
    );

    return json({ encryptedToken });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return json({ error: error.message }, { status: 401 });
    }
    if (error instanceof RockAPIError) {
      return json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof EncryptionError) {
      return json({ error: error.message }, { status: 400 });
    }
    console.error("Unhandled authentication error:", error);
    return json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
};
