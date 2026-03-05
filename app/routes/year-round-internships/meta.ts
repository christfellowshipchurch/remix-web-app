import type { MetaFunction } from "react-router-dom";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction = () => {
  return createMeta({
    title: "Summer Internships",
    description:
      "Summer internship opportunities at Christ Fellowship Church. Gain experience and grow in your faith.",
    path: "/summer-internships",
  });
};
