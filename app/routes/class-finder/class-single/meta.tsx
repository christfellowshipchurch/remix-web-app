import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return createMeta({
      title: "404 – Class Not Found",
      description: "The class you are looking for does not exist.",
    });
  }
  const classUrl = data.classUrl;
  const classTitle = classUrl
    .split("-")
    .join(" ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  return createMeta({
    title: classTitle,
    description: `Register for ${classTitle} at Christ Fellowship Church`,
  });
};
