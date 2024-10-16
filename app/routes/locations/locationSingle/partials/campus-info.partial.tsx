import ServiceTimes from "../components/serviceTimes.component";
import {
  MainCampusInfo,
  WaysToJoinOnlineMobile,
} from "../components/mainCampusInfo.component";
import PastorCard from "../components/pastorCard.component";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export const CampusInfo = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  return (
    <>
      <ServiceTimes />
      {/* TODO: Pass Data */}
      {name === "cf-everywhere" && <WaysToJoinOnlineMobile />}
      <div className="flex w-full flex-col items-center">
        <PastorCard />
      </div>
      <MainCampusInfo />
    </>
  );
};
