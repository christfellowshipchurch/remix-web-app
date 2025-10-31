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
  const attributeMatrix: AttributeMatrix = await fetchRockData({
    endpoint: `AttributeMatrices`,
    queryParams: {
      $filter: `Guid eq guid'${attributeMatrixGuid}'`,
      $expand: "AttributeMatrixItems",
    },
  });

  if (!attributeMatrix) {
    throw new Error(
      `Attribute matrix not found with guid: ${attributeMatrixGuid}`
    );
  }

  const matrixItems = attributeMatrix.attributeMatrixItems;

  //  now we query the matrix items for the attribute values
  const matrixItemsExpanded: AttributeMatrixItem[] = await fetchRockData({
    endpoint: `AttributeMatrixItems`,
    queryParams: {
      $filter: matrixItems
        .map((item: { id: number }) => `(Id eq ${item.id})`)
        .join(" or "),
      loadAttributes: "simple",
    },
  });

  return matrixItemsExpanded;
};
