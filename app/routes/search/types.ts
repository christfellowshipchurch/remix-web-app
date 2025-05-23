export interface ContentItemHit {
  rockItemId: number;
  title: string;
  summary: string;
  author: {
    firstName: string;
    lastName: string;
  };
  routing: {
    pathname: string;
  };
  priority: number;
  action: string;
  contentType: string;
  imageLabel: string;
  htmlContent: string[];
  contentTags: string[];
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
