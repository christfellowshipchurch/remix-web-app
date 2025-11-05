import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { EventSinglePageType } from "./types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const eventData = data as EventSinglePageType | undefined;
  if (!eventData) {
    return [
      { title: "404 - Event Not Found" },
      {
        name: "description",
        content: "The event you are looking for does not exist.",
      },
    ];
  }

  return [
    { title: `${eventData.title} | Christ Fellowship Church` },
    { name: "description", content: eventData.subtitle },
  ];
};
