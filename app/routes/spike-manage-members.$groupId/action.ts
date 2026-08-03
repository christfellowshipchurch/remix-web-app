/**
 * THROWAWAY SPIKE CODE — Manage Group Members, write paths.
 *
 * Two intents: `add` (direct POST) and `remove` (soft remove).
 *
 * `add` is a direct `POST /api/GroupMembers`, per the brief's assumption and NOT
 * legacy parity — legacy fires Rock workflow `GROUP_ADD_PERSON` (very likely
 * type 654) and never POSTs the entity at all. This is the deliberate half of
 * the Q2 fork: POSTing is what lets us observe whether a REST write trips Rock's
 * `GroupMemberWorkflowTriggers`, which production has never answered because
 * production never took this path. See day2 findings §6.
 *
 * `remove` is a soft remove — `GroupMemberStatus: 0` plus the mandatory
 * `MemberInactiveReason` attribute — matching legacy, which has no delete
 * mutation at all. DELETE-cascade stays a separate time-boxed probe.
 *
 * Both intents open with the SAME pre-read (`readGroupMemberRows`), per day2
 * findings §28 and §29. That read does three jobs at once: it scopes the write to
 * `groupId` (the only authorization check on the target row — see §28), it yields
 * the affected person's id for cache invalidation (Q4, §25), and on the add path
 * it distinguishes insert from reactivation so a soft-removed member can be added
 * back at all (§17). Do not "optimize" it away on either path.
 */
import type { ActionFunctionArgs } from 'react-router';
import { requireGroupLeader } from '~/lib/.server/authentication/require-group-leader';
import { requireUser } from '~/lib/.server/authentication/require-user';
import { AuthorizationError } from '~/lib/.server/error-types';
import {
  fetchRockData,
  invalidateUser,
  patchRockData,
  postRockData,
  TTL,
} from '~/lib/.server/fetch-rock-data';
import redis from '~/lib/.server/redis-config';

/**
 * Write model under test (brief Q4).
 *
 * `false` → the service account writes (model (a)): the token can do anything,
 * so every invariant Rock would otherwise enforce has to live in this file.
 * `true` → the caller's Rock cookie writes (model (b)). Passing Cookie alone is
 * NOT enough — also blank `Authorization-Token`. With a valid `.ROCK` cookie
 * present, Rock authenticates as that person (cookie wins over the service
 * token); entity REST controllers then 401 because ordinary users have no ACL
 * (day2 §20). Blanking the token makes the call truly cookie-only. Earlier
 * comments claiming Rock "prefers" the token were wrong.
 *
 * Model (b) is DEAD on current Rock REST ACLs (day2 §20), not for lack of a
 * test user. Left at `false`.
 */
const WRITE_AS_USER = false;

const writeHeaders = (
  rockCookie: string,
): Record<string, string> | undefined =>
  WRITE_AS_USER ? { Cookie: rockCookie, 'Authorization-Token': '' } : undefined;

const GROUP_MEMBER_STATUS = { INACTIVE: 0, ACTIVE: 1, PENDING: 2 } as const;

/** The shape `readGroupMemberRows` selects. Rock normalizes to camelCase. */
interface GroupMemberRow {
  id: number;
  groupId: number;
  personId: number;
  groupRoleId: number;
  /** 0=Inactive, 1=Active, 2=Pending */
  groupMemberStatus: number;
}

/**
 * The one read both write paths open with (§28, §29).
 *
 * COLLECTION form, never `GroupMembers/{id}` — a by-id GET silently ignores
 * `$select` and returns the whole ~3.1 KB entity (§27, §15). Same endpoint,
 * `$select` and TTL for both intents; only the `$filter` differs.
 *
 * NO status predicate, deliberately. The dormant Inactive rows are the entire
 * point: Rock's uniqueness key is `(GroupId, PersonId, GroupRoleId)` and IGNORES
 * status, so a row hidden by a status filter is a row that produces an opaque 400
 * later (§17, §26).
 *
 * `TTL.NONE` because this read carries an authorization decision — it must not
 * outlive a membership change, same reasoning as `requireGroupLeader`.
 */
