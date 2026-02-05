import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { Author } from "./types";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return createMeta({
      title: "404 – Author Not Found",
      description: "The author you are looking for does not exist.",
    });
  }
  const author = data as Author;
  return createMeta({
    title: author.fullName,
    description:
      author.authorAttributes?.bio ?? "Author at Christ Fellowship Church",
  });
};
