import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  if (!data) return [];
  return [
    {
      title: `${
        data?.campusName === "Trinity "
          ? "Trinity Location | Christ Fellowship Church"
          : data?.campusName?.includes("Online")
          ? "Christ Fellowship Church | Get the Most Out of Life"
          : `Church in ${data?.campusName},  Fl | Christ Fellowship Church`
      }`,
      description: `Join us at Christ Fellowship Church in`,
      keywords: `church in ${data?.campusName} fl,  churches in ${data?.campusName} fl, church in palm beach county, churches in palm beach county, christ fellowship church in ${data?.campusName} fl, church near me, churches near me, church in my area, churches in my area, christian church near me, christian churches near me, non denominational church near me, non denominational churches near me, church service near me`,
    },
  ];
};
