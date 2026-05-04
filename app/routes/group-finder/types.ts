/** Algolia index for small-group search (finder, single group loader, related groups, class-single). */
export const GROUPS_ALGOLIA_INDEX_NAME = "dev_Groups";

// Image source structure
export interface ImageSource {
  sources: {
    uri: string;
  }[];
}

/** One leader row as returned from the `dev_Groups` Algolia index. */
export interface GroupLeaderHit {
  id: number | string;
  firstName: string;
  lastName: string;
  /** Algolia may omit or null this when no photo is set. */
  photo?: ImageSource | null;
}

export type GroupMeetingFrequency =
  | "Weekly"
  | "Monthly"
  | "Bi-Weekly"
  | "Once"
  | "Daily";

export type GroupMeetingLocationType = "Home" | "Church" | "Public Place";

export type GroupMeetingType = "In Person" | "Online" | "Virtual";

export type GroupMeetingDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"
  | "Daily"
  | "Not Specified";

export type GroupFor = "Men" | "Women" | "Anyone" | "Couples";

export type GroupPeopleWhoAre =
  | "Single"
  | "Married"
  | "Divorced"
  | "Engaged"
  | "Empty Nesters"
  | "New Believers"
  | "Parents"
  | "Professionals";

export type GroupLanguage = "English" | "Spanish";

export type GroupTopic =
  | "Bible Study"
  | "Prayer"
  | "Message Discussion"
  | "Marriage"
  | "Parenting"
  | "Finances"
  | "Friendship"
  | "Activty/Hobby"
  | "Book Club"
  | "Sports"
  | "Podcast"
  | "Watch Party";

/** Facet values on `adultsOnly` in Algolia. */
export type GroupAdultsOnlyFacet = "True" | "False";

/**
 * Record shape for the `dev_Groups` Algolia index (UI reads these fields directly).
 * Index payloads are asserted to this type at the loader / InstantSearch boundary.
 */
export interface GroupType {
  objectID: string;
  groupGUID: string;
  groupId?: number;
  title: string;
  summary: string;
  campusName: string;
  classType?: string;
  coverImage: ImageSource;
  /** Empty string when unset in Rock / Algolia. */
  meetingLocationType: GroupMeetingLocationType | "";
  meetingLocation: string;
  /** Empty string when unset in Rock / Algolia. */
  meetingDay: GroupMeetingDay | "";
  meetingTime: string;
  meetingType: GroupMeetingType;
  meetingFrequency: GroupMeetingFrequency;
  adultsOnly: GroupAdultsOnlyFacet;
  childCareDescription?: string;
  /** Algolia may return `null` when no leaders are attached. */
  leaders: GroupLeaderHit[] | null;
  /** Empty string when unset in Rock / Algolia. */
  groupFor: GroupFor | "";
  peopleWhoAre?: GroupPeopleWhoAre[];
  /** Empty string when unset in Rock / Algolia. */
  language: GroupLanguage | "";
  /** Often a comma-separated list from Rock; use {@link splitGroupTopics} for tags. */
  topics: string;
  minMaxAge: string;
  _geoloc: { lat: number; lng: number } | null;
}

/** Split `topics` from Algolia into display tags. */
export function splitGroupTopics(topics: string | null | undefined): string[] {
  if (topics == null || !String(topics).trim()) {
    return [];
  }
  return String(topics)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
