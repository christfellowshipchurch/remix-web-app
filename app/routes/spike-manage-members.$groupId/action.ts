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
 */
import type { ActionFunctionArgs } from 'react-router';
import { requireGroupLeader } from '~/lib/.server/authentication/require-group-leader';
import { requireUser } from '~/lib/.server/authentication/require-user';
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
 * `true` → the caller's Rock cookie writes (model (b)). Note that passing the
 * Cookie alone is NOT enough — Rock prefers the `Authorization-Token`, so the
 * write silently runs as the service account unless the token is also blanked.
 * That is the trap flagged in auth-review; hence the explicit `''`.
 *
 * Model (b) is untestable until a real test user exists — the `.ROCK` cookie
 * only comes from `/Auth/Login`. Left at `false`.
 */
const WRITE_AS_USER = false;

const writeHeaders = (
  rockCookie: string,
): Record<string, string> | undefined =>
  WRITE_AS_USER ? { Cookie: rockCookie, 'Authorization-Token': '' } : undefined;

const GROUP_MEMBER_STATUS = { INACTIVE: 0, ACTIVE: 1, PENDING: 2 } as const;

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
            leadership,
            rockCookie: auth.rockCookie,
          })
        : { ok: false as const, error: `Unknown intent: ${intent}` };

  // The member list is cached per-user; a write has to drop it or the leader
  // sees their own stale view.
  await invalidateUser(redis, auth.personId);

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
  const readBack = await fetchRockData({
    endpoint: `GroupMembers/${newGroupMemberId}`,
    queryParams: { $expand: 'GroupRole' },
    ttl: TTL.NONE,
  });

  return {
    ok: true as const,
    intent: 'add' as const,
    groupMemberId: newGroupMemberId,
    readBack,
    timings: { postMs, totalMs: Math.round(Date.now() - start) },
  };
};

const removeMember = async ({
  form,
  leadership,
  rockCookie,
}: {
  form: FormData;
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

  // Attribute values are a separate v1 write with the values in the QUERY
  // STRING and no body — never inline on the entity (survey #6, confirmed by
  // legacy production code). This lands BEFORE the PATCH, exactly as legacy
  // does it, which is why the rollback below is necessary.
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
      groupMemberId,
      patchStatus: status,
      timings: {
        attributeMs,
        totalMs: Math.round(Date.now() - start),
      },
    };
  } catch (error) {
    // Hand-rolled compensating rollback — there is no transaction across the
    // two writes. Legacy does the same thing. Q5 evidence: this is the cost of
    // a multi-call write against Rock REST.
    let rollbackOk = true;
    try {
      await postRockData({
        endpoint: `GroupMembers/AttributeValue/${groupMemberId}?attributeKey=MemberInactiveReason&attributeValue=`,
        body: '',
        customHeaders: writeHeaders(rockCookie),
      });
    } catch {
      rollbackOk = false;
    }

    return {
      ok: false as const,
      error: `PATCH failed: ${error instanceof Error ? error.message : 'unknown'}`,
      rolledBack: rollbackOk,
      timings: { attributeMs },
    };
  }
};
