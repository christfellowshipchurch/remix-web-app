import { createImageUrlFromGuid, normalize } from "~/lib/utils";
import { attributeProps, attributeValuesProps } from "../types/rock-types";
import redis from "./redis-config";
interface RockDataRequest {
  endpoint: string;
  body: Record<string, unknown>;
}

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
 * @param cache - if true, the data will be cached. Default is true.
 * @returns Either the response data as JSON(array if multiple items, object if single item) or an error
 */

/**
 * Interface for Rock API query parameters
 */
interface RockQueryParams {
  /** Expands related entities inline */
  $expand?: string;

  /** Filters results based on Boolean condition (e.g. ContentChannelId eq 63) */
  $filter?: string;

  /** Selects which properties to include in response */
  $select?: string;

  /** Sorts results (e.g. StartDateTime desc) */
  $orderby?: string;

  /** Returns only first n results */
  $top?: string;

  /** Skips first n results */
  $skip?: string;

  /** Specify 'simple' or 'expanded' to load attributes */
  loadAttributes?: "simple" | "expanded";

  /** Comma-delimited list of attribute keys to limit specific attributes */
  attributeKey?: string;

  /** Value to filter by */
  value?: string;
}

export const fetchRockData = async ({
  endpoint,
  queryParams = {},
  customHeaders = {},
  cache = true,
}: {
  endpoint: string;
  queryParams?: RockQueryParams;
  customHeaders?: Record<string, string>;
  cache?: boolean;
}) => {
  const cacheKey = `${endpoint}:${JSON.stringify(queryParams)}`;

  // Clear cache if cache is disabled
  if (redis && !cache) {
    try {
      await redis.del(cacheKey);
    } catch {
      console.error("⚠️ Redis cache deletion failed");
    }
  }

  // Try to use Redis cache if available and caching is enabled
  if (redis && cache) {
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch {
      console.error(
        "⚠️ Redis cache retrieval failed, falling back to API call"
      );
    }
  }

  try {
    const queryString = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();
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
      .then((data: unknown) =>
        Array.isArray(data) && data?.length === 1 ? data[0] : data
      );

    // Try to cache the response if Redis is available and caching is enabled
    if (redis && cache) {
      try {
        await redis.set(cacheKey, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
      } catch {
        console.error("⚠️ Redis cache storage failed");
      }
    }

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
 * Posts data to a Rock endpoint
 * @param params.endpoint - Rock endpoint to post to
 * @param params.body - the body of the post request
 * @returns response body as JSON
 */
export const postRockData = async ({ endpoint, body }: RockDataRequest) => {
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
};

/**
 * Updates data at a Rock endpoint using PATCH
 * @param params.endpoint - Rock endpoint to patch
 * @param params.body - the body of the patch request
 * @returns response status code
 */
export const patchRockData = async ({ endpoint, body }: RockDataRequest) => {
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

/**
 * Deletes a specific cache key from Redis
 * @param endpoint - The Rock endpoint that was cached
 * @param queryParams - The query parameters that were used in the original request
 * @returns boolean indicating whether the deletion was successful
 */
export const deleteCacheKey = async ({
  endpoint,
  queryParams = {},
}: {
  endpoint: string;
  queryParams?: RockQueryParams;
}): Promise<boolean> => {
  if (!redis) {
    console.error("⚠️ Redis not available for cache deletion");
    return false;
  }

  try {
    const cacheKey = `${endpoint}:${JSON.stringify(queryParams)}`;
    await redis.del(cacheKey);
    return true;
  } catch (error) {
    console.error("Error deleting cache key:", error);
    return false;
  }
};
