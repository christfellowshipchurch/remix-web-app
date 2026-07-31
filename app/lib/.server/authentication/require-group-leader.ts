/**
 * Per-group leader authorization.
 *
 * Rock's REST layer applies no app-level authorization — every write helper in
 * `fetch-rock-data.ts` presents the same service-account token, which can do
 * anything (auth-review C1). So the gate has to live here, in front of the call.
 *
 * Mirrors the Apollos check this replaces (`services`
 * `group-item/data-source.js:207-218`): exact group match, `IsLeader`, Active
 * only. No parent/child inheritance — leading a parent group confers nothing on
 * a child.
 */
import { AuthorizationError } from '../error-types';
import { fetchRockData, TTL } from '../fetch-rock-data';
import type { AuthContext } from './require-user';

export interface GroupLeadership {
  groupMemberId: number;
  groupRoleId: number;
  isLeader: true;
}

interface GroupMemberRow {
  id: number;
  groupRoleId: number;
  groupRole?: { isLeader?: boolean };
}

/**
 * Asserts the caller is an ACTIVE LEADER of `groupId`, returning the membership
 * row that grants it. Throws `AuthorizationError` (→ 403) otherwise.
 *
 * Takes an already-resolved `AuthContext` rather than a `Request` so the
 * 401-before-403 ordering stays explicit at the call site: the caller must have
 * proven who they are (`requireUser`) before we ask what they may do. Do not
 * "simplify" this to accept a Request.
 *
 * The query is verified against both dev (Rock 18.4.1) and prod (Rock 17.7.0) —
 * see `docs/architecture/day2-findings-manage-group-members.md` §2-§4:
 *
 * - `GroupMemberStatus eq 'Active'` — the numeric form (`eq 1`) is a 400, since
 *   Rock types this field as `Edm.String` in `$filter` while returning it as an
 *   integer in entity JSON.
 * - `GroupRole/IsLeader eq true` — filtering on the nav property works, so Rock
 *   returns only leader rows and there is no app-side scan to get wrong.
 * - No `IsArchived` predicate: REST does not appear to return archived rows at
 *   all, making it dead weight (§5 — flagged as not decisively proven).
 *
 * `IsLeader` is deliberately the predicate rather than `CanManageMembers`. In
 * group type 31 that authorizes Group Leader (50) and Co-Leader (47) only, and
 * denies Campus Hub Leader (48) and Group Coach (49) — which are configured
 * `CanManageMembers: true` in Rock but `IsLeader: false`. This matches legacy
 * exactly, so no one's access changes. See §4 — the divergence is real and worth
 * a product decision, but not one this spike should make silently.
 *
 * Runs as the service account, not as the user: the gate is a question about
 * group data, and routing it through the caller's cookie would let Rock's own
 * entity security turn "leader" into "denied" for reasons unrelated to
 * leadership. Never cached — `TTL.NONE` — an authorization decision must not
 * outlive a role change.
 */
export const requireGroupLeader = async (
  auth: AuthContext,
  groupId: number,
): Promise<GroupLeadership> => {
  if (!Number.isInteger(groupId) || groupId <= 0) {
    throw new AuthorizationError(`Invalid groupId: ${groupId}`);
  }

  const rows = await fetchRockData({
    endpoint: 'GroupMembers',
    queryParams: {
      $filter: [
        `GroupId eq ${groupId}`,
        `PersonId eq ${auth.personId}`,
        `GroupMemberStatus eq 'Active'`,
        `GroupRole/IsLeader eq true`,
      ].join(' and '),
      $expand: 'GroupRole',
    },
    ttl: TTL.NONE,
  });

  // fetchRockData returns a bare object for a single result and an array for
  // many, so normalize before counting.
  const members: GroupMemberRow[] = Array.isArray(rows)
    ? rows
    : rows
      ? [rows]
      : [];

  const leadership = members.find((m) => m.groupRole?.isLeader === true);

  if (!leadership) {
    throw new AuthorizationError(
      `Person ${auth.personId} is not an active leader of group ${groupId}`,
    );
  }

  return {
    groupMemberId: leadership.id,
    groupRoleId: leadership.groupRoleId,
    isLeader: true,
  };
};
