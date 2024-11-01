import { json } from "@remix-run/node";
import { isRouteErrorResponse } from "@remix-run/react";
import { authenticateWithSms } from "~/lib/.server/authentication/authenticateUserSms";

type AuthenticateSmsData = {
  pin: string;
  phoneNumber: string;
  userProfile?: string;
};

export const authenticateSms = async ({
  pin,
  phoneNumber,
  userProfile: userProfileString,
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

  // todo : we need to review/implement this with  register user...
  let userProfile;
  if (
    userProfileString !== undefined &&
    typeof userProfileString !== "string"
  ) {
    try {
      userProfile = JSON.parse(userProfileString);
    } catch (parseError) {
      console.error("Failed to parse userProfile:", parseError);
      return json({ error: "Invalid user profile format" }, { status: 400 });
    }
  }

  try {
    const encryptedToken = await authenticateWithSms({
      pin,
      phoneNumber,
      userProfile,
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
