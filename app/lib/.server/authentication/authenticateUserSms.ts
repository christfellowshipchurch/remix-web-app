import {
  createOrFindSmsLoginUserId,
  hashPassword,
  parsePhoneNumberUtil,
} from "./smsAuthentication";
import { AuthenticationError } from "../errorTypes";
import { patchRockData } from "../fetchRockData";
import { authenticateUser } from "./authenticateUser";
import { SmsAuthParams } from "./authentication.types";
import { fetchUserLogin } from "./rockAuthentication";

export const authenticateWithSms = async ({
  pin,
  phoneNumber,
  userProfile,
}: SmsAuthParams) => {
  const { significantNumber } = parsePhoneNumberUtil(phoneNumber);

  const userLogin = await fetchUserLogin(significantNumber);

  if (!userLogin) {
    throw new AuthenticationError("Invalid input");
  }

  if (userLogin && userLogin.personId === null) {
    const personId = await createOrFindSmsLoginUserId({
      phoneNumber,
      userProfile: userProfile || [],
    });

    await patchRockData(`UserLogins/${userLogin?.id}`, {
      PersonId: personId,
    });
  }

  const identity = phoneNumber;
  const password = hashPassword(pin);

  const { encryptedToken } = await authenticateUser(
    identity as string,
    password as string
  );

  return encryptedToken;
};
