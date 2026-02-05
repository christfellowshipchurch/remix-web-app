import type { MetaFunction } from "react-router-dom";
import type { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return createMeta({
      title: "Ministry",
      description: "Explore this ministry at Christ Fellowship Church.",
    });
  }
  const { title, content } = data;
  const description = content
    ? content
        .replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim() + (content.length > 160 ? "..." : "")
    : `Explore ${title} at Christ Fellowship Church`;
  return createMeta({
    title: title ?? "Ministry",
    description,
    image: data.heroImage,
  });
};
