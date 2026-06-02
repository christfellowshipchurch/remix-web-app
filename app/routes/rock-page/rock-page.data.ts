import { ROCK_PUBLIC_SITE_ORIGIN } from '~/lib/rock-config';
import { ROCK_PARENT_RESIZE_QUERY_PARAM } from '~/lib/rock-iframe-resize';

// Server-side registry for named Rock embeds. Keep Rock paths and allowed
// query params here so callers pass intent, not arbitrary destination URLs.
//
// Cross-origin auto-height: Rock pages must include the resize script when
// ParentResize=1 is present. See app/lib/rock-iframe-resize.ts.

// Page IDs for Rock pages that this app embeds by name.
export const CHURCH_OPPORTUNITY_APPLICATION_PAGE_ID = '5886';

// Keys for the embeds.
export const ROCK_PAGE_EMBED_KEYS = {
  churchOpportunity: 'church-opportunity',
} as const;

type RockPageEmbedKey =
  (typeof ROCK_PAGE_EMBED_KEYS)[keyof typeof ROCK_PAGE_EMBED_KEYS];

type RockPageEmbedConfig = {
  path: string;
  queryParams: Record<string, string>;
};

// Config for the embeds.
const ROCK_PAGE_EMBEDS: Record<RockPageEmbedKey, RockPageEmbedConfig> = {
  [ROCK_PAGE_EMBED_KEYS.churchOpportunity]: {
    path: `/page/${CHURCH_OPPORTUNITY_APPLICATION_PAGE_ID}`,
    queryParams: {
      opportunityId: 'OpportunityId',
    },
  },
};

export function buildRockPageEmbedUrl(
  embedKey: string,
  searchParams: URLSearchParams,
): string {
  const embed = ROCK_PAGE_EMBEDS[embedKey as RockPageEmbedKey];

  if (!embed) {
    throw new Response('Embed not supported', { status: 400 });
  }

  const url = new URL(embed.path, ROCK_PUBLIC_SITE_ORIGIN);

  for (const [queryParam, rockParam] of Object.entries(embed.queryParams)) {
    const value = searchParams.get(queryParam)?.trim();

    if (!value) {
      throw new Response(`${queryParam} parameter required`, { status: 400 });
    }

    url.searchParams.set(rockParam, value);
  }

  url.searchParams.set(ROCK_PARENT_RESIZE_QUERY_PARAM, '1');

  return url.toString();
}

export function buildChurchOpportunityApplicationUrl(
  opportunityId: string,
): string {
  return buildRockPageEmbedUrl(
    ROCK_PAGE_EMBED_KEYS.churchOpportunity,
    new URLSearchParams({ opportunityId }),
  );
}
