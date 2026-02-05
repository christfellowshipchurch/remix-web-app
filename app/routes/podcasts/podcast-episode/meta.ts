import type { MetaFunction } from "react-router-dom";
import type { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.episode) {
    return createMeta({
      title: "Episode Not Found",
      description: "The podcast episode you are looking for does not exist.",
    });
  }
  const { episode } = data;
  const summary = episode.summary?.trim() ?? "";
  const description =
    summary.length > 160
      ? summary.substring(0, 160) + "..."
      : summary ||
        `${episode.title} – ${episode.show} | Christ Fellowship Church`;
  return createMeta({
    title: `${episode.title} – ${episode.show}`,
    description,
    image: episode.coverImage,
  });
};
