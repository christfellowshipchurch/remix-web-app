/**
 * THROWAWAY SPIKE CODE — tests for the write paths.
 *
 * These exist because §28 and §29 of
 * `docs/architecture/day2-findings-manage-group-members.md` encode two things
 * that are invisible in the happy path:
 *
 * 1. A SECURITY CONTROL. The pre-read's group check is one of only two
 *    authorization controls in the system (§20, §28) — Rock's GroupMembers
 *    controller has no Auth rules and every write runs as a service account that
 *    can do anything. If that check regresses, nothing below the app catches it
 *    and every request still returns 200.
 * 2. TWO WRITE SHAPES THAT LOOK IDENTICAL FROM THE UI. Add-as-insert and
 *    add-as-reactivation both mean "add this person"; picking the wrong one is a
 *    permanent, opaque Rock 400 (§17), not a visible failure.
 *
 * Each test therefore asserts on the WRITES ISSUED, not just the returned value —
 * a test that only checked `ok` would pass while POSTing into a 400 forever.
 */
import type { ActionFunctionArgs } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireGroupLeader } from '~/lib/.server/authentication/require-group-leader';
import { requireUser } from '~/lib/.server/authentication/require-user';
import { AuthorizationError } from '~/lib/.server/error-types';
import {
  fetchRockData,
  invalidateUser,
  patchRockData,
  postRockData,
} from '~/lib/.server/fetch-rock-data';
import { action } from './action';

vi.mock('~/lib/.server/fetch-rock-data', () => ({
  fetchRockData: vi.fn(),
  postRockData: vi.fn(),
  patchRockData: vi.fn(),
  invalidateUser: vi.fn(),
  TTL: { NONE: 0 },
}));
vi.mock('~/lib/.server/redis-config', () => ({ default: {} }));
vi.mock('~/lib/.server/authentication/require-user', () => ({
  requireUser: vi.fn(),
}));
vi.mock('~/lib/.server/authentication/require-group-leader', () => ({
  requireGroupLeader: vi.fn(),
}));

const mockFetch = vi.mocked(fetchRockData);
const mockPost = vi.mocked(postRockData);
const mockPatch = vi.mocked(patchRockData);
const mockInvalidate = vi.mocked(invalidateUser);
const mockRequireUser = vi.mocked(requireUser);
const mockRequireGroupLeader = vi.mocked(requireGroupLeader);

/** The acting leader: person 394626, whose own membership row is 8862386. */
const ACTOR_PERSON_ID = 394626;
const ACTOR_GROUP_MEMBER_ID = 8862386;
const GROUP_ID = 1055022;
/** The person being added or removed — deliberately NOT the actor. */
const TARGET_PERSON_ID = 389650;

const invoke = (fields: Record<string, string>, groupId = GROUP_ID) => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return action({
    request: new Request('http://localhost/spike', { method: 'POST', body }),
    params: { groupId: String(groupId) },
    context: {},
  } as unknown as ActionFunctionArgs);
};

beforeEach(() => {
  vi.clearAllMocks();
  mockRequireUser.mockResolvedValue({
    personId: ACTOR_PERSON_ID,
    rockCookie: '.ROCK=x',
  } as never);
  mockRequireGroupLeader.mockResolvedValue({
    groupMemberId: ACTOR_GROUP_MEMBER_ID,
    groupRoleId: 50,
    isLeader: true,
  } as never);
  mockInvalidate.mockResolvedValue(undefined as never);
});

