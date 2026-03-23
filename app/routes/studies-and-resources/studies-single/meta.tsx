import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) {
    return createMeta({
      title: "404 – Study Not Found",
      description: "The study you are looking for does not exist.",
    });
  }
  const studyUrl = loaderData.studyUrl;
  const studyTitle = studyUrl
    .split("-")
    .join(" ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  return createMeta({
    title: studyTitle,
    description: `Register for ${studyTitle} at Christ Fellowship Church`,
  });
};
