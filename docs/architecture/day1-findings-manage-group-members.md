# Day 1 Findings — Manage Group Members Spike

**Prepared:** 2026-07-27 · **Phase:** Day 1 (orient) · **Branch:** `claude/manage-group-members-day1-193bdt`
**Scope:** Reading and reconnaissance only — no feature code written.

Companion to `spike-brief-manage-group-members.md` (§10 Day 1, and the **Day 0
findings** section appended at `6215f7d`). Read the Day 0 findings first; several
items below correct or extend them.

**Repos examined:**

| Repo               | Commit    | Role                                            |
| ------------------ | --------- | ----------------------------------------------- |
| `remix-web-app`    | `6215f7d` | spike branch; the two reference docs            |
| `services`         | `4dd1ca5` | old Apollos/GraphQL backend — leader-authz spec |
| `legacy-my-groups` | `8e727a0` | interim My Groups app — Manage flow             |

`services` and `legacy-my-groups` were **not** in the spike branch's session scope
(brief §8 predicted this); both were added and cloned for Day 1.

---

## 0. Summary

**Confirmed**

- Leader semantics from the Apollos resolver are fully specified: exact-group
  match, `IsLeader eq true`, Active-only, co-leaders supported, **no parent/child
  inheritance** (§3).
- `GroupMemberStatus` integers `0=Inactive, 1=Active, 2=Pending`; entity JSON and
  write payloads are numeric (§4).
- Attribute values are always a **separate v1 write** — survey open-question #6
  confirmed by production code, not just inferred (§5).
- Legacy has **no hard delete** and **no role-change** capability (§5).
- Brief §8's four legacy paths all exist; one is mischaracterized (§7).

**Still open**

- **Rock CMS version**, dev _and_ prod — still unresolved, now higher priority (§2).
- **`GroupMemberStatus eq '1'`** — legacy production's filter form, untested
  against this Rock; a silent-deny risk (§4).
- **Archived leaders** — neither legacy nor the Day 0 corrected filter handles
  `IsArchived` (§3).
- **`GROUP_ADD_PERSON` workflow type id** — not in any committed config (§5).
- **Coaches as leaders** — role 49 appears to carry `IsLeader = true` (§3).
- **Test-leader and non-leader credentials** — not yet provisioned; blocks Q1 (§8).

**Changes the Day 2–3 plan** — see §8.

---

## 1. Reference docs (brief §2)

### `auth-review.md`

- Credential is `AES-CBC( JWT{ cookie: <Rock .ROCK cookie>, sessionId } )` in an
  HttpOnly `auth-token` cookie. `/Auth/Login` returns **no body token** — the
  `set-cookie` header _is_ the credential
  (`app/lib/.server/authentication/rock-authentication.ts:17-68`).
- **The read-as-user pattern `requireGroupLeader` needs already exists.**
  `getCurrentPerson(rockCookie)` (`rock-authentication.ts:79-111`) passes
  `{ Cookie: rockCookie }` **and** sends `'Authorization-Token': ''` to suppress
  the default app token. That header suppression is the non-obvious part — omit
  it and the "as the user" read silently executes as the service account.
- **C1:** all four write helpers hard-code `ROCK_TOKEN` and accept no headers
  (`app/lib/.server/fetch-rock-data.ts:314-424`). No app-level authorization
  exists anywhere in `app/`. This is why the gate must be app-side.
- **C6:** `getUserFromRequest` returns four different shapes; on an _expired_
  token `currentUser` returns a `data()` object rather than a `Response`, so
  `profile.tsx` renders a broken authed page instead of redirecting. In scope
  per brief §4.1.
- Minor trap for add/remove calls: `patchRockData`/`deleteRockData` prepend `/`
  to the endpoint, `postRockData`/`putRockData` do not
  (`fetch-rock-data.ts:316, 350, 381, 408`).

### `rock-rest-api-survey.md`

