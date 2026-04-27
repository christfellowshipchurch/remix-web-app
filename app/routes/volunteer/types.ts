export type VolunteerHitType = {
  objectID: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  about?: string;
  category?: string;
  groupType?: string;
  coverImage?: {
    sources: {
      uri: string;
    }[];
  };
  campus?: string;
  location?: string;
  city?: string;
  country?: string;
  dateOfTrip?: string;
  eventTime?: string;
  timeRange?: string;
  whatToKnow?: string;
  contactName?: string;
  contactEmail?: string;
  questionsHtml?: string;
  applyUrl?: string;
  signupUrl?: string;
  spotsLeft?: number | string;

  /** Present when filtering by group GUID in Algolia */
  groupGuid?: string;
};
import type { Coordinates } from "./country-coordinates";

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
  image: string;
  country: string;
  tripDate: string;
  missionsUrl: string;
  coordinates?: Coordinates;
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
