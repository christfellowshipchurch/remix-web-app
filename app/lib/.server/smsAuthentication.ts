import crypto from "crypto";
import { parsePhoneNumber } from "awesome-phonenumber";

import { AuthenticationError } from "~/lib/.server/errorTypes";
import { secret } from "~/lib/.server/token";
import { User_Auth_Status } from "~/providers/auth-provider";
import {
  deleteRockData,
  fetchRockData,
  patchRockData,
  postRockData,
} from "~/lib/.server/fetchRockData";
import { fieldsAsObject } from "~/lib/utils";
import { sendSms } from "~/lib/.server/twilio";
import { authenticateUser } from "~/lib/.server/authenticateUser";
import { createUserProfile } from "~/lib/.server/fetchRockAuthentication";
import { checkUserExists, fetchUserLogin } from "~/routes/_auth.userExists";

interface AuthParams {
  pin: string;
  phoneNumber: string;
  userProfile: any[];
}

export type SmsPinResult = {
  success?: boolean;
  userAuthStatus?: User_Auth_Status;
};

const parsePhoneNumberUtil = (phoneNumber: string) => {
  const parsedNumber = parsePhoneNumber(phoneNumber, { regionCode: "US" });

  return {
    valid: parsedNumber.valid,
    significantNumber: parsedNumber.number?.significant || "",
    countryCode: parsedNumber.countryCode,
    e164: parsedNumber.number?.e164 || "",
  };
};

const hashPassword = (pin: string) =>
  crypto.createHash("sha256").update(`${pin}${secret}`).digest("hex");

const generateSmsPinAndPassword = () => {
  const pin = `${Math.floor(Math.random() * 1000000)}`.padStart(6, "0");
  const password = hashPassword(pin);

  return { pin, password };
};

const createPhoneNumber = async ({
  personId,
  phoneNumber,
  countryCode,
}: {
  personId: string;
  phoneNumber: string;
  countryCode: number;
}) =>
  postRockData("PhoneNumbers", {
    PersonId: personId,
    Number: phoneNumber,
    CountryCode: countryCode,
    IsMessagingEnabled: true,
    IsSystem: false,
    NumberTypeValueId: 13,
  });

const createOrFindSmsLoginUserId = async ({
  phoneNumber,
  userProfile,
}: {
  phoneNumber: string;
  userProfile: any[];
}) => {
  const { significantNumber, countryCode } = parsePhoneNumberUtil(phoneNumber);

  const existingPhoneNumbers = await fetchRockData("PhoneNumbers", {
    $select: "PersonId",
    $filter: `Number eq '${significantNumber}'`,
  });

  if (existingPhoneNumbers.length > 0) {
    return existingPhoneNumbers[0].personId;
  }

  const profileFields = fieldsAsObject(userProfile || []);
  const personId = await createUserProfile({ email: null, ...profileFields });

  if (!countryCode) {
    throw new AuthenticationError("Country code is required for phone number");
  }
  await createPhoneNumber({ personId, phoneNumber, countryCode });

  return personId;
};

export const requestSmsLogin = async (
  phoneNumber: string
): Promise<SmsPinResult> => {
  const { ExistingAppUser, None } = User_Auth_Status;
  const { valid, significantNumber, e164 } = parsePhoneNumberUtil(phoneNumber);

  if (!valid) {
    throw new AuthenticationError(
      `${significantNumber} is not a valid phone number`
    );
  }

  const { pin, password } = generateSmsPinAndPassword();

  const existingUserLogin = await fetchRockData(`UserLogins`, {
    $filter: `UserName eq '${significantNumber}'`,
    $top: "1",
  });

  let personOptions = {};

  // If the user already exists, we need to delete the existing login
  if (existingUserLogin) {
    const userLogins = Array.isArray(existingUserLogin)
      ? existingUserLogin
      : [existingUserLogin];

    if (userLogins.length > 0) {
      const { personId, id } = userLogins[0];
      if (personId) {
        personOptions = { PersonId: personId };
      }
      await deleteRockData(`UserLogins/${id}`);
    }
  }

  const createNewLogin = await postRockData(`UserLogins`, {
    UserName: significantNumber,
    PlainTextPassword: password,
    EntityTypeId: 27,
    isConfirmed: true,
    ...personOptions,
  });

  // Create new login should return an ID
  if (typeof createNewLogin !== "number") {
    console.error("Failed to create new login for", phoneNumber);
    throw new AuthenticationError(
      `Failed to create new login for ${phoneNumber}`
    );
  }

  try {
    await sendSms({
      to: e164,
      body: `Your login code is ${pin}`,
    });
  } catch (error: any) {
    console.error("Failed to send SMS:", error.message);
    throw new AuthenticationError(`Failed to send SMS: ${error.message}`);
  }

  return {
    success: true,
    userAuthStatus: existingUserLogin ? ExistingAppUser : None,
  };
};

export const authenticateWithSms = async ({
  pin,
  phoneNumber,
  userProfile,
}: AuthParams) => {
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

export const userExists = async (
  identity: string
): Promise<User_Auth_Status> => {
  const { significantNumber, valid } = parsePhoneNumberUtil(identity);

  let parsedIdentity;
  if (valid) {
    parsedIdentity = significantNumber;
  } else {
    parsedIdentity = identity;
  }

  const userExists = await checkUserExists(parsedIdentity);

  if (userExists) {
    return User_Auth_Status.ExistingAppUser;
  }
  return User_Auth_Status.None;
};
