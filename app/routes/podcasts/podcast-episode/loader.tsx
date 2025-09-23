import { LoaderFunctionArgs } from "react-router-dom";
import {
  PodcastEpisode,
  RockChannel,
  RockPodcastEpisode,
  WistiaElement,
  Resource,
  PlatformLinks,
} from "../types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid, parseRockKeyValueList } from "~/lib/utils";

// Constants
const SISTERHOOD_SHOW_PATH = "so-good-sisterhood";
const OLD_SISTERHOOD_CHANNEL_ID = 95;
const SHOW_NAME = "So Good Sisterhood";

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
 * Handles both new podcast episodes and legacy sisterhood episodes
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

  // Determine channel ID based on show type
  // Legacy sisterhood episodes use old content channel (ID 95)
  // All other episodes use the new channel type (CFDP Podcasts)
  const showChannel =
    showPath === SISTERHOOD_SHOW_PATH
      ? { id: OLD_SISTERHOOD_CHANNEL_ID.toString(), name: SHOW_NAME }
      : await getPodcastChannel(showPath);

  if (!showChannel) {
    throw new Response(ERROR_MESSAGES.CHANNEL_NOT_FOUND, { status: 404 });
  }

  // Fetch episode data
  const rockEpisode = await getPodcastEpisode({
    path: episodePath,
    channelId: showChannel.id,
  });

  // Map episode data based on show type
  const episode = showPath.includes(SISTERHOOD_SHOW_PATH)
    ? await mapSisterhoodRockEpisodeToPodcastEpisode(rockEpisode)
    : await mapRockEpisodeToPodcastEpisode(rockEpisode, showChannel.name);

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
 * Fetches the channel ID and name for a given show path
 */
async function getPodcastChannel(path: string): Promise<RockChannel> {
  try {
    const channel = await fetchRockData({
      endpoint: "ContentChannels/GetByAttributeValue",
      queryParams: {
        attributeKey: "showUrl",
        $select: "Id, Name",
        value: path,
      },
    });

    const channelData = getFirstItem(channel) as RockChannel;

    return channelData;
  } catch (error) {
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
        $filter: `ContentChannelId eq ${channelId}`,
        attributeKey: "Url",
        value: path,
        loadAttributes: "simple",
      },
    });

    return getFirstItem(episode) as RockPodcastEpisode;
  } catch (error) {
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
 * Maps a Rock episode to a PodcastEpisode for new podcast episodes
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
    publishDate: rockEpisode?.startDateTime
      ? new Date(rockEpisode.startDateTime).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
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
    ),
  };
}

/**
 * Maps a Rock episode to a PodcastEpisode for legacy sisterhood episodes
 * Handles the old content channel format with different attribute structure
 */
async function mapSisterhoodRockEpisodeToPodcastEpisode(
  rockEpisode: RockPodcastEpisode
): Promise<PodcastEpisode> {
  const attributeValues = rockEpisode?.attributeValues || {};

  // Extract episode number from rock label (e.g., "Season 13 | Episode 4" -> "4")
  const rockLabel = attributeValues.rockLabel?.value || "";
  const summary = attributeValues.summary?.value || "";
  const episodeNumberMatch = rockLabel.match(/Episode\s+(\d+)/);
  const episodeNumber = episodeNumberMatch ? episodeNumberMatch[1] : "";

  // Extract season from rock label or summary (e.g., "Season 13 | Episode 4" -> "13")
  const seasonMatch =
    rockLabel !== ""
      ? rockLabel.match(/Season\s+(\d+)/)
      : summary.match(/Season\s+(\d+)/);
  const season = seasonMatch ? seasonMatch[1] : "";

  // Parse calls to action for resources and platform links
  const callsToAction = attributeValues.callsToAction?.value || "";
  const { resources, platformLinks } = parseCallsToAction(callsToAction);

  // Convert image GUID to full URL
  const imageGuid = attributeValues.image?.value || "";
  const coverImage = createImageUrlFromGuid(imageGuid);

  // Extract Wistia ID from media attribute
  const mediaGuid = attributeValues.media?.value || null;
  const wistiaElement =
    (mediaGuid && (await getWistiaElement(mediaGuid))) || null;

  return {
    show: SHOW_NAME,
    title: rockEpisode?.title || "",
    publishDate: rockEpisode?.startDateTime
      ? new Date(rockEpisode.startDateTime).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    season,
    episodeNumber,
    audio: wistiaElement?.sourceKey || "",
    coverImage,
    summary: attributeValues.summary?.value || "",
    showGuests: attributeValues.author?.persistedTextValue || "",
    url: attributeValues.pathname?.value || "",
    apple: platformLinks.apple || "",
    spotify: platformLinks.spotify || "",
    amazon: platformLinks.amazon || "",
    youtube: platformLinks.youtube || "",
    content: rockEpisode.content || "",
    resources,
  };
}

/**
 * Parses calls to action string to extract resources and platform links
 * Format: "Title^URL|Title^URL" where platform links contain APPLE/SPOTIFY/AMAZON
 */
function parseCallsToAction(callsToAction: string): {
  resources: Resource[];
  platformLinks: PlatformLinks;
} {
  if (!callsToAction) {
    return {
      resources: [],
      platformLinks: { apple: "", spotify: "", amazon: "", youtube: "" },
    };
  }

  const platformLinks: PlatformLinks = {
    apple: "",
    spotify: "",
    amazon: "",
    youtube: "",
  };
  const resources: Resource[] = [];

  // Split by | and parse each call to action
  callsToAction.split("|").forEach((action) => {
    const parts = action.split("^");
    if (parts.length >= 2) {
      const title = parts[0].trim();
      const url = parts[1].trim();

      // Check if this is a platform link
      if (title.includes("APPLE")) {
        platformLinks.apple = url;
      } else if (title.includes("SPOTIFY")) {
        platformLinks.spotify = url;
      } else if (title.includes("AMAZON")) {
        platformLinks.amazon = url;
      } else if (title.includes("YOUTUBE")) {
        platformLinks.youtube = url;
      } else {
        // This is a general resource
        resources.push({ title, url });
      }
    }
  });

  return { resources, platformLinks };
}

/**
 * Utility function to safely get the first item from an array or return the item if it's not an array
 */
function getFirstItem<T>(item: T | T[]): T {
  return Array.isArray(item) ? item[0] : item;
}
