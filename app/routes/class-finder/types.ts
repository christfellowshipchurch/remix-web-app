import { ImageSource } from "../group-finder/types";

/** Single highlighted field from Algolia search responses. */
export type ClassHitHighlightField = {
  value: string;
  matchLevel: string;
  matchedWords: string[];
};

/**
 * `dev_Classes` record shape + optional `_highlightResult` from search API.
 */
export interface ClassHitType {
  objectID: string;
  title: string;
  classType: string;
  campus: string;
  groupId: number;
  subtitle: string;
  summary: string;
  coverImage: ImageSource;
  _geoloc: {
    lat: number;
    lng: number;
  };
  startDate: string;
  endDate: string;
  schedule: string; // Sunday at 8:00 AM
  topic:
    | "Care & Recovery"
    | "Finances"
    | "Relationships"
    | "Parenting"
    | "Spiritual Growth";
  language: "English" | "Español" | "Multiple Languages";
  format: "In-Person" | "Virtual";
  /** Meters from search origin when `aroundLatLng` + `getRankingInfo` are set (zip / current location). */
  _rankingInfo?: {
    geoDistance?: number;
  };
  /** Present on search hits when highlighting is enabled; keys vary by query. */
  _highlightResult?: {
    title?: ClassHitHighlightField;
    summary?: ClassHitHighlightField;
    author?: {
      firstName?: ClassHitHighlightField;
      lastName?: ClassHitHighlightField;
    };
    routing?: {
      pathname?: ClassHitHighlightField;
    };
    htmlContent?: ClassHitHighlightField[];
  };
}

export type ContactFormType = {
  PersonId: string;
  GroupId: string;
};