- `DELETE /api/GroupMembers/{id}` is a **hard row delete**, no soft-delete
  parameter; cascade to Attendance/History unknown (#4). Soft remove available
  via `GroupMemberStatus` or `IsArchived`.
- Attribute values are a **second-class separate write** (#6) — flagged
  best-effort. **Now confirmed empirically by legacy production code** (§5).
- Auto-fired workflows not answerable from Swagger (#12); real auth mechanism
  not answerable (#14).
- `GroupTypeRoles` and `AttributeValues` have **no v2 route** — role lookups and
  attribute writes force v1.

### Conflicts with the Day 0 findings

1. **`GroupMemberStatus eq 1`** — both docs use the bare numeric form. Day 0
   proved it returns **HTTP 400**. Both reference filters are wrong for this
   instance. Superseded by the Day 0 corrected filter. See §4 for a remaining
   nuance.
2. **`$expand=Group`** — survey Key Finding #1 and brief §7's "A user's groups"
   row both prescribe `$filter=PersonId eq {id}&$expand=Group,GroupRole`. Day 0
   proved `Group` is not a navigation property on `Rock.Model.GroupMember`. Both
   are wrong. This is the core "my groups" read for the whole app, not a
   Manage-flow detail — group data needs a separate `GET /api/Groups/{id}` per
   group, an N+1 unless batched. Unpriced input to Q3.

---

## 2. Rock CMS version (brief §3, §11.1, survey #5)

**Unresolved.** Both `dev-rock.christfellowship.church` and
`rock.christfellowship.church` are blocked by the session's network policy
(`403` on `CONNECT`, confirmed via the agent proxy's relay-failure log). This is
an environment restriction, not a credential or code problem — it requires a
local session.

**Where to look:**

1. **Admin Tools (gear) → Power Tools → Rock Update** — installed version and
   available updates. Most authoritative.
2. **Footer of any internal admin page** — renders `Rock McKinley <x.y.z>`.
3. `curl -sI` and check `Server` / `X-AspNet-Version` / `X-Powered-By` — often
   stripped; treat the admin UI as the real answer.

**Priority raised.** Get the version for **both dev and prod**, not just dev. A
version delta between the two is the leading hypothesis for the filter
discrepancy in §4.

---

## 3. Leader-authorization spec from `services` (brief §4.2, §11.3)

Three functions, all under `applications/graphql/src/data/`:

| Function                                              | Location                              | Role                                                   |
| ----------------------------------------------------- | ------------------------------------- | ------------------------------------------------------ |
| `GroupItem.userIsLeader(groupId, personId)`           | `group-item/data-source.js:207-218`   | the actual check                                       |
| `GroupItem._requireCurrentUserIsGroupLeader(groupId)` | `group-item/data-source.js:1941-1958` | throws `ForbiddenError`                                |
| `GroupMember._protectedAction(groupMemberId)`         | `group-member/data-source.js:553-570` | resolves `groupId` from the member row, then delegates |

The entire check (`group-item/data-source.js:207-218`):

```js
userIsLeader = async (groupId, personId) => {
  const leaders = await this.request('GroupMembers')
    .filter(`GroupId eq ${groupId}`)
    .andFilter('GroupRole/IsLeader eq true')
    .andFilter(`GroupMemberStatus eq '1'`)
    .get();
  const leaderIds = leaders.map(
    ({ personId: groupMemberPersonId }) => groupMemberPersonId,
  );
  return leaderIds.includes(personId);
};
```

### Co-leaders — fully supported

All leader rows are fetched and tested with `leaderIds.includes(personId)`
(`:213-217`). No "the leader" singular assumption anywhere in the authz path.

### Co-leaders, the part that will bite: Coaches count as leaders

`group-member/resolver.js:26-29`:

```js
if (groupRole?.isLeader && groupRoleId !== 49) return 'LEADER';
if (groupRole?.id === 49) return 'COACH';
return 'MEMBER';
```

The `!== 49` exclusion is only necessary if **role 49 carries `IsLeader = true`**
in Rock — meaning Coaches pass `userIsLeader` and can add/remove members, while
the UI labels them separately. `requireGroupLeader` must make an explicit call:
match legacy (coaches authorized) or diverge. Product question, not technical.
Verify with `GET /api/GroupTypeRoles/49`.

### Deactivated leaders — denied

`GroupMemberStatus eq '1'` restricts to Active. Inactive (0) and Pending (2)
leaders fail the gate. Matches the brief's intent.

### Archived leaders — NOT handled

`userIsLeader` has **no `IsArchived` filter**. Sibling queries in the same
codebase do (`group-member/data-source.js:368`, `:408`;
`group-item/data-source.js:1236`, `:1349`), so this is an inconsistency rather
than a convention. Either Rock's REST layer excludes archived rows from
`GroupMembers` by default, or an archived-but-Active leader retains full access
in legacy today. **Not resolvable from code — needs an empirical check.** The
Day 0 corrected filter also omits `IsArchived`. Do not copy the omission blindly.

### Parent/child inheritance — none

The filter is `GroupId eq {groupId}`, exact match. There is no parent traversal
anywhere in the authz path; the only parent-group code in the repo is
`getGroupParentVideoCallParams` (`group-item/data-source.js:959`), unrelated to
permissions. **Leading a parent group confers nothing on a child group.**

### One extra invariant the brief does not mention

`updateStatus` refuses self-edits — `You cannot make a change to your own record.`
(`group-member/data-source.js:148`). A leader cannot change their own status.
Belongs in the action layer, not in `requireGroupLeader`.

### A bug not to replicate

Four call sites invoke `userIsLeader` **without `await`** —
`if (this.userIsLeader(groupGlobalId, currentPerson.id))` at
`group-item/data-source.js:251, 282, 318, 348` (`updateCoverImage`,
`addResource`, `updateResource`, `removeResource`). A pending Promise is always
truthy, so **those four guards never deny anyone.** The group-member mutation
paths (`_protectedAction`, `_requireCurrentUserIsGroupLeader`) await correctly,
so member management is genuinely gated — only the resource/cover-image paths
are open. Worth reporting to whoever still owns `services`.

### Recommended `requireGroupLeader` query

Prefer the **Day 0 corrected filter** over legacy's form:

```
GroupMembers?$filter=GroupId eq {groupId} and PersonId eq {personId} and GroupMemberStatus eq 'Active'&$expand=GroupRole
```

It returns exactly the caller's row(s) — the `GroupLeadership { groupMemberId,
groupRoleId, isLeader }` shape the helper needs — and avoids depending on the
nav-property filter (`GroupRole/IsLeader eq true`) that legacy uses but Day 0
never tested. Day 0 confirmed `$expand=GroupRole` works; **filtering** on a nav
property is a separate question. If it does work, it collapses the gate to one
call with no app-side scan — keep it as an optimization to test, not a
dependency.

---

## 4. `GroupMemberStatus` enum (brief §11.2)

**Settled by Day 0**, with one live risk remaining.

The integer mapping is unambiguous (`group-member-status/data-source.js:12-16`):

```js
validStatuses = [
  { id: 0, label: 'Inactive' },
  { id: 1, label: 'Active' },
  { id: 2, label: 'Pending' },
];
```

Writes are numeric — `patch(\`GroupMembers/${id}\`, { GroupMemberStatus: status })`
(`group-member/data-source.js:186-188`) — consistent with Day 0's observation
that `POST` accepts `GroupMemberStatus: 1`. Day 0's `$filter` finding
(`eq 'Active'`required,`eq 1` → 400) is authoritative and supersedes both
reference docs.

### The remaining risk: legacy uses a third form

Legacy production filters with `GroupMemberStatus eq '1'`
(`group-item/data-source.js:211`) — a **quoted numeral**, neither documented
form.

Day 0's 400 was a **type** error (`Edm.String` vs `Edm.Int32`), so `'1'` is
type-_valid_ and will not 400. The question is whether it **matches**. If Rock
compares against the enum name, `eq '1'` returns **zero rows with no error** —
and inside `userIsLeader` that reads as "not a leader", **denying everyone
silently**. Fails closed, no exception, no log.

Two readings, and they diverge sharply:

- **`eq '1'` returns rows on dev** → Rock accepts both forms, legacy is fine.
- **`eq '1'` returns zero rows on dev** → legacy's leader check cannot work on a
  Rock of this version. Since legacy My Groups demonstrably worked in production
  (a broken gate would have 403'd every leader — highly visible), that implies
  **prod and dev Rock differ behaviorally**, which is why §2 now asks for both
  versions.

**Test all three forms against the same group and compare row counts** before
writing `requireGroupLeader`. Ten minutes; it gates the entire authorization path.

---

## 5. `legacy-my-groups` Manage implementation (brief §8)

### Path confirmation

| Brief §8 path                               | Status                                                |
| ------------------------------------------- | ----------------------------------------------------- |
| `hooks/useGroupMembers.js`                  | exists — **mischaracterized**, see below              |
| `components/Modals/AddGroupMemberModal`     | `AddGroupMemberModal.js`, 269 lines                   |
| `components/Modals/GroupMemberDetailsModal` | `GroupMemberDetailsModal.js`, 165 lines               |
| `components/.../GroupEmailComposer`         | `components/GroupEmailComposer/GroupEmailComposer.js` |

`useGroupMembers.js` is **46 lines and query-only** — a single `getGroupMembers`
`useQuery`. Brief §8 states it holds "the `groupMembers(groupId)` query and the
add/remove/update mutations"; the mutations are **not** there. They live in
**`hooks/useAddGroupMember.js`** and **`hooks/useEditGroupMember.js`**.

### Add — a workflow, not a REST insert

Mutation `addPersonToGroup(groupId, person: PersonInput)`. The client submits a
**new-person form** (firstName, lastName, gender, phoneNumber, email, campusId)
and **never a personId** (`AddGroupMemberModal.js:66-78`).

Server side (`group-item/data-source.js:1114-1171`):

1. `_requireCurrentUserIsGroupLeader(groupId)` (`:1121`)
2. `Person.hasEmailOrPhoneNumber(person, true)` — one is mandatory (`:1124`)
3. `campusId` required, else `UserInputError` (`:1134`)
4. `Person.create(typeSafePerson)` — dedupe delegated to Rock, not done here
5. optional `PhoneNumber.addPhoneNumberToPerson`
6. **fires Rock workflow `GROUP_ADD_PERSON`** (`:1158-1166`; id from
   `ROCK_MAPPINGS.WORKFLOW_IDS.GROUP_ADD_PERSON` via `:93-94`).
   `!workflow || status === 'Failed'` → throw
7. `GroupMember.indexGroup(groupId)` (search reindex) + `updateCache(groupId)`

**There is no `POST /api/GroupMembers` anywhere in this path.** The workflow
creates the membership.

### Remove — does not exist

No delete mutation exists anywhere in `legacy-my-groups`. Removal is
`updateGroupMemberStatus` → Inactive (0), and Inactive **requires** an
`inactiveStatusReasonId` — a DefinedValue from
`INACTIVE_GROUP_MEMBER_STATUS_REASONS` (`group-member/data-source.js:160-183`).

This converges with Day 0, which reversed the gate write via `PATCH` → Inactive
rather than `DELETE`. **One parity gap:** legacy also writes the
`MemberInactiveReason` attribute _before_ the PATCH. Remove-with-parity is
2 writes + a DefinedValue lookup.

### Update — status and note only

`updateStatus` (`group-member/data-source.js:133-215`):

1. `_protectedAction(groupMemberId)` — leader gate
2. self-edit guard (`:148`)
3. `GroupMemberStatus.isValid(status)`
4. snapshot for rollback
5. if Inactive: resolve the reason's GUID, then
   `postAttributeValue(id, 'MemberInactiveReason', guid)` (`:182`)
6. `PATCH GroupMembers/{id} { GroupMemberStatus: status }` (`:186-188`)
7. on PATCH failure, **manually restore the previous attribute value** and throw
   (`:190-196`)
8. `cleanCache` + `_updateModifiedByPersonAliasId`

Step 7 is a hand-rolled compensating rollback — attribute written _before_ the
entity patch, no transaction. There is also a documented Rock quirk at
`:203-207`: a `GET` immediately after a `PATCH` returns stale data, so the object
is merged client-side rather than re-read. **Note this against Day 0's finding
that `PATCH` returns 204 and requires a follow-up `GET`** — that follow-up may
return stale data.

`updateNote` (`:106-123`) writes/removes the `LeaderNote` attribute.

### Attributes — always a separate v1 call, in the query string

`postAttributeValue` (`group-member/data-source.js:236-250`) issues
`POST /GroupMembers/AttributeValue/{id}?attributeKey=X&attributeValue=Y` —
parameters in the URL, **no body**. `deleteAttributeValue` (`:253-263`) mirrors
it. This **empirically confirms survey #6**: legacy production never sets
attribute values inline on the entity.

### Role changes — not supported at all

No mutation, no UI. `groupRoleId` appears only as a read field
(`hooks/useGroupMember.js:16`).

### Side effects

Rock workflow on add; search reindex (`GroupMember.indexGroup`); Redis
invalidation (`updateCache`, `cleanCache`); `ModifiedByPersonAliasId` stamped
manually on every mutation; `GroupEmailComposer` launches its own workflow behind
a **second** authz check that additionally requires the leader to have their own
GroupMember row (`group-email/data-source.js:70-84`). On the client, add does a
blunt `router.reload()` 1s after success (`AddGroupMemberModal.js:105-110`),
while the details modal does a proper Apollo `cache.modify`.

---

## 6. Gaps between the old system and the new REST approach (Q6)

Flagging only — not solving.

1. **Add is a workflow, not an insert.** Legacy fires `GROUP_ADD_PERSON`; the
   brief (§4.5, §7) assumes `POST /api/GroupMembers`. Either replicate the
   workflow launch — the type id lives in `ROCK_MAPPINGS`, not in any committed
   config — or POST directly and accept losing whatever the workflow does
   downstream.
2. **This likely explains the Day 0 workflow mystery.** Day 0 found 4 triggers on
   group type 31 but no run entry for Activity Indicators after a REST `POST`.
   Because legacy **never POSTed** `/api/GroupMembers`, the "do REST writes trip
   the triggers?" question has **never had a production answer** — production did
   not take that path. The Day 0 negative result may be true behavior rather than
   an observation gap. Two independent mechanisms are in play (Rock-side
   `GroupMemberWorkflowTriggers` vs. an explicit `GROUP_ADD_PERSON` launch), and
   the cache-flush trigger is separate from that workflow — so seeing the flush
   fire would _not_ confirm the add is complete.
3. **No add-by-existing-person flow to port.** Brief §5 says "add a member by
   email or person-id lookup"; legacy always creates a person and delegates
   dedupe to Rock. Product decision.
4. **No hard delete to replicate.** Legacy's remove is soft + mandatory inactive
   reason. Q1's DELETE-cascade question stays worth answering, but parity does
   not require it.
5. **Attribute writes are v1-only and separate**, confirming survey #6/#10 and
   colliding with brief §3's no-v2-route coverage gap.
6. **No transactionality.** Legacy hand-rolls compensating rollback across a
   2-call write. Feeds Q5.
7. **Server-side invariants with nowhere to live.** Self-edit guard,
   Coach-counts-as-Leader, inactive-reason requirement, `ModifiedByPersonAliasId`
   stamping. Under write model (a) the service account can do anything, so every
   one of these must move into our action layer or it silently disappears.
8. **The member list is not REST in legacy.** `getForGroup` calls a **SQL Server
   stored procedure** (`GROUP_MEMBERS_BY_GROUP`) via `mssql`, with role/status/
   text filters as table-valued params (`group-member/data-source.js:271-345`).
   The new architecture has no DB access, so OData must reproduce that filtering
   — and Q3's latency numbers are being compared against a stored proc, not a
   REST call.
9. **Round-trip inflation.** Day 0: `POST` returns a bare integer with no
   `Location`; `PATCH` returns 204. Combined with the separate attribute write,
   add is `POST` + `GET` (+ workflow) and remove-with-parity is attribute-write +
   `PATCH` + `GET`. Q3 should count round-trips, not just payload size.
10. **Role changes are greenfield** — no legacy behavior to match.

---

## 7. Corrections owed to existing docs

Not applied here — recorded so the brief and survey can be patched deliberately.

| Doc                                   | Location                           | Correction                                                                                                                                                       |
| ------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spike-brief-manage-group-members.md` | §8, group-member management bullet | `hooks/useGroupMembers.js` is query-only; add/update mutations are in `hooks/useAddGroupMember.js` and `hooks/useEditGroupMember.js`. No remove mutation exists. |
| `spike-brief-manage-group-members.md` | §7 table, "A user's groups" row    | `$expand=Group` is invalid — `Group` is not a navigation property on `Rock.Model.GroupMember` (Day 0). `$expand=GroupRole` works.                                |
| `spike-brief-manage-group-members.md` | §4.2, reference filter             | `GroupMemberStatus eq 1` → HTTP 400. Use the Day 0 corrected filter.                                                                                             |
| `rock-rest-api-survey.md`             | Key Finding #1                     | Same `$expand=Group` correction.                                                                                                                                 |
| `auth-review.md`                      | §B proposed `requireGroupLeader`   | Same `eq 1` correction.                                                                                                                                          |

---

## 8. What this changes for Day 2–3

1. **Run the filter shootout before writing `requireGroupLeader`** (§4). Three
   forms, same group, compare row counts. Everything downstream depends on it.
2. **Use the Day 0 corrected filter as the gate query** (§3), with
   `GroupRole/IsLeader eq true` as an optimization to test, not a dependency.
3. **Decide `IsArchived` explicitly** rather than inheriting legacy's omission.
4. **Decide the Coach question** — `GET /api/GroupTypeRoles/49`.
5. **Promote Q2 into the Day 2 build.** If add is workflow-driven, the "add
   member" prototype is a `LaunchWorkflow` call, not a `POST` — an architectural
   fork. Building the POST version first may prototype the wrong thing. Pull the
   `GROUP_ADD_PERSON` type id from Rock admin alongside the version lookup.
6. **Prototype remove as soft-remove-with-reason**, matching legacy and Day 0.
   Keep DELETE-cascade as the time-boxed probe it already is.
7. **Budget for multi-call writes with compensating rollback** in both paths.
8. **Add the self-edit guard and the Coach decision to `requireGroupLeader`'s
   scope** — under service-account writes nothing else enforces them.
9. **Cost the `$expand=Group` fallout** — per-group `GET /api/Groups/{id}` for
   the "my groups" read is an unpriced N+1 that lands in Q3.

### Blocker to clear before Day 4

Day 0 gate check #1 asks for _"a test person who is an active leader of at least
one test group."_ What was resolved was the **service account** (`personId`
389650, `primaryAliasId` 389595, name `"apollos"`). The Day 0 findings
acknowledge leader authz is untested; the sharper consequence is that **Q1 cannot
run without two real user credentials** — an active leader and a non-leader.
Write model (b) additionally needs a genuine login, since the `.ROCK` cookie only
exists as a `/Auth/Login` artifact.

Day 2–3 can proceed. **Provision both test users now** rather than discovering
this on Day 4.

---

## 9. Local-session checklist

The Rock hosts are unreachable from a Claude Code web session (network policy,
§2). Run these locally, in roughly this order:

1. **Rock CMS version, dev _and_ prod** — Admin Tools → Power Tools → Rock
   Update, or the admin footer. A delta between the two is the leading
   hypothesis for §4.
2. **Filter shootout** — same group, compare row counts:
   `GroupMemberStatus eq 'Active'` / `eq '1'` / `eq 1`.
   Zero rows on `'1'` is the finding to watch for.
3. **`GroupRole/IsLeader eq true` as a `$filter`** — works or not? Legacy relies
   on it; Day 0 only confirmed `$expand=GroupRole`.
4. **`IsArchived eq false`** — does adding it to the gate query change the leader
   count for a group with archived members?
5. **`GET /api/GroupTypeRoles/49`** — does the Coach role carry `IsLeader = true`?
6. **`GROUP_ADD_PERSON` workflow type id** — from Rock admin's workflow list or
   the deployed `ROCK_MAPPINGS` config.
7. **Provision a test leader and a test non-leader** with known credentials
   (§8 blocker).
