import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "404 - Class Not Found" },
      {
        name: "description",
        content: "The class you are looking for does not exist.",
      },
    ];
  }

  const classUrl = data.classUrl;
  const classTitle = classUrl
    .split("-")
    .join(" ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

  return [
    { title: `${classTitle} | Christ Fellowship Church` },
    {
      name: "description",
      content: `Register for ${classTitle} at Christ Fellowship Church`,
    },
  ];
};
