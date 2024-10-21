import type { MetaFunction } from "@remix-run/node";
import { loader } from "./loader";

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
    { title: `${data?.fullName} | Christ Fellowship Church` },
    { name: "description", content: data?.summary },
  ];
};
