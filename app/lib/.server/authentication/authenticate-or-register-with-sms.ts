import {
  createOrFindSmsLoginUserId,
  hashPassword,
  parsePhoneNumberUtil,
} from "./sms-authentication";
import { AuthenticationError } from "../error-types";
import { patchRockData } from "../fetch-rock-data";
import { authenticateUser } from "./authenticate-user";
import { SmsAuthParams } from "./authentication.types";
import { fetchUserLogin } from "./rock-authentication";

export const authenticateOrRegisterWithSms = async ({
  pin,
  phoneNumber,
  userProfile,
  email,
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
      email,
    });

    await patchRockData({
      endpoint: `UserLogins/${userLogin?.id}`,
      body: {
        PersonId: personId,
      },
    });
  }

  const identity = phoneNumber;
  const password = hashPassword(pin);

  const { encryptedToken } = await authenticateUser(
    identity as string,
    password as string
  );

  return { encryptedToken, personId: userLogin.personId };
};
