import type { MetaFunction } from "react-router-dom";
import type { loader } from "./loader";
import type { LoaderReturnType } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const articleData = data as LoaderReturnType | undefined;
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
