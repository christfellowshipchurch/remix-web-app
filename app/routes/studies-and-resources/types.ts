import { ImageSource } from '../group-finder/types';

export interface StudyHitType {
  objectID: string;
  id: string;
  /** Rock ContentChannelItem Id — used to fetch curriculum/CTA attributes */
  rockItemId: number;
  title: string; // this will either be Rock Class Title
  studyType: string;
  url: string;
  /** Rich text / HTML for the study body (HTMLRenderer on single; finder card uses plain excerpt when summary is empty). */
  content: string;
  coverImage: ImageSource;
  subtitle: string; // this will be the subtitle of the class inside Class Preference Define Type - TODO: Add to Algolia? NOT IN ALGOLIA CURRENTLY
  summary: string; // this will be the summary of the class inside the individual Classes - TODO: Add to Algolia? NOT IN ALGOLIA CURRENTLY
  description: string; // this will be the description of the study TODO: Add to Algolia? NOT IN ALGOLIA CURRENTLY
  duration: 'Short' | 'Medium' | 'Long' | 'Ongoing/Daily' | 'Self Paced';
  topic:
    | 'Bible Books'
    | 'Spiritual Growth'
    | 'Relationships'
    | 'Parenting'
    | 'Finances'
    | 'Apologetics'
    | 'Outreach'
    | 'Discipleship'
    | 'Prayer';
  format:
    | 'Video'
    | 'Discussion Guide'
    | 'Book Study'
    | 'Devotional'
    | 'Podcast';
  audience:
    | 'Everyone'
    | 'Men'
    | 'Women'
    | 'Couples'
    | 'Youth'
    | 'Parents'
    | 'New Believers';
  source: 'Christ Fellowship' | 'Recommended External';
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

export interface CurriculumResource {
  title: string;
  /** Formatted label for display, e.g. "Video", "Discussion Guide" */
  type: string;
  url?: string;
  wistiaId?: string;
}

export interface CurriculumSession {
  /** From the SessionTitles value list attribute */
  title: string;
  resources: CurriculumResource[];
}

export interface StudyCallToAction {
  title: string;
  url: string;
}
