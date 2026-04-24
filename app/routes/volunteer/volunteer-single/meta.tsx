import type { MetaFunction } from "react-router-dom";

import { createMeta } from "~/lib/meta-utils";
import type { LoaderReturnType } from "./loader";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const missionData = data as LoaderReturnType | undefined;
  if (!missionData) {
    return [];
  }

  return createMeta({
    title: "Volunteer mission | Christ Fellowship Church",
    description:
      "Learn about this mission opportunity and how you can serve with Christ Fellowship.",
    path: `/volunteer/${missionData.groupGuid}`,
  });
};
