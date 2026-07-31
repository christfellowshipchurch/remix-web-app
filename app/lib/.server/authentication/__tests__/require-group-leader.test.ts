import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireGroupLeader } from '../require-group-leader';
import { AuthorizationError } from '../../error-types';
import type { AuthContext } from '../require-user';

const fetchRockData = vi.hoisted(() => vi.fn());

vi.mock('../../fetch-rock-data', () => ({
  fetchRockData,
  TTL: { NONE: 0, SHORT: 300, DEFAULT: 3600, LONG: 86400 },
}));

const auth: AuthContext = {
  personId: 907,
  primaryAliasId: 1001,
  rockCookie: '.ROCK=abc',
  sessionId: 'sess-1',
};

/** Shape fetchRockData returns for the gate query (normalized to camelCase). */
const leaderRow = {
  id: 799452,
  groupRoleId: 50,
  groupRole: { isLeader: true },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('requireGroupLeader', () => {
  it('returns the leadership row when the caller leads the group', async () => {
    fetchRockData.mockResolvedValue([leaderRow]);

    await expect(requireGroupLeader(auth, 241543)).resolves.toEqual({
      groupMemberId: 799452,
      groupRoleId: 50,
      isLeader: true,
    });
  });

  it('accepts a bare object, since Rock returns one for a single match', async () => {
    // fetchRockData unwraps single-element arrays, so the gate must not assume
    // an array or a lone leader would be denied.
    fetchRockData.mockResolvedValue(leaderRow);

    await expect(requireGroupLeader(auth, 241543)).resolves.toMatchObject({
      groupMemberId: 799452,
    });
  });

  it('denies when the query returns no rows', async () => {
    fetchRockData.mockResolvedValue([]);

    await expect(requireGroupLeader(auth, 241543)).rejects.toThrow(
      AuthorizationError,
    );
  });

  it('denies a role Rock does not mark IsLeader, even if Rock returned the row', async () => {
    // Defense in depth: the $filter should already exclude these, but if the
    // nav-property filter ever silently stops applying, the gate must still
    // deny Coach (49) and Campus Hub Leader (48) — both CanManageMembers: true
    // but IsLeader: false. Without this check, a filter regression would
    // silently grant member management to two extra roles.
    fetchRockData.mockResolvedValue([
      { id: 822084, groupRoleId: 49, groupRole: { isLeader: false } },
    ]);

    await expect(requireGroupLeader(auth, 241543)).rejects.toThrow(
      AuthorizationError,
    );
  });

  it('requests Active status and IsLeader, and never caches the decision', async () => {
    // An authorization decision that outlives a role change is a security bug,
    // and the status filter must use the string form — `eq 1` is an HTTP 400 on
    // both dev (Rock 18.4.1) and prod (Rock 17.7.0).
    fetchRockData.mockResolvedValue([leaderRow]);

    await requireGroupLeader(auth, 241543);

    const [options] = fetchRockData.mock.calls[0];
    expect(options.queryParams.$filter).toContain('GroupId eq 241543');
    expect(options.queryParams.$filter).toContain('PersonId eq 907');
    expect(options.queryParams.$filter).toContain(
      "GroupMemberStatus eq 'Active'",
    );
    expect(options.queryParams.$filter).toContain('GroupRole/IsLeader eq true');
    // An archived membership must never authorize. Dev suggests REST hides
    // archived rows anyway, but that is unproven and prod is a major version
    // behind, so the predicate is the guarantee rather than the observation.
    expect(options.queryParams.$filter).toContain('IsArchived eq false');
    expect(options.queryParams.$filter).not.toMatch(/GroupMemberStatus eq 1\b/);
    expect(options.ttl).toBe(0);
  });

  it('rejects a non-integer groupId without calling Rock', async () => {
    await expect(requireGroupLeader(auth, Number('abc'))).rejects.toThrow(
      AuthorizationError,
    );
    expect(fetchRockData).not.toHaveBeenCalled();
  });
});
