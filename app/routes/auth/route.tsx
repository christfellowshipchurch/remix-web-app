import { ActionFunction, data } from "react-router";
import { authenticate } from "./authenticate";
import { requestSmsPinLogin } from "./requestSmsPinLogin";
import { authenticateSms } from "./authenticateSms";
import { currentUser } from "./currentUser";
import { userExists } from "./userExists";
import { RegistrationTypes, UserInputData } from "~/providers/auth-provider";
import { registerPerson } from "./registerPerson";

/**
 * In order to consolidate all of our auth route functions we decided to setup a single action function that will handle all of the different form types that we have. This will allow us to have a single route file for all of our auth routes.
 */

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formType = formData.get("formType");

  switch (formType) {
    case "authenticate":
      const identity = formData.get("identity");
      const password = formData.get("password");
      return await authenticate({
        identity: identity as string,
        password: password as string,
      });
    case "requestSmsPin":
      const requestNumber = formData.get("phoneNumber");
      return await requestSmsPinLogin(requestNumber as string);
    case "loginWithSms":
      const phoneNumber = formData.get("phoneNumber");
      const pin = formData.get("pin");
      return await authenticateSms({
        phoneNumber: phoneNumber as string,
        pin: pin as string,
      });
    case "currentUser":
      const token = formData.get("token");
      return await currentUser(token as string);
    case "checkUserExists":
      const checkIdentity = formData.get("identity");
      return await userExists(checkIdentity as string);
    case "registerPerson":
      const registrationType = formData.get("registrationType");
      const userInputData = formData.get("userInputData");
      return await registerPerson({
        registrationType: registrationType as RegistrationTypes,
        userInputData: userInputData as unknown as UserInputData,
      });
    default:
      return data({ error: "Invalid form type" }, { status: 400 });
  }
};
