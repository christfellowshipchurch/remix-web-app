import type { MetaFunction } from "react-router";

interface ArticleData {
  title: string;
  summary: string;
}

export const meta: MetaFunction = ({ data }: { data: any }) => {
  const articleData = data as ArticleData | null;
  if (!articleData) {
    return [
      { title: "404 - Article Not Found" },
      {
        name: "description",
        content: "The article you are looking for does not exist.",
      },
    ];
  }

  return [
    { title: `${articleData.title} | Christ Fellowship Church` },
    { name: "description", content: articleData.summary },
  ];
};
