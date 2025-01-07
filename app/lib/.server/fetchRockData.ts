import { createImageUrlFromGuid, normalize } from "~/lib/utils";
import { attributeProps, attributeValuesProps } from "../types/rockTypes";

const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

/**
 *
 * @param endpoint - the Rock endpoint to fetch data from
 * @param queryParams - query parameters to append to the request
 * @param customHeaders - additional headers to include in the request eg. Rock Cookie
 * @returns Either the response data as JSON(array if multiple items, object if single item) or an error
 */
export const fetchRockData = async (
  endpoint: string,
  queryParams: Record<string, string>,
  customHeaders: Record<string, string> = {}
) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${baseUrl}${endpoint}?${queryString}`;

    const res = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...customHeaders,
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
        Array.isArray(data) && data?.length === 1 ? data[0] : data
      ); // if only one item, return it directly

    return data;
  } catch (error) {
    console.error("Error fetching rock data:", error);
    throw error;
  }
};

/**
 *
 * @param endpoint - a string representing the Rock endpoint to delete
 * @returns the status code of the response
 */
export const deleteRockData = async (endpoint: string) => {
  try {
    const response = await fetch(`${process.env.ROCK_API}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization-Token": `${process.env.ROCK_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error details:", errorDetails);
      throw new Error(
        `Failed to delete resource: ${response.status}, details: ${errorDetails}`
      );
    }

    return response.status;
  } catch (error) {
    console.error("Error in deleteRockData:", error);
    throw error;
  }
};

/**
 *
 * @param endpoint - Rock endpoint to post to
 * @param body - the body of the post request
 * @returns response body as JSON
 */
export const postRockData = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(`${process.env.ROCK_API}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization-Token": `${process.env.ROCK_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to post data: ${response.status}, details: ${errorDetails}`
      );
    }

    const responseBody = await response.text();
    if (!responseBody) {
      return {};
    }

    return JSON.parse(responseBody);
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param endpoint - Rock endpoint to patch
 * @param body - the body of the patch request
 * @returns response body as JSON
 */
export const patchRockData = async (endpoint: string, body: any) => {
  const response = await fetch(`${process.env.ROCK_API}/${endpoint}`, {
    method: "PATCH",
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Failed to patch data: ${response.status}, details: ${errorDetails}`
    );
  }

  return response.status;
};

// Todo : move to utils
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
  const imageKeys = attributes
    ? Object.keys(attributes).filter((key) =>
        attributeIsImage({
          key,
          attributeValues,
        })
      )
    : [];

  if (imageKeys) {
    return imageKeys.map((key) =>
      createImageUrlFromGuid(attributeValues[key].value)
    );
  }
};
