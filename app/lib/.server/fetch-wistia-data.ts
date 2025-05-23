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
      .find((asset: any) => asset.width === size)
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
