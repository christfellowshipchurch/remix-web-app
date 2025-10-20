import type { MetaFunction } from "react-router-dom";
// import { loader } from "./loader";

interface EventData {
  title: string;
  summary: string;
}

export const meta: MetaFunction = ({ data }: { data: EventData | null }) => {
  const eventData = data as EventData | null;
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
    { name: "description", content: eventData.summary },
  ];
};
