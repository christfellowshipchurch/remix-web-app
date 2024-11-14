import { json } from "@remix-run/node";
import { isRouteErrorResponse } from "@remix-run/react";
import { authenticateOrRegisterWithSms } from "~/lib/.server/authentication/authenticateOrRegisterWithSms";

type AuthenticateSmsData = {
  pin: string;
  phoneNumber: string;
  userProfile?: string;
};

export const authenticateSms = async ({
  pin,
  phoneNumber,
}: AuthenticateSmsData) => {
  if (!pin || !phoneNumber) {
    console.error("Missing required fields:", {
      pin,
      phoneNumber,
    });
    throw new Error(
      JSON.stringify({
        message: "Pin and phone number are required",
        status: 400,
      })
    );
  }

  try {
    const encryptedToken = await authenticateOrRegisterWithSms({
      pin,
      phoneNumber,
      userProfile: [], //not creating new profile, just authenticating
    });

    return json({ encryptedToken });
  } catch (error) {
    if (isRouteErrorResponse(error)) {
      return error;
    }
    console.error("Failed to authenticate with SMS:", error);
    return json({ error: "Failed to authenticate with SMS" }, { status: 500 });
  }
};
