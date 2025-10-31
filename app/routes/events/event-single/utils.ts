import { parse, format } from "date-fns";
import { AttributeMatrixItem } from "~/lib/types/rock-types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { SessionRegistrationCardType } from "./types";
import { icons } from "~/lib/icons";

export const fetchEventData = async (eventPath: string) => {
  const rockData = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Url",
      $filter: "Status eq 'Approved' and ContentChannelId eq 186",
      value: eventPath,
      loadAttributes: "simple",
    },
  });

  if (!rockData || rockData.length === 0) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (rockData.length > 1) {
    console.error(
      `More than one article was found with the same path: /events/${eventPath}`
    );
    return rockData[0];
  }

  return rockData;
};

export const mapSessionScheduleCards = async (
  sessionScheduleCardsRockItems: AttributeMatrixItem[]
): Promise<SessionRegistrationCardType[]> => {
  return await Promise.all(
    sessionScheduleCardsRockItems.map(
      async (item): Promise<SessionRegistrationCardType> => {
        const rockCampus = await fetchRockData({
          endpoint: "Campuses",
          queryParams: {
            $filter: `Guid eq guid'${item.attributeValues?.campus?.value}'`,
            loadAttributes: "simple",
            $expand: "Location",
          },
        });

        if (!rockCampus) {
          throw new Error(
            `Campus not found with url: ${item.attributeValues?.campus?.value}`
          );
        }

        const campusAddress =
          rockCampus.location.street1 +
          " " +
          rockCampus.location.city +
          " " +
          rockCampus.location.state +
          " " +
          String(rockCampus.location.postalCode ?? "").substring(0, 5);

        let title = rockCampus.name;
        let description = campusAddress;
        let icon = "map";

        if (rockCampus.name.includes("Online")) {
          title = "Online Experience";
          description = "Join us from anywhere";
          icon = "globe";
        }

        const { programDate, programTime } = parseProgramDateTime(
          item.attributeValues?.sessionDateTime?.valueFormatted ?? ""
        );

        const partyTime = parsePartyTime(
          item.attributeValues?.partyTime?.value || ""
        );

        return {
          icon: (icon as keyof typeof icons) || "map",
          title: title || "",
          description: description || "",
          date: programDate || "",
          programTime: programTime || "",
          partyTime: partyTime || "",
          additionalInfo: item.attributeValues?.additionalInfo?.value || "",
          url: item.attributeValues?.ticketsUrl?.value || "",
        };
      }
    )
  );
};

export const parsePartyTime = (partyTimeValue: string) => {
  const inputFormat = "HH:mm:ss";
  const referenceDate = new Date();
  const parsedTime = parse(partyTimeValue, inputFormat, referenceDate) || null;
  let partyTime = "";
  if (parsedTime && !isNaN(parsedTime.getTime())) {
    const formattedTime = format(parsedTime, "ha").toLowerCase();
    partyTime = formattedTime;
  }

  return partyTime;
};

export const parseProgramDateTime = (programDateTime: string) => {
  const programTime = programDateTime.split(" at ")[1]?.toLowerCase() ?? "";
  let programDate = programDateTime.split(" at ")[0];

  const addDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const match = programDate.match(/(\d{1,2})$/);
  const dayNumber = match ? parseInt(match[1], 10) : null;

  programDate =
    dayNumber !== null
      ? `${programDate}${addDaySuffix(dayNumber)}`
      : programDate;

  return { programDate, programTime };
};
