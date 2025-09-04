export interface ContentItemHit {
  rockItemId: number;
  title: string;
  summary: string;
  author: {
    firstName: string;
    lastName: string;
  };
  url?: string;
  routing: {
    pathname: string;
  };
  priority: number;
  action: string;
  contentType: string;
  imageLabel: string;
  htmlContent?: string;
  seriesName?: string;
  seriesGuid?: string;
  sermonPrimaryTags: string[];
  sermonSecondaryTags: string[];
  articlePrimaryTags: string[];
  articleSecondaryTags: string[];
  contentTags: string[];
  coverImage: {
    sources: {
      uri: string;
    }[];
  };
  show?: string;
  season?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  startDateTime: string;
  locations?: {
    name: string;
  }[];
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