const readGroupMemberRows = async (
  filter: string,
): Promise<GroupMemberRow[]> => {
  const rows = await fetchRockData({
    endpoint: 'GroupMembers',
    queryParams: {
      $filter: filter,
      $select: 'Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus',
    },
    ttl: TTL.NONE,
  });

  // fetchRockData returns a bare object for one result, an array for many.
  return Array.isArray(rows) ? rows : rows ? [rows] : [];
};

/**
 * Clears `MemberInactiveReason`.
 *
 * Rock does NOT clear this on a status transition — §29 proved the attribute
 * survives a full remove → reactivate → remove cycle with its `ModifiedDateTime`
 * untouched. Without this, every reactivated member keeps a stale removal reason
 * that no UI surfaces.
 *
 * TWO CALLS, and NOT the obvious one. §31: `POST
 * GroupMembers/AttributeValue/{id}?attributeKey=…&attributeValue=` with an EMPTY
 * value is a **400** — `"A value is required but was not present in the
 * request."` That endpoint can only set a value, never clear one; omitting the
 * parameter is a 404. Clearing means locating the `AttributeValue` row and
 * patching it to empty, which is why this costs a lookup.
 *
 * Returns rather than throws: the status change already succeeded, and a leftover
 * reason on an Active member is cosmetic (nothing renders it). Failing the whole
 * add over it would be worse than reporting it.
 */
