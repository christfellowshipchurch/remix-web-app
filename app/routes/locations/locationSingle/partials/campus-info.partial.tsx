import ServiceTimes from "../components/serviceTimes.component";
import {
  MainCampusInfo,
  WaysToJoinOnlineMobile,
} from "../components/mainCampusInfo.component";
import PastorCard from "../components/pastorCard.component";
import { CampusInfoTypes } from "../location-single.types";

export const CampusInfo = ({
  name,
  campusMap,
  campusInstagram,
}: CampusInfoTypes) => {
  return (
    <>
      <ServiceTimes />
      {/* TODO: Pass Data */}
      {name === "cf-everywhere" && <WaysToJoinOnlineMobile />}
      <div className="flex w-full flex-col items-center">
        <PastorCard
          name={name}
          campusMap={campusMap}
          campusInstagram={campusInstagram}
        />
      </div>
      <MainCampusInfo name={name} />
    </>
  );
};
