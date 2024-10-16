import type { MetaFunction } from "@remix-run/node";
import { loader } from "./loader";
import { createImageUrlFromGuid } from "~/lib/utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  return [
    {
      title: `${
        data?.data[0]?.name === "Trinity "
          ? "Trinity Location | Christ Fellowship Church"
          : data?.data[0]?.name.includes("Online")
          ? "Christ Fellowship Church | Get the Most Out of Life"
          : `Church in ${data?.data[0]?.name},  Fl | Christ Fellowship Church`
      }`,
      description: `Join us at Christ Fellowship Church in`,
      keywords: `church in ${data?.data[0]?.name} fl,  churches in ${data?.data[0]?.name} fl, church in palm beach county, churches in palm beach county, christ fellowship church in ${data?.data[0]?.name} fl, church near me, churches near me, church in my area, churches in my area, christian church near me, christian churches near me, non denominational church near me, non denominational churches near me, church service near me`,
      // TODO: Fix this
      // image: createImageUrlFromGuid(
      //   data?.data[0]?.attributeValues?.campusImage?.value
      // ),
      url: `https://rock.christfellowship.church/locations/${data?.data[0]?.url}`,
    },
  ];
};
