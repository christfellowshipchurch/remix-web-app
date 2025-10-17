import { data } from "react-router-dom";
import { registerPersonWithEmail } from "~/lib/.server/authentication/rock-authentication";
import { RegistrationTypes, UserInputData } from "~/providers/auth-provider";
import { authenticateOrRegisterWithSms } from "~/lib/.server/authentication/authenticate-or-register-with-sms";

type RegisterPersonType = {
  registrationType: RegistrationTypes;
  userInputData: UserInputData;
};

export const registerPerson = async ({
  registrationType,
  userInputData,
}: RegisterPersonType) => {
  if (!userInputData) {
    return data({ error: "User input data is required" }, { status: 400 });
  }
  const registrationData = JSON.parse(userInputData as unknown as string);

  switch (registrationType) {
    case "sms":
      try {
        const { encryptedToken } = await authenticateOrRegisterWithSms(
          registrationData
        );
        return new Response(JSON.stringify({ encryptedToken }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const statusCode =
          (error as { statusCode?: number })?.statusCode || 500;
        return data({ error: errorMessage }, { status: statusCode });
      }
    case "email":
      try {
        const { token } = await registerPersonWithEmail(registrationData);
        return new Response(JSON.stringify({ encryptedToken: token }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const statusCode =
          (error as { statusCode?: number })?.statusCode || 500;
        return data({ error: errorMessage }, { status: statusCode });
      }
    default:
      return data({ error: "Invalid registration type" }, { status: 400 });
  }
};
