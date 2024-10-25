import { clsx, type ClassValue } from "clsx";
import { camelCase, mapKeys, mapValues } from "lodash";
import { twMerge } from "tailwind-merge";

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

export const enforceProtocol = (uri: string) =>
  uri?.startsWith("//") ? `https:${uri}` : uri;

export const createImageUrlFromGuid = (uri: string) =>
  uri?.split("-")?.length === 5
    ? `${process.env.CLOUDFRONT}/GetImage.ashx?guid=${uri}`
    : enforceProtocol(uri);

export const getIdentifierType = (identifier: any) => {
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

// due to CSS rendering issues, we needed to move these styles to a separate function to show correctly...
export const heroBgImgStyles = (image?: string) => {
  return {
    backgroundImage: image?.includes("https")
      ? `url(${image}&width=1200)`
      : `url(${image}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

type ShareMessages = {
  title: string;
  url: string;
  shareMessages: {
    title?: string;
    faceBook: string;
    twitter: string;
    email: {
      subject: string;
      body: string;
    };
    sms: string;
  };
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
