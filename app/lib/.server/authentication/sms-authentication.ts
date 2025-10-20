/**
 * This file contains our SMS authentication functions.
 */
import crypto from "crypto";
import { parsePhoneNumber } from "awesome-phonenumber";

import { AuthenticationError } from "~/lib/.server/error-types";
import { User_Auth_Status } from "~/providers/auth-provider";
import {
  deleteRockData,
  fetchRockData,
  postRockData,
} from "~/lib/.server/fetch-rock-data";
import { fieldsAsObject } from "~/lib/utils";

interface FieldObject {
  field: string;
  value: unknown;
}
import { sendSms } from "~/lib/.server/twilio";
import { createUserProfile, fetchUserLogin } from "./rock-authentication";
import { SmsPinResult } from "./authentication.types";
import { checkUserExists } from "~/routes/auth/userExists";

export const parsePhoneNumberUtil = (
  phoneNumber: string
): {
  valid: boolean;
  significantNumber: string;
  countryCode: number | undefined;
  e164: string;
} => {
  const parsedNumber = parsePhoneNumber(phoneNumber, { regionCode: "US" });

  return {
    valid: parsedNumber.valid,
    significantNumber: parsedNumber.number?.significant || "",
    countryCode: parsedNumber.countryCode,
    e164: parsedNumber.number?.e164 || "",
  };
};

export const hashPassword = (pin: string): string =>
  crypto
    .createHash("sha256")
    .update(`${pin}${process.env.SECRET || ""}`)
    .digest("hex");

export const generateSmsPinAndPassword = (): {
  pin: string;
  password: string;
} => {
  const pin = `${Math.floor(Math.random() * 1000000)}`.padStart(6, "0");
  const password = hashPassword(pin);

  return { pin, password };
};

export const createPhoneNumberInRock = async ({
  personId,
  phoneNumber,
  countryCode,
}: {
  personId: string;
  phoneNumber: string;
  countryCode: number;
}): Promise<boolean> => {
  try {
    await postRockData({
      endpoint: "PhoneNumbers",
      body: {
        PersonId: personId,
        Number: phoneNumber,
        CountryCode: countryCode,
        IsMessagingEnabled: true,
        IsSystem: false,
        NumberTypeValueId: 13,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to create phone number in Rock:", error);
    return false;
  }
};

export const createOrFindSmsLoginUserId = async ({
  phoneNumber,
  userProfile,
  email = null,
}: {
  phoneNumber: string;
  userProfile: unknown[];
  email?: string | null;
}): Promise<string> => {
  const { significantNumber, countryCode } = parsePhoneNumberUtil(phoneNumber);

  const existingPhoneNumbers = await fetchRockData({
    endpoint: "PhoneNumbers",
    queryParams: {
      $select: "PersonId",
      $filter: `Number eq '${significantNumber}'`,
    },
    cache: false,
  });

  /** if the phone number in Rock already is attached to a person we will just return that person instead */
  if (existingPhoneNumbers.length > 0) {
    return existingPhoneNumbers[0].personId;
  }

  const profileFields = fieldsAsObject((userProfile || []) as FieldObject[]);
  const personId = await createUserProfile({
    email: email ?? undefined,
    ...profileFields,
  });

  if (!countryCode) {
    throw new AuthenticationError("Country code is required for phone number");
  }
  await createPhoneNumberInRock({ personId, phoneNumber, countryCode });

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

  const existingUserLogin = await fetchUserLogin(significantNumber);

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

  const createNewLogin = await postRockData({
    endpoint: "UserLogins",
    body: {
      UserName: significantNumber,
      PlainTextPassword: password,
      EntityTypeId: 27,
      isConfirmed: true,
      ...personOptions,
    },
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
  } catch (error) {
    console.error(
      "Failed to send SMS:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new AuthenticationError(
      `Failed to send SMS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return {
    success: true,
    userAuthStatus: existingUserLogin ? ExistingAppUser : None,
  };
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
