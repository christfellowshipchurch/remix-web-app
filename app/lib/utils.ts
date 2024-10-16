import { clsx, type ClassValue } from "clsx";
import { camelCase, mapKeys, mapValues } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalize(data: object): object {
  if (Array.isArray(data)) return data.map((n) => normalize(n));
  if (typeof data !== "object" || data === null) return data;
  const normalizedValues = mapValues(data, (n) => normalize(n));
  return mapKeys(normalizedValues, (value, key: string) => camelCase(key));
}

export const enforceProtocol = (uri: string) =>
  uri.startsWith("//") ? `https:${uri}` : uri;

export const createImageUrlFromGuid = (uri: string) =>
  uri.split("-").length === 5
    ? `${process.env.CLOUDFRONT}/GetImage.ashx?guid=${uri}`
    : enforceProtocol(uri);
