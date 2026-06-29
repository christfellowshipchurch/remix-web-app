import { type ActionFunction, data } from 'react-router-dom';
import redis from '~/lib/.server/redis-config';
import { invalidateItem } from '~/lib/.server/cache-utils';

/**
 * Admin cache-invalidation endpoint.
 *
 * POST /api/admin/cache
 *   Header: x-cache-secret: <CACHE_INVALIDATION_SECRET>
 *   Body:   { "id": <contentChannelItemId> }
 *
 * Invalidates every cache entry containing the given content item (its own entry
 * plus any list/aggregate entry that included it). Designed to be called both
 * manually by a developer and by a Rock RMS webhook on content publish/update.
 *
 * Channel id is not required — Rock ContentChannelItem ids are globally unique.
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  const secret = process.env.CACHE_INVALIDATION_SECRET;
  const provided = request.headers.get('x-cache-secret');
  if (!secret || !provided || provided !== secret) {
    return data({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { id?: string | number };
  try {
    body = await request.json();
  } catch {
    return data({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = body?.id;
  if (id === undefined || id === null || `${id}`.trim() === '') {
    return data({ error: 'Missing required field: id' }, { status: 400 });
  }

  const deletedKeys = await invalidateItem(redis, id);
  return data({ success: true, id: String(id), deletedKeys });
};
