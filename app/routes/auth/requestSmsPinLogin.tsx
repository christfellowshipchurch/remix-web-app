import { data } from "@remix-run/node";
import { requestSmsLogin } from "~/lib/.server/authentication/smsAuthentication";
import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/errorTypes";

export const requestSmsPinLogin = async (phoneNumber: string) => {
  try {
    if (!phoneNumber) {
      return data({ error: "Phone number is required" }, { status: 400 });
    }

    const res = await requestSmsLogin(phoneNumber as string);

    return { res };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error("AuthenticationError:", error.message);
      return data({ error: error.message }, { status: 401 });
    }
    if (error instanceof RockAPIError) {
      console.error("RockAPIError:", error.message);
      return data({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof EncryptionError) {
      console.error("EncryptionError:", error.message);
      return data({ error: error.message }, { status: 400 });
    }
    console.error("Unhandled authentication error:", error);
    return data(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
};
