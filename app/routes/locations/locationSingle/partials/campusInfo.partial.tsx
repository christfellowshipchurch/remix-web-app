import ServiceTimes from "../components/serviceTimes.component";
import {
  MainCampusInfo,
  WaysToJoinOnlineMobile,
} from "../components/mainCampusInfo.component";
import PastorCard from "../components/pastorCard.component";
import { CampusName } from "../locationSingle.types";

export const CampusInfo = ({ name }: CampusName) => {
  return (
    <>
      <ServiceTimes />
      {/* TODO: Pass Data */}

      {name === "cf-everywhere" && <WaysToJoinOnlineMobile />}

      <div className="flex w-full flex-col items-center">
        <PastorCard name={name} />
      </div>
      <MainCampusInfo name={name} />
    </>
  );
};
