export interface ContentItemHit {
  rockItemId: number;
  title: string;
  summary: string;
  author: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  routing: {
    pathname: string;
  };
  priority: number;
  action: string;
  contentType: string;
  imageLabel: string;
  htmlContent?: string; // TODO: This is an array of strings in Algolia, how do we handle this?
  sermonSeriesName?: string;
  sermonSeriesGuid?: string;
  sermonPrimaryCategories: string[];
  sermonSecondaryCategories: string[];
  articlePrimaryCategories: string[];
  articleSecondaryCategories: string[];
  readTime: number;
  url: string;
  startDateTime: string;
  coverImage: {
    sources: {
      uri: string;
    }[];
  };
  podcastShow?: string;
  podcastSeason?: string;
  podcastSeasonNumber?: number;
  podcastEpisodeNumber?: number;
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
