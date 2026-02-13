import type { MetaFunction } from "react-router-dom";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction = () => {
  return createMeta({
    title: "Info",
    description: "Information and resources from Christ Fellowship Church.",
    path: "/info",
  });
};
