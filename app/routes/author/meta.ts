import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { Author } from "./types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "404 - Author Not Found" },
      {
        name: "description",
        content: "The author you are looking for does not exist.",
      },
    ];
  }

  return [
    { title: `${(data as Author).fullName} | Christ Fellowship Church` },
    {
      name: "description",
      content: (data as Author).authorAttributes.bio || "Author page",
    },
  ];
};
