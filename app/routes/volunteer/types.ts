export type VolunteerHitType = {
  objectID: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  about?: string;
  category?: string;
  groupType?: string;
  coverImage?: string;
  coverImageUrl?: string;
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
