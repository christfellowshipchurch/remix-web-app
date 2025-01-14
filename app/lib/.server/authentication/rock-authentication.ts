/**
 * This file contains our main authentication functions for Rock.
 */
import { checkUserExists } from "~/routes/auth/userExists";
import { AuthenticationError, RockAPIError } from "../error-types";
import { fetchRockData, postRockData } from "../fetch-rock-data";
import { createPerson } from "../rock-person";
import { RockUserLogin } from "./authentication.types";
import { fieldsAsObject } from "~/lib/utils";
import { authenticateUser } from "./authenticate-user";
import {
  createPhoneNumberInRock,
  parsePhoneNumberUtil,
} from "./sms-authentication";

export const fetchUserCookie = async (
  Username: string,
  Password: string
): Promise<string> => {
  if (!Username || !Password) {
    throw new AuthenticationError("Username and password are required");
  }

  try {
    const response = await fetch(
      new Request(`${process.env.ROCK_API}/Auth/Login`, {
        method: "POST",
        body: JSON.stringify({
          Username,
          Password,
          Persisted: true,
        }),
        headers: {
          "Content-Type": "Application/Json",
        },
      })
    );

    if (!response.ok) {
      const statusCode = response.status;
      if (statusCode === 401) {
        throw new AuthenticationError("Invalid credentials");
      }
      throw new RockAPIError(
        `Authentication failed with status ${statusCode}`,
        statusCode
      );
    }

    const cookie = response.headers.get("set-cookie");
    if (!cookie) {
      throw new RockAPIError("No authentication cookie received", 500);
    }

    return cookie;
  } catch (err) {
    if (err instanceof AuthenticationError || err instanceof RockAPIError) {
      throw err;
    }
    throw new RockAPIError(
      `Authentication failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      500
    );
  }
};

export const getCurrentPerson = async (cookie: string): Promise<any> => {
  if (!cookie) {
    throw new AuthenticationError("No authentication cookie provided");
  }

  try {
    const person = await fetchRockData(
      "People/GetCurrentPerson",
      {},
      {
        "Authorization-Token": "",
        Cookie: cookie,
      },
      true // no cache
    );

    if (!person) {
      throw new RockAPIError("Failed to fetch current person", 404);
    }

    return person;
  } catch (err) {
    if (err instanceof AuthenticationError || err instanceof RockAPIError) {
      throw err;
    }
    throw new RockAPIError(
      `Failed to get current person: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      500
    );
  }
};

export const createRockSession = async (cookie: string): Promise<any> => {
  if (!cookie) {
    throw new AuthenticationError("No authentication cookie provided");
  }

  const currentPerson = await getCurrentPerson(cookie);

  if (!currentPerson?.primaryAliasId) {
    throw new RockAPIError("Invalid person data: missing primaryAliasId", 400);
  }

  try {
    const response = await fetch(`${process.env.ROCK_API}InteractionSessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization-Token": `${process.env.ROCK_TOKEN}`,
      },
      body: JSON.stringify({
        PersonAliasId: currentPerson.primaryAliasId,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new RockAPIError(
        `Failed to create Rock Session: ${errorDetails}`,
        response.status
      );
    }

    const data = await response.json();

    if (!data) {
      throw new RockAPIError("Empty response from Rock Session creation", 500);
    }

    return data;
  } catch (err) {
    if (err instanceof AuthenticationError || err instanceof RockAPIError) {
      throw err;
    }
    throw new RockAPIError(
      `Session creation failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      500
    );
  }
};

export const createUserProfile = async ({
  email,
  ...otherFields
}: {
  email?: string;
  [key: string]: any;
}) => {
  try {
    const person = await createPerson({
      Email: email,
      // In order to get Rock's duplicate record system
      // to trigger, we need to mark the record as
      // "pending" which is the status value id: 5
      RecordStatusValueId: 5,
      ...otherFields,
    });
    return person;
  } catch (err) {
    throw new Error("Unable to create profile!");
  }
};

export const fetchUserLogin = async (
  identity: string
): Promise<RockUserLogin | null> => {
  const userLogin = await fetchRockData(
    "UserLogins",
    {
      $filter: `UserName eq '${identity}'`,
      $top: "1",
    },
    undefined,
    true // no cache
  );

  // If no login exists for the identity, return null
  if (Array.isArray(userLogin) && userLogin.length === 0) {
    return null;
  }

  // Ensures that the return value is an object
  return Array.isArray(userLogin) ? userLogin[0] : userLogin;
};

export const createUserLogin = async (
  identity: string,
  password: string,
  personId: number
) => {
  try {
    return await postRockData("UserLogins", {
      PersonId: personId,
      EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
      UserName: identity,
      isConfirmed: true,
      PlainTextPassword: password,
      LastLoginDateTime: new Date(),
    });
  } catch (err) {
    throw new Error("Unable to create user login!");
  }
};

export const registerPersonWithEmail = async ({
  email,
  phoneNumber,
  password,
  userProfile,
}: {
  email: string;
  phoneNumber?: string;
  password: string;
  userProfile: any;
}) => {
  const personExists = await checkUserExists(email);
  if (personExists) throw new Error("User already exists!");

  const profileFields = fieldsAsObject(userProfile || []);
  const personId = await createUserProfile({ email, ...profileFields });

  /**
   * If the phone number is provided, we need to check if it already exists before creating it in Rock.
   */
  if (phoneNumber && phoneNumber !== "") {
    const { significantNumber, countryCode } =
      parsePhoneNumberUtil(phoneNumber);
    const existingPhoneNumbers = await fetchRockData(
      "PhoneNumbers",
      {
        $select: "PersonId",
        $filter: `Number eq '${significantNumber}'`,
      },
      undefined,
      true // no cache
    );

    if (existingPhoneNumbers) {
      if (!countryCode) {
        throw new Error("Country code is required for creating phone number");
      }
      await createPhoneNumberInRock({ personId, phoneNumber, countryCode });
    }
  }

  await createUserLogin(email, password, personId);

  return await authenticateUser(email, password);
};
