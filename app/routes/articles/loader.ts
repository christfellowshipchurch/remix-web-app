import { formatDate } from "date-fns";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type ArticlesReturnType = {
  recentArticles: Article[];
  upcomingArticles: Article[];
};

export type Article = {
  title: string;
  startDate: string;
  startDateTime: string;
  image: string;
  attributeValues: {
    summary: { value: string };
    image: { value: string };
    url: { value: string };
  };
};

const getRecentArticles = async () => {
  const recentArticles = await fetchRockData("ContentChannelItems", {
    $filter: `ContentChannelId eq 43 and Status eq 'Approved'`,
    $orderby: "StartDateTime desc",
    $top: "5",
    loadAttributes: "simple",
  });

  recentArticles.forEach((article: Article) => {
    if (article && article.attributeValues.image.value) {
      article.image = createImageUrlFromGuid(
        article.attributeValues.image.value
      );
    }
  });

  recentArticles.forEach((article: Article) => {
    article.startDate = formatDate(
      new Date(article.startDateTime),
      "MMMM d, yyyy"
    );
  });

  return recentArticles;
};

const getUpcomingArticles = async () => {
  const upcomingArticles = await fetchRockData("ContentChannelItems", {
    $filter: `ContentChannelId eq 43 and Status eq 'PendingApproval'`,
    $orderby: "StartDateTime desc",
    $top: "5",
    loadAttributes: "simple",
  });

  upcomingArticles.forEach((article: Article) => {
    if (article && article.attributeValues.image.value) {
      article.image = createImageUrlFromGuid(
        article.attributeValues.image.value
      );
    }
  });

  upcomingArticles.forEach((article: Article) => {
    article.startDate = formatDate(
      new Date(article.startDateTime),
      "MMMM d, yyyy"
    );
  });

  return upcomingArticles;
};

export const loader = async () => {
  const recentArticles = await getRecentArticles();
  const upcomingArticles = await getUpcomingArticles();

  return { recentArticles, upcomingArticles };
};
