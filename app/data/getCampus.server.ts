const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const latLonDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

export type attributes = {
  [key: string]: {
    fieldTypeId: number;
    name: string;
  };
};

export type attributeValues = {
  [key: string]: {
    value: string;
    valueFormatted: string;
  };
};

export type CampusImageModel = {
  guid: string;
};

export type LocationModel = {
  id: string;
  name: string;
  guid: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  image: CampusImageModel;
};

export type CampusModel = {
  locationId: string;
  name: string;
  shortCode: string;
  isActive: boolean;
  guid: string;
  location: LocationModel;
  attributes: attributes;
  attributeValues: attributeValues;
  distanceFromLocation?: number;
};

export type ReturnType = {
  id: string;
  name: string;
  distanceFromLocation?: number;
  image: {
    uri: string;
  };
};
