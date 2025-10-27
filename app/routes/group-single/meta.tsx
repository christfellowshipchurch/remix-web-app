import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import type { LoaderReturnType } from "./loader";

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data?: LoaderReturnType;
}) => {
  if (!data || !data.group) {
    return [
      { title: "Group Not Found | Christ Fellowship Church" },
      {
        name: "description",
        content: "The group you are looking for does not exist.",
      },
    ];
  }

  const groupName = data.group.title;
  const summary = data.group.summary || "";
  // Limit description to 160 characters for best SEO practice
  const description =
    summary.length > 157
      ? `${summary.substring(0, 157)}...`
      : summary || "Join this group at Christ Fellowship Church";

  return [
    { title: `${groupName} | Christ Fellowship Church` },
    { name: "description", content: description },
  ];
};
