import {
  AttributeMatrixItem,
  attributeProps,
  attributeValuesProps,
} from "../types/rock-types";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchRockData } from "./fetch-rock-data";
import { AttributeMatrix } from "../types/rock-types";

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

export const getAttributeMatrixItems = async ({
  attributeMatrixGuid,
}: {
  attributeMatrixGuid: string;
}): Promise<AttributeMatrixItem[]> => {
  try {
    const attributeMatrix: AttributeMatrix = await fetchRockData({
      endpoint: `AttributeMatrices`,
      queryParams: {
        $filter: `Guid eq guid'${attributeMatrixGuid}'`,
        $expand: "AttributeMatrixItems",
      },
    });

    if (!attributeMatrix) {
      console.warn(
        `Attribute matrix not found with guid: ${attributeMatrixGuid}`
      );
      return [];
    }

    const matrixItems = attributeMatrix.attributeMatrixItems;

    // Check if matrixItems exists and is an array
    if (
      !matrixItems ||
      !Array.isArray(matrixItems) ||
      matrixItems.length === 0
    ) {
      console.warn(
        `No matrix items found for attribute matrix guid: ${attributeMatrixGuid}`
      );
      return [];
    }

    //  now we query the matrix items for the attribute values
    const matrixItemsExpanded = await fetchRockData({
      endpoint: `AttributeMatrixItems`,
      queryParams: {
        $filter: matrixItems
          .map((item: { id: number }) => `(Id eq ${item.id})`)
          .join(" or "),
        loadAttributes: "simple",
      },
    });

    // Normalize response: fetchRockData returns a single object if array.length === 1
    // We need to ensure we always return an array
    if (!matrixItemsExpanded) {
      console.warn(
        `No expanded matrix items returned for guid: ${attributeMatrixGuid}`
      );
      return [];
    }

    // Convert single object to array if needed
    const normalizedItems: AttributeMatrixItem[] = Array.isArray(
      matrixItemsExpanded
    )
      ? matrixItemsExpanded
      : [matrixItemsExpanded];

    return normalizedItems;
  } catch (error) {
    console.error(
      `Error fetching attribute matrix items for guid ${attributeMatrixGuid}:`,
      error
    );
    // Return empty array instead of throwing to prevent page breakage
    return [];
  }
};
