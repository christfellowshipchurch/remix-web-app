import { type LoaderFunctionArgs } from 'react-router-dom';
import {
  validateRockUrl,
  validateRockUrlString,
} from '~/lib/.server/validate-rock-url';
import {
  buildRockPageEmbedUrl,
  ROCK_PAGE_EMBED_KEYS,
} from './rock-page.data';

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const embed = requestUrl.searchParams.get('embed')?.trim();
  const hasOpportunityId = requestUrl.searchParams.has('opportunityId');

  if (embed) {
    return {
      url: validateRockUrlString(
        buildRockPageEmbedUrl(embed, requestUrl.searchParams),
      ),
    };
  }

  if (hasOpportunityId) {
    return {
      url: validateRockUrlString(
        buildRockPageEmbedUrl(
          ROCK_PAGE_EMBED_KEYS.churchOpportunity,
          requestUrl.searchParams,
        ),
      ),
    };
  }

  return { url: validateRockUrl(request) };
}
