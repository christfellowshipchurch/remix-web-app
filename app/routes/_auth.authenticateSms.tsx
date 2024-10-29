import { ActionFunction, json } from "@remix-run/node";
import { isRouteErrorResponse } from "@remix-run/react";
import { authenticateWithSms } from "~/lib/.server/smsAuthentication";

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const pin = formData.get("pin");
  const phoneNumber = formData.get("phoneNumber");
  const userProfileString = formData.get("userProfile");

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

  let userProfile = null;
  try {
    userProfile = JSON.parse(userProfileString as string);
  } catch (parseError) {
    console.error("Failed to parse userProfile:", parseError);
    return json({ error: "Invalid user profile format" }, { status: 400 });
  }

  try {
    const encryptedToken = await authenticateWithSms({
      pin: pin as string,
      phoneNumber: phoneNumber as string,
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
