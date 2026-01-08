import { fetchRockData } from "./fetch-rock-data";

type FetchWistiaProps = {
  id: string;
  size: 1920 | 1280 | 960 | 640 | 400; // different sizes of the video we can return
};

export async function fetchWistiaData({
  id,
  size = 960,
}: FetchWistiaProps): Promise<string> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${process.env.WISTIA_API_KEY}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.wistia.com/v1/medias/${id}.json`,
      options
    );
    const data = await response.json();
    const { assets } = data;

    const videoUrl = assets
      .find((asset: { width: number }) => asset.width === size)
      .url.replace("http", "https")
      .replace("bin", "mp4");

    return videoUrl;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch Wistia data");
  }
}

export async function fetchWistiaDataFromRock(guid: string) {
  const mediaElement = await fetchRockData({
    endpoint: "MediaElements",
    queryParams: {
      $filter: `Guid eq guid'${guid}'`,
    },
  });

  if (!mediaElement) {
    throw new Error(`Media element not found for GUID: ${guid}`);
  }

  // Ensure mediaElement is an array
  let mediaElementArray = [];
  if (!Array.isArray(mediaElement)) {
    mediaElementArray = [mediaElement];
  } else {
    mediaElementArray = mediaElement;
  }

  if (mediaElementArray.length === 0) {
    throw new Error(`No media element found for GUID: ${guid}`);
  }

  return mediaElementArray[0];
}

/**
 * Validates if a Wistia video ID exists and is accessible
 * Uses Wistia's oEmbed endpoint to check if the video exists
 * @param wistiaId - The Wistia video ID to validate
 * @returns true if the video exists and is accessible (HTTP 200), false otherwise
 */
export async function isValidWistiaId(
  wistiaId: string | null | undefined
): Promise<boolean> {
  if (!wistiaId || typeof wistiaId !== "string") {
    return false;
  }

  const trimmedId = wistiaId.trim();
  if (trimmedId.length === 0) {
    return false;
  }

  // Quick format check first (alphanumeric with possible hyphens/underscores)
  const wistiaIdPattern = /^[a-zA-Z0-9_-]+$/;
  if (!wistiaIdPattern.test(trimmedId)) {
    return false;
  }

  try {
    // Use Wistia's oEmbed endpoint to validate the video
    const oEmbedUrl = `https://fast.wistia.com/oembed?url=https://fast.wistia.com/embed/medias/${trimmedId}`;
    const response = await fetch(oEmbedUrl, {
      method: "GET",
    });

    // If the request is successful (HTTP 200), the video exists and is accessible
    if (response.ok) {
      return true;
    }

    // If the request returns 404, the video doesn't exist or is not accessible
    if (response.status === 404) {
      return false;
    }

    // For any other status code, consider it invalid
    return false;
  } catch (error) {
    // Check if it's an SSL certificate error (common in development)
    const isSSLError =
      error instanceof Error &&
      (error.message.includes("certificate") ||
        error.message.includes("UNABLE_TO_GET_ISSUER_CERT") ||
        (error as { cause?: { code?: string } }).cause?.code ===
          "UNABLE_TO_GET_ISSUER_CERT_LOCALLY");

    if (isSSLError && process.env.NODE_ENV !== "production") {
      // In development, if format is valid, allow it (SSL errors are environment issues)
      // Log a warning so developers know what's happening
      console.warn(
        `⚠️ SSL certificate error validating Wistia ID ${trimmedId} in development. ` +
          `Assuming valid (format check passed). Fix SSL certificates for proper validation.`
      );
      return true;
    }

    // In production or for non-SSL errors, reject to be safe
    console.error(`Error validating Wistia ID ${trimmedId}:`, error);
    return false;
  }
}
