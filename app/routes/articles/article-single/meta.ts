import type { MetaFunction } from "react-router";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "404 - Article Not Found" },
      {
        name: "description",
        content: "The article you are looking for does not exist.",
      },
    ];
  }

  return [
    { title: `${data.title} | Christ Fellowship Church` },
    { name: "description", content: data.summary },
  ];
};
