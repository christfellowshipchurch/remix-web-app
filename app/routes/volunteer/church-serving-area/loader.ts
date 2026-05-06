import type { LoaderFunctionArgs } from 'react-router';

import { fetchDreamTeamBucketByGuid } from '../dream-team-buckets.server';
import { fetchChurchRolesByPreferenceAreaGuid } from './church-roles.server';
import type { VolunteerAtChurchResource } from '../types';
import type { ChurchRole } from './types';

export type LoaderReturnType = {
  bucketGuid: string;
  bucket: VolunteerAtChurchResource;
  roles: ChurchRole[];
};

/** UUID / Rock GUID (with hyphens), case-insensitive. */
const ROCK_GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loader({ params }: LoaderFunctionArgs) {
  const raw = decodeURIComponent(params.bucketGuid ?? '').trim();
  if (!raw || !ROCK_GUID_RE.test(raw)) {
    throw new Response('Serving area not found', { status: 404 });
  }

  const bucketGuid = raw.toUpperCase();
  const bucket = await fetchDreamTeamBucketByGuid(bucketGuid);

  if (!bucket) {
    throw new Response('Serving area not found', { status: 404 });
  }

  const roles = await fetchChurchRolesByPreferenceAreaGuid(bucketGuid);

  return Response.json({
    bucketGuid,
    bucket,
    roles,
  } satisfies LoaderReturnType);
}
