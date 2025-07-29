export type PodcastShow = {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  apple: string;
  spotify: string;
  amazon: string;
  episodesChannelGuid: string;
  url: string;
  //seasons: Season[];
  //tags: string[];
  //trailer: string;
};

export type PodcastEpisode = {
  show: string;
  title: string;
  season: string;
  episodeNumber: string;
  audio: string; // TODO: Replace with wistiaId??? or Spotify embed??
  coverImage: string;
  description: string;
  authors: string;
  url: string;

  content: string;
  resources: {
    title: string;
    url: string;
  }[];
};

export type PodcastSeason = {
  title: string;
  description: string;
  coverImage: string;
  episodes: PodcastEpisode[];
};
