/**
 * Fetches the top N unique searches from Algolia Analytics API.
 * Requires an API key with `analytics` ACL (Premium/Elevate plan).
 *
 * Env:
 * - ALGOLIA_ANALYTICS_API_KEY (or ALGOLIA_SEARCH_API_KEY if it has analytics ACL)
 */

const CONTENT_INDEX = 'dev_contentItems';

function getAnalyticsBase(): string {
  return `https://analytics.us.algolia.com`;
}

export async function fetchTopSearches(
  appId: string | undefined,
  apiKey: string | undefined,
  limit = 12,
): Promise<string[]> {
  if (!appId || !apiKey) return [];

  const base = getAnalyticsBase();
  const params = new URLSearchParams({
    index: CONTENT_INDEX,
    limit: String(limit),
    orderBy: 'searchCount',
    direction: 'desc',
  });

  try {
    const res = await fetch(`${base}/2/searches?${params}`, {
      headers: {
        'x-algolia-application-id': appId,
        'x-algolia-api-key': apiKey,
        accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 402 || res.status === 403) {
        // Analytics not enabled or key without analytics ACL
        return [];
      }
      return [];
    }

    const data = (await res.json()) as {
      searches?: Array<{ search?: string }>;
    };
    const searches = data?.searches ?? [];
    return searches
      .map((s) => (typeof s.search === 'string' ? s.search.trim() : ''))
      .filter(Boolean);
  } catch {
    return [];
  }
}
