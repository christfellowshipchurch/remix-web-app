// import type { LoaderFunctionArgs } from "react-router-dom";
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
    (podcastShow: {
      id: string;
      title: string;
      content: string;
      attributeValues?: {
        coverImage: { value: string };
        applePodcast: { value: string };
        spotify: { value: string };
        amazonMusic: { value: string };
        showChannel: { value: string };
        url: { value: string };
        youtube: { value: string };
      };
    }) => ({
      id: podcastShow.id || "",
      title: podcastShow.title || "",
      description: podcastShow.content || "",
      apple: podcastShow.attributeValues?.applePodcast?.value || "",
      spotify: podcastShow.attributeValues?.spotify?.value || "",
      amazon: podcastShow.attributeValues?.amazonMusic?.value || "",
      youtube: podcastShow.attributeValues?.youtube?.value || "",
      coverImage: createImageUrlFromGuid(
        podcastShow.attributeValues?.coverImage?.value || ""
      ),
      episodesChannelGuid:
        podcastShow.attributeValues?.showChannel?.value || "",
      url: podcastShow.attributeValues?.url?.value || "",
    })
  );

  return { podcastShows };
}
