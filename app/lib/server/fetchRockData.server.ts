import { createImageUrlFromGuid, normalize } from "~/lib/utils";
import { attributeProps, attributeValuesProps } from "../types/rockTypes";

const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const fetchRockData = async (
  endpoint: string,
  queryParams: Record<string, string>,
  returnFirstItem: boolean = true
) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${baseUrl}${endpoint}?${queryString}`;

    const res = await fetch(url, {
      headers: {
        ...defaultHeaders,
      },
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      throw new Error(
        `⚠️ Error Fetching Rock Data status: ${res.status}, details: ${errorDetails}, path: ${url}`
      );
    }

    const data = await res
      .json()
      .then((data) => normalize(data))
      .then((data: any) =>
        returnFirstItem && Array.isArray(data) ? data[0] : data
      );

    return data;
  } catch (error) {
    console.error("Error fetching rock data:", error);
    throw error;
  }
};

export const attributeIsImage = ({
  key,
  attributeValues,
}: {
  key: string;
  attributeValues: attributeValuesProps;
}): boolean => {
  return (
    key.toLowerCase().includes("image") &&
    typeof attributeValues[key].value === "string"
  ); // looks like an image url
};

export const getImages = ({
  attributeValues,
  attributes,
}: {
  attributeValues: attributeValuesProps;
  attributes: attributeProps;
}) => {
  const imageKeys = Object.keys(attributes).filter((key) =>
    attributeIsImage({
      key,
      attributeValues,
    })
  );
  return imageKeys.map((key) =>
    createImageUrlFromGuid(attributeValues[key].value)
  );
};
