import { fetchRockData, postRockData, TTL } from './fetch-rock-data';
import { fetchUserLogin } from './authentication/rock-authentication';
import {
  createOrFindSmsLoginUserId,
  parsePhoneNumberUtil,
} from './authentication/sms-authentication';
import { updatePerson } from './rock-person';
import { escapeOData } from './rock-utils';

export interface SignupPersonInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const findOrCreateRockPersonForSignup = async (
  input: SignupPersonInput,
): Promise<string> => {
  const { firstName, lastName, email, phoneNumber } = input;
  const { significantNumber } = parsePhoneNumberUtil(phoneNumber);

  // Step 1: Check by email login
  const emailLogin = await fetchUserLogin(email);
  if (emailLogin) {
    await updatePerson(emailLogin.personId.toString(), { email, phoneNumber });
    return emailLogin.personId.toString();
  }

  // Step 2: Check by phone login
  const phoneLogin = await fetchUserLogin(phoneNumber);
  if (phoneLogin) {
    await updatePerson(phoneLogin.personId.toString(), { email, phoneNumber });
    return phoneLogin.personId.toString();
  }

  // Step 3: Query People by first name, last name, and email
  const peopleByEmail = await fetchRockData({
    endpoint: 'People',
    queryParams: {
      $filter: `FirstName eq '${escapeOData(firstName)}' and LastName eq '${escapeOData(lastName)}' and Email eq '${escapeOData(email)}'`,
      $select: 'Id',
    },
    ttl: TTL.NONE,
  });

  const personByEmail = Array.isArray(peopleByEmail)
    ? peopleByEmail[0]
    : peopleByEmail;

  if (personByEmail?.id) {
    await updatePerson(personByEmail.id.toString(), { email, phoneNumber });
    return personByEmail.id.toString();
  }

  // Step 4: Query PhoneNumbers by significant number, then verify name match
  const phoneEntries = await fetchRockData({
    endpoint: 'PhoneNumbers',
    queryParams: {
      $select: 'PersonId',
      $filter: `Number eq '${significantNumber}'`,
    },
    ttl: TTL.NONE,
  });

  const phoneEntriesArr = Array.isArray(phoneEntries)
    ? phoneEntries
    : phoneEntries != null
      ? [phoneEntries]
      : [];

  for (const entry of phoneEntriesArr) {
    if (!entry.personId) continue;

    const personDetails = await fetchRockData({
      endpoint: 'People',
      queryParams: {
        $filter: `Id eq ${entry.personId}`,
        $select: 'FirstName, LastName',
      },
      ttl: TTL.NONE,
    });

    const namesMatch =
      personDetails?.firstName?.toLowerCase() === firstName.toLowerCase() &&
      personDetails?.lastName?.toLowerCase() === lastName.toLowerCase();

    if (namesMatch) {
      await updatePerson(entry.personId.toString(), { email, phoneNumber });
      return entry.personId.toString();
    }
  }

  // Step 5: No match found — create a new person via SMS login flow
  return (
    await createOrFindSmsLoginUserId({
      phoneNumber,
      email,
      userProfile: [
        { field: 'FirstName', value: firstName },
        { field: 'LastName', value: lastName },
      ],
    })
  ).toString();
};

export const launchGroupClassSignupWorkflow = async (
  groupId: string,
  personId: string,
): Promise<void> => {
  await postRockData({
    endpoint: `Workflows/LaunchWorkflow/0?workflowTypeId=654&workflowName=Add%20To%20Group/Class`,
    body: { GroupId: groupId, PersonId: personId },
  });
};
