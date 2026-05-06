import { fetchRockData, TTL } from '~/lib/.server/fetch-rock-data';

import type { ChurchRole } from './types';

type RawConnectionOpportunity = {
  guid?: string;
  name?: string;
  summary?: string;
  description?: string;
};

/** Strips HTML tags and returns the first sentence of the resulting plain text. */
function firstSentenceFromHtml(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const match = text.match(/^.+?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

function mapOpportunityToRole(
  item: RawConnectionOpportunity,
): ChurchRole | null {
  const id = item.guid?.trim();
  if (!id) return null;

  const title = item.name?.trim();
  if (!title) return null;

  const description = item.summary?.trim()
    ? firstSentenceFromHtml(item.summary.trim())
    : '';
  const expandedDescription = item.description?.trim() || undefined;

  return { id, title, description, expandedDescription };
}

export async function fetchChurchRolesByPreferenceAreaGuid(
  bucketGuid: string,
): Promise<ChurchRole[]> {
  try {
    const raw = await fetchRockData({
      endpoint: 'ConnectionOpportunities/GetByAttributeValue',
      queryParams: {
        attributeKey: 'preferenceArea',
        value: bucketGuid,
      },
      ttl: TTL.SHORT,
    });

    const items: RawConnectionOpportunity[] = Array.isArray(raw)
      ? raw
      : raw
        ? [raw]
        : [];

    return items.reduce<ChurchRole[]>((acc, item) => {
      const mapped = mapOpportunityToRole(item);
      if (mapped) acc.push(mapped);
      return acc;
    }, []);
  } catch (error) {
    console.error(
      'Error fetching church roles by preference area guid:',
      error,
    );
    return [];
  }
}
