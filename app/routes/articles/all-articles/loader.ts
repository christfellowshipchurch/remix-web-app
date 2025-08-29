import { formatDate } from "date-fns";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getAuthorDetails } from "../article-single/loader";
import { AuthorProps } from "../article-single/partials/hero.partial";

export type ArticlesReturnType = {
  recentArticles: Article[];
  allArticles: Article[];
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
};

export type Article = {
  title: string;
  startDate: string;
  startDateTime: string;
  image: string;
  content: string;
  author: AuthorProps;
  readTime: number;
  primaryCategories: [{ value: string }];
  secondaryCategories: [{ value: string }];
  attributeValues: {
    author: { value: string };
    summary: { value: string };
    image: { value: string };
    url: { value: string };
    primaryCategory: { value: string };
    secondaryCategory: { value: string };
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

const getAllArticles = async () => {
  const allArticles = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq 43 and Status eq 'Approved'`,
      $orderby: "StartDateTime desc",
      $top: "10",
      loadAttributes: "simple",
    },
  });

  // Process each article to add author details and format data
  for (const article of allArticles) {
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

    if (article.attributeValues.primaryCategory.value) {
      // Separate the primary category into an array of values
      const categoryValues =
        article.attributeValues.primaryCategory.value.split(",");

      // Loop through all category values and fetch their details
      const primaryCategories = [];
      for (const categoryGuid of categoryValues) {
        const primaryCategory = await fetchRockData({
          endpoint: `DefinedValues/`,
          queryParams: {
            $filter: `Guid eq guid'${categoryGuid.trim()}'`,
            $select: "Value",
          },
        });

        if (primaryCategory && primaryCategory.length > 0) {
          primaryCategories.push(primaryCategory[0]);
        } else {
          primaryCategories.push(primaryCategory);
        }
      }

      article.primaryCategories = primaryCategories;
    }

    if (article.attributeValues.secondaryCategory.value) {
      const categoryValues =
        article.attributeValues.secondaryCategory.value.split(",");

      const secondaryCategories = [];
      for (const categoryGuid of categoryValues) {
        const secondaryCategory = await fetchRockData({
          endpoint: `DefinedValues/`,
          queryParams: {
            $filter: `Guid eq guid'${categoryGuid.trim()}'`,
            $select: "Value",
          },
        });

        if (secondaryCategory && secondaryCategory.length > 0) {
          secondaryCategories.push(secondaryCategory[0]);
        } else {
          secondaryCategories.push(secondaryCategory);
        }
      }

      article.secondaryCategories = secondaryCategories;
    }

    // Calculate read time
    article.readTime = Math.round(article.content.split(" ").length / 200);
  }

  return allArticles;
};

export const loader = async (): Promise<ArticlesReturnType> => {
  const recentArticles = await getRecentArticles();
  const allArticles = await getAllArticles();

  return {
    recentArticles,
    allArticles,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };
};
