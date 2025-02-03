import type { MetaFunction } from "react-router";
import { loader, LoaderReturnType } from "./loader";

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

  const typedData = data as LoaderReturnType;

  return [
    { title: `${typedData.fullName} | Christ Fellowship Church` },
    { name: "description", content: typedData.authorAttributes.bio },
  ];
};
