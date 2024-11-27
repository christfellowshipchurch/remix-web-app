import { ActionFunction, json } from "@remix-run/node";
import { authenticate } from "./authenticate";
import { requestSmsPinLogin } from "./requestSmsPinLogin";
import { authenticateSms } from "./authenticateSms";
import { currentUser } from "./currentUser";
import { userExists } from "./userExists";

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
    default:
      return json({ error: "Invalid form type" }, { status: 400 });
  }
};
