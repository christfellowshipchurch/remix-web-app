import { type LoaderFunctionArgs } from 'react-router-dom';
import {
  validateRockUrl,
  validateRockUrlString,
} from '~/lib/.server/validate-rock-url';
import { buildChurchOpportunityApplicationUrl } from './rock-page.data';

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const hasOpportunityId = requestUrl.searchParams.has('opportunityId');
  const opportunityId = requestUrl.searchParams.get('opportunityId')?.trim();

  if (hasOpportunityId && !opportunityId) {
    throw new Response('OpportunityId parameter required', { status: 400 });
  }

  const url =
    hasOpportunityId && opportunityId
      ? validateRockUrlString(
          buildChurchOpportunityApplicationUrl(opportunityId),
        )
      : validateRockUrl(request);

  return { url };
}
