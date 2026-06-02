import { ROCK_PUBLIC_SITE_ORIGIN } from '~/lib/rock-config';

export const CHURCH_OPPORTUNITY_APPLICATION_PAGE_ID = '5886';

export function buildChurchOpportunityApplicationUrl(
  opportunityId: string,
): string {
  const url = new URL(
    `/page/${CHURCH_OPPORTUNITY_APPLICATION_PAGE_ID}`,
    ROCK_PUBLIC_SITE_ORIGIN,
  );
  url.searchParams.set('OpportunityId', opportunityId);
  return url.toString();
}
