export type Podcas = {
  id: string;
  title: string;
  image: string;
  tags: string[];
  href: string;
};

export type Podcast = {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  apple: string;
  spotify: string;
  amazon: string;
  episodesChannelGuid: string;
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

  shareLinks: {
    title: string;
    url: string;
  }[];
};

export type Season = {
  title: string;
  description: string;
  coverImage: string;
  episodes: PodcastEpisode[];
};
