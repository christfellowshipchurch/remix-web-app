import { includes, lowerCase } from "lodash";
import { getIdentifierType } from "../utils";
import { fetchRockData } from "./fetchRockData";
import { format } from "date-fns";

export const fetchCampusData = async (campusUrl: string) => {
  return fetchRockData("Campuses", {
    $filter: `Url eq '${campusUrl}'`,
    $expand: "Location",
    loadAttributes: "simple",
  });
};

export const fetchComingUpTitle = async (id: string) => {
  const { title } = await fetchRockData(`ContentChannelItems`, {
    $filter: `Id eq ${id}`,
    $select: "Title",
  });

  return title;
};

export const fetchComingUpChildren = async (id: string) => {
  return fetchRockData(`ContentChannelItems/GetChildren/${id}`, {
    loadAttributes: "simple",
  });
};

export const fetchPastorIdByAlias = async (personAlias: string) => {
  return fetchRockData("PersonAlias", {
    $filter: `Id eq ${personAlias}`,
    $select: "PersonId",
  });
};

export const fetchPastorData = async (id: string) => {
  return fetchRockData("People", {
    $filter: `Id eq ${id}`,
    $expand: "Photo",
  });
};

export const getMatricesFromGuid = async (guid: string) => {
  return fetchRockData("AttributeMatrices", {
    $filter: `Guid eq guid'${guid}'`,
  });
};

export const getMatrixItemsFromId = async (id: string) => {
  return fetchRockData("AttributeMatrixItems", {
    $filter: `AttributeMatrix/${getIdentifierType(id).query}`,
    loadAttributes: "simple",
  });
};

const formatTime = (time: string) => {
  const date = new Date(`1970-01-01T${time}`);
  return format(date, "h:mm a");
};

export const fetchWeekdaySchedules = async (matrixGuid: any) => {
  //Grab weekdaySchedule attribute matrix items from guid
  const matrices = await getMatricesFromGuid(matrixGuid);

  if (matrices?.length === 0) return null;

  const matrixItems = await getMatrixItemsFromId(matrices?.id);

  //Grab day, time, title, url from matrixItems
  let matrixItemValues = matrixItems?.flatMap((n: any) => {
    const { attributeValues } = n;
    const day = lowerCase(attributeValues?.day?.valueFormatted);

    // Check if the day is valid
    if (!day || day.trim() === "") {
      console.warn("Invalid day detected", day);
      return []; // Return an empty array for invalid entries
    }

    // If there are multiple days, split them into separate entries
    if (includes(day, " ")) {
      const days = day.split(" ");
      return days.map((d) => ({
        [d]: {
          time: formatTime(n?.attributeValues?.time?.value),
          title: n?.attributeValues?.event?.value,
          url: n?.attributeValues?.url?.value,
        },
      }));
    }

    // Return the single day entry
    return {
      [day]: {
        time: formatTime(n?.attributeValues?.time?.value),
        title: n?.attributeValues?.event?.value,
        url: n?.attributeValues?.url?.value,
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
    const key = Object.keys(cur)[0]; // The day (e.g., "tuesday")
    const value = cur[key]; // The event details

    if (!key || !value) {
      console.warn("Invalid key or value", key, value);
      return acc; // Skip invalid entries
    }

    // Initialize the day array if it doesn't exist
    if (!acc[key]) {
      acc[key] = [];
    }

    // Add the event details to the day
    acc[key].push(value);

    return acc;
  }, {});
};
