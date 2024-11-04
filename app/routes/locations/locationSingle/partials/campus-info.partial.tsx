import ServiceTimes from "../components/serviceTimes.component";
import {
  MainCampusInfo,
  WaysToJoinOnlineMobile,
} from "../components/mainCampusInfo.component";
import PastorCard from "../components/pastorCard.component";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export const CampusInfo = () => {
  const { url } = useLoaderData<LoaderReturnType>();
  return (
    <>
      <ServiceTimes />
      {url === "cf-everywhere" && <WaysToJoinOnlineMobile />}
      <div className="flex w-full flex-col items-center">
        <PastorCard />
      </div>
      <MainCampusInfo />
    </>
  );
};
