import { LoaderFunctionArgs } from "react-router-dom";
import { PodcastEpisode, Podcast } from "../types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type LoaderReturnType = {
  path: string;
  podcast: Podcast;
  latestEpisodes: PodcastEpisode[];
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

export async function getLatestEpisodes(channelGuid: string) {
  let channel;
  try {
    channel = await fetchRockData({
      endpoint: "ContentChannels",
      queryParams: {
        $filter: `Guid eq guid'${channelGuid}'`,
        $select: "Id",
      },
    });
  } catch (error) {
    throw new Error("Error fetching channel from Rock");
  }

  if (!Array.isArray(channel)) {
    channel = channel;
  } else {
    channel = channel[0];
  }

  let episodes;
  try {
    episodes = await fetchRockData({
      endpoint: "ContentChannelItems",
      queryParams: {
        $filter: `ContentChannelId eq ${channel.id} and Status eq 'Approved'`,
        $orderby: "StartDateTime desc",
        $top: "6",
        loadAttributes: "simple",
      },
    });

    if (!Array.isArray(episodes)) {
      episodes = [episodes];
    }
  } catch (error) {
    throw new Error("Error fetching episodes from Rock");
  }

  const formattedEpisodes = episodes.map((episode) => {
    return {
      title: episode.title,
      description: episode.content.attributeValues?.summary?.value,
      coverImage: createImageUrlFromGuid(episode.attributeValues?.image?.value),
      url: episode.attributeValues?.pathname?.value,
    };
  });

  return formattedEpisodes;
}

export async function getPodcast(path: string) {
  const contentChannelId = 179;
  let podcastData;
  try {
    podcastData = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        attributeKey: "Url",
        value: path,
        $filter: `ContentChannelId eq ${contentChannelId} and Status eq 'Approved'`,
        loadAttributes: "simple",
      },
    });

    if (!Array.isArray(podcastData)) {
      podcastData = podcastData;
    } else {
      podcastData = podcastData[0];
    }
  } catch (error) {
    throw new Error("Error fetching podcast from Rock");
  }

  const podcastShow: Podcast = {
    title: podcastData.title,
    description: podcastData.content,
    coverImage: createImageUrlFromGuid(
      podcastData.attributeValues?.coverImage?.value
    ),
    apple: podcastData.attributeValues?.applePodcast?.value,
    spotify: podcastData.attributeValues?.spotify?.value,
    amazon: podcastData.attributeValues?.amazonMusic?.value,
    episodesChannelGuid: podcastData.attributeValues?.showChannel?.value,
  };

  return podcastShow;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { path } = params;
  if (!path) {
    throw new Error("Path is required");
  }

  const podcast = await getPodcast(path);
  const latestEpisodes = await getLatestEpisodes(podcast.episodesChannelGuid);

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

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
