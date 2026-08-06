/**
 * THROWAWAY SPIKE CODE — Manage Group Members, view path.
 *
 * Exists to generate evidence for Q1 (authorization) and Q3 (latency /
 * round-trips), not to ship. See
 * `docs/architecture/spike-brief-manage-group-members.md`.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { requireGroupLeader } from '~/lib/.server/authentication/require-group-leader';
import { requireUser } from '~/lib/.server/authentication/require-user';
import { fetchRockData, TTL } from '~/lib/.server/fetch-rock-data';
import type { SpikeGroupMember, SpikeLoaderData } from './types';

/** Rock defined type for Group Member Inactive Reason (dev + prod). */
export const INACTIVE_REASON_DEFINED_TYPE_ID = 289;

interface RockMemberRow {
  id: number;
  personId: number;
  groupMemberStatus: number;
  groupRole?: { name?: string; isLeader?: boolean };
  person?: { nickName?: string; lastName?: string; email?: string };
}

const asArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : value ? [value as T] : [];

/** Times an awaited call so Q3 can count round-trips, not just payload size. */
const timed = async <T>(
  label: string,
  timings: Record<string, number>,
  fn: () => Promise<T>,
): Promise<T> => {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    timings[label] = Math.round(Date.now() - start);
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings: Record<string, number> = {};

  // 401 before 403, always in that order.
  const auth = await timed('requireUser', timings, () =>
    requireUser(request, { returnTo: true }),
  );

  const groupId = Number(params.groupId);
  const leadership = await timed('requireGroupLeader', timings, () =>
    requireGroupLeader(auth, groupId),
  );

  // `$expand=Person` works, so the member list is a single call with no N+1.
  // Note the contrast with `$expand=Group`, which is a 400 — see day2 findings §7.
  const [rows, reasons] = await Promise.all([
    timed('members', timings, () =>
      fetchRockData({
        endpoint: 'GroupMembers',
        queryParams: {
          $filter: `GroupId eq ${groupId}`,
          $expand: 'GroupRole,Person',
          $select: [
            'Id',
            'PersonId',
            'GroupMemberStatus',
            'GroupRole/Name',
            'GroupRole/IsLeader',
            'Person/NickName',
            'Person/LastName',
            'Person/Email',
          ].join(','),
        },
        // Per-user namespace: this is a leader-only view of a group. Caching it
        // under a shared key would serve it to non-leaders.
        cacheUserId: auth.personId,
        ttl: TTL.NONE, // spike: always read through, so writes are observable
      }),
    ),
    timed('inactiveReasons', timings, () =>
      fetchRockData({
        endpoint: 'DefinedValues',
        queryParams: {
          $filter: `DefinedTypeId eq ${INACTIVE_REASON_DEFINED_TYPE_ID} and IsActive eq true`,
          $select: 'Guid,Value',
          $orderby: 'Order',
        },
        ttl: TTL.LONG, // reference data
      }),
    ),
  ]);

  const members: SpikeGroupMember[] = asArray<RockMemberRow>(rows).map((m) => ({
    groupMemberId: m.id,
    personId: m.personId,
    name:
      [m.person?.nickName, m.person?.lastName].filter(Boolean).join(' ') ||
      `Person ${m.personId}`,
    email: m.person?.email ?? '',
    roleName: m.groupRole?.name ?? 'Unknown',
    isLeader: m.groupRole?.isLeader === true,
    status: m.groupMemberStatus,
  }));

  return {
    groupId,
    leadership: {
      groupMemberId: leadership.groupMemberId,
      groupRoleId: leadership.groupRoleId,
    },
    members,
    inactiveReasons: asArray<{ guid: string; value: string }>(reasons).map(
      (r) => ({ guid: r.guid, value: r.value }),
    ),
    timings,
  } satisfies SpikeLoaderData;
};
