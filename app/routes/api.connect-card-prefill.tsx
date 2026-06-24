import { type LoaderFunction, data } from 'react-router-dom';
import { fetchRockData, TTL } from '~/lib/.server/fetch-rock-data';
import type {
  ConnectCardPrefill,
  ConnectCardPrefillResponse,
} from './connect-card/types';

type RockPerson = {
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

const isRockPersonId = (value: string | null): value is string =>
  !!value && /^\d+$/.test(value.trim());

const asArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
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

const buildPrefill = async (
  personId: string,
): Promise<ConnectCardPrefillResponse> => {
  const person = (await fetchRockData({
    endpoint: `People/${personId}`,
    queryParams: {
      $select: 'FirstName,LastName,Email,PrimaryCampusId',
    },
    ttl: TTL.NONE,
  })) as RockPerson | null;

  if (!person || typeof person !== 'object') {
    return { status: 'not-found' };
  }

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

  return { status: 'success', prefill };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const personId = url.searchParams.get('rckipid')?.trim() ?? null;

  if (!isRockPersonId(personId)) {
    return data<ConnectCardPrefillResponse>({ status: 'invalid-id' });
  }

  try {
    return data<ConnectCardPrefillResponse>(await buildPrefill(personId));
  } catch (error) {
    console.error('Connect Card prefill failed:', error);
    return data<ConnectCardPrefillResponse>(
      { status: 'error', message: 'Unable to load prefill data' },
      { status: 500 },
    );
  }
};
