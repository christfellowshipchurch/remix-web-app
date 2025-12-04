import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import type { LoaderReturnType } from "./loader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locationData = data as LoaderReturnType | undefined;
  if (!locationData) return [];

  const espanolCampusName = locationData?.campusName
    ?.toLowerCase()
    .includes("iglesia")
    ? locationData?.campusName.replace("Iglesia", "").trim()
    : locationData?.campusName;

  return [
    {
      title: `${
        locationData?.campusName === "Trinity "
          ? "Trinity at Christ Fellowship Church in Palm Beach Gardens, FL | Christ Fellowship Church"
          : locationData?.campusName?.toLowerCase().includes("online") ||
            locationData?.campusName?.toLowerCase().includes("everywhere")
          ? "Christ Fellowship Church Online | Get the Most Out of Life"
          : locationData?.campusName?.toLowerCase().includes("iglesia")
          ? `Christ Fellowship Español en ${espanolCampusName}, FL | Christ Fellowship Church`
          : `Church in ${locationData?.campusName},  Fl | Christ Fellowship Church`
      }`,
      description: `Join us at Christ Fellowship Church in`,
      keywords: `church in ${locationData?.campusName} fl,  churches in ${locationData?.campusName} fl, church in palm beach county, churches in palm beach county, christ fellowship church in ${locationData?.campusName} fl, church near me, churches near me, church in my area, churches in my area, christian church near me, christian churches near me, non denominational church near me, non denominational churches near me, church service near me`,
    },
  ];
};
