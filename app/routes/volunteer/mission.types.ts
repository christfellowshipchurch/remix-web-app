export const VOLUNTEER_MISSIONS_ALGOLIA_INDEX = "dev_Missions";

/** `coverImage` shape from Algolia `dev_Missions` records. */
export interface MissionCoverImage {
  sources: { uri: string }[];
}

export interface MissionLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
}

/** One hit from the `dev_Missions` Algolia index. */
export interface Mission {
  objectID: string;
  groupId: number;
  groupGuid: string;
  title: string;
  coverImage: MissionCoverImage;
  summary: string;
  campusList: string[];
  eventDateStr: string;
  eventTimeStr: string;
  eventEndDateStr: string;
  eventEndTimeStr: string;
  category: string;
  checkInLocation: string;
  location: MissionLocation;
  opportunityType: string[];
  spotsLeft: number;
}

export type MissionsList = Mission[];
