import { ActionFunction, data } from "react-router";
import { ContactFormType } from "./types";
import { fetchRockData, postRockData } from "~/lib/.server/fetchRockData";
import { AUTH_TOKEN_KEY, RegistrationTypes } from "~/providers/auth-provider";
import {
  fetchUserLogin,
  getCurrentPerson,
} from "~/lib/.server/authentication/rockAuthentication";
import { registerToken } from "~/lib/.server/token";
import { decrypt } from "~/lib/.server/decrypt";
import { registerPerson } from "../auth/registerPerson";

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
  console.log("here");
  // Checking CurrentUser - If we will not have login on our platform this can be removed.
  if (token) {
    console.log("token exists", token);
    const { rockCookie } = registerToken(decrypt(token as string));
    if (rockCookie) {
      const { id } = await getCurrentPerson(rockCookie);
      console.log("rockCookies exists", id);
      return id;
    }
  }

  //   TODO: Optional - If found user does not have email or phone number add the missing one.
  // Checking UserLogins to see if the user exists and get the Id
  console.log("checking logins with email", email);
  let userLogin = await fetchUserLogin(email as string);
  if (!userLogin) {
    console.log("checking logins with phoneNumber", phoneNumber);
    userLogin = await fetchUserLogin(phoneNumber as string);
  }
  if (userLogin) {
    console.log("userLogin exists", userLogin);
    return userLogin?.personId;
  }

  // TODO: Create a new user since no user was found
  console.log("creating new person");
  const newPerson = await registerPerson({
    registrationType: RegistrationTypes.EMAIL,
    userInputData: {
      email: email as string,
      phoneNumber: phoneNumber as string,
      userProfile: [
        { field: "FirstName", value: firstName as string },
        { field: "LastName", value: lastName as string },
        { field: "Gender", value: gender as string },
        { field: "BirthDate", value: birthDate as string },
      ],
    },
  });
  console.log("newPerson", newPerson);
  //   return newPerson;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    console.log("here");
    const formData = Object.fromEntries(await request.formData());
    console.log("formData1", formData);

    const email = formData.email?.toString();
    const phoneNumber = formData.phoneNumber?.toString();
    const firstName = formData.firstName?.toString();
    const lastName = formData.lastName?.toString();
    const gender = formData.gender?.toString();
    const birthDate = formData.birthDate?.toString();
    const groupName = formData.groupName?.toString();

    console.log("formData2", formData);
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

    console.log("personId", personId);
    // const contactFormSubmission: ContactFormType = {
    //   GroupId: groupId as string,
    //   PersonId: personId as number,
    // };

    // await postRockData(
    //   `Workflows/LaunchWorkflow/0?workflowTypeId=654&workflowName=Add%20To%20Group/Class`,
    //   contactFormSubmission
    // );

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
