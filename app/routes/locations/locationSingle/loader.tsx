import { json, LoaderFunctionArgs } from "@remix-run/node";
import { includes, lowerCase } from "lodash";
import invariant from "tiny-invariant";
import { fetchRockData } from "~/lib/server/fetchRockData.server";
import { createImageUrlFromGuid, getIdentifierType } from "~/lib/utils";

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
  // weekdaySchedules: any; // TODO: Finish Weekday Schedules
  // Add other properties as needed
};

const youtube = "https://www.youtube.com/user/christfellowship";
const facebook = "https://www.facebook.com/CFimpact";

const fetchCampusData = async (campusUrl: string) => {
  return fetchRockData("Campuses", {
    $filter: `Url eq '${campusUrl}'`,
    $expand: "Location",
    loadAttributes: "simple",
  });
};

const fetchPastorByAlias = async (personAlias: string) => {
  return fetchRockData("PersonAlias", {
    $filter: `Id eq ${personAlias}`,
  });
};

const pastorData = async (id: string) => {
  return fetchRockData("People", {
    $filter: `Id eq ${id}`,
    $expand: "Photo",
  });
};

const getMatricesFromGuid = async (guid: string) => {
  return fetchRockData("AttributeMatrices", {
    $filter: `Guid eq guid'${guid}'`,
  });
};

const getMatrixItemsFromId = async (id: string) => {
  return fetchRockData("AttributeMatrixItems", {
    $filter: `AttributeMatrix/${getIdentifierType(id).query}`,
    loadAttributes: "simple",
  });
};

const fetchWeekdaySchedules = async (matrixGuid: any) => {
  //Grab weekdaySchedule attribute matrix items from guid
  const matrices = await getMatricesFromGuid(matrixGuid);

  if (matrices?.length === 0) return null;

  const matrixItems = await getMatrixItemsFromId(matrices?.id);

  //Grab day, time, title, url from matrixItems
  let matrixItemValues = matrixItems?.map((n: any) => {
    const day = lowerCase(n?.attributevalues?.day?.valueFormatted);

    //If multiple days, need to split them up and add them back to the matrixItemValues array later
    if (includes(day, " ")) {
      const days = day?.split(" ");
      return days?.map((d) => {
        return {
          [d]: {
            time: n?.attributevalues?.time?.value,
            title: n?.attributevalues?.event?.value,
            url: n?.attributevalues?.url?.value,
          },
        };
      });
    }

    return {
      [day]: {
        time: n?.attributevalues?.time?.value,
        title: n?.attributevalues?.event?.value,
        url: n?.attributevalues?.url?.value,
      },
    };
  });

  //Find where multiple days we're assigned to one time
  const findAdditionalDaysWithSameTime = matrixItemValues?.find((n: any) => {
    if (Array.isArray(n)) {
      return n;
    }
    return null;
  });
  //move them to the matrixItemValues array
  if (findAdditionalDaysWithSameTime) {
    findAdditionalDaysWithSameTime?.map((n: any) => {
      matrixItemValues?.push(n);
    });
  }

  //Group items by day(key)
  return matrixItemValues?.reduce((acc: any, cur: any) => {
    const key = Object?.keys(cur)[0];
    const value = cur[key];

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key]?.push(value);

    return acc;
  }, {});
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");

  const campusUrl = params.location as string;
  const data = await fetchCampusData(campusUrl);
  const pastorsByAlias = await fetchPastorByAlias(data?.leaderPersonAliasId);
  const pastor = await pastorData(pastorsByAlias?.personId);

  if (!data) {
    throw new Error("No data found");
  }

  const { name, phoneNumber, serviceTimes, url } = data;
  const times = serviceTimes.split("|").reduce((acc: any, time: string) => {
    const [day, hour] = time.split("^");
    const existingDay = acc.find((item: any) => item.day === day);

    if (existingDay) {
      existingDay.hour.push(hour);
    } else {
      acc.push({ day, hour: [hour] });
    }

    return acc;
  }, []);
  const additionalInfos = data?.attributeValues?.additionalInfo?.value
    .split("|")
    .slice(0, -1);

  const pageData: LoaderReturnType = {
    additionalInfo: additionalInfos,
    campusImage: createImageUrlFromGuid(
      data?.attributeValues?.campusImage?.value
    ),
    campusInstagram:
      data?.attributeValues?.campusInstagram?.value ||
      "https://www.instagram.com/christfellowship.church/",
    campusMapImage: createImageUrlFromGuid(
      data?.attributeValues?.campusMapImage?.value
    ),
    campusPastors: {
      name: pastor?.fullName,
      image: createImageUrlFromGuid(pastor?.photo?.guid),
    },
    city: data?.location?.city,
    facebook,
    mapLink: data?.attributeValues?.mapLink?.value,
    name,
    phoneNumber,
    postalCode: data?.location?.postalCode?.substring(0, 5),
    serviceTimes: times,
    state: data?.location?.state,
    street1: data?.location?.street1,
    street2: data?.location?.street2,
    url,
    youtube,
    // weekdaySchedules: fetchWeekdaySchedules(
    //   data?.attributeValues?.weekdaySchedule?.value
    // ),
  };

  return json<LoaderReturnType>(pageData);
};
