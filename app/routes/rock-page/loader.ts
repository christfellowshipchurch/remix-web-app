import { type LoaderFunctionArgs } from 'react-router-dom';
import { validateRockUrl } from '~/lib/.server/validate-rock-url';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = validateRockUrl(request);
  return { url };
}
