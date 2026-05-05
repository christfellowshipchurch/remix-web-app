import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';

/** Legacy route: `/volunteer/:path` → redirect to `/volunteer/outreach/:path`. */
export async function loader({ params }: LoaderFunctionArgs) {
  const path = params.path ?? '';
  throw redirect(`/volunteer/outreach/${path}`, 301);
}

export default function LegacyVolunteerRedirect() {
  return null;
}
