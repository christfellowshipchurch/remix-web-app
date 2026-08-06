import {
  AttributeMatrixItem,
  attributeProps,
  attributeValuesProps,
} from '../types/rock-types';
import { createImageUrlFromGuid } from '~/lib/utils';
import { fetchRockData } from './fetch-rock-data';
import { AttributeMatrix } from '../types/rock-types';

/**
 * Escapes a string value for safe interpolation into an OData $filter expression.
 * OData encodes a literal single-quote inside a string operand as two single-quotes ('').
 */
export const escapeOData = (value: string): string => value.replace(/'/g, "''");

export const attributeIsImage = ({
  key,
  attributeValues,
}: {
  key: string;
  attributeValues: attributeValuesProps;
}): boolean => {
  return (
    key.toLowerCase().includes('image') &&
    typeof attributeValues[key].value === 'string'
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
    }),
  );
  return imageKeys.map((key) =>
    createImageUrlFromGuid(attributeValues[key].value),
  );
};

/**
 * Rock's OData parser rejects a query once it exceeds a node count of 100, and
 * each `(Id eq N)` clause costs 5 nodes — so more than 20 ids in one $filter
 * comes back as a 400 and the whole matrix silently disappears. Fetch in
 * batches and reorder afterwards, since $orderby only sorts within a request.
 */
const MATRIX_ITEM_BATCH_SIZE = 20;

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
        $expand: 'AttributeMatrixItems',
      },
    });

    if (!attributeMatrix) {
      console.warn(
        `Attribute matrix not found with guid: ${attributeMatrixGuid}`,
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
        `No matrix items found for attribute matrix guid: ${attributeMatrixGuid}`,
      );
      return [];
    }

    const idBatches: number[][] = [];
    for (let i = 0; i < matrixItems.length; i += MATRIX_ITEM_BATCH_SIZE) {
      idBatches.push(
        matrixItems
          .slice(i, i + MATRIX_ITEM_BATCH_SIZE)
          .map((item: { id: number }) => item.id),
      );
    }

    //  now we query the matrix items for the attribute values
    const batches = await Promise.all(
      idBatches.map((ids) =>
        fetchRockData({
          endpoint: `AttributeMatrixItems`,
          queryParams: {
            $filter: ids.map((id) => `(Id eq ${id})`).join(' or '),
            $orderby: 'Order',
            loadAttributes: 'simple',
          },
        }),
      ),
    );

    // Normalize response: fetchRockData returns a single object if array.length === 1
    // We need to ensure we always return an array
    const normalizedItems: AttributeMatrixItem[] = batches.flatMap((batch) => {
      if (!batch) return [];
      return Array.isArray(batch) ? batch : [batch];
    });

    if (normalizedItems.length === 0) {
      console.warn(
        `No expanded matrix items returned for guid: ${attributeMatrixGuid}`,
      );
      return [];
    }

    if (normalizedItems.length !== matrixItems.length) {
      console.warn(
        `Attribute matrix ${attributeMatrixGuid}: expected ${matrixItems.length} expanded items but got ${normalizedItems.length}`,
      );
    }

    // $orderby only sorts within each batch, so restore the matrix-wide order.
    return normalizedItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error(
      `Error fetching attribute matrix items for guid ${attributeMatrixGuid}: content depending on this matrix will render empty.`,
      error,
    );
    // Return empty array instead of throwing to prevent page breakage
    return [];
  }
};
