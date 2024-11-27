import { json } from "@remix-run/node";
import { registerPersonWithEmail } from "~/lib/.server/authentication/rockAuthentication";
import { RegistrationTypes, UserInputData } from "~/providers/auth-provider";
import { authenticateOrRegisterWithSms } from "~/lib/.server/authentication/authenticateOrRegisterWithSms";

type RegisterPersonType = {
  registrationType: RegistrationTypes;
  userInputData: UserInputData;
};

export const registerPerson = async ({
  registrationType,
  userInputData,
}: RegisterPersonType) => {
  if (!userInputData) {
    return json({ error: "User input data is required" }, { status: 400 });
  }
  const registrationData = JSON.parse(userInputData as unknown as string);

  switch (registrationType) {
    case "sms":
      try {
        const token = await authenticateOrRegisterWithSms(registrationData);
        return json({ encryptedToken: token });
      } catch (error: any) {
        return json({ error: error.message }, { status: error.statusCode });
      }
    case "email":
      try {
        const token = await registerPersonWithEmail(registrationData);
        return json({ encryptedToken: token });
      } catch (error: any) {
        return json({ error: error.message }, { status: error.statusCode });
      }
    default:
      return json({ error: "Invalid registration type" }, { status: 400 });
  }
};
