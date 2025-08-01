import { data } from "react-router-dom";
import { getCurrentPerson } from "~/lib/.server/authentication/rock-authentication";
import { decrypt } from "~/lib/.server/decrypt";
import { registerToken } from "~/lib/.server/token";
import {
  AuthenticationError,
  RockAPIError,
  EncryptionError,
} from "~/lib/.server/error-types";
import { createImageUrlFromGuid } from "~/lib/utils";
import { User } from "~/providers/auth-provider";

export const currentUser = async (token: string) => {
  try {
    if (!token || typeof token !== "string") {
      throw new AuthenticationError("Token is required and must be a string");
    }

    let decryptedToken;
    try {
      decryptedToken = decrypt(token);
    } catch (error) {
      throw new EncryptionError("Failed to decrypt token");
    }

    const { rockCookie } = registerToken(decryptedToken);

    if (!rockCookie) {
      throw new AuthenticationError("rockCookie is undefined");
    }

    const { id, fullName, phoneNumbers, photo, email } = await getCurrentPerson(
      rockCookie
    );

    /**
     * todo: Finish implementing the rest of the user data
     */
    const currentUser: User = {
      id,
      fullName,
      email,
      phoneNumber: phoneNumbers[0]?.number,
      birthDate: "",
      gender: "",
      guid: "",
      photo: photo ? createImageUrlFromGuid(photo.guid) : "",
    };

    return new Response(JSON.stringify(currentUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return data({ error: error.message }, { status: 401 });
    }
    if (error instanceof RockAPIError) {
      return data({ error: error.message }, { status: error.statusCode });
    }
    return data({ error: "An unexpected error occurred" }, { status: 500 });
  }
};
