import { LoaderFunctionArgs } from "react-router";

export type Podcast = {
  title: string;
  seasons: Season[];
  coverImage: string;
  description: string;
  id: string;
  shareLinks: {
    title: string;
    url: string;
  }[];
};

export type PodcastEpisode = {
  title: string;
  season: string;
  episodeNumber: string;
  audio: string;
  coverImage: string;
  description: string;
  id: string;
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

export type LoaderReturnType = {
  path: string;
  podcast: Podcast;
  latestEpisodes: PodcastEpisode[];
};

export async function getLatestEpisodes() {
  return mockLatestEpisodes;
}

export const mockLatestEpisodes: PodcastEpisode[] = [
  {
    id: "1",
    title: "Podcast Episode 1",
    description: "Description 1",
    coverImage: "/assets/images/podcasts/hero.jpg",
    season: "1",
    episodeNumber: "1",
    audio: "/assets/audio/podcasts/podcast-1.mp3",
    shareLinks: [],
  },
  {
    id: "2",
    title: "Podcast Episode 2",
    description: "Description 2",
    coverImage: "/assets/images/podcasts/hero.jpg",
    season: "1",
    episodeNumber: "2",
    audio: "/assets/audio/podcasts/podcast-2.mp3",
    shareLinks: [],
  },
  {
    id: "3",
    title: "Podcast Episode 3",
    description: "Description 3",
    coverImage: "/assets/images/podcasts/hero.jpg",
    season: "1",
    episodeNumber: "3",
    audio: "/assets/audio/podcasts/podcast-3.mp3",
    shareLinks: [],
  },
  {
    id: "4",
    title: "Podcast Episode 4",
    description: "Description 4",
    coverImage: "/assets/images/podcasts/hero.jpg",
    season: "1",
    episodeNumber: "4",
    audio: "/assets/audio/podcasts/podcast-4.mp3",
    shareLinks: [],
  },
];

export async function getPodcast(path: string) {
  const mockPodcast: Podcast = {
    id: "1",
    title: "So Good Sisterhood",
    seasons: [
      {
        title: "Season 1",
        description: "Description 1",
        coverImage: "/assets/images/podcasts/hero.jpg",
        episodes: mockLatestEpisodes,
      },
      {
        title: "Season 2",
        description: "Description 2",
        coverImage: "/assets/images/podcasts/hero.jpg",
        episodes: mockLatestEpisodes,
      },
    ],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi",
    coverImage: "/assets/images/podcasts/hero.jpg",
    shareLinks: [
      {
        title: "AppleMusic",
        url: "https://www.facebook.com/sharer/sharer.php?u=https://www.google.com",
      },
      {
        title: "Spotify",
        url: "https://twitter.com/share?url=https://www.google.com",
      },
      {
        title: "Amazon Music",
        url: "https://www.google.com/podcasts",
      },
    ],
  };

  return mockPodcast;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { path } = params;
  if (!path) {
    throw new Error("Path is required");
  }

  const latestEpisodes = await getLatestEpisodes();
  const podcast = await getPodcast(path);

  return { path, podcast, latestEpisodes };
}
