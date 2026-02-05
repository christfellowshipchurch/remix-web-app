import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { EventSinglePageType } from "./types";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const eventData = data as EventSinglePageType | undefined;
  if (!eventData) {
    return createMeta({
      title: "404 – Event Not Found",
      description: "The event you are looking for does not exist.",
    });
  }
  return createMeta({
    title: eventData.title,
    description:
      eventData.subtitle ?? "Join this event at Christ Fellowship Church.",
    image: eventData.coverImage,
  });
};
