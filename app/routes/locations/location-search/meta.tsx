import type { MetaFunction } from "react-router-dom";
import { createMeta } from "~/lib/meta-utils";

const DESCRIPTION =
  "Here at Christ Fellowship Church, we want to help you live the life you were created for. Every Sunday, we have church services throughout South Florida where you can experience uplifting worship music, encouraging messages from our pastors, special programming for your family, and opportunities for you to find people to do life with all throughout the week—and it all starts here!";

const KEYWORDS =
  "christ fellowship church locations, church locations, church locations near me, church, church near me, church in my area, churches, churches near me, christian church, non denominational church, church services near me";

export const meta: MetaFunction = () => {
  return [
    ...createMeta({
      title:
        "Christ Fellowship Church Locations | Across South Florida and Online",
      description: DESCRIPTION,
      path: "/locations",
    }),
    { name: "keywords", content: KEYWORDS },
  ];
};
