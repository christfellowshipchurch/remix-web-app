import type { MetaFunction } from "react-router-dom";
import type { loader } from "./loader";
import type { LoaderReturnType } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const articleData = data as LoaderReturnType | undefined;
  if (!articleData) {
    return createMeta({
      title: "404 – Article Not Found",
      description: "The article you are looking for does not exist.",
    });
  }
  return createMeta({
    title: articleData.title,
    description:
      articleData.summary ?? "Read this article at Christ Fellowship Church.",
    image: articleData.coverImage,
  });
};
