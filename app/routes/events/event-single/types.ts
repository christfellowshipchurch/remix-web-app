import { icons } from '~/lib/icons';

/** Defined values for the event `groupType` attribute (Rock defined value list). */
export const EVENT_REGISTRATION_GROUP_TYPES = [
  'Baptism',
  'Journey',
  'Kids Starting Line',
  'Kids Dedication',
  'Dream Team Kickoff',
] as const;

export type EventRegistrationGroupType =
  (typeof EVENT_REGISTRATION_GROUP_TYPES)[number];

export function isEventRegistrationGroupType(
  value: string | undefined | null,
): value is EventRegistrationGroupType {
  if (value == null || value === '') {
    return false;
  }
  return (EVENT_REGISTRATION_GROUP_TYPES as readonly string[]).includes(value);
}

export type EventSinglePageType = {
  title: string;
  titleOverride?: string;
  subtitle: string;
  heroCtas: { title: string; url: string }[];
  quickPoints?: string[];
  coverImage: string;
  aboutTitle?: string;
  aboutContent?: string;
  groupType?: EventRegistrationGroupType;
  keyInfoCards?: { title: string; description: string; icon: string }[];
  whatToExpect?: { title: string; description: string }[];
  moreInfoTitle?: string;
  moreInfoText?: string;
  optionalBlurb?: { title: string; description: string }[];
  faqItems?: { question: string; answer: string }[];
  sessionScheduleCards?: SessionRegistrationCardType[];
};

export type SessionRegistrationCardType = {
  icon: keyof typeof icons;
  title: string;
  description: string;
  date: string;
  programTime: string;
  partyTime: string;
  additionalInfo?: string;
  url: string;
};

export interface EventFinderHit {
  objectID: string;
  campus: { name: string; street1: string; city: string; state: string };
  groupType: string;
  rockItemId: number;
  groupGuid: string;
  summary: string;
  location: string;
  day: string;
  time: string;
  date: string;
  subGroupType: string;
}
