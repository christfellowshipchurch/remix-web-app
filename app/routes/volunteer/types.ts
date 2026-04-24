/** Algolia index id (configured in Algolia dashboard). */
export const VOLUNTEER_ALGOLIA_INDEX = "dev_Missions";

/** `coverImage` shape from Algolia volunteer index records. */
export interface VolunteerCoverImage {
  sources: { uri: string }[];
}

export interface VolunteerLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
}

/** One volunteer opportunity hit from the Algolia volunteer index. */
export interface Volunteer {
  objectID: string;
  groupId: number;
  groupGuid: string;
  title: string;
  coverImage: VolunteerCoverImage;
  summary: string;
  campusList: string[];
  eventDateStr: string;
  eventTimeStr: string;
  eventEndDateStr: string;
  eventEndTimeStr: string;
  category: string;
  checkInLocation: string;
  location: VolunteerLocation;
  opportunityType: string[];
  spotsLeft: number;
}

export type VolunteerList = Volunteer[];

export type Trip = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  applyUrl?: string;
  donateUrl: string;
  groupType: string;
  city: string;
  country: string;
  dateOfTrip: string;
  cost: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type CommunityCard = {
  title: string;
  image: string;
  ctas: { label: string; href: string }[];
};

export type RegionCard = {
  title: string;
  image: string;
  spotsLeft: number;
  description: string;
  location: string;
  date: string;
  time: string;
  href: string;
};

export interface VolunteerFeaturedEvent {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  imageUrl: string;
}
