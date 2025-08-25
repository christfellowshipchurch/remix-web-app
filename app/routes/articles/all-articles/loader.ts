import { formatDate } from "date-fns";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getAuthorDetails } from "../article-single/loader";
import { AuthorProps } from "../article-single/partials/hero.partial";

export type ArticlesReturnType = {
  recentArticles: Article[];
  upcomingArticles: Article[];
};

export type Article = {
  title: string;
  startDate: string;
  startDateTime: string;
  image: string;
  content: string;
  author: AuthorProps;
  readTime: number;
  attributeValues: {
    author: { value: string };
    summary: { value: string };
    image: { value: string };
    url: { value: string };
  };
};

const getRecentArticles = async () => {
  const recentArticles = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq 43 and Status eq 'Approved'`,
      $orderby: "StartDateTime desc",
      $top: "5",
      loadAttributes: "simple",
    },
  });

  // Process each article to add author details and format data
  for (const article of recentArticles) {
    if (article && article.attributeValues.image.value) {
      article.image = createImageUrlFromGuid(
        article.attributeValues.image.value
      );
    }

    article.startDate = formatDate(
      new Date(article.startDateTime),
      "MMMM d, yyyy"
    );

    // Add author details
    if (article.attributeValues.author?.value) {
      article.author = await getAuthorDetails(
        article.attributeValues.author.value
      );
    }

    // Calculate read time
    article.readTime = Math.round(article.content.split(" ").length / 200);
  }

  return recentArticles;
};

const getUpcomingArticles = async () => {
  const upcomingArticles = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq 43 and Status eq 'Approved'`,
      $orderby: "Order asc",
      $top: "5",
      loadAttributes: "simple",
    },
  });

  // Process each article to add author details and format data
  for (const article of upcomingArticles) {
    if (article && article.attributeValues.image.value) {
      article.image = createImageUrlFromGuid(
        article.attributeValues.image.value
      );
    }

    article.startDate = formatDate(
      new Date(article.startDateTime),
      "MMMM d, yyyy"
    );

    // Add author details
    if (article.attributeValues.author?.value) {
      article.author = await getAuthorDetails(
        article.attributeValues.author.value
      );
    }

    // Calculate read time
    article.readTime = Math.round(article.content.split(" ").length / 200);
  }

  return upcomingArticles;
};

export const loader = async () => {
  const recentArticles = await getRecentArticles();
  const upcomingArticles = await getUpcomingArticles();

  return { recentArticles, upcomingArticles };
};
