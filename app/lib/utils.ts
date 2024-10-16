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