describe('remove — the pre-read is an authorization control (§28)', () => {
  it('refuses a groupMemberId belonging to another group, and writes nothing', async () => {
    // The row exists and is a perfectly valid GroupMember — it just is not in the
    // group the caller leads. This is the whole attack: the gate authorizes
    // `groupId` from the URL, the write targets an id from the form, and before
    // §28 nothing connected them. Rock would have honoured this write.
    mockFetch.mockResolvedValueOnce({
      id: 3329432,
      groupId: 9999999,
      personId: TARGET_PERSON_ID,
      groupRoleId: 44,
      groupMemberStatus: 1,
    });

    await expect(
      invoke({
        intent: 'remove',
        groupMemberId: '3329432',
        inactiveReasonGuid: 'guid-1',
      }),
    ).rejects.toThrow(AuthorizationError);

    // Not "returned an error" — issued no write at all.
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it('resolves the removed person server-side and invalidates BOTH caches', async () => {
    // §25: `invalidateUser` SCANs one person's key prefix, so the actor's
    // invalidation provably cannot reach the removed person's "my groups". And
    // §22: Rock flushes nothing on a soft remove. Miss this and the removed
    // member keeps seeing the group in two independent caches.
    mockFetch.mockResolvedValueOnce({
      id: 3329432,
      groupId: GROUP_ID,
      personId: TARGET_PERSON_ID,
      groupRoleId: 44,
      groupMemberStatus: 1,
    });
    mockPost.mockResolvedValue(undefined as never);
    mockPatch.mockResolvedValue(204 as never);

    const result = await invoke({
      intent: 'remove',
      groupMemberId: '3329432',
      inactiveReasonGuid: 'guid-1',
    });

    expect(result).toMatchObject({
      ok: true,
      outcome: 'removed',
      affectedPersonId: TARGET_PERSON_ID,
    });
    // The form never carried a personId — it came from the pre-read.
    expect(mockInvalidate).toHaveBeenCalledWith({}, ACTOR_PERSON_ID);
    expect(mockInvalidate).toHaveBeenCalledWith({}, TARGET_PERSON_ID);
  });

  it('treats an already-Inactive row as success without rewriting the reason', async () => {
    // A double-submit must not overwrite the recorded removal reason with a new
    // one, and must not pretend to fail.
    mockFetch.mockResolvedValueOnce({
      id: 3329432,
      groupId: GROUP_ID,
      personId: TARGET_PERSON_ID,
      groupRoleId: 44,
      groupMemberStatus: 0,
    });

    const result = await invoke({
      intent: 'remove',
      groupMemberId: '3329432',
      inactiveReasonGuid: 'guid-2',
    });

    expect(result).toMatchObject({ ok: true, outcome: 'already-inactive' });
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
    // Still drops the target's cache: Rock may be right while Redis is stale.
    expect(mockInvalidate).toHaveBeenCalledWith({}, TARGET_PERSON_ID);
  });
});

describe('add — upsert, not insert (§29)', () => {
  it('reactivates a soft-removed row instead of POSTing it (§17)', async () => {
    // The bug this whole spec exists for: uniqueness is
    // (GroupId, PersonId, GroupRoleId) and IGNORES status, so re-POSTing a
    // soft-removed member is a permanent 400. Remove-then-re-add is an obvious
    // leader workflow, so this is the difference between working and never
    // working.
    mockFetch
      .mockResolvedValueOnce([
        {
          id: 8862385,
          groupId: GROUP_ID,
          personId: TARGET_PERSON_ID,
          groupRoleId: 44,
          groupMemberStatus: 0,
        },
      ])
      .mockResolvedValueOnce([{ id: 541832959 }]); // the AttributeValue row
    mockPatch.mockResolvedValue(204 as never);

    const result = await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    expect(result).toMatchObject({ ok: true, outcome: 'reactivated' });
    // Never POST — that is the 400.
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'GroupMembers/8862385',
        body: { GroupMemberStatus: 1 },
      }),
    );
    // §29: Rock does not clear MemberInactiveReason on a status change, so a
    // reactivated member would otherwise carry a stale removal reason forever.
    // §31: it must be cleared by PATCHing the AttributeValue row — the
    // `attributeValue=` (empty) form is a 400, so asserting on THAT call would
    // lock in a request Rock rejects.
    expect(mockPatch).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'AttributeValues/541832959',
        body: { Value: '' },
      }),
    );
    expect(result).toMatchObject({ reasonCleared: { cleared: true } });
  });

  it('reports rather than fails when there is no reason to clear', async () => {
    // A member added, never removed, then re-added has no AttributeValue row.
    // That is not an error, and it must not fail the add.
    mockFetch
      .mockResolvedValueOnce([
        {
          id: 8862385,
          groupId: GROUP_ID,
          personId: TARGET_PERSON_ID,
          groupRoleId: 44,
          groupMemberStatus: 0,
        },
      ])
      .mockResolvedValueOnce([]); // no AttributeValue row
    mockPatch.mockResolvedValue(204 as never);

    const result = await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    expect(result).toMatchObject({
      ok: true,
      outcome: 'reactivated',
      reasonCleared: { cleared: false, note: 'no-existing-value' },
    });
  });

  it('clears the reason AFTER the status patch, not before', async () => {
    // Ordering matters on a two-write sequence with no transaction (§17): dying
    // between them must leave "Active with a stale reason" (benign, already
    // possible) rather than "Inactive with the reason cleared", which reads as a
    // successful add that silently did nothing.
    mockFetch
      .mockResolvedValueOnce([
        {
          id: 8862385,
          groupId: GROUP_ID,
          personId: TARGET_PERSON_ID,
          groupRoleId: 44,
          groupMemberStatus: 0,
        },
      ])
      .mockResolvedValueOnce([{ id: 541832959 }]);
    const order: string[] = [];
    mockPatch.mockImplementation((async ({
      endpoint,
    }: {
      endpoint: string;
    }) => {
      order.push(endpoint.startsWith('GroupMembers/') ? 'status' : 'reason');
      return 204;
    }) as never);

    await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    expect(order).toEqual(['status', 'reason']);
  });

  it('declines when the person is in the group at a different role (§26)', async () => {
    // §26 proved PATCHing GroupRoleId onto a role held by a dormant row is the
    // same permanent 400. And POSTing would create a SECOND row for one person
    // in one group, because uniqueness is per-role. Both are wrong, so the add
    // path must detect a role change and refuse rather than improvise.
    mockFetch.mockResolvedValueOnce([
      {
        id: 3329432,
        groupId: GROUP_ID,
        personId: TARGET_PERSON_ID,
        groupRoleId: 44,
        groupMemberStatus: 1,
      },
    ]);

    const result = await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '50',
    });

    expect(result).toMatchObject({ ok: false, existingRoleIds: [44] });
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it('POSTs only when the person has no row in the group at all', async () => {
    mockFetch
      .mockResolvedValueOnce([]) // pre-read: nothing exists
      .mockResolvedValueOnce({ id: 8862390 }); // by-id read-back
    mockPost.mockResolvedValue(8862390 as never);

    const result = await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    expect(result).toMatchObject({
      ok: true,
      outcome: 'inserted',
      groupMemberId: 8862390,
      affectedPersonId: TARGET_PERSON_ID,
    });
    expect(mockPost).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'GroupMembers',
        body: {
          GroupId: GROUP_ID,
          PersonId: TARGET_PERSON_ID,
          GroupRoleId: 44,
          GroupMemberStatus: 1,
        },
      }),
    );
    // The added person's own "my groups" is now wrong too — it is missing a
    // group. Fails toward under-showing (§25), but still wrong.
    expect(mockInvalidate).toHaveBeenCalledWith({}, TARGET_PERSON_ID);
  });

  it('is idempotent when the person is already Active at that role (§17)', async () => {
    // The app cannot distinguish "already a member" from "my own retry landed" —
    // both are the same Rock 400. With the pre-read, neither reaches Rock and
    // both are success.
    mockFetch.mockResolvedValueOnce([
      {
        id: 3329432,
        groupId: GROUP_ID,
        personId: TARGET_PERSON_ID,
        groupRoleId: 44,
        groupMemberStatus: 1,
      },
    ]);

    const result = await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    expect(result).toMatchObject({ ok: true, outcome: 'already-active' });
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });
});

describe('the pre-read never hides dormant rows (§17, §26, §29)', () => {
  it('sends no status predicate and uses the collection form, not by-id', async () => {
    // Two regressions this catches, both of which would still return 200:
    // - adding `GroupMemberStatus eq 'Active'` to the filter hides exactly the
    //   dormant rows the upsert exists to find, restoring the §17 400;
    // - switching to `GroupMembers/{id}` silently ignores $select and returns the
    //   whole ~3.1 KB entity (§27).
    mockFetch.mockResolvedValueOnce([]);
    mockPost.mockResolvedValue(1 as never);

    await invoke({
      intent: 'add',
      personId: String(TARGET_PERSON_ID),
      groupRoleId: '44',
    });

    const call = mockFetch.mock.calls[0][0];
    expect(call.endpoint).toBe('GroupMembers');
    expect(call.queryParams?.$filter).not.toMatch(/GroupMemberStatus/);
    expect(call.queryParams?.$select).toContain('PersonId');
    expect(call.queryParams?.$select).toContain('GroupId');
  });
});
