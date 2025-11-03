import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "404 - Group Not Found" },
      {
        name: "description",
        content: "The message you are looking for does not exist.",
      },
    ];
  }

  // TODO: Get class title from data
  const className = data.className;

  return [
    { title: `${className} | Christ Fellowship Church` },
    // TODO: Add description
    { name: "description", content: "Messages from Christ Fellowship Church" },
  ];
};
