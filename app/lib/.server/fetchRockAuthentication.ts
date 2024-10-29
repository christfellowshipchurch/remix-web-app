import { AuthenticationError, RockAPIError } from "./errorTypes";
import { fetchRockData } from "./fetchRockData";
import { createPerson } from "./rockPerson";

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

export const getCurrentPerson = async (cookie: string) => {
  if (!cookie) {
    throw new AuthenticationError("No authentication cookie provided");
  }

  try {
    const person = await fetchRockData(
      "People/GetCurrentPerson",
      {},
      {
        Cookie: cookie,
      }
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

export const createRockSession = async (cookie: string) => {
  if (!cookie) {
    throw new AuthenticationError("No authentication cookie provided");
  }

  const currentPerson = await getCurrentPerson(cookie);

  if (!currentPerson?.primaryAliasId) {
    throw new RockAPIError("Invalid person data: missing primaryAliasId", 400);
  }

  try {
    const response = await fetch(
      `${process.env.ROCK_API}/InteractionSessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization-Token": `${process.env.ROCK_TOKEN}`,
          Cookie: cookie,
        },
        body: JSON.stringify({
          PersonAliasId: currentPerson.primaryAliasId,
        }),
      }
    );

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
