import type { MetaFunction } from "react-router-dom";
import { Author, loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const author = data as Author | undefined;

  if (!author) {
    return [
      { title: "404 - Author Not Found" },
      {
        name: "description",
        content: "The author you are looking for does not exist.",
      },
    ];
  }

  return [
    { title: `${author.fullName} | Christ Fellowship Church` },
    { name: "description", content: "" },
  ];
};
