import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";

interface ClassData {
  className: string;
}

export const meta: MetaFunction<typeof loader> = ({ data }: { data: any }) => {
  const classData = data as ClassData | null;
  if (!classData) {
    return [
      { title: "404 - Group Not Found" },
      {
        name: "description",
        content: "The message you are looking for does not exist.",
      },
    ];
  }

  // TODO: Get class title from data
  const className = classData.className;

  return [
    { title: `${className} | Christ Fellowship Church` },
    // TODO: Add description
    { name: "description", content: "Messages from Christ Fellowship Church" },
  ];
};
