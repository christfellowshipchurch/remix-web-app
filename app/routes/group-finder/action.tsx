import { ActionFunction, data } from "react-router";
import { ContactFormType } from "./types";
import { fetchRockData, postRockData } from "~/lib/.server/fetchRockData";
import { AUTH_TOKEN_KEY } from "~/providers/auth-provider";
import {
  fetchUserLogin,
  getCurrentPerson,
  registerPersonWithEmail,
} from "~/lib/.server/authentication/rockAuthentication";
import { registerToken } from "~/lib/.server/token";
import { decrypt } from "~/lib/.server/decrypt";

const getPersonId = async ({
  token,
  email,
  phoneNumber,
  firstName,
  lastName,
  gender,
  birthDate,
}: {
  token?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
}) => {
  // Checking CurrentUser - If we will not have login on our platform this can be removed.
  if (token) {
    const { rockCookie } = registerToken(decrypt(token as string));
    if (rockCookie) {
      const { id } = await getCurrentPerson(rockCookie);
      return id;
    }
  }

  //   TODO: Optional - If found user does not have email or phone number add the missing one.
  // Checking UserLogins to see if the user exists and get the Id
  let userLogin = await fetchUserLogin(email as string);
  if (!userLogin) {
    userLogin = await fetchUserLogin(phoneNumber as string);
  }
  if (userLogin) {
    return userLogin?.personId;
  }

  const userData = {
    email: email as string,
    phoneNumber: phoneNumber as string,
    password: Math.random().toString(36).slice(-8), // Generate 8-char random password
    userProfile: [
      { field: "FirstName", value: firstName as string },
      { field: "LastName", value: lastName as string },
      { field: "BirthDate", value: birthDate as string },
      { field: "Gender", value: gender as string },
    ],
  };
  const { personId } = await registerPersonWithEmail(userData);
  return personId.toString() as string;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    const email = formData.email?.toString();
    const phoneNumber = formData.phoneNumber?.toString();
    const firstName = formData.firstName?.toString();
    const lastName = formData.lastName?.toString();
    const gender = formData.gender?.toString();
    const birthDate = formData.birthDate?.toString();
    const groupName = formData.groupName?.toString();

    const token = request.headers
      .get("Cookie")
      ?.match(new RegExp(`${AUTH_TOKEN_KEY}=([^;]+)`))?.[1];

    // Fetch GroupId by it's name
    const groupId = await fetchRockData("Groups", {
      $filter: `Name eq '${groupName}'`,
      $select: "Id",
    });

    const personId = await getPersonId({
      token,
      email,
      phoneNumber,
      firstName,
      lastName,
      gender,
      birthDate,
    });

    const contactFormSubmission: ContactFormType = {
      GroupId: groupId.id as string,
      PersonId: personId as string,
    };

    await postRockData(
      `Workflows/LaunchWorkflow/0?workflowTypeId=654&workflowName=Add%20To%20Group/Class`,
      contactFormSubmission
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "Network error please try again" }, { status: 400 });
  }
};
