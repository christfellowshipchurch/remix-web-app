import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getUserFromRequest } from "~/lib/.server/authentication/getUserFromRequest";
import {
  fetchCampusData,
  fetchComingUpChildren,
  fetchComingUpTitle,
  fetchPastorData,
  fetchPastorIdByAlias,
  fetchWeekdaySchedules,
} from "~/lib/.server/fetchLocationSingleData";
import { createImageUrlFromGuid } from "~/lib/utils";

export type dayTimes = {
  day: string;
  hour: string[];
};

export type ContentItem = {
  title: string;
  attributeValues: {
    summary: { value: string };
    image: { value: string };
    url: { value: string };
  };
};

export type ThisWeekCard = {
  title: string;
  description: string;
  image: string;
  url: string;
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
  thisWeek: {
    cards: ThisWeekCard[];
  };
  comingUpSoon: {
    title: string;
    cards: {
      title: string;
      description: string;
      image: string;
      url: string;
    }[];
    buttonTitle: string;
  };
  facebook: string;
  mapLink: string;
  name: string;
  phoneNumber: string;
  postalCode: string;
  serviceTimes: dayTimes[];
  state: string;
  street1: string;
  street2: string;
  user: any;
  url: string;
  youtube: string;
  weekdaySchedules: any[];
};

const youtube = "https://www.youtube.com/user/christfellowship";
const facebook = "https://www.facebook.com/CFimpact";
const defaultInstagram = "https://www.instagram.com/christfellowship.church/";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");
  const campusUrl = params.location as string;
  const data = await fetchCampusData(campusUrl);

  const userData = await getUserFromRequest(request);
  const user = userData ? await userData : null;

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

  // TODO: Order is not accurate
  const comingUpSoonId = url?.includes("iglesia") ? "15472" : "11436";
  const comingUpChildren = await fetchComingUpChildren(comingUpSoonId);
  const comingUpChildrenTrimmed = comingUpChildren.slice(0, 3);
  const thisWeek = await fetchComingUpChildren("8168");
  const comingUpTitle = await fetchComingUpTitle(comingUpSoonId);

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

  // const thisWeekCards = []
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
    thisWeek: name.includes("Online") && {
      thisWeek: thisWeek.reverse(),
      cards: thisWeek.map((child: ContentItem) => {
        return {
          title: child?.title,
          description: child?.attributeValues?.summary?.value,
          image: createImageUrlFromGuid(child?.attributeValues?.image?.value),
          url: child.attributeValues?.url?.value,
        };
      }),
    },
    comingUpSoon: {
      title: comingUpTitle,
      cards: comingUpChildrenTrimmed.map((child: ContentItem) => {
        return {
          title: child?.title,
          description: child?.attributeValues?.summary?.value,
          image: createImageUrlFromGuid(child?.attributeValues?.image?.value),
          url: child.attributeValues?.url?.value,
        };
      }),
      buttonTitle: name.includes("Español") ? "Ver Más" : "See More",
    },
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
    user: user,
    youtube,
    weekdaySchedules: weekdaySchedulesFormatted,
  };

  return pageData;
};
