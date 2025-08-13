import type { LoaderFunctionArgs } from "react-router-dom";
import type { PodcastShow } from "../types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export async function loader(): Promise<{ podcastShows: PodcastShow[] }> {
  let podcastShowsData;
  try {
    podcastShowsData = await fetchRockData({
      endpoint: "ContentChannelItems",
      queryParams: {
        $filter: "ContentChannelId eq 179",
        loadAttributes: "simple",
      },
    });
  } catch (error) {
    console.error(error);
  }

  //ensure podcasts is an array
  if (!Array.isArray(podcastShowsData)) {
    podcastShowsData = [podcastShowsData];
  }

  //map podcastShows to PodcastShow type
  const podcastShows: PodcastShow[] = podcastShowsData.map(
    (podcastShow: any) => ({
      id: podcastShow.id || "",
      title: podcastShow.title || "",
      description: podcastShow.content || "",
      coverImage: createImageUrlFromGuid(
        podcastShow.attributeValues?.coverImage?.value
      ),
      apple: podcastShow.attributeValues?.applePodcast?.value || "",
      spotify: podcastShow.attributeValues?.spotify?.value || "",
      amazon: podcastShow.attributeValues?.amazonMusic?.value || "",
      episodesChannelGuid:
        podcastShow.attributeValues?.showChannel?.value || "",
      url: podcastShow.attributeValues?.url?.value || "",
    })
  );

  return { podcastShows };
}
