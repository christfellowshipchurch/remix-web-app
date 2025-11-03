// TODO: This is a temporary type for the class finder.
// It will be replaced with the actual type from the Algolia API.

export interface ClassType {
  rockItemId: number;
  title: string;
  summary: string;
  dateTime: string;
  leaders: {
    firstName: string;
    lastName: string;
    photo: {
      uri: string;
    };
  }[];
  priority: number;
  action: string;
  campusName: string;
  meetingTime: string;
  meetingDay: string;
  meetingType: string;
  preferences: string[];
  coverImage: {
    sources: {
      uri: string;
    }[];
  };
  _typename: string;
  objectID: string;
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
