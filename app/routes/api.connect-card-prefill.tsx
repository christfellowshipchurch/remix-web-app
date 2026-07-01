import { createHash } from 'node:crypto';
import { type LoaderFunction, data } from 'react-router-dom';
import {
  fetchRockData,
  postRockData,
  TTL,
} from '~/lib/.server/fetch-rock-data';
import type {
  ConnectCardPrefill,
  ConnectCardPrefillDebug,
  ConnectCardPrefillResponse,
} from './connect-card/types';

type RockPerson = {
  id?: number | string | null;
  Id?: number | string | null;
  firstName?: string;
  FirstName?: string;
  lastName?: string;
  LastName?: string;
  email?: string;
  Email?: string;
  primaryCampusId?: number | string | null;
  PrimaryCampusId?: number | string | null;
  campusId?: number | string | null;
  CampusId?: number | string | null;
  primaryCampus?: RockCampus | null;
  PrimaryCampus?: RockCampus | null;
  campus?: RockCampus | null;
  Campus?: RockCampus | null;
};

type RockPhoneNumber = {
  number?: string;
  Number?: string;
  numberFormatted?: string;
  NumberFormatted?: string;
};

type RockCampus = {
  id?: number | string;
  Id?: number | string;
  guid?: string;
  Guid?: string;
  name?: string;
  Name?: string;
};

const ROCK_PERSON_TOKEN_MAX_LENGTH = 512;
const ROCK_PERSON_ID_QUERY_PARAMS = ['rckpid', 'rckipid'] as const;

type RockPersonTokenParam = {
  paramName: (typeof ROCK_PERSON_ID_QUERY_PARAMS)[number];
  value: string;
};

const hasControlCharacters = (value: string) =>
  Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code <= 31 || code === 127;
  });

const hasUnsafeTokenCharacters = (value: string) =>
  hasControlCharacters(value) ||
  value.includes('"') ||
  value.includes('\\') ||
  value.includes('{{') ||
  value.includes('}}') ||
  value.includes('{%') ||
  value.includes('%}');

const isValidRockPersonToken = (value: string | null): value is string => {
  if (!value) return false;

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > ROCK_PERSON_TOKEN_MAX_LENGTH) {
    return false;
  }

  return !hasUnsafeTokenCharacters(trimmed);
};

const getRockPersonTokenParam = (url: URL): RockPersonTokenParam | null => {
  for (const paramName of ROCK_PERSON_ID_QUERY_PARAMS) {
    const value = url.searchParams.get(paramName)?.trim();
    if (value) {
      return { paramName, value };
    }
  }

  return null;
};

const getTokenFingerprint = (value: string | null | undefined) => {
  if (!value) return null;

  return createHash('sha256').update(value).digest('hex').slice(0, 12);
};

const logPrefillDiagnostic = (
  event: string,
  details: Record<string, unknown>,
) => {
  console.warn('[connect-card-prefill]', event, details);
};

const asArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const getPersonId = (person: RockPerson): string | undefined => {
  const personId = person.id ?? person.Id;
  return personId == null ? undefined : String(personId);
};

const getPersonCampusId = (person: RockPerson): string | undefined => {
  const id =
    person.primaryCampusId ??
    person.PrimaryCampusId ??
    person.campusId ??
    person.CampusId ??
    person.primaryCampus?.id ??
    person.PrimaryCampus?.Id ??
    person.campus?.id ??
    person.Campus?.Id;

  return id == null ? undefined : String(id);
};

const getPersonCampusGuid = (person: RockPerson): string | undefined =>
  normalizeString(person.primaryCampus?.guid) ??
  normalizeString(person.PrimaryCampus?.Guid) ??
  normalizeString(person.campus?.guid) ??
  normalizeString(person.Campus?.Guid);

const getPersonCampusName = (person: RockPerson): string | undefined =>
  normalizeString(person.primaryCampus?.name) ??
  normalizeString(person.PrimaryCampus?.Name) ??
  normalizeString(person.campus?.name) ??
  normalizeString(person.Campus?.Name);

const resolveCampusGuid = (
  person: RockPerson,
  campuses: RockCampus[],
): string | undefined => {
  const personCampusGuid = getPersonCampusGuid(person);
  if (personCampusGuid) {
    return personCampusGuid;
  }

  const personCampusId = getPersonCampusId(person);
  if (personCampusId) {
    const campusById = campuses.find(
      (campus) => String(campus.id ?? campus.Id) === personCampusId,
    );
    const campusGuid = normalizeString(campusById?.guid ?? campusById?.Guid);
    if (campusGuid) {
      return campusGuid;
    }
  }

  const personCampusName = getPersonCampusName(person)?.toLowerCase();
  if (personCampusName) {
    const campusByName = campuses.find(
      (campus) =>
        normalizeString(campus.name ?? campus.Name)?.toLowerCase() ===
        personCampusName,
    );
    return normalizeString(campusByName?.guid ?? campusByName?.Guid);
  }

  return undefined;
};

const resolveRockPersonFromToken = async (
  personToken: string,
): Promise<RockPerson | null> => {
  const lavaTemplate =
    `{% assign person = "${personToken}" | PersonTokenRead %}` +
    '{{ person | ToJSON }}';

  const person = (await postRockData({
    endpoint: '/Lava/RenderTemplate',
    body: lavaTemplate,
    contentType: 'text/plain',
  })) as RockPerson | null;

  if (!person || typeof person !== 'object') {
    return null;
  }

  return person;
};

