export type PodcastShow = {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  apple: string;
  spotify: string;
  amazon: string;
  youtube: string;
  episodesChannelGuid: string;
  url: string;
  //seasons: Season[];
  //tags: string[];
  //trailer: string;
};

export type PodcastEpisode = {
  id: string;
  show: string;
  title: string;
  publishDate: string;
  season: string;
  episodeNumber: string;
  audio: string; // TODO: Replace with wistiaId??? or Spotify embed??
  coverImage: string;
  summary: string;
  content: string;
  showGuests: string;
  url: string;
  apple: string;
  spotify: string;
  amazon: string;
  youtube: string;
  resources: {
    title: string;
    url: string;
  }[];
  resourceTest?: string;
};

export type PodcastSeason = {
  title: string;
  description: string;
  coverImage: string;
  episodes: PodcastEpisode[];
};

export interface RockChannelItem {
  id: string;
  title: string;
  attributeValues: {
    [key: string]: { value: string };
  };
}

export interface RockAttributeValue {
  value: string;
  valueFormatted: string;
  persistedTextValue?: string;
}

export interface RockPodcastEpisode {
  id: string;
  title: string;
  content: string;
  startDateTime: string;
  attributeValues: {
    seasonNumber?: RockAttributeValue;
    episodeNumber?: RockAttributeValue;
    media?: RockAttributeValue;
    image?: RockAttributeValue;
    author?: RockAttributeValue;
    showGuests?: RockAttributeValue;
    pathname?: RockAttributeValue;
    applePodcast?: RockAttributeValue;
    spotify?: RockAttributeValue;
    amazonMusic?: RockAttributeValue;
    ytLink?: RockAttributeValue;
    rockLabel?: RockAttributeValue;
    callsToAction?: RockAttributeValue; // Mobile app only CTAs
    summary?: RockAttributeValue;
    additionalResources?: RockAttributeValue;
    releaseDate?: RockAttributeValue;
  };
}

export interface WistiaElement {
  sourceKey: string;
}

export interface PlatformLinks {
  apple: string;
  spotify: string;
  amazon: string;
  youtube: string;
}

export interface Resource {
  title: string;
  url: string;
}
