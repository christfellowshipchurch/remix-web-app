import { data } from "react-router";
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
        const token = await authenticateOrRegisterWithSms(registrationData);
        return new Response(JSON.stringify({ encryptedToken: token }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return data({ error: error.message }, { status: error.statusCode });
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
      } catch (error: any) {
        return data({ error: error.message }, { status: error.statusCode });
      }
    default:
      return data({ error: "Invalid registration type" }, { status: 400 });
  }
};