const buildPrefill = async (
  personToken: string,
  requestDebug: ConnectCardPrefillDebug,
): Promise<ConnectCardPrefillResponse> => {
  logPrefillDiagnostic('decode-start', {
    tokenFingerprint: getTokenFingerprint(personToken),
    tokenLength: personToken.length,
  });

  const person = await resolveRockPersonFromToken(personToken);

  if (!person || typeof person !== 'object') {
    logPrefillDiagnostic('decode-not-found', {
      tokenFingerprint: getTokenFingerprint(personToken),
    });
    return {
      status: 'not-found',
      debug: {
        ...requestDebug,
        decodeAttempted: true,
        personResolved: false,
      },
    };
  }

  const personId = getPersonId(person);
  if (!personId) {
    logPrefillDiagnostic('decode-missing-person-id', {
      tokenFingerprint: getTokenFingerprint(personToken),
    });
    return {
      status: 'not-found',
      debug: {
        ...requestDebug,
        decodeAttempted: true,
        personResolved: true,
      },
    };
  }

  logPrefillDiagnostic('decode-success', {
    tokenFingerprint: getTokenFingerprint(personToken),
    personId,
    hasEmail: !!normalizeString(person.email ?? person.Email),
    hasCampusId: !!getPersonCampusId(person),
    hasCampusGuid: !!getPersonCampusGuid(person),
  });

  const [phoneNumbers, campuses] = await Promise.all([
    fetchRockData({
      endpoint: 'PhoneNumbers',
      queryParams: {
        $filter: `PersonId eq ${personId}`,
        $select: 'Number,NumberFormatted',
      },
      ttl: TTL.NONE,
    }),
    fetchRockData({
      endpoint: 'Campuses',
      queryParams: {
        $filter: 'IsActive eq true',
        $orderby: 'Order',
        $select: 'Id,Name,Guid',
      },
      ttl: TTL.NONE,
    }),
  ]);

  const phone = asArray(phoneNumbers as RockPhoneNumber[] | RockPhoneNumber)[0];
  const prefill: ConnectCardPrefill = {
    firstName: normalizeString(person.firstName ?? person.FirstName),
    lastName: normalizeString(person.lastName ?? person.LastName),
    email: normalizeString(person.email ?? person.Email),
    phone:
      normalizeString(phone?.numberFormatted ?? phone?.NumberFormatted) ??
      normalizeString(phone?.number ?? phone?.Number),
    campus: resolveCampusGuid(
      person,
      asArray(campuses as RockCampus[] | RockCampus),
    ),
  };

  logPrefillDiagnostic('prefill-built', {
    tokenFingerprint: getTokenFingerprint(personToken),
    personId,
    hasFirstName: !!prefill.firstName,
    hasLastName: !!prefill.lastName,
    hasEmail: !!prefill.email,
    hasPhone: !!prefill.phone,
    hasCampus: !!prefill.campus,
  });

  return {
    status: 'success',
    prefill,
    debug: {
      ...requestDebug,
      decodeAttempted: true,
      personResolved: true,
      personId,
      hasFirstName: !!prefill.firstName,
      hasLastName: !!prefill.lastName,
      hasEmail: !!prefill.email,
      hasPhone: !!prefill.phone,
      hasCampus: !!prefill.campus,
    },
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const personTokenParam = getRockPersonTokenParam(url);
  const personToken = personTokenParam?.value ?? null;
  const tokenFingerprint = getTokenFingerprint(personToken);
  const tokenLength = personToken?.length ?? 0;
  const requestDebug: ConnectCardPrefillDebug = {
    detectedParam: personTokenParam?.paramName ?? null,
    tokenPresent: !!personToken,
    tokenLength,
    tokenFingerprint,
  };

  logPrefillDiagnostic('request', {
    pathname: url.pathname,
    queryKeys: Array.from(url.searchParams.keys()),
    detectedParam: personTokenParam?.paramName ?? null,
    tokenPresent: !!personToken,
    tokenLength,
    tokenFingerprint,
  });

  if (!isValidRockPersonToken(personToken)) {
    logPrefillDiagnostic('invalid-token', {
      detectedParam: personTokenParam?.paramName ?? null,
      tokenPresent: !!personToken,
      tokenLength,
      tokenFingerprint,
    });
    return data<ConnectCardPrefillResponse>({
      status: 'invalid-id',
      debug: {
        ...requestDebug,
        validationPassed: false,
      },
    });
  }

  try {
    const response = await buildPrefill(personToken, {
      ...requestDebug,
      validationPassed: true,
    });
    logPrefillDiagnostic('response', {
      tokenFingerprint,
      status: response.status,
    });
    return data<ConnectCardPrefillResponse>(response);
  } catch (error) {
    logPrefillDiagnostic('error', {
      tokenFingerprint,
      error:
        error instanceof Error
          ? { message: error.message, name: error.name }
          : { message: 'Unknown error' },
    });
    console.error('Connect Card prefill failed:', error);
    return data<ConnectCardPrefillResponse>(
      {
        status: 'error',
        message: 'Unable to load prefill data',
        debug: {
          ...requestDebug,
          validationPassed: true,
          decodeAttempted: true,
        },
      },
      { status: 500 },
    );
  }
};
