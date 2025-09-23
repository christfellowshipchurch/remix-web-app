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

export interface RockChannel {
  id: string;
  name: string;
}

export interface RockAttributeValue {
  value: string;
  persistedTextValue?: string;
}

export interface RockPodcastEpisode {
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
    youtube?: RockAttributeValue;
    rockLabel?: RockAttributeValue;
    callsToAction?: RockAttributeValue;
    summary?: RockAttributeValue;
    additionalResources?: RockAttributeValue;
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
