import { clsx, type ClassValue } from "clsx";
import lodash from "lodash";
import { twMerge } from "tailwind-merge";
import { ShareMessages } from "./types/messaging";
import {
  addMinutes,
  setMinutes,
  setHours,
  setSeconds,
  parseISO,
  format,
  nextSunday,
} from "date-fns";

const { camelCase, isString, mapKeys, mapValues, uniqueId } = lodash;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Server Utils */
export function normalize(data: object): object {
  if (Array.isArray(data)) return data.map((n) => normalize(n));
  if (typeof data !== "object" || data === null) return data;
  const normalizedValues = mapValues(data, (n) => normalize(n));
  return mapKeys(normalizedValues, (value, key: string) => camelCase(key));
}

interface FieldObject {
  field: string;
  value: unknown;
}

export const fieldsAsObject = (fields: FieldObject[]) =>
  fields.reduce(
    (accum, { field, value }) => ({
      ...accum,
      [field]: typeof value === "string" ? value.trim() : value,
    }),
    {} as Record<string, unknown>
  );

export const enforceProtocol = (uri: string) =>
  uri?.startsWith("//") ? `https:${uri}` : uri;

export const createImageUrlFromGuid = (uri: string) =>
  uri?.split("-")?.length === 5
    ? `${process.env.CLOUDFRONT}/GetImage.ashx?guid=${uri}`
    : enforceProtocol(uri);

export const getIdentifierType = (identifier: string | number) => {
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const intRegex = /\D/g;
  const stringId = identifier?.toString();

  if (stringId?.match(guidRegex)) {
    return {
      type: "guid",
      value: identifier,
      query: `Guid eq (guid'${identifier}')`,
    };
  }
  if (!stringId?.match(intRegex)) {
    return { type: "int", value: identifier, query: `Id eq ${identifier}` };
  }

  return { type: "custom", value: identifier, query: null };
};

export const shareMessaging = ({
  title,
  shareMessages,
  url,
}: ShareMessages) => {
  const defaultShareMessages = {
    title: `${title}`,
    faceBook: `Check out this article from Christ Fellowship Church!`,
    twitter: `${title} at Christ Fellowship Church`,
    email: {
      subject: `${title} - Christ Fellowship Church`,
      body: `I thought you might be interested in this article from Christ Fellowship: ${url} \n\n`,
    },
    sms: `I thought you might be interested in this article from Christ Fellowship: ${url}`,
  };
  const messages = {
    ...defaultShareMessages,
    ...shareMessages,
  };
  return messages;
};
interface EventDetails {
  title: string;
  description: string;
  address: string;
  startTime: string | Date;
  endTime: string | Date;
  url?: string;
}

export const icsLink = (event: EventDetails): string => {
  const { title, description, address, url } = event;
  let { startTime, endTime } = event;

  if (isString(startTime) || isString(endTime)) {
    startTime = parseISO(startTime as string);
    endTime = parseISO(endTime as string);
  }

  // Ensure dates are in the correct timezone
  const formatDateInTimezone = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const icsString = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//www.cf.church//Christ Fellowship Church",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
    `UID:${uniqueId()}-@christfellowship.church`,
    `DTSTART;TZID=America/New_York:${formatDateInTimezone(startTime)}`,
    `DTEND;TZID=America/New_York:${formatDateInTimezone(endTime)}`,
    `SUMMARY:${title}`,
    `URL:${url ?? document?.URL ?? "https://www.christfellowship.church"}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  // We use blob method and removed `charset=utf8` in order to be compatible with Safari IOS
  const blob = new Blob([icsString], { type: "text/calendar" });
  const calendarLink = window.URL.createObjectURL(blob);

  return calendarLink;
};

function parseTimeAsInt(_time: string) {
  const time = _time?.toString().trim().toUpperCase();
  const a = time.match(/(AM)|(PM)/g)?.join();
  const [hour, minute] = time
    .replace(/(AM)|(PM)/g, "")
    .trim()
    .split(":")
    .map((n) => parseInt(n));
  const hour24 = a === "PM" ? hour + 12 : hour;

  return [hour24, minute];
}

interface ServiceTime {
  day: string;
  time: string;
}

export function icsLinkEvents({
  serviceTimes,
  address,
  campusName,
  url,
}: {
  serviceTimes: ServiceTime[];
  address: string;
  campusName: string;
  url?: string;
}) {
  return serviceTimes.map(({ day: _day, time }) => {
    const now = new Date();
    const [hour, minute] = parseTimeAsInt(time);
    let sunday = nextSunday(now);
    sunday = setMinutes(sunday, minute ?? 0);
    sunday = setHours(sunday, hour ?? 0);
    sunday = setSeconds(sunday, 0);

    return {
      label: `${time}`,
      event: {
        title:
          campusName !== "Trinity"
            ? `Sunday service at Christ Fellowship Church in ${campusName}`
            : "Sunday service at Trinity Church by Christ Fellowship",
        description: `Join us this Sunday!`,
        address,
        startTime: sunday,
        endTime: addMinutes(sunday, 90),
        url: url ? url : "https://www.christfellowship.church",
      },
    };
  });
}

export const googleLink =
  "https://play.google.com/store/apps/details?id=com.subsplash.thechurchapp.s_BSVMPR&pcampaignid=web_share";
export const appleLink =
  "https://apps.apple.com/us/app/christ-fellowship-app/id785979426";

// Utility function to detect Apple devices
export const isAppleDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|macintosh/.test(userAgent);
};

export const isValidZip = (zip: string) => /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip);

export const latLonDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

/**
 * Get the first paragraph of a given HTML string
 * @param html - The HTML string to parse
 * @returns The first paragraph of the HTML string
 */
export const getFirstParagraph = (html: string): string => {
  if (typeof window === "undefined") {
    // Server-side: Use a simple regex to extract text between <p> tags
    const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
    return match ? match[1].replace(/<[^>]+>/g, "") : "";
  }

  // Client-side: Use DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const firstParagraph = doc.querySelector("p");
  return firstParagraph?.textContent || "";
};

export const parseRockKeyValueList = (
  input: string
): {
  title: string;
  url: string;
}[] => {
  if (!input || input === "") return [];

  return input.split("|").map((item) => {
    const [title, url] = item.split("^");
    return {
      title: title.trim(),
      url: url.trim(),
    };
  });
};

export const parseRockValueList = (input: string): string[] => {
  if (!input?.trim()) return [];
  // Remove a trailing pipe and filter out any empty results
  return input
    .split("|")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export type dayTimes = {
  day: string;
  hour: string[];
};

export const formattedServiceTimes = (serviceTimes: string) =>
  serviceTimes.split("|").reduce((acc: dayTimes[], time: string) => {
    const [day, hour] = time.split("^");
    const existingDay = acc.find((item) => item.day === day.trim());

    if (existingDay) {
      existingDay.hour.push(hour);
    } else {
      acc.push({ day, hour: [hour] });
    }

    return acc;
  }, []);

export const ensureArray = <T>(data: T | T[]): T[] => {
  return Array.isArray(data) ? data : [data];
};

export const getImageUrl = (id: string) => {
  return `https://cloudfront.christfellowship.church/GetImage.ashx?id=${id}`;
};

export const calculateReadTime = (content: string): number => {
  const words = content?.split(" ")?.length ?? 0;
  const readTime = Math.round(words / 200);
  return readTime === 0 ? 1 : readTime;
};
