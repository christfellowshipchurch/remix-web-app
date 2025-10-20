import { LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type DailyDevo = {
  title: string;
  content: string;
  startDateTime: string;
  wistiaId: string;
  coverImage: string;
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

const fetchScripture = async (scripture: string) => {
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

const fetchDailyDevo = async () => {
  const contentChannelId = 136;

  const dailyDevoItems = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq ${contentChannelId}`,
      $orderby: "StartDateTime desc",
      $top: "14", // Fetch 2 weeks of items to ensure we get the most recent one, sometimnes items are made ahead of time
      loadAttributes: "simple",
    },
    cache: false,
  });

  // Filter to get the most recent item that has started (StartDateTime <= current date)
  const currentDate = new Date();
  const validItems = dailyDevoItems.filter(
    (item: { startDateTime: string }) => {
      const startDate = new Date(item.startDateTime);
      return startDate <= currentDate;
    }
  );

  return validItems[0]; // Return the most recent valid item
};

const avatars = [
  { src: "https://picsum.photos/id/1011/70/70", alt: "Avatar 1" },
  { src: "https://picsum.photos/id/1012/70/70", alt: "Avatar 2" },
  { src: "https://picsum.photos/id/1015/70/70", alt: "Avatar 3" },
  { src: "https://picsum.photos/id/1015/70/70", alt: "Avatar 4" },
];

export const loader: LoaderFunction = async (): Promise<LoaderReturnType> => {
  const dailyDevoRockData = await fetchDailyDevo();

  const scripturesRockData = dailyDevoRockData.attributeValues.scriptures.value
    .split(",")
    .map((s: string) => s.trim());

  const scriptures = await Promise.all(
    scripturesRockData.map((scripture: string) => fetchScripture(scripture))
  );

  const appPromoVideo = "b8qb27ar32";

  const dailyDevo = {
    title: dailyDevoRockData.title,
    content: dailyDevoRockData.content,
    startDateTime: dailyDevoRockData.startDateTime,
    wistiaId: dailyDevoRockData.attributeValues.media.value,
    coverImage: await createImageUrlFromGuid(
      dailyDevoRockData.attributeValues.image.value
    ),
    scriptures,
  };

  return { appPromoVideo, avatars, dailyDevo };
};
