import { fetchRockData, TTL } from '~/lib/.server/fetch-rock-data';
import { createImageUrlFromGuid } from '~/lib/utils';
import type { VolunteerAtChurchResource } from './types';

const DREAM_TEAM_BUCKETS_DEFINED_TYPE_ID = 616;

type RawDefinedValue = {
  guid?: string;
  value?: string;
  description?: string;
  attributeValues?: {
    publicDescription?: { value?: string };
    label?: { value?: string };
    image?: { value?: string };
  };
};

function mapDefinedValueToResource(
  item: RawDefinedValue,
): VolunteerAtChurchResource | null {
  const guid = item.guid?.trim();
  if (!guid) return null;

  const name = item.value?.trim() ?? '';
  const description =
    item.attributeValues?.publicDescription?.value?.trim() ||
    item.description?.trim() ||
    '';
  const tag = item.attributeValues?.label?.value?.trim() ?? '';
  const imageGuid = item.attributeValues?.image?.value?.trim() ?? '';
  const image = imageGuid ? createImageUrlFromGuid(imageGuid) : '';

  // Hide buckets that don't have a description, tag, or image(e.g. "Not Sure Yet?" bucket)
  if (!description || !tag || !image) return null;

  const pathname = `/volunteer/${guid}`;

  return { name, description, tag, image, pathname };
}

export async function fetchDreamTeamBuckets(): Promise<
  VolunteerAtChurchResource[]
> {
  try {
    const raw = await fetchRockData({
      endpoint: 'DefinedValues',
      queryParams: {
        $filter: `DefinedTypeId eq ${DREAM_TEAM_BUCKETS_DEFINED_TYPE_ID} and IsActive eq true`,
        $orderby: 'Order',
        loadAttributes: 'simple',
      },
      ttl: TTL.NONE,
    });

    const items: RawDefinedValue[] = Array.isArray(raw)
      ? raw
      : raw
        ? [raw]
        : [];

    return items.reduce<VolunteerAtChurchResource[]>((acc, item) => {
      const mapped = mapDefinedValueToResource(item);
      if (mapped) acc.push(mapped);
      return acc;
    }, []);
  } catch (error) {
    console.error('Error fetching Dream Team Buckets:', error);
    return [];
  }
}
