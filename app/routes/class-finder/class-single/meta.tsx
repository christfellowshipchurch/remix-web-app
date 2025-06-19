import type { MetaFunction } from "react-router";
import { loader } from "./loader";

/**
 * todo : set up meta data for group single pages
 */
interface GroupData {
  groupName: string;
}

export const meta: MetaFunction<typeof loader> = ({ data }: { data: any }) => {
  const groupData = data as GroupData | null;
  if (!groupData) {
    return [
      { title: "404 - Group Not Found" },
      {
        name: "description",
        content: "The message you are looking for does not exist.",
      },
    ];
  }

  // TODO: Get group title from data
  const groupName = groupData.groupName;

  return [
    { title: `${groupName} | Christ Fellowship Church` },
    // TODO: Add description
    { name: "description", content: "Messages from Christ Fellowship Church" },
  ];
};
