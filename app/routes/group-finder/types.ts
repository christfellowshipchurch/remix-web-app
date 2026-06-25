// Image source structure
export interface ImageSource {
  sources: {
    uri: string;
  }[];
}

/** One leader row as returned from the groups Algolia index. */
export interface GroupLeaderHit {
  id: number | string;
  firstName: string;
  lastName: string;
  /** Algolia may omit or null this when no photo is set. */
  photo?: ImageSource | null;
}

export type GroupMeetingFrequency =
  | 'Weekly'
  | 'Monthly'
  | 'Bi-Weekly'
  | 'Once'
  | 'Daily';

export type GroupMeetingLocationType = 'Home' | 'Church' | 'Public Place';

export type GroupMeetingType = 'In Person' | 'Online' | 'Virtual';

export type GroupMeetingDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Daily'
  | 'Not Specified';

export type GroupFor = 'Men' | 'Women' | 'Anyone' | 'Couples';

export type GroupPeopleWhoAre =
  | 'Single'
  | 'Married'
  | 'Divorced'
  | 'Engaged'
  | 'Empty Nesters'
  | 'New Believers'
  | 'Parents'
  | 'Professionals';

export type GroupLanguage = 'English' | 'Spanish';

export type GroupTopic =
  | 'Bible Study'
  | 'Prayer'
  | 'Message Discussion'
  | 'Marriage'
  | 'Parenting'
  | 'Finances'
  | 'Friendship'
  | 'Activity/Hobby'
  | 'Book Club'
  | 'Sports'
  | 'Podcast'
  | 'Watch Party';

/** Facet values on `adultsOnly` in Algolia. */
export type GroupAdultsOnlyFacet = 'True' | 'False';

/**
 * Record shape for the groups Algolia index (UI reads these fields directly).
 * Index payloads are asserted to this type at the loader / InstantSearch boundary.
 */
export interface GroupType {
  objectID: string;
  groupGuid: string;
  groupId?: number;
  title: string;
  summary: string;
  campusName: string;
  classType?: string;
  coverImage: ImageSource;
  /** Empty string when unset in Rock / Algolia. */
  meetingLocationType: GroupMeetingLocationType | '';
  meetingLocation: string;
  /** Empty string when unset in Rock / Algolia. */
  meetingDay: GroupMeetingDay | '';
  meetingTime: string;
  meetingType: GroupMeetingType;
  meetingFrequency: GroupMeetingFrequency;
  adultsOnly: GroupAdultsOnlyFacet;
  childCareDescription?: string;
  /** Algolia may return `null` when no leaders are attached. */
  leaders: GroupLeaderHit[] | null;
  /** Empty string when unset in Rock / Algolia. */
  groupFor: GroupFor | '';
  peopleWhoAre?: GroupPeopleWhoAre[];
  /** Empty string when unset in Rock / Algolia. */
  language: GroupLanguage | '';
  /** Topic tags from Algolia (array of strings). */
  topics: string[];
  minMaxAge: string;
  _geoloc: { lat: number | ''; lng: number | '' } | null;
  /** Present when getRankingInfo is true and aroundLatLng is set; distance in meters from search point. */
  _rankingInfo?: { geoDistance?: number };
}

/** Normalize `topics` from Algolia into display tags. */
export function splitGroupTopics(
  topics: string | string[] | null | undefined,
): string[] {
  if (topics == null) {
    return [];
  }

  if (Array.isArray(topics)) {
    return topics.map((topic) => String(topic).trim()).filter(Boolean);
  }

  if (!String(topics).trim()) {
    return [];
  }

  return String(topics)
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);
}
