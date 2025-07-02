import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { LoaderReturnType } from "./loader";

/**
 * todo : set up meta data for group single pages
 */

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderReturnType | undefined;
}) => {
  if (!data) {
    return [
      { title: "404 - Group Not Found" },
      {
        name: "description",
        content: "The message you are looking for does not exist.",
      },
    ];
  }

  // TODO: Get group title from data
  const groupName = data.groupName;

  return [
    { title: `${groupName} | Christ Fellowship Church` },
    // TODO: Add description
    { name: "description", content: "Messages from Christ Fellowship Church" },
  ];
};
