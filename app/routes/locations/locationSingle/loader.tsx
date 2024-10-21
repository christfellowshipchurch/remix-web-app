import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  fetchCampusData,
  fetchPastorData,
  fetchPastorIdByAlias,
  fetchWeekdaySchedules,
} from "~/lib/server/fetchLocationSingleData.server";
import { createImageUrlFromGuid } from "~/lib/utils";

export type dayTimes = {
  day: string;
  hour: string[];
};

export type LoaderReturnType = {
  additionalInfo: string[];
  campusImage: string;
  campusInstagram: string;
  campusMapImage: string;
  campusPastors: {
    name: string;
    image: string;
  };
  city: string;
  facebook: string;
  mapLink: string;
  name: string;
  phoneNumber: string;
  postalCode: string;
  serviceTimes: dayTimes[];
  state: string;
  street1: string;
  street2: string;
  url: string;
  youtube: string;
  weekdaySchedules: any[];
};

const youtube = "https://www.youtube.com/user/christfellowship";
const facebook = "https://www.facebook.com/CFimpact";
const defaultInstagram = "https://www.instagram.com/christfellowship.church/";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");
  const campusUrl = params.location as string;
  const data = await fetchCampusData(campusUrl);

  if (!data) {
    throw new Error("No data found");
  }

  const {
    name,
    phoneNumber,
    serviceTimes,
    url,
    attributeValues,
    location,
    leaderPersonAliasId,
  } = data;

  const {
    campusImage,
    campusInstagram,
    campusMapImage,
    mapLink,
    additionalInfo,
    weekdaySchedule,
  } = attributeValues;

  const { personId } = await fetchPastorIdByAlias(leaderPersonAliasId);

  const pastorData = await fetchPastorData(personId);

  const formattedServices = serviceTimes
    .split("|")
    .reduce((acc: dayTimes[], time: string) => {
      const [day, hour] = time.split("^");
      const existingDay = acc.find((item) => item.day === day);

      if (existingDay) {
        existingDay.hour.push(hour);
      } else {
        acc.push({ day, hour: [hour] });
      }

      return acc;
    }, []);

  const additionalInfoFormatted =
    additionalInfo?.value.split("|").slice(0, -1) || [];

  const weekdaySchedulesFormatted = await fetchWeekdaySchedules(
    weekdaySchedule?.value
  );

  /** Return Page Data */
  const pageData: LoaderReturnType = {
    additionalInfo: additionalInfoFormatted,
    campusImage: createImageUrlFromGuid(campusImage?.value),
    campusInstagram: campusInstagram?.value || defaultInstagram,
    campusMapImage: createImageUrlFromGuid(campusMapImage?.value),
    campusPastors: {
      name: pastorData?.fullName,
      image: createImageUrlFromGuid(pastorData?.photo?.guid),
    },
    city: location?.city,
    facebook,
    mapLink: mapLink?.value,
    name,
    phoneNumber,
    postalCode: location?.postalCode?.substring(0, 5),
    serviceTimes: formattedServices,
    state: location?.state,
    street1: location?.street1,
    street2: location?.street2,
    url,
    youtube,
    weekdaySchedules: weekdaySchedulesFormatted,
  };

  return json<LoaderReturnType>(pageData);
};