const clearInactiveReason = async (
  groupMemberId: number,
  rockCookie: string,
): Promise<{ cleared: boolean; note?: string }> => {
  try {
    const rows = await fetchRockData({
      endpoint: 'AttributeValues',
      queryParams: {
        $filter: `EntityId eq ${groupMemberId} and Attribute/Key eq 'MemberInactiveReason'`,
        $select: 'Id',
      },
      ttl: TTL.NONE,
    });
    const list: { id: number }[] = Array.isArray(rows)
      ? rows
      : rows
        ? [rows]
        : [];
    const attributeValueId = list[0]?.id;

    // Never removed through the app, so there is nothing to clear.
    if (!attributeValueId) return { cleared: false, note: 'no-existing-value' };

    await patchRockData({
      endpoint: `AttributeValues/${attributeValueId}`,
      body: { Value: '' },
      customHeaders: writeHeaders(rockCookie),
    });
    return { cleared: true };
  } catch (error) {
    return {
      cleared: false,
      note: `clear failed: ${error instanceof Error ? error.message : 'unknown'}`,
    };
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // 401 before 403, always in that order.
  const auth = await requireUser(request);
  const groupId = Number(params.groupId);
  const leadership = await requireGroupLeader(auth, groupId);

  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');

  const result =
    intent === 'add'
      ? await addMember({ form, groupId, rockCookie: auth.rockCookie })
      : intent === 'remove'
        ? await removeMember({
            form,
            groupId,
            leadership,
            rockCookie: auth.rockCookie,
          })
        : { ok: false as const, error: `Unknown intent: ${intent}` };

  // The member list is cached per-user; a write has to drop it or the leader
  // sees their own stale view.
  await invalidateUser(redis, auth.personId);

  // Q4, §25: the affected person's "my groups" lives in a DIFFERENT namespace
  // (`rock:u{personId}:*`) that the actor's invalidation provably cannot reach —
  // `invalidateUser` SCANs one person's prefix, which is exactly why it needs no
  // reverse index and exactly why one call can never cover two people. Both
  // intents need it: an add gives someone a group, a remove takes one away.
  //
  // `affectedPersonId` comes from the server-side pre-read, NOT from the form
  // (§28 option 2). Gated on `ok` because a failed write changed nothing. Not
  // rolled back if anything later fails — a spurious invalidation costs one cache
  // miss, so it errs in the harmless direction.
  if (
    result.ok &&
    result.affectedPersonId &&
    result.affectedPersonId !== auth.personId
  ) {
    await invalidateUser(redis, result.affectedPersonId);
  }

  return result;
};

const addMember = async ({
  form,
  groupId,
  rockCookie,
}: {
  form: FormData;
  groupId: number;
  rockCookie: string;
}) => {
  const personId = Number(form.get('personId'));
  const groupRoleId = Number(form.get('groupRoleId'));

  if (!Number.isInteger(personId) || personId <= 0) {
    return { ok: false as const, error: 'personId must be a positive integer' };
  }
  if (!Number.isInteger(groupRoleId) || groupRoleId <= 0) {
    return {
      ok: false as const,
      error: 'groupRoleId must be a positive integer',
    };
  }

  const start = Date.now();

  // UPSERT PRE-READ (§29). Filtered on (GroupId, PersonId) WITHOUT the role, not
  // on the full uniqueness key. The role-scoped filter is blind to a row for the
  // same person at a DIFFERENT role, and since Rock's uniqueness is per-role it
  // would happily POST and leave that person with two rows in one group — a
  // duplicate in the member list, not the promotion the leader intended. Reading
  // every row for the person costs the same single round trip.
  const existing = await readGroupMemberRows(
    `GroupId eq ${groupId} and PersonId eq ${personId}`,
  );
  const preReadMs = Math.round(Date.now() - start);

  const sameRole = existing.find((row) => row.groupRoleId === groupRoleId);

  // Already Active at the requested role: no-op success. This is also the
  // correct recovery from §17's ambiguity — the app cannot tell "already a
  // member" from "my own retry landed", and with the pre-read it no longer has
  // to: both arrive here, and both are success.
  if (sameRole && sameRole.groupMemberStatus === GROUP_MEMBER_STATUS.ACTIVE) {
    return {
      ok: true as const,
      intent: 'add' as const,
      outcome: 'already-active' as const,
      groupMemberId: sameRole.id,
      affectedPersonId: personId,
      timings: { preReadMs, totalMs: Math.round(Date.now() - start) },
    };
  }

  // REACTIVATE (§17's bug, fixed). A soft-removed row cannot be re-POSTed —
  // uniqueness ignores status, so the POST is a permanent, opaque 400. PATCH it
  // back to Active instead.
  if (sameRole) {
    const status = await patchRockData({
      endpoint: `GroupMembers/${sameRole.id}`,
      body: { GroupMemberStatus: GROUP_MEMBER_STATUS.ACTIVE },
      customHeaders: writeHeaders(rockCookie),
    });

    // AFTER the status PATCH, mirroring the remove path's ordering argument
    // (§17): if the process dies between the two writes, the member is Active
    // with a stale reason — the benign inconsistency that already exists —
    // rather than reason-cleared but still Inactive, which would look like a
    // successful add that did nothing.
    const reasonCleared = await clearInactiveReason(sameRole.id, rockCookie);

    return {
      ok: true as const,
      intent: 'add' as const,
      outcome: 'reactivated' as const,
      groupMemberId: sameRole.id,
      affectedPersonId: personId,
      patchStatus: status,
      reasonCleared,
      timings: { preReadMs, totalMs: Math.round(Date.now() - start) },
    };
  }

  // Rows exist, but only at OTHER roles. This is a role change, not an add, and
  // §26 proved it cannot be done by PATCHing GroupRoleId: if a dormant row holds
  // the target role that PATCH is a permanent 400 with the same opaque message.
  // The correct sequence is reactivate-target-then-deactivate-source — a third
  // write shape, deliberately out of scope. Detect it and decline rather than
  // improvise into a duplicate row or a 400.
  if (existing.length > 0) {
    return {
      ok: false as const,
      error:
        'This person is already in the group with a different role. Changing a ' +
        "member's role is not supported yet.",
      existingRoleIds: existing.map((row) => row.groupRoleId),
      timings: { preReadMs },
    };
  }

  // Day 0: POST returns a BARE INTEGER id — no entity JSON, no Location header.
  const created = await postRockData({
    endpoint: 'GroupMembers',
    body: {
      GroupId: groupId,
      PersonId: personId,
      GroupRoleId: groupRoleId,
      // Numeric on write, even though $filter demands the string form.
      GroupMemberStatus: GROUP_MEMBER_STATUS.ACTIVE,
    },
    customHeaders: writeHeaders(rockCookie),
  });

  const newGroupMemberId = Number(created);
  const postMs = Math.round(Date.now() - start);

  if (!Number.isInteger(newGroupMemberId) || newGroupMemberId <= 0) {
    return {
      ok: false as const,
      error: `POST did not return an id (got ${JSON.stringify(created)})`,
      timings: { postMs },
    };
  }

  // Follow-up GET, forced by the bare-integer response. Counts toward Q3.
  //
  // NOTE — this is §27's one real by-id hit: `$expand` is silently ignored here,
  // so `readBack.groupRole` is ALWAYS null. Left as-is deliberately. §27's
  // conclusion was that the durable fix is a guard inside `fetchRockData` (which
  // would catch all ~55 call sites), not scattered edits, and this change is
  // scoped to §28 and §29. Do not read a nav property off this object.
  const readBack = await fetchRockData({
    endpoint: `GroupMembers/${newGroupMemberId}`,
    queryParams: { $expand: 'GroupRole' },
    ttl: TTL.NONE,
  });

  return {
    ok: true as const,
    intent: 'add' as const,
    outcome: 'inserted' as const,
    groupMemberId: newGroupMemberId,
    affectedPersonId: personId,
    readBack,
    timings: { preReadMs, postMs, totalMs: Math.round(Date.now() - start) },
  };
};

const removeMember = async ({
  form,
  groupId,
  leadership,
  rockCookie,
}: {
  form: FormData;
  groupId: number;
  leadership: { groupMemberId: number };
  rockCookie: string;
}) => {
  const groupMemberId = Number(form.get('groupMemberId'));
  const inactiveReasonGuid = String(form.get('inactiveReasonGuid') ?? '');

  if (!Number.isInteger(groupMemberId) || groupMemberId <= 0) {
    return {
      ok: false as const,
      error: 'groupMemberId must be a positive integer',
    };
  }

  // Legacy invariant (`group-member/data-source.js:148`), reproduced here
  // because under service-account writes nothing else enforces it.
  if (groupMemberId === leadership.groupMemberId) {
    return {
      ok: false as const,
      error: 'You cannot make a change to your own record.',
    };
  }

  // Legacy requires a reason whenever status goes Inactive.
  if (!inactiveReasonGuid) {
    return {
      ok: false as const,
      error: 'inactiveReasonGuid is required to remove a member',
    };
  }

  const start = Date.now();

  // PRE-READ (§28). Two jobs, one round trip.
  //
  // 1. AUTHORIZATION. `requireGroupLeader` proved the caller leads `groupId` —
  //    it says NOTHING about the row being written, which arrives as a bare id
  //    from the form. Without the group check below, a leader of any group could
  //    soft-remove ANY GroupMember row in the instance by posting its id. There
  //    is no backstop: the GroupMembers controller has no Auth rules and the
  //    write runs as the service account with full rights (§20). This check and
  //    the gate are the only two authorization controls in the system.
  // 2. CACHE KEY. The removed person's id, which the form never supplied and
  //    this function previously had no way to learn — the Q4 blocker (§25).
  //
  // Resolved server-side rather than trusted from the form precisely because
  // job 1 requires verifying an id, not receiving one.
  const [row] = await readGroupMemberRows(`Id eq ${groupMemberId}`);
  const preReadMs = Math.round(Date.now() - start);

  if (!row) {
    return { ok: false as const, error: 'Group member not found' };
  }

  // The security check. `AuthorizationError`, not a validation error — this is
  // the same class of refusal as failing the gate, and it must read that way in
  // logs. (Note §13: this currently surfaces as a 500, not a 403. Deny is
  // correct; the status code is a known, separate defect.)
  if (row.groupId !== groupId) {
    throw new AuthorizationError(
      `GroupMember ${groupMemberId} belongs to group ${row.groupId}, not ${groupId}`,
    );
  }

  // Legacy invariant (`group-member/data-source.js:148`), reproduced here
  // because under service-account writes nothing else enforces it. Now
  // belt-and-braces with the check above, which is why it stays.
  if (row.id === leadership.groupMemberId) {
    return {
      ok: false as const,
      error: 'You cannot make a change to your own record.',
    };
  }

  // Already Inactive: no-op success, and skip both writes. Idempotent, and it
  // avoids overwriting an existing removal reason with a new one on a
  // double-submit. Still reports `affectedPersonId` so the caches drop — the
  // person may well be stale in Redis even though Rock is already correct.
  if (row.groupMemberStatus === GROUP_MEMBER_STATUS.INACTIVE) {
    return {
      ok: true as const,
      intent: 'remove' as const,
      outcome: 'already-inactive' as const,
      groupMemberId,
      affectedPersonId: row.personId,
      timings: { preReadMs, totalMs: Math.round(Date.now() - start) },
    };
  }

  // Attribute values are a separate v1 write with the values in the QUERY
  // STRING and no body — never inline on the entity (survey #6, confirmed by
  // legacy production code). This lands BEFORE the PATCH, exactly as legacy
  // does it, which is why the rollback below is necessary.
  //
  // The pre-read above narrows the window this rollback exists for: "row missing"
  // and "wrong group" are now rejected before the first write, so the untransacted
  // two-write sequence is only entered for requests already known to be valid.
  await postRockData({
    endpoint: `GroupMembers/AttributeValue/${groupMemberId}?attributeKey=MemberInactiveReason&attributeValue=${encodeURIComponent(inactiveReasonGuid)}`,
    body: '',
    customHeaders: writeHeaders(rockCookie),
  });
  const attributeMs = Math.round(Date.now() - start);

  try {
    // Day 0: PATCH returns 204 with an empty body.
    const status = await patchRockData({
      endpoint: `GroupMembers/${groupMemberId}`,
      body: { GroupMemberStatus: GROUP_MEMBER_STATUS.INACTIVE },
      customHeaders: writeHeaders(rockCookie),
    });

    return {
      ok: true as const,
      intent: 'remove' as const,
      outcome: 'removed' as const,
      groupMemberId,
      // From the pre-read, not the form (§28). Without this the removed person
      // keeps seeing the group in their own cached "my groups" — and §22 proved
      // Rock flushes nothing on a soft remove, so they would be stale in TWO
      // caches at once.
      affectedPersonId: row.personId,
      patchStatus: status,
      timings: {
        preReadMs,
        attributeMs,
        totalMs: Math.round(Date.now() - start),
      },
    };
  } catch (error) {
    // Hand-rolled compensating rollback — there is no transaction across the
    // two writes. Legacy does the same thing. Q5 evidence: this is the cost of
    // a multi-call write against Rock REST.
    //
    // This USED to POST `attributeValue=` (empty) and could never have worked:
    // that is a 400, so the rollback silently reported `rolledBack: false` on
    // every invocation (§31). It went unnoticed because the catch block only runs
    // when the PATCH fails, which it never did in testing. Now shares the add
    // path's clearing helper, which is verified against dev.
    const rollback = await clearInactiveReason(groupMemberId, rockCookie);

    return {
      ok: false as const,
      error: `PATCH failed: ${error instanceof Error ? error.message : 'unknown'}`,
      rolledBack: rollback.cleared,
      rollbackNote: rollback.note,
      timings: { attributeMs },
    };
  }
};
