import { ImageSource } from "../group-finder/types";

export interface StudyHitType {
  objectID: string;
  id: string;
  title: string; // this will either be Rock Class Title
  studyType: string;
  url: string;
  subtitle: string; // this will be the subtitle of the class inside Class Preference Define Type
  summary: string; // this will be the summary of the class inside the individual Classes
  description: string; // this will be the description of the study
  coverImage: ImageSource;
  duration: "Short" | "Medium" | "Long" | "Ongoing/Daily" | "Self Paced";
  topic:
    | "Bible Books"
    | "Spiritual Growth"
    | "Relationships"
    | "Parenting"
    | "Finances"
    | "Apologetics"
    | "Outreach"
    | "Discipleship"
    | "Prayer";
  format:
    | "Video"
    | "Discussion Guide"
    | "Book Study"
    | "Devotional"
    | "Podcast";
  audience:
    | "Everyone"
    | "Men"
    | "Women"
    | "Couples"
    | "Youth"
    | "Parents"
    | "New Believers";
  source: "Christ Fellowship" | "Recommended External";
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
