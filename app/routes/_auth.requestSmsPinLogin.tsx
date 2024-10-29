import { ActionFunction, json } from "@remix-run/node";
import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/errorTypes";
import { requestSmsLogin } from "~/lib/.server/smsAuthentication";

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  try {
    const formData = await request.formData();
    const phoneNumber = formData.get("phoneNumber");

    if (!phoneNumber) {
      return json({ error: "Phone number is required" }, { status: 400 });
    }

    const res = await requestSmsLogin(phoneNumber as string);

    return json({ res });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error("AuthenticationError:", error.message);
      return json({ error: error.message }, { status: 401 });
    }
    if (error instanceof RockAPIError) {
      console.error("RockAPIError:", error.message);
      return json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof EncryptionError) {
      console.error("EncryptionError:", error.message);
      return json({ error: error.message }, { status: 400 });
    }
    console.error("Unhandled authentication error:", error);
    return json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
};
