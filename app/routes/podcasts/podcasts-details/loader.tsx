import { LoaderFunctionArgs } from "react-router-dom";
import { PodcastEpisode, Podcast } from "../types";

export type LoaderReturnType = {
  path: string;
  podcast: Podcast;
  latestEpisodes: PodcastEpisode[];
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

export async function getLatestEpisodes() {
  return mockLatestEpisodes;
}

export const mockLatestEpisodes: PodcastEpisode[] = [
  {
    audio: "/assets/audio/podcasts/podcast-1.mp3",
    authors: "Pastor Julie Mullins",
    content: "Content 1",
    coverImage: "/assets/images/podcasts/hero.jpg",
    description: "Description 1",
    episodeNumber: "1",
    resources: [],
    season: "1",
    shareLinks: [],
    show: "So Good Sisterhood",
    title: "Podcast Episode 1",
  },
  {
    audio: "/assets/audio/podcasts/podcast-2.mp3",
    authors: "Pastor Julie Mullins",
    content: "Content 2",
    coverImage: "/assets/images/podcasts/hero.jpg",
    description: "Description 2",
    episodeNumber: "2",
    resources: [],
    season: "1",
    shareLinks: [],
    show: "So Good Sisterhood",
    title: "Podcast Episode 2",
  },
  {
    audio: "/assets/audio/podcasts/podcast-3.mp3",
    authors: "Pastor Julie Mullins",
    content: "Content 3",
    coverImage: "/assets/images/podcasts/hero.jpg",
    description: "Description 3",
    episodeNumber: "3",
    resources: [],
    season: "1",
    shareLinks: [],
    show: "So Good Sisterhood",
    title: "Podcast Episode 3",
  },
  {
    audio: "/assets/audio/podcasts/podcast-4.mp3",
    authors: "Pastor Julie Mullins",
    content: "Content 4",
    coverImage: "/assets/images/podcasts/hero.jpg",
    description: "Description 4",
    episodeNumber: "4",
    resources: [],
    season: "1",
    shareLinks: [],
    show: "So Good Sisterhood",
    title: "Podcast Episode 4",
  },
];

export async function getPodcast(path: string) {
  const mockPodcast: Podcast = {
    title: "So Good Sisterhood",
    trailer: "/assets/videos/podcasts/sisterhood.mp4",
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
    tags: ["So Good Sisterhood"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi",
    coverImage: "/assets/images/podcasts/hero.jpg",
    shareLinks: [
      {
        title: "Apple Music",
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

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  console.log("Loader environment variables:", {
    appId: appId ? "***" : "MISSING",
    searchApiKey: searchApiKey ? "***" : "MISSING",
    podcastTitle: podcast.title,
  });

  if (!appId || !searchApiKey) {
    console.warn("Algolia credentials not found - search will not work");
  }

  return {
    path,
    podcast,
    latestEpisodes,
    ALGOLIA_APP_ID: appId || "",
    ALGOLIA_SEARCH_API_KEY: searchApiKey || "",
  };
}
