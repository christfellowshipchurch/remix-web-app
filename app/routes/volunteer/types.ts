import type { Coordinates } from "./country-coordinates";

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
