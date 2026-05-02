import { fetchRockData, postRockData, TTL } from './fetch-rock-data';
import {
  createUserProfile,
  fetchUserLogin,
} from './authentication/rock-authentication';
import {
  createPhoneNumberInRock,
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

const normalizeName = (name: string | undefined) =>
  name?.trim().toLowerCase() ?? '';

const personNameMatches = async (
  personId: string | number,
  firstName: string,
  lastName: string,
): Promise<boolean> => {
  const personDetails = await fetchRockData({
    endpoint: 'People',
    queryParams: {
      $filter: `Id eq ${personId}`,
      $select: 'FirstName, LastName',
    },
    ttl: TTL.NONE,
  });

  const person = Array.isArray(personDetails) ? personDetails[0] : personDetails;

  return (
    normalizeName(person?.firstName) === normalizeName(firstName) &&
    normalizeName(person?.lastName) === normalizeName(lastName)
  );
};

export const findOrCreateRockPersonForSignup = async (
  input: SignupPersonInput,
): Promise<string> => {
  const { firstName, lastName, email, phoneNumber } = input;
  const { significantNumber, countryCode } = parsePhoneNumberUtil(phoneNumber);

  // Step 1: Check by email login
  const emailLogin = await fetchUserLogin(email);
  if (
    emailLogin &&
    (await personNameMatches(emailLogin.personId, firstName, lastName))
  ) {
    await updatePerson(emailLogin.personId.toString(), { email, phoneNumber });
    return emailLogin.personId.toString();
  }

  // Step 2: Check by phone login
  const phoneLogin = await fetchUserLogin(significantNumber);
  if (
    phoneLogin &&
    (await personNameMatches(phoneLogin.personId, firstName, lastName))
  ) {
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
      $filter: `Number eq '${escapeOData(significantNumber)}'`,
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

    if (await personNameMatches(entry.personId, firstName, lastName)) {
      await updatePerson(entry.personId.toString(), { email, phoneNumber });
      return entry.personId.toString();
    }
  }

  // Step 5: No match found — create a new person directly
  const newPersonId = await createUserProfile({
    email,
    FirstName: firstName,
    LastName: lastName,
  });
  if (countryCode) {
    await createPhoneNumberInRock({ personId: newPersonId, phoneNumber, countryCode });
  }
  return newPersonId.toString();
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
