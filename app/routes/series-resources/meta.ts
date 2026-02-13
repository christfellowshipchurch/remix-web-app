import type { MetaFunction } from "react-router-dom";
import type { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.series) {
    return createMeta({
      title: "Series Resources",
      description:
        "Messages, resources, and events for this series at Christ Fellowship Church.",
    });
  }
  const seriesName = data.series.value ?? "Series";
  return createMeta({
    title: `${seriesName} – Series Resources`,
    description:
      data.series.description ??
      `Messages, resources, and events for ${seriesName} at Christ Fellowship Church.`,
    path: "/series-resources",
  });
};
