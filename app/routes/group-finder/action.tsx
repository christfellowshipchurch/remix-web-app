import { ActionFunction, data } from "react-router-dom";
import {
  fetchRockData,
  postRockData,
  TTL,
} from "~/lib/.server/fetch-rock-data";
import { fetchUserLogin } from "~/lib/.server/authentication/rock-authentication";
import { updatePerson } from "~/lib/.server/rock-person";
import {
  createOrFindSmsLoginUserId,
  parsePhoneNumberUtil,
} from "~/lib/.server/authentication/sms-authentication";
import { escapeOData } from "~/lib/.server/rock-utils";

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
  email: string,
) => {
  return await fetchRockData({
    endpoint: "People",
    queryParams: {
      $filter: `FirstName eq '${escapeOData(firstName)}' and LastName eq '${escapeOData(lastName)}' and Email eq '${escapeOData(email)}'`,
      $select: "Id",
    },
    ttl: TTL.NONE,
  });
};

const findPersonByPhoneAndName = async (
  firstName: string,
  lastName: string,
  phoneNumber: string,
) => {
  const { significantNumber } = parsePhoneNumberUtil(phoneNumber);
  const existingPhoneNumbers = await fetchRockData({
    endpoint: "PhoneNumbers",
    queryParams: {
      $select: "PersonId",
      $filter: `Number eq '${significantNumber}'`,
    },
    ttl: TTL.NONE,
  });

  // Convert to array if single object
  const phoneEntries = Array.isArray(existingPhoneNumbers)
    ? existingPhoneNumbers
    : typeof existingPhoneNumbers === "object" && existingPhoneNumbers !== null
      ? [existingPhoneNumbers]
      : [];

  if (phoneEntries.length === 0) {
    return { found: false };
  }

  // Check each phone entry
  for (const phoneEntry of phoneEntries) {
    if (!phoneEntry.personId) continue;

    const personDetails = await fetchRockData({
      endpoint: "People",
      queryParams: {
        $filter: `Id eq ${phoneEntry.personId}`,
        $select: "FirstName, LastName",
      },
      ttl: TTL.NONE,
    });

    const namesMatch =
      personDetails.firstName?.toLowerCase() === firstName.toLowerCase() &&
      personDetails.lastName?.toLowerCase() === lastName.toLowerCase();

    if (namesMatch) {
      return { personId: phoneEntry.personId, found: true };
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
    email,
  );
  let existingPerson = emailExists;

  // Ensure existingPerson is an object
  if (Array.isArray(emailExists) && emailExists.length > 0) {
    existingPerson = emailExists[0];
  }

  if (existingPerson && existingPerson.id) {
    await updatePerson(existingPerson.id.toString(), { email, phoneNumber });
    return existingPerson.id;
  }

  // Check for existing person by phone and name
  const phoneExists = await findPersonByPhoneAndName(
    firstName,
    lastName,
    phoneNumber,
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

<<<<<<< Updated upstream
    // Get group ID
    const groupId = await fetchRockData({
      endpoint: "Groups",
      queryParams: {
        $filter: `Name eq '${escapeOData(formData.groupName as string)}'`,
        $select: "Id",
      },
      ttl: TTL.NONE,
=======
    const firstName = formData.firstName?.toString() ?? '';
    const lastName = formData.lastName?.toString() ?? '';
    const phoneNumber = formData.phoneNumber?.toString() ?? '';
    const email = formData.email?.toString() ?? '';
    const groupId = formData.groupId?.toString() ?? '';
    // TODO: write campus to Rock person (PrimaryCampusId) once campus ID lookup is available
    const _campus = formData.campus?.toString();

    if (!firstName || !lastName || !phoneNumber || !email || !groupId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const personId = await findOrCreateRockPersonForSignup({
      firstName,
      lastName,
      email,
      phoneNumber,
>>>>>>> Stashed changes
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
    await postRockData({
      endpoint: `Workflows/LaunchWorkflow/0?workflowTypeId=654&workflowName=Add%20To%20Group/Class`,
      body: { GroupId: groupId.id, PersonId: personId },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
<<<<<<< Updated upstream
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "Network error please try again" }, { status: 400 });
=======
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Network error please try again',
      },
      { status: 400 },
    );
>>>>>>> Stashed changes
  }
};
