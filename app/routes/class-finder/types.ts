import { ImageSource } from "../group-finder/types";

export interface ClassHitType {
  objectID: string;
  id: string;
  title: string; // this will either be Rock Class Title
  classType: string;
  classTypeUrl: string;
  subtitle: string; // this will be the subtitle of the class inside Class Preference Define Type
  summary: string; // this will be the summary of the class inside the individual Classes
  coverImage: ImageSource;
  campus: {
    name: string;
  };
  _geoloc: {
    lat: number;
    lng: number;
  }; // will be coordinates of the campus
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
  format: "In-Person" | "Online";
  _highlightResult: {
    title: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    summary: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    author: {
      firstName: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      lastName: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
    routing: {
      pathname: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
    htmlContent: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    }[];
  };
  __position: number;
}

export type ContactFormType = {
  PersonId: string;
  GroupId: string;
};
