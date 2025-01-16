import { ActionFunction, data } from "react-router";
import { ContactFormType } from "./types";
import { fetchRockData, postRockData } from "~/lib/.server/fetch-rock-data";
import { fetchUserLogin } from "~/lib/.server/authentication/rock-authentication";
import { updatePerson } from "~/lib/.server/rock-person";
import {
  createOrFindSmsLoginUserId,
  parsePhoneNumberUtil,
} from "~/lib/.server/authentication/sms-authentication";

// Types
interface PersonFormData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate: string;
}

// Helper functions
const findUserByLogin = async (email: string, phoneNumber: string) => {
  let userLogin = await fetchUserLogin(email);
  if (!userLogin) {
    userLogin = await fetchUserLogin(phoneNumber);
  }
  return userLogin;
};

const findPersonByEmailAndName = async (
  firstName: string,
  lastName: string,
  email: string
) => {
  return await fetchRockData("People", {
    $filter: `FirstName eq '${firstName}' and LastName eq '${lastName}' and Email eq '${email}'`,
    $select: "Id",
  });
};

const findPersonByPhoneAndName = async (
  firstName: string,
  lastName: string,
  phoneNumber: string
) => {
  const { significantNumber } = parsePhoneNumberUtil(phoneNumber);
  const existingPhoneNumbers = await fetchRockData(
    "PhoneNumbers",
    {
      $select: "PersonId",
      $filter: `Number eq '${significantNumber}'`,
    },
    undefined,
    true
  );

  for (const phoneEntry of existingPhoneNumbers) {
    const personDetails = await fetchRockData("People", {
      $filter: `Id eq ${phoneEntry.personId}`,
      $select: "FirstName, LastName",
    });

    if (
      personDetails.firstName === firstName &&
      personDetails.lastName === lastName
    ) {
      return { ...phoneEntry, found: true };
    }
  }
  return { found: false };
};

// Main functions
const getPersonIdFromGroupForm = async ({
  email,
  phoneNumber,
  firstName,
  lastName,
  gender,
  birthDate,
}: PersonFormData): Promise<string> => {
  // Check for existing user login
  const userLogin = await findUserByLogin(email, phoneNumber);
  if (userLogin) {
    await updatePerson(userLogin.personId.toString(), { email, phoneNumber });
    return userLogin.personId.toString();
  }

  // Check for existing person by email and name
  const emailExists = await findPersonByEmailAndName(
    firstName,
    lastName,
    email
  );
  if (emailExists) {
    await updatePerson(emailExists.id.toString(), { email, phoneNumber });
    return emailExists.id;
  }

  // Check for existing person by phone and name
  const phoneExists = await findPersonByPhoneAndName(
    firstName,
    lastName,
    phoneNumber
  );
  if (phoneExists.found) {
    await updatePerson(phoneExists.personId.toString(), { email, phoneNumber });
    return phoneExists.personId.toString();
  }

  // Create new user if no matches found
  const userData = {
    email,
    phoneNumber,
    userProfile: [
      { field: "FirstName", value: firstName },
      { field: "LastName", value: lastName },
      { field: "BirthDate", value: birthDate },
      { field: "Gender", value: gender },
    ],
  };

  return (await createOrFindSmsLoginUserId(userData)).toString();
};

// Action
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = Object.fromEntries(await request.formData());

    // Get group ID
    const groupId = await fetchRockData("Groups", {
      $filter: `Name eq '${formData.groupName}'`,
      $select: "Id",
    });

    // Get or create person
    const personId = await getPersonIdFromGroupForm({
      email: formData.email?.toString(),
      phoneNumber: formData.phoneNumber?.toString(),
      firstName: formData.firstName?.toString(),
      lastName: formData.lastName?.toString(),
      gender: formData.gender?.toString(),
      birthDate: formData.birthDate?.toString(),
    });

    // Submit contact form
    await postRockData(
      `Workflows/LaunchWorkflow/0?workflowTypeId=654&workflowName=Add%20To%20Group/Class`,
      { GroupId: groupId.id, PersonId: personId } as ContactFormType
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "Network error please try again" }, { status: 400 });
  }
};
