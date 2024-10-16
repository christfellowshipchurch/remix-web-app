import type { MetaFunction } from "@remix-run/node";
import { loader } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  if (!data) return [];
  return [
    {
      title: `${
        data[0]?.name === "Trinity "
          ? "Trinity Location | Christ Fellowship Church"
          : data[0]?.name.includes("Online")
          ? "Christ Fellowship Church | Get the Most Out of Life"
          : `Church in ${data[0]?.name},  Fl | Christ Fellowship Church`
      }`,
      description: `Join us at Christ Fellowship Church in`,
      keywords: `church in ${data[0]?.name} fl,  churches in ${data[0]?.name} fl, church in palm beach county, churches in palm beach county, christ fellowship church in ${data[0]?.name} fl, church near me, churches near me, church in my area, churches in my area, christian church near me, christian churches near me, non denominational church near me, non denominational churches near me, church service near me`,
      image: data[0]?.campusImage,
      url: `https://rock.christfellowship.church/locations/${data[0]?.url}`,
    },
  ];
};
