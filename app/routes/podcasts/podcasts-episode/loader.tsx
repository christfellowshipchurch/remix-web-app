import { LoaderFunctionArgs } from "react-router-dom";
import { PodcastEpisode } from "../types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type LoaderReturnType = {
  episode: PodcastEpisode;
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episode: episodePath } = params;

  if (!episodePath) {
    throw new Response("Episode not found", { status: 404 });
  }

  const rockEpisode = await getPodcastEpisode(episodePath);
  const episode = mapRockEpisodeToPodcastEpisode(rockEpisode);

  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  return {
    episode,
    ALGOLIA_APP_ID: appId || "",
    ALGOLIA_SEARCH_API_KEY: apiKey || "",
  };
};

async function getPodcastEpisode(path: string) {
  let episode;
  try {
    episode = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        attributeKey: "Url",
        value: path,
        loadAttributes: "simple",
      },
    });
  } catch (error) {
    throw new Error("Error fetching channel from Rock");
  }

  if (!Array.isArray(episode)) {
    episode = episode;
  } else {
    episode = episode[0];
  }

  return episode;
}

function mapRockEpisodeToPodcastEpisode(rockEpisode: any): PodcastEpisode {
  const attributeValues = rockEpisode.attributeValues || {};

  // Extract episode number from rock label (e.g., "Season 13 | Episode 4" -> "4")
  const rockLabel = attributeValues.rockLabel?.value || "";
  const episodeNumberMatch = rockLabel.match(/Episode\s+(\d+)/);
  const episodeNumber = episodeNumberMatch ? episodeNumberMatch[1] : "";

  // Extract season from rock label (e.g., "Season 13 | Episode 4" -> "13")
  const seasonMatch = rockLabel.match(/Season\s+(\d+)/);
  const season = seasonMatch ? seasonMatch[1] : "";

  // Parse calls to action for resources and platform links
  const callsToAction = attributeValues.callsToAction?.value || "";
  const { resources, platformLinks } = parseCallsToAction(callsToAction);

  // Convert image GUID to full URL
  const imageGuid = attributeValues.image?.value || "";
  const coverImage = createImageUrlFromGuid(imageGuid);

  // Extract Wistia ID from media attribute
  const mediaValue = attributeValues.media?.value || "";
  const wistiaIdMatch = mediaValue.match(
    /wistia\.com\/deliveries\/([a-f0-9]+)/
  );
  const audio = wistiaIdMatch ? wistiaIdMatch[1] : "";

  return {
    show: "So Good Sisterhood", // This could be extracted from theme or other attributes
    title: rockEpisode.title || "",
    season,
    episodeNumber,
    audio,
    coverImage,
    description: attributeValues.summary?.value || "",
    authors: attributeValues.author?.persistedTextValue || "",
    url: attributeValues.pathname?.value || "",
    apple: platformLinks.apple || "",
    spotify: platformLinks.spotify || "",
    amazon: platformLinks.amazon || "",
    content: rockEpisode.content || "",
    resources,
  };
}

function parseCallsToAction(callsToAction: string): {
  resources: { title: string; url: string }[];
  platformLinks: { apple: string; spotify: string; amazon: string };
} {
  if (!callsToAction) {
    return {
      resources: [],
      platformLinks: { apple: "", spotify: "", amazon: "" },
    };
  }

  const platformLinks = { apple: "", spotify: "", amazon: "" };
  const resources: { title: string; url: string }[] = [];

  // Split by | and parse each call to action
  const actions = callsToAction
    .split("|")
    .map((action) => {
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
        } else {
          // This is a general resource
          resources.push({ title, url });
        }
      }
      return null;
    })
    .filter(Boolean);

  return { resources, platformLinks };
}
