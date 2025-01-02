import type { MetaFunction } from "react-router";
import { loader } from "./loader";

/**
 * todo : set up meta data for messages
 */

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
    { title: `Messages | Christ Fellowship Church` },
    { name: "description", content: "Messages from Christ Fellowship Church" },
  ];
};
