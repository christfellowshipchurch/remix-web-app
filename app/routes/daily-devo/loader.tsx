import { LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";

export type DailyDevo = {
  title: string;
  content: string;
  startDateTime: string;
  wistiaId: string;
  scriptures: {
    reference: string;
    text: string;
    translation_id: string;
  }[];
};

export type LoaderReturnType = {
  appPromoVideo: string;
  avatars: { src: string; alt: string }[];
  dailyDevo: DailyDevo;
};

const FetchScripture = async (scripture: string) => {
  const response = await fetch(`https://bible-api.com/${scripture}`);

  if (!response.ok) {
    throw new Error("Failed to fetch scripture");
  }

  return (await response.json()) as {
    reference: string;
    text: string;
    translation_id: string;
  };
};

const FetchDailyDevo = async () => {
  const contentChannelId = 136;

  const dailyDevo = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      // TODO: Add filter for StartDateTime < current date
      $filter: `ContentChannelId eq ${contentChannelId}`,
      $orderby: "StartDateTime desc",
      $top: "1",
      loadAttributes: "simple",
    },
    cache: false,
  });

  return dailyDevo;
};

const avatars = [
  { src: "https://picsum.photos/id/1011/70/70", alt: "Avatar 1" },
  { src: "https://picsum.photos/id/1012/70/70", alt: "Avatar 2" },
  { src: "https://picsum.photos/id/1015/70/70", alt: "Avatar 3" },
  { src: "https://picsum.photos/id/1015/70/70", alt: "Avatar 4" },
];

export const loader: LoaderFunction = async (): Promise<LoaderReturnType> => {
  const dailyDevo = await FetchDailyDevo();
  dailyDevo.wistiaId = dailyDevo.attributeValues.media.value;
  const scriptures = dailyDevo.attributeValues.scriptures.value
    .split(",")
    .map((s: string) => s.trim());
  dailyDevo.scriptures = await Promise.all(
    scriptures.map((scripture: string) => FetchScripture(scripture))
  );

  const appPromoVideo = "b8qb27ar32";

  return { appPromoVideo, avatars, dailyDevo };
};
