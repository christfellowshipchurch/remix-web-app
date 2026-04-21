export const VOLUNTEER_MISSIONS_ALGOLIA_INDEX = "dev_missionsFinder";

export interface MissionImageSource {
  sources: { uri: string }[];
}

export interface MissionLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Mission {
  objectID: string;
  rockItemId: number;
  title: string;
  coverImage: MissionImageSource;
  spotsLeft: number;
  category: string;
  opportunityType: string[];
  campus: {
    name: string;
  };
  location: MissionLocation;
  day: string;
  time: string;
  summary: string;
  groupGuid: string;
}

export type MissionsList = Mission[];
