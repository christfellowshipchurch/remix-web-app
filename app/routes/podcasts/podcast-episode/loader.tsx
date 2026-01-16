import { LoaderFunctionArgs } from "react-router-dom";
import { PodcastEpisode, RockPodcastEpisode, WistiaElement } from "../types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid, parseRockKeyValueList } from "~/lib/utils";

// Error messages
const ERROR_MESSAGES = {
  EPISODE_NOT_FOUND: "Episode not found",
  SHOW_NOT_FOUND: "Show not found",
  CHANNEL_NOT_FOUND: "Show Channel not found",
  CHANNEL_FETCH_ERROR: "Error fetching channel from Rock",
  EPISODE_FETCH_ERROR: "Error fetching episode from Rock",
  WISTIA_FETCH_ERROR: "Error fetching Wistia element",
} as const;

export type LoaderReturnType = {
  episode: PodcastEpisode;
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

/**
 * Loader function for podcast episode pages
 */
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episode: episodePath, show: showPath } = params;

  // Validate required parameters
  if (!episodePath) {
    throw new Response(ERROR_MESSAGES.EPISODE_NOT_FOUND, { status: 404 });
  }

  if (!showPath) {
    throw new Response(ERROR_MESSAGES.SHOW_NOT_FOUND, { status: 404 });
  }

  // Get the podcast channel
  const showChannel = await getPodcastChannel(showPath);

  if (!showChannel) {
    throw new Response(ERROR_MESSAGES.CHANNEL_NOT_FOUND, { status: 404 });
  }

  // Fetch episode data
  const rockEpisode = await getPodcastEpisode({
    path: episodePath,
    channelId: showChannel.id,
  });

  // Map episode data
  const episode = await mapRockEpisodeToPodcastEpisode(
    rockEpisode,
    showChannel.title
  );

  // Get Algolia configuration
  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  return {
    episode,
    ALGOLIA_APP_ID: appId || "",
    ALGOLIA_SEARCH_API_KEY: apiKey || "",
  };
};

/**
 * Fetches the PodcastShow ContentChannelItem and returns the show ContentChannel containing the episodes
 */
async function getPodcastChannel(
  path: string
): Promise<{ id: string; title: string }> {
  try {
    const channel = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        attributeKey: "Url",
        value: path,
        $filter: "ContentChannelId eq 179",
        loadAttributes: "simple",
      },
    });

    const channelData = getFirstItem(channel);

    // The showChannel Guid references the ContentChannel that contains the episodes
    const showChannel = await fetchRockData({
      endpoint: "ContentChannels",
      queryParams: {
        $filter: `Guid eq guid'${channelData.attributeValues?.showChannel?.value}'`,
        $select: "Id",
      },
    });

    return {
      id: showChannel.id,
      title: showChannel.title,
    };
  } catch {
    throw new Error(ERROR_MESSAGES.CHANNEL_FETCH_ERROR);
  }
}

/**
 * Fetches a podcast episode by path and channel ID
 */
async function getPodcastEpisode({
  path,
  channelId,
}: {
  path: string;
  channelId: string;
}): Promise<RockPodcastEpisode> {
  try {
    const episode = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        $filter: `ContentChannelId eq ${channelId} and StartDateTime le datetime'${new Date().toISOString()}'`,
        attributeKey: "Url",
        value: path,
        loadAttributes: "simple",
      },
    });

    return getFirstItem(episode) as RockPodcastEpisode;
  } catch {
    throw new Error(ERROR_MESSAGES.EPISODE_FETCH_ERROR);
  }
}

/**
 * Fetches Wistia element data by GUID
 */
async function getWistiaElement(guid: string): Promise<WistiaElement | null> {
  try {
    const wistiaElement = await fetchRockData({
      endpoint: "MediaElements",
      queryParams: {
        $filter: `Guid eq guid'${guid}'`,
      },
    });

    return getFirstItem(wistiaElement) as WistiaElement;
  } catch (error) {
    throw new Error(
      `${ERROR_MESSAGES.WISTIA_FETCH_ERROR} for guid ${guid}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Maps a Rock episode to a PodcastEpisode
 */
async function mapRockEpisodeToPodcastEpisode(
  rockEpisode: RockPodcastEpisode,
  showName: string
): Promise<PodcastEpisode> {
  const wistiaElement = await getWistiaElement(
    rockEpisode?.attributeValues?.media?.value || ""
  );

  return {
    show: showName,
    title: rockEpisode?.title || "",
    publishDate:
      rockEpisode?.attributeValues?.releaseDate?.valueFormatted || "",
    season: rockEpisode?.attributeValues?.seasonNumber?.value || "",
    episodeNumber: rockEpisode?.attributeValues?.episodeNumber?.value || "",
    audio: wistiaElement?.sourceKey || "",
    coverImage: createImageUrlFromGuid(
      rockEpisode?.attributeValues?.image?.value || ""
    ),
    summary: rockEpisode?.attributeValues?.summary?.value || "",
    content: rockEpisode?.content || "",
    showGuests: rockEpisode?.attributeValues?.showGuests?.value || "",
    url: rockEpisode?.attributeValues?.pathname?.value || "",
    apple: rockEpisode?.attributeValues?.applePodcast?.value || "",
    spotify: rockEpisode?.attributeValues?.spotify?.value || "",
    amazon: rockEpisode?.attributeValues?.amazonMusic?.value || "",
    youtube: rockEpisode?.attributeValues?.youtube?.value || "",
    resources: parseRockKeyValueList(
      rockEpisode?.attributeValues?.additionalResources?.value || ""
    ).map((resource) => ({
      title: resource.key,
      url: resource.value,
    })),
  };
}

/**
 * Utility function to safely get the first item from an array or return the item if it's not an array
 */
function getFirstItem<T>(item: T | T[]): T {
  return Array.isArray(item) ? item[0] : item;
}
