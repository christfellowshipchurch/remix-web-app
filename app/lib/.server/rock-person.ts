import { createImageUrlFromGuid } from "~/lib/utils";
import { parseISO, isValid, getMonth, getDate, getYear } from "date-fns";
import { fetchRockData, patchRockData, postRockData } from "./fetch-rock-data";
import {
  createPhoneNumberInRock,
  parsePhoneNumberUtil,
} from "./authentication/sms-authentication";

export enum Gender {
  Female = "Female",
  Male = "Male",
  Unknown = "Unknown",
}

const RockGenderMap: { [key in Gender]: number } = {
  [Gender.Unknown]: 0,
  [Gender.Male]: 1,
  [Gender.Female]: 2,
};

interface PersonProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  BirthDate?: string;
  [key: string]: unknown;
}

export const createPerson = async (profile: PersonProfile) => {
  const inputProfileFields = await mapInputFieldsToRock(profile);
  return await postRockData({
    endpoint: "People",
    body: {
      Gender: 0,
      ...inputProfileFields,
      IsSystem: false,
    },
  });
};

export const updatePerson = async (
  id: string,
  fields: { email: string; phoneNumber: string }
) => {
  // Update User email if user does not have one in Rock
  const emailInRock = await fetchRockData({
    endpoint: `People/${id}`,
    queryParams: {
      $select: "Email",
    },
    cache: false, // no cache
  });
  if (!emailInRock.email) {
    await patchRockData({
      endpoint: `People/${id}`,
      body: {
        Email: fields.email,
      },
    });
  }

  // Create Phone Number in Rock
  const { significantNumber, countryCode } = parsePhoneNumberUtil(
    fields.phoneNumber
  );

  const existingPhoneNumbers = await fetchRockData({
    endpoint: "PhoneNumbers",
    queryParams: {
      $select: "PersonId",
      $filter: `Number eq '${significantNumber}'`,
    },
    cache: false, // no cache
  });

  if (!existingPhoneNumbers || existingPhoneNumbers.length === 0) {
    if (!countryCode) {
      throw new Error("Country code is required for creating phone number");
    }
    await createPhoneNumberInRock({
      personId: id,
      phoneNumber: fields.phoneNumber,
      countryCode,
    });
  }
};

// Uses the Person Alias GUID to get the Person
interface PersonData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  photo?: {
    guid: string;
    path: string;
  };
  [key: string]: unknown;
}

export const getPersonByAliasGuid = async (
  guid: string,
  loadAttributes?: boolean
): Promise<PersonData | null> => {
  const getPersonId = async () => {
    const person = await fetchRockData({
      endpoint: "PersonAlias",
      queryParams: {
        $filter: `Guid eq guid'${guid}'`,
      },
    });
    return person ? person[0]?.personId : null;
  };
  const personId = await getPersonId();
  // If we have a personAlias, return him.
  if (personId) {
    if (loadAttributes) {
      // If loadAttributes is true, return the person with attributes.
      return getFromId(personId, true);
    }
    return getFromId(personId);
  }
  // Otherwise, return null.
  return null;
};

// Uses the Person Alias ID to get the Person
export const getPersonByAliasId = async (
  id: string
): Promise<PersonData | null> => {
  const personAlias = await fetchRockData({
    endpoint: `PersonAlias/${id}`,
    queryParams: {},
  });
  return personAlias ? personAlias?.person : null;
};

// Uses the Person Alias ID to get the Person Alias GUID
export const getPersonAliasGuid = async (
  id: string
): Promise<string | null> => {
  const personAlias = await fetchRockData({
    endpoint: `PersonAlias/${id}`,
    queryParams: {},
  });
  return personAlias?.guid || null;
};

// Get a person from their ID
export const getFromId = async (
  id: string,
  loadAttributes?: boolean
): Promise<PersonData> => {
  const person = await fetchRockData({
    endpoint: "People",
    queryParams: {
      $expand: "Photo",
      $filter: `Id eq ${id}${loadAttributes ? "&loadAttributes=simple" : ""}`,
    },
    cache: false, //no cache
  });
  return person[0];
};

export const getProfileImage = async (id: string): Promise<string | null> => {
  const person = await getFromId(id);
  const { photo } = person;
  return photo && Object.keys(photo).length !== 0
    ? createImageUrlFromGuid(photo.guid)
    : null;
};

// Update mapGender function
export const mapGender = (gender: number): Gender | undefined => {
  // Find the key in RockGenderMap that matches the gender value
  return (Object.keys(RockGenderMap) as Array<keyof typeof RockGenderMap>).find(
    (key) => RockGenderMap[key] === gender
  ) as Gender | undefined;
};

// Add this to create profile when ready...
export const mapInputFieldsToRock = (fields: PersonProfile) => {
  const profileFields = fields;

  // Create a shallow copy of profileFields
  let rockUpdateFields = { ...profileFields };

  if (profileFields.BirthDate) {
    delete rockUpdateFields.BirthDate;
    const birthDate = parseISO(profileFields.BirthDate);

    if (!isValid(birthDate)) {
      throw new Error("BirthDate must be a valid date");
    }

    rockUpdateFields = {
      ...rockUpdateFields,
      // months in date-fns are 0 indexed
      BirthMonth: getMonth(birthDate) + 1,
      BirthDay: getDate(birthDate),
      BirthYear: getYear(birthDate),
    };
  }

  return rockUpdateFields;
};
