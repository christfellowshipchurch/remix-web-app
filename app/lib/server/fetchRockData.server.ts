import { createImageUrlFromGuid, normalize } from "~/lib/utils";
import { attributeProps, attributeValuesProps } from "../types/rockTypes";

const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const fetchRockData = async (
  endpoint: string,
  queryParams: Record<string, string>
) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${baseUrl}${endpoint}?${queryString}`;

  const res = await fetch(url, {
    headers: {
      ...defaultHeaders,
    },
  });

  const data = await res
    .json()
    .then((data) => normalize(data))
    // The following line returns the first element of the array if it is an array, otherwise it returns the data object.
    .then((data: any) =>
      Array.isArray(data) && data?.length === 1 ? data[0] : data
    );

  return data;
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
