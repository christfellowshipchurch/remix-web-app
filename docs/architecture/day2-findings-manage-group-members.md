# Day 2 Findings — Manage Group Members Spike (Rock-connection checks)

**Prepared:** 2026-07-30 · **Phase:** Day 2 (empirical checks, pre-build)
**Environment:** local session — **both Rock hosts are reachable**, clearing the
blocker that stopped Day 1 (§2 of the Day 1 findings).

Auth for every call below: `Authorization-Token: $ROCK_TOKEN` (the service
account, `personId` 389650). The same token authenticates against **both** dev and
prod.

Companion to `day1-findings-manage-group-members.md` (§9 local-session checklist)
and the Day 0 findings appended to `spike-brief-manage-group-members.md`.

---

> # ⚠️ READ FIRST — every id in this document is dev-only
>
> **Dev is a clone of production, but the ids have DRIFTED. The same id is a
> different entity on each host.**
>
> Two proven cases, both of them fixtures used throughout this document:
>
> | Id        | On **dev** (`dev-rock.christfellowship.church`)      | On **PROD** (`rock.christfellowship.church`)                    |
> | --------- | ---------------------------------------------------- | --------------------------------------------------------------- |
> | Group **1838823** | "Jedi Council Test Group", group type **31** — a disposable spike fixture | A **Known Relationship system group, group type 11** — not a test group at all |
> | Group **1055022** | "CFDP Testing Group", group type 31, 37 members       | A **real group** under the same id                                |
>
> **The rule: never assume an id means the same entity across hosts.** Resolve
> every id against the host you are actually talking to, by name or by a
> `$select`ed read, before you use it in a `$filter` and *especially* before you
> use it in a write. A fixture id copy-pasted from this document into a session
> pointed at prod does not fail loudly — it succeeds, against the wrong entity.
>
> This is not hypothetical. `ROCK_API` in both `.env` and `.env.local` points at
> **production** (§30, and follow-up ticket 1), so a session that does not
> hardcode the dev host is writing to prod by default. Every write recorded in
> this document was made against a **deliberately hardcoded dev host** for exactly
> this reason.
>
> Consolidated ledger of every record this spike touched: **§32**.

---

## 0. Summary

Six of the seven checklist items are resolved. Headline results:

| #   | Check                                     | Result                                                                                      |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Rock CMS version, dev _and_ prod          | **Dev 18.4.1.0, prod 17.7.0.0 — a full major version apart**                                |
| 2   | Filter shootout                           | `eq 'Active'` and `eq '1'` are **equivalent**; `eq 1` → 400. Silent-deny risk **refuted**   |
| 3   | `GroupRole/IsLeader eq true` as `$filter` | **Works** — the gate collapses to one call                                                  |
| 4   | `IsArchived`                              | REST appears to **never return archived rows**; filtering is a no-op. Not decisively proven |
| 5   | `GET /api/GroupTypeRoles/49`              | Coach is **`IsLeader: false`** — contradicts the Day 1 inference                            |
| 6   | `GROUP_ADD_PERSON` workflow type id       | **Very likely 654** (`ADD TO GROUP/CLASSES`). Inferred, not confirmed                       |
| 7   | Test leader / non-leader credentials      | **Still not provisioned** — blocks Q1                                                       |

**Every check was run against dev _and_ prod where it mattered. All tested
surfaces behave identically despite the version gap.**

---

## 1. Rock CMS version — the delta is real

```
GET /api/EntityTypes/27?$select=Id,Name,AssemblyName
```

| Host                               | `AssemblyName` version   |
| ---------------------------------- | ------------------------ |
| `dev-rock.christfellowship.church` | `Rock, Version=18.4.1.0` |
| `rock.christfellowship.church`     | `Rock, Version=17.7.0.0` |

A corroborating signal: `GET /api/GroupTypeRoles/49` returns an `IsPublic` field
on dev and **omits it on prod** — a schema difference consistent with the version
gap.

**Consequence.** Day 1 §2 wanted this to explain the filter discrepancy. It does
not (see §2 — there is no discrepancy). But the delta is now a standing risk:
**dev is one major version ahead of the environment the app will actually run
against.** Anything validated only on dev is provisionally true. Everything in
this document was therefore re-run on prod.

---

## 2. Filter shootout — the silent-deny risk is refuted

Test group **241543**, which conveniently holds exactly one active member of each
interesting role. Run identically on dev and prod.

| Form                            | dev             | prod            |
| ------------------------------- | --------------- | --------------- |
| `GroupMemberStatus eq 'Active'` | **4 rows**, 200 | **4 rows**, 200 |
| `GroupMemberStatus eq '1'`      | **4 rows**, 200 | **4 rows**, 200 |
| `GroupMemberStatus eq 1`        | **400**         | **400**         |

The 4 rows returned are byte-identical between the two quoted forms:

```json
[
  { "Id": 799452, "PersonId": 907, "GroupRoleId": 50 },
  { "Id": 822084, "PersonId": 21567, "GroupRoleId": 49 },
  { "Id": 800501, "PersonId": 72911, "GroupRoleId": 47 },
  { "Id": 800502, "PersonId": 85989, "GroupRoleId": 48 }
]
```

`eq 1` fails the same way on both hosts:

```json
{
  "Message": "The query specified in the URI is not valid. A binary operator with incompatible types was detected. Found operand types 'Edm.String' and 'Edm.Int32' for operator kind 'Equal'."
}
```

**Rock accepts both `'Active'` and `'1'` and treats them as the same predicate.**
Day 1 §4's silent-deny scenario — legacy's `eq '1'` matching zero rows and
denying every leader — **does not occur on either host.** Legacy's leader check
works. The dev/prod behavioural-divergence hypothesis built on top of it is dead.

Day 0's `eq 1` → 400 finding is reproduced exactly, on both hosts.

---

## 3. `GroupRole/IsLeader eq true` works as a `$filter`

```
GET /api/GroupMembers?$filter=GroupId eq 241543
    and GroupRole/IsLeader eq true
    and GroupMemberStatus eq 'Active'
```

Returns **2 rows on both dev and prod** — roles 50 and 47 only:

```json
[
  { "Id": 799452, "PersonId": 907, "GroupRoleId": 50 },
  { "Id": 800501, "PersonId": 72911, "GroupRoleId": 47 }
]
```

Day 1 §3 kept this as "an optimization to test, not a dependency" because Day 0
had only confirmed `$expand=GroupRole`. **Filtering on the nav property works.**
The gate can be a single call that returns only authorized rows, with no
app-side scan — `requireGroupLeader` becomes "did this return ≥1 row?".

Adding `and PersonId eq {personId}` narrows it to the caller. Recommended gate
query:

```
GroupMembers?$filter=GroupId eq {groupId} and PersonId eq {personId}
  and GroupMemberStatus eq 'Active' and GroupRole/IsLeader eq true
  &$expand=GroupRole
```

`$expand=GroupRole` is retained only to populate `GroupLeadership.groupRoleId` /
`isLeader` for the return value; the authorization decision no longer depends on
reading it.

---

## 4. The role table — Day 1's Coach inference is wrong, and there is a second surprise

```
GET /api/GroupTypeRoles?$filter=GroupTypeId eq 31
    &$select=Id,Name,IsLeader,CanManageMembers,CanEdit
```

Group type 31, dev (prod agrees for role 49, the one cross-checked):

| Id  | Name                                      | `IsLeader` | `CanManageMembers` | `CanEdit` |
| --- | ----------------------------------------- | ---------- | ------------------ | --------- |
| 44  | Group Member                              | false      | false              | false     |
| 45  | Group Leader (Old, Do Not Use)            | false      | false              | false     |
| 46  | Prospective Member (Old Role, Do Not Use) | false      | false              | false     |
| 47  | Group Co-Leader                           | **true**   | true               | false     |
| 48  | **Campus Hub Leader**                     | **false**  | **true**           | **true**  |
| 49  | **Group Coach**                           | **false**  | **true**           | **true**  |
| 50  | Group Leader                              | **true**   | true               | false     |

### Correction to Day 1 §3

Day 1 reasoned that the resolver's `groupRoleId !== 49` guard "is only necessary
if role 49 carries `IsLeader = true`". **It does not.** Coach is
`IsLeader: false` on both dev and prod. The guard is dead defensive code, or
reflects a Rock configuration that has since changed. **Coaches do not pass
`userIsLeader` in legacy today** — the product question Day 1 raised is already
answered by the data, not by preference.

### The second surprise

**Role 48, "Campus Hub Leader", is named a leader and is configured
`CanManageMembers: true` — but `IsLeader: false`.** Same shape as Coach. So an
`IsLeader`-based gate denies two of the four roles that Rock's own configuration
says can manage members.

This reframes the design decision. It is no longer "do coaches count?" but:

> Does the gate mean `IsLeader` (2 of 7 roles: 47, 50 — matches legacy exactly)
> or `CanManageMembers` (4 of 7 roles: 47, 48, 49, 50 — matches Rock's configured
> intent)?

Legacy chose `IsLeader`. Rock's role config says `CanManageMembers`. **These
disagree, and the disagreement is invisible in legacy** because legacy never
consulted `CanManageMembers`. Whether Campus Hub Leaders and Coaches currently
expect to manage members is a product/ops question worth asking before it is
baked into `requireGroupLeader`.

`CanManageMembers` is filterable the same way (`GroupRole/CanManageMembers eq
true`), so either choice is one call.

---

## 5. `IsArchived` — probably a no-op, not decisively proven

Two observations on dev:

1. `$filter=IsArchived eq true` (no other predicate, `$top=5`) → **`[]`**, HTTP 200.
2. Adding `and IsArchived eq false` to the §3 gate query → **still the same 2
   rows**, unchanged.

Both are consistent with Rock's REST layer excluding archived rows from the
`GroupMembers` queryable before OData is applied, which would make an
`IsArchived` predicate unreachable and therefore pointless.

**But observation 1 is ambiguous** and I am not claiming it proven: zero rows is
equally consistent with "this dev database simply contains no archived group
members anywhere". I could not distinguish the two read-only —
`$count` and `$inlinecount=allpages` are both unsupported on this Rock
(`/$count` → 400 `The value '$count' is not valid for Int32.`;
`$inlinecount` is silently ignored and returns a bare array), so a
total-vs-non-archived row-count comparison was not available.

**The decisive experiment is a write:** `PATCH` a disposable test member to
`IsArchived: true`, then re-run the gate query and see whether the row vanishes.
That has not been run — it mutates a record, and this environment is a clone of
production containing real people's rows, so it is being left for an explicitly
chosen throwaway member. It pairs naturally with the remove-path prototype.

**Practical recommendation:** omit `IsArchived` from the gate query. If REST
hides archived rows the predicate is dead weight; if it does not, the archived
question is a genuine product decision that should be made deliberately rather
than inherited. Either way, do not add it on the strength of the evidence above.

---

## 6. `GROUP_ADD_PERSON` — very likely workflow type 654, not confirmed

**Candidate: `WorkflowType` 654, `ADD TO GROUP/CLASSES`**, `IsActive: true`,
Guid `4df7b9ea-10a4-4987-bf47-dfe9d3adb5c1`, description "And sends email
confirmations".

Three converging lines of evidence:

1. **Name and purpose match.** It is the generic add-to-group entry point.
2. **A sibling workflow points at it.** `WorkflowType` 780, `Add to Group 2
(Manually added by Group Leader)`, describes itself as "launched from workflow
   `...?workflowTypeId=654` when group members manually added to a group by a
   leader". So 654 is the entry point and **780 is downstream of it** — worth
   noting, because 780's name is the more tempting match.
3. **654 carries a `GroupLeaderAdd` attribute** — a leader-add code path exists
   inside it by design.

Its workflow attributes (`GET /api/Attributes?$filter=EntityTypeQualifierColumn
eq 'WorkflowTypeId' and EntityTypeQualifierValue eq '654'`), which are the keys a
`LaunchWorkflow` call would set — all 23 are `IsRequired: false`:

| Key                                                               | Name                 |
| ----------------------------------------------------------------- | -------------------- |
| `Group`                                                           | Group                |
| `Person`                                                          | Person               |
| `Campus1`                                                         | Person Campus        |
| `GroupId`                                                         | GroupId              |
| `PersonId`                                                        | PersonId             |
| `GroupMemberId`                                                   | Group Member Id      |
| `GroupMember`                                                     | Group Member         |
| `GroupType`                                                       | Group Type           |
| `GroupLeaderAdd`                                                  | **Group Leader Add** |
| `MemberAdd`                                                       | Group Member Entry   |
| `EntrySource`                                                     | Entry Source         |
| `Address`, `PhoneNumber`, `SMSOptedOut`, `EmailInfo`              | contact details      |
| `Childcare`, `Class`, `GroupBreakout`, `Language`, `PrayerCourse` | group flags          |
| `ConnectionStatus`, `RecordStatus`, `Minutessincepersoncreated`   | person flags         |

**This is an inference, not a confirmation.** The authoritative value lives in the
deployed `ROCK_MAPPINGS.WORKFLOW_IDS.GROUP_ADD_PERSON` config, which is not in any
committed file and was not available in this session. Confirm against the
deployed env config before relying on 654. Every attribute being optional also
means a wrong-but-valid launch would fail silently rather than error.

---

## 7. `$expand=Group` — Day 0's finding confirmed on prod

```
GET /api/GroupMembers?$filter=GroupId eq 241543&$expand=Group
```

→ **400 on prod** (as on dev):

```json
{
  "Message": "The query specified in the URI is not valid. Could not find a property named 'Group' on type 'Rock.Model.GroupMember'."
}
```

Confirms the Day 1 §1 correction owed to `rock-rest-api-survey.md` Key Finding #1
and brief §7 on **both** environments. The N+1 for the "my groups" read is real
and stays an unpriced input to Q3.

**`$expand=Person`, however, works** — so the _member list_ is a single call with
no N+1, unlike the "my groups" read:

```
GET /api/GroupMembers?$filter=GroupId eq 241543&$expand=GroupRole,Person
    &$select=Id,PersonId,GroupMemberStatus,GroupRole/Name,GroupRole/IsLeader,
             Person/NickName,Person/LastName,Person/Email
```

Returns names, emails, roles and status for all 5 members of group 241543 in one
request. The N+1 problem is specific to `Group`, not to `$expand` generally.

---

## 8. Gate query verification — most of the Q1 matrix, without test users

The exact `$filter` that `requireGroupLeader` builds, run once per person against
group 241543 on dev. This substitutes for the missing test credentials on the
_authorization-logic_ half of Q1, though not the _authentication_ half.

| Person | Role                             | `IsLeader` | Status   | Gate rows | Decision  |
| ------ | -------------------------------- | ---------- | -------- | --------- | --------- |
| 907    | Group Leader (50)                | true       | Active   | 1         | **ALLOW** |
| 72911  | Group Co-Leader (47)             | true       | Active   | 1         | **ALLOW** |
| 21567  | Group Coach (49)                 | false      | Active   | 0         | **DENY**  |
| 85989  | Campus Hub Leader (48)           | false      | Active   | 0         | **DENY**  |
| 10600  | Group Coach (49)                 | false      | Inactive | 0         | **DENY**  |
| 389650 | (service account — not a member) | —          | —        | 0         | **DENY**  |

Co-leaders pass, confirming the Day 1 §3 reading. Coaches and Campus Hub Leaders
are denied, which is the `IsLeader` decision from §4 taking effect.

Person 10600 is denied for two reasons at once (wrong role _and_ Inactive), so it
does not isolate the status filter. A clean isolation, same person and group,
leader role 101, differing only by the status predicate:

| Query on group 235716, person 1                                        | Result                        |
| ---------------------------------------------------------------------- | ----------------------------- |
| `... and GroupRole/IsLeader eq true` (no status predicate)             | 1 row, `GroupMemberStatus: 0` |
| `... and GroupMemberStatus eq 'Active' and GroupRole/IsLeader eq true` | **0 rows**                    |

So the `Active` predicate alone is what denies a deactivated leader. Day 1 §3's
"deactivated leaders are denied" is confirmed empirically rather than by reading
the filter.

---

## 9. Still open

_Updated at the end of session 5 (Day 4, 2026-08-03). Resolved items struck
through with a pointer to where they were settled._

- **`removeMember` does not verify that `groupMemberId` belongs to `groupId`**
  (§28) — **NEW, and the most serious item in this list.** A leader of any group
  can soft-remove **any `GroupMember` row in the instance** by posting its id.
  Per §20 there is no backstop: no controller `Auth` rules, service-account
  writes, app-side gate is the only control. **Closed by §28's pre-read**, which
  is the same read that fixes Q4 — one change, both problems. Spike code, not
  shipped; must not ship.
- ~~**Whether a REST `POST` trips Rock's `GroupMemberWorkflowTriggers`**~~ —
  **RESOLVED: it does.** See §14.
- **Re-adding a soft-removed member is a 400** and the prototype's add path does
  not handle it (§15). Still the highest-priority *functional* gap. **Spec now
  written (§29); not implemented.**
- **Changing a member's role collides the same way** (§26) — `PATCH GroupRoleId`
  returns the byte-identical 400 when a dormant row holds the target role. Role
  change is therefore a **third** write shape, not covered by §29's upsert, and
  is out of prototype scope until specified deliberately.
- **Three by-id `$expand`/`$select` call sites** (§27). Only one expects a nav
  property and it is the spike's own read-back; the two shipped sites `$select`
  scalars, so they overfetch ~17× uncached but are **not** incorrect. The durable
  fix is a guard in `fetchRockData`, not three edits. **No shipped correctness
  bug — recorded so this is not re-escalated.**
- **`AuthorizationError` does not produce a 403** — it produces a 500 rendered as
  the generic "not found" page (§13). Decide the error contract before build.
- ~~**Role 48 / `CanManageMembers` disagreement**~~ — **RESOLVED (product,
  2026-07-31): Campus Hub Leader (role 48) does not need to manage members. The
  `IsLeader` gate stands as-is.** No code change; §12's gate is correct as built.
  **The second-order risk in §12 is not closed by this decision:** `IsLeader`
  remains **admin-editable in the Rock UI**, so who can add and remove members can
  still change with no deploy, no code review, and no audit trail on our side.
  That coupling stays on the table as an architecture concern.
- ~~**Test leader and non-leader credentials (checklist #7)**~~ — **PROVISIONED
  and used in session 4.** `/Auth/Login` and the `.ROCK` cookie are now
  characterized (§20). **Q1 model (b) is resolved: DEAD as configured** — a
  per-user cookie cannot read or write group entities on this Rock, because the
  `GroupMembers` REST controller has no `Auth` rules and defaults to deny.
- **Whether Rock enforces per-group security on REST writes — now known to be
  UNTESTED, not merely unverified** (§20). The controller-level 401 masks it
  entirely. This matters because under model (a) **the app-side gate is the only
  authorization control in the system**, with no demonstrated backstop.
- **`ROCK_TEST_USER` env var holds the wrong username** (`ani@jedi.order`; actual
  is `anakin@jedi.order`). Fails login with a misleading `Invalid login type.`
- **The `.ROCK` cookie is issued without a `Secure` flag** and lives 30 days
  (§20). Rock-side setting; worth raising with the Rock team.
- ~~**The `IsArchived` write probe** (§5)~~ — **RESOLVED (§23).** Archived rows are
  excluded by REST **before** OData applies, so `IsArchived eq false` is a proven
  no-op. Harmless to keep; stop calling it protection. REST archive also leaves
  `ArchivedDateTime` **null** — a half-archived row with no audit trail.
- ~~**Whether a soft remove fires trigger 53**~~ — **RESOLVED (§22): it does not.**
  Neither does an archive, nor does reactivation fire the add trigger. Group type
  31's triggers respond to row creation/deletion, not status transitions.
- ~~**Removals never flush the legacy web/app cache**~~ (§22) — **CONFIRMED as
  Rock behaviour, WITHDRAWN as a legacy ask (2026-08-04).** Trigger 49 fires on
  add; trigger 53 does not fire on soft remove or archive. But workflow 700 is
  Apollos-specific (a GraphQL `flushRock` POST — see §22), not a Rock-internal
  cache flush, and legacy-my-groups retires the day the new app launches, so
  there is no coexistence window. The durable residue is that **writes
  originating in Rock never invalidate the new project's Redis** — see the
  decision memo's cache-invalidation build requirement.
- ~~**`WorkflowType` 700 `IsPersisted` must be reverted to `false`**~~ —
  **CLOSED (2026-08-04).** Reverted to `false` by a Rock admin. Two `Workflow`
  rows accumulated while it was `true` (5696074, 5696075 — §32); no further
  accrual.
- **Confirming 654** against the deployed `ROCK_MAPPINGS` (§6).
- ~~**Q4 cache invalidation**~~ — **RESOLVED (§25): YES, a second invalidation
  keyed to the affected person is required.** Actor invalidation provably cannot
  reach it. **Blocked on a small refactor:** `removeMember` is keyed on
  `groupMemberId` and does not know the removed person's id, so the remove path
  cannot issue the second call today. Compounds §22 — a removed member sits stale
  in *two* caches at once. **The refactor is now specified (§28) — resolve
  `personId` server-side, not via the form, because the same read closes the
  authorization hole above. This reverses §25's own recommendation; §25 did not
  know about the missing group-scope check.**
- **`DELETE` cascade behavior** — never probed, by policy (reversibility rule).
- **`MemberInactiveReason` survives reactivation untouched** (§29) — proven by
  `ModifiedDateTime`. The app must clear it on reactivation; Rock will not. Also:
  Rock does **not** require the reason attribute for a status change at all
  (§29) — the mandatory-reason rule is an app/legacy invariant with nothing
  enforcing it underneath.
- ~~**Neither spec (§28, §29) is implemented**~~ — **both now implemented together
  (§31)**, with 10 tests, two of them mutation-checked. The group-scope check and
  the second `invalidateUser` are in place.
- **`MemberInactiveReason` cannot be cleared via the attribute-write endpoint**
  (§31) — an empty `attributeValue=` is a **400**, omitting it is a **404**.
  Clearing requires `GET AttributeValues` + `PATCH AttributeValues/{id}` with
  `{"Value":""}`. **This falsified §29 as originally written.**
- **The remove path's compensating rollback had never worked** (§31) — it issued
  exactly the 400-ing call above, so it always reported `rolledBack: false`.
  Invisible because the `catch` never ran. Now fixed and sharing the verified
  helper. §17's description of it as merely "hand-rolled" was too generous.
- ~~**The spike route has never been exercised end-to-end**~~ — **partially
  closed (2026-08-05, §33).** Auth chain, loader, non-leader denial, and the
  write-path sequence (insert → remove → reactivate) all ran behind a real
  cookie on group 1838823. **Still not exercised live:** upsert no-op and
  decline/role-change branches; group-scope `AuthorizationError` path; self-edit
  guard. See §3a / §3b / §33.
- **Role change is still unspecified and unimplemented** (§26) — the third write
  shape. The add path detects it and declines; nothing performs it.

---

## 10. What was built on this evidence

Brief §4.1–4.4 prerequisites, plus a throwaway prototype. Typecheck, lint and
targeted tests pass; production build compiles and registers the route.

| File                                                     | Purpose                                                                                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/lib/.server/authentication/require-user.ts`         | `getAuthContext` (never throws on auth failure) + `requireUser` (throws `redirect`). An expired token is indistinguishable from an absent one, which is the C6 fix. |
| `app/lib/.server/authentication/require-group-leader.ts` | The gate, using the §3 query verified on both hosts. `IsLeader`, per the decision in §4.                                                                            |
| `app/lib/.server/error-types.ts`                         | `AuthorizationError` → 403.                                                                                                                                         |
| `app/lib/.server/fetch-rock-data.ts`                     | `customHeaders` on all four write helpers; `cacheUserId` option.                                                                                                    |
| `app/lib/.server/cache-utils.ts`                         | `buildUserCacheKey` (person in the key _namespace_, so `invalidateUser` needs no reverse index) + `invalidateUser` (SCAN, never KEYS).                              |
| `app/routes/spike-manage-members.$groupId/`              | Throwaway prototype at `/spike-manage-members/:groupId`. View + add (direct POST) + remove (soft). Deliberately unstyled.                                           |

Tests cover the two non-throwaway pieces: `require-group-leader` (6 tests,
including that a role Rock does not mark `IsLeader` is denied even if Rock
returns the row — a filter regression must not silently authorize roles 48/49)
and the cache helpers (7 tests, including that per-user keys cannot collide with
the shared keyspace).

Two things the prototype encodes that Rock will **not** enforce under
service-account writes, both lifted from legacy:

- **Self-edit guard** — a leader cannot change their own membership row.
- **Mandatory inactive reason** — remove writes the `MemberInactiveReason`
  attribute _before_ the `PATCH`, with a hand-rolled compensating rollback if the
  `PATCH` fails, exactly as legacy does. The reason values come from Rock defined
  type **289** ("Group Member Inactive Reason"); 3 of its 5 values are active:
  `993f485b-…` No longer interested, `564a345a-…` Taking a break,
  `f4eb8667-…` Moved/Passed Away.

**Neither write path has been executed.** Both require a logged-in leader, so the
prototype is compiled and gated but unexercised — the add/remove evidence for
Q2/Q3/Q5 arrives only once test users exist. `WRITE_AS_USER` in `action.ts` is
the model (a)/(b) switch, currently `false`.

## 11. Corrections owed to existing docs

Recorded, not applied — consistent with the Day 1 approach. (Renumbered from a
duplicate `§9` heading.)

| Doc                                     | Location                                    | Correction                                                                                                                                 |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `day1-findings-manage-group-members.md` | §0, §3 "Coaches count as leaders", §8.4     | Role 49 is `IsLeader: false` on dev **and** prod. Coaches do **not** pass `userIsLeader`. The `!== 49` guard is not evidence that they do. |
| `day1-findings-manage-group-members.md` | §0, §4                                      | The `eq '1'` silent-deny risk is refuted — `eq '1'` and `eq 'Active'` return identical rows on both hosts.                                 |
| `day1-findings-manage-group-members.md` | §3 "Recommended `requireGroupLeader` query" | `GroupRole/IsLeader eq true` works as a `$filter`; it can be a dependency, not just an optimization.                                       |
| `rock-rest-api-survey.md`               | Key Finding #1                              | `$expand=Group` → 400 confirmed on prod as well as dev.                                                                                    |

---

# Session 3 — write paths executed (2026-07-31)

Everything below ran against **dev only** (`dev-rock.christfellowship.church`,
Rock 18.4.1), on the service-account token, against **real test group 1055022**
("CFDP Testing Group", group type 31, 37 members / 16 Active).

Test identities supplied for this session were `GroupMember.Id` values, resolved
first:

| `GroupMember.Id` | `PersonId` | `GroupRoleId`                | Status   | `IsArchived` | `GroupId` |
| ---------------- | ---------- | ---------------------------- | -------- | ------------ | --------- |
| 3183436          | **27099**  | **47** Group Co-Leader       | 1 Active | false        | 1055022 ✓ |
| 3329432          | **394626** | **44** Group Member          | 1 Active | false        | 1055022 ✓ |

Note the brief described 3183436 as "Group Leader role"; it is actually role
**47, Group Co-Leader**. Immaterial to the test — 47 is `IsLeader: true` per §4 —
but recorded so the ALLOW result is not misread as evidence about role 50.

---

## 12. Corrections applied, and the role 48 open item

### Applied in place

- **Brief, "Day 0 findings".** The claim that the `GroupMemberStatus eq 1`
  reference filter was "wrong for this Rock instance" was half wrong and is now
  rewritten in place: only the **bare int** `eq 1` is a 400. Rock coerces `eq
  'Active'` and `eq '1'` to the same predicate (§2). The reference filter needed
  **quoting only** — its semantics were correct, and **legacy's leader check was
  never broken**. Any inference built on "legacy silently denied every leader" is
  void.
- **`require-group-leader.ts`.** `IsArchived eq false` added to the gate filter,
  with the reasoning in a comment and an assertion in the test. Re-verified live
  on group 1055022: leader 27099 returns **1 row with or without** the predicate,
  so it is confirmed not to over-deny. It is very likely a no-op on dev, but it
  was never decisively proven to be one, and prod is a **major version behind**
  (§1) — so the predicate, not the observation, is what guarantees an archived
  membership cannot authorize. Free insurance; do not remove it for looking
  redundant.

### Role 48 (Campus Hub Leader) — `IsLeader: false` but `CanManageMembers: true`

Recorded per §4's second surprise. **Product owner's decision: `IsLeader: false`
is intentional** — it is what hides the role from other members inside the group.
So the flag is doing double duty: it is simultaneously a *visibility* control and,
in our gate and in legacy, an *authorization* control.

**This is flagged as an open item to confirm with the Rock team, not as a bug.**
The role config is deliberate; what is unconfirmed is whether the Rock team agrees
that `IsLeader` should also be the authorization predicate, given they may be
setting it for presentation reasons.

> **Superseded 2026-07-31 (Day 3).** Product has decided **Campus Hub Leader does
> not need to manage members**, so the `IsLeader` gate stands as-is and no Rock-team
> confirmation is required. The paragraph above is retained for the reasoning trail.
> **The admin-editable risk below is unaffected by that decision.**

**Second-order risk — the important part.** `IsLeader` is **admin-editable in the
Rock UI**. Because the gate keys on it, **authorization for this feature can
change with no deploy, no code review, and no audit trail on our side.** Someone
toggling a checkbox to change who is visible in a group also silently changes who
can add and remove members. That coupling is worth breaking before build: gating
on an explicit, purpose-built predicate (`CanManageMembers`, or a role allow-list
we own) would at least make the authorization surface intentional. Deferred as a
product/architecture decision, not resolved here.

---

## 13. Gate verified against real members — and the 403 does not exist

`requireGroupLeader` called directly (real function, real Rock, synthetic
`AuthContext` per person, since no `.ROCK` cookie exists to drive the route):

| Person     | Role                | Result    | Detail                                                        |
| ---------- | ------------------- | --------- | ------------------------------------------------------------- |
| **27099**  | 47 Co-Leader        | **ALLOW** | `{ groupMemberId: 3183436, groupRoleId: 47, isLeader: true }`  |
| **394626** | 44 Group Member     | **DENY**  | `AuthorizationError: Person 394626 is not an active leader…`   |
| 389650     | 44, Inactive (§15)  | **DENY**  | Same — confirms the `Active` predicate, post-soft-remove       |

Matches §8's prediction exactly. The third row is a bonus: the member soft-removed
in §15 is denied by the *same* gate immediately afterwards, which is the
authorization half of the remove path working end to end.

### The actual error response shape — not a 403

**`AuthorizationError` does not map to a 403 anywhere.** Verified:

- `e instanceof Response === false`, and it has no `.status` property.
- `grep` over `app/` finds **no** consumer of `AuthorizationError` other than the
  gate that throws it and its own tests. Nothing translates it.
- React Router treats a thrown non-`Response` value as an **unhandled error**, so
  the route answers **HTTP 500**.
- The root boundary, `app/error.tsx:11`, **ignores the error entirely** and
  renders `<NotFound />` unconditionally — no `isRouteErrorResponse` check, no
  status branching.

So a non-leader hitting the route today gets **HTTP 500 with a "page not found"
body**. Three separate problems: the status is wrong, the page contradicts the
status, and the two failure modes a leader cares about (not signed in / not
allowed) are indistinguishable from a server crash.

What *is* correct: it **fails closed**, and the `AuthorizationError` message —
which names the person and group — never reaches the client. That is accidental
rather than designed, but it is not a leak.

The docstring in `require-group-leader.ts` claimed "→ 403". That claim was
corrected in place to describe actual behavior. **Behavior was deliberately not
changed** — throwing `data({...}, { status: 403 })` is a one-line fix, but it sets
the error contract for every future caller and belongs in the build, not in a
spike. This is now a §9 open item.

---

## 14. Q2 — RESOLVED: a REST `POST` **does** trip Rock's workflow triggers

Day 0 could not distinguish "REST writes don't fire triggers" from "no-persist
workflows leave no log". **They fire.** Here is the evidence chain.

### The triggers on group type 31

```
GET /api/GroupMemberWorkflowTriggers?$filter=GroupTypeId eq 31 or GroupId eq 1055022
```

| Id | `WorkflowTypeId` | `TriggerType` | `TypeQualifier`       | Name                                     |
| -- | ---------------- | ------------- | --------------------- | ---------------------------------------- |
| 49 | 700              | 0 (added)     | `1\|\|\|\|False…`     | Web and App Cache Flush (adds)           |
| 53 | 700              | 1 (removed)   | `\|\|\|\|False…`      | Web and App Cache Flush (removes)        |
| 63 | 730              | 0 (added)     | `1\|\|\|\|False…`     | Activity Indicators for Data Automation  |
| 64 | 730              | 0 (added)     | `2\|\|\|\|False…`     | Activity Indicators for Data Automation  |

All four are scoped to the **group type**, `GroupId: null` — there are no
triggers specific to group 1055022. The `TypeQualifier`'s first segment is the
member status the trigger requires: `1` Active, `2` Pending. Our `POST` wrote
status Active, so triggers **49 and 63** were the ones eligible to fire.

### Why the absence of a run log proves nothing

```
GET /api/WorkflowTypes?$filter=Id eq 700 or Id eq 730
  → 700 "Group Member Cache Clear":  IsPersisted: false, LoggingLevel: 0
  → 730 "Activity Indicator: Write Interaction when joining Groups": IsPersisted: false, LoggingLevel: 0
```

Both are **`IsPersisted: false`** and **`LoggingLevel: 0`** (None). A
non-persisted workflow that completes writes **no `Workflow` row**, and logging
disabled means **no `WorkflowLog` row**. Confirmed empirically — `Workflows`
filtered to types 700/730 returns `[]`, and *no* `Workflow` row of **any** type
was created anywhere in the database today.

**So Day 0's method could never have answered the question.** Looking for a run
entry from these two workflow types is guaranteed to find nothing whether they run
or not. That is the trap, and it is why the question stayed open for two sessions.

### The decisive probe — observe the side effect, not the run

Workflow 730's entire job is to **write an `Interaction`**. An `Interaction` row
persists *independently* of the workflow that created it. So it survives
`IsPersisted: false`.

Our add (§15) created `GroupMember` 8862385 with
`DateTimeAdded: 2026-07-31T13:31:27.84`. Then:

```
GET /api/Interactions?$filter=PersonAliasId eq 389595
    and InteractionDateTime gt datetime'2026-07-31T00:00:00'
```

```json
{ "Id": 73324746, "Operation": "AddedToGroup",
  "InteractionDateTime": "2026-07-31T13:31:28.3833333",
  "InteractionComponentId": 273491 }
```

- **`Operation: "AddedToGroup"`** — exactly what workflow 730 writes.
- **`13:31:28.383` — 0.54 s after the `POST` committed.** Nothing else touched
  this group at that moment.
- **`InteractionComponentId` 273491 is named `"Group: CFDP Testing Group"`** — the
  component is scoped to the very group we wrote to.
- **Baseline:** this alias has **3** `AddedToGroup` interactions in its entire
  history (2023-05-30, 2026-06-23, and ours). Ours is the only one today.

**Conclusion: a plain `POST /api/GroupMembers` fires `GroupMemberWorkflowTriggers`
the same way a UI write does.** Trigger 63 → workflow 730 → Interaction, in
under a second, with no involvement from us.

### What this means for the design

- **The add path does not need to launch `GROUP_ADD_PERSON` (654) to get Rock's
  side effects.** Rock's own trigger machinery runs on the entity write. The §6
  question of whether 654 is the right workflow id becomes **less urgent** — it
  matters for legacy parity on the *email confirmations* 654 sends, not for
  keeping Rock's internal state consistent.
- **Corollary — POSTing is not side-effect-free.** Any spike or test that adds a
  member is also writing interactions and firing workflow 700 (an Apollos GraphQL
  cache flush — §22) and 730. Budget for that when testing against prod.
- **Trigger 49 (Apollos flush on add) almost certainly also fired.** It shares the
  dispatch mechanism just proven for 63. At the time of this section it could not
  be observed directly — a non-persisted workflow leaves no queryable row — so this
  was inference, clearly labelled. Later confirmed directly once `IsPersisted` was
  flipped (§22).

### The one part still genuinely open

**Whether a soft remove fires the "removed" trigger (53) is unresolved.** Our
remove was a `PATCH` to `GroupMemberStatus: 0`, and no second `Interaction`
appeared — but trigger 53 points at workflow 700, the cache flush, which writes
**no observable side effect**, and the only interaction-writing workflow (730) is
an *added* trigger that would not fire on a removal anyway. So the absence of a
second interaction is uninformative here, for the same reason Day 0's absence was.

Worth flagging on its own merits, because Rock's `MemberRemovedFromGroup` trigger
conventionally fires on **delete/archive**, and a status change to Inactive may
well not count as "removed" at all. If it does not, **a soft remove never runs
workflow 700** (the Apollos per-person flush — §22), and removed members could
linger in Apollos surfaces. Resolved later: it does not fire (§22).

**The test that would settle it:** temporarily set workflow type 700
`IsPersisted: true` (or `LoggingLevel: 3`) in the Rock admin UI, run one soft
remove, and check for a `Workflow` row. That is a Rock configuration change, so it
needs the Rock team — but it is a two-minute change and it would also
retroactively confirm the trigger-49 inference above. **This is the single
highest-value ask to take to the Rock team.**

---

## 15. Write paths executed — full evidence

Driven through the **real helpers** in `fetch-rock-data.ts` (`postRockData`,
`patchRockData`, `fetchRockData`) with `global.fetch` wrapped to capture the wire,
so this exercises the same code the action runs. The route itself could not be
driven: `requireUser` needs a `.ROCK` cookie from `/Auth/Login`, which was out of
scope this session.

### Add — `POST /api/GroupMembers`

```http
POST https://dev-rock.christfellowship.church/api/GroupMembers
Content-Type: application/json
Authorization-Token: <service account>

{"GroupId":1055022,"PersonId":389650,"GroupRoleId":44,"GroupMemberStatus":1}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

8862385
```

- **Status `201`.** Day 0 reported the bare-int body but not the status; recorded now.
- **Body is a bare integer, 7 bytes.** Day 0's finding **reproduced exactly**.
- **No `Location` header** — confirmed `null`. So there is no way to learn the new
  id other than parsing the body.
- `GroupMemberStatus: 1` **numeric on write** is accepted, confirming §2's
  representation split (string in `$filter`, numeric in JSON).

**Round trips: the add costs 2.** `POST` 275 ms + read-back `GET` 154 ms =
**435 ms** wall time.

**New finding — `$expand` and `$select` are silently ignored on a by-id `GET`.**
The read-back was
`GET /api/GroupMembers/8862385?$expand=GroupRole` and it returned
**`"GroupRole": null`**. The same happened with `$select` when resolving the test
ids at the top of this section: the full entity came back regardless. Both work
correctly on the **collection** form (`GroupMembers?$filter=…`). Consequences:

- The action's `readBack` **cannot** populate the role name — a UI that echoes
  "added as Group Co-Leader" needs a **third** call, or must re-read via the
  collection form.
- Anywhere else in the codebase that fetches `Entity/{id}` with `$select`
  expecting a trimmed payload is silently getting the whole row. Worth a sweep.

### Remove — attribute write, then `PATCH`

Step 1, the mandatory inactive reason (query string, empty body, as legacy does):

```http
POST /api/GroupMembers/AttributeValue/8862385
     ?attributeKey=MemberInactiveReason
     &attributeValue=993f485b-52d7-4b65-b7d0-f758324fa1ae

HTTP/1.1 202 Accepted
8862385
```

**Status `202`, not 200/201** — and the body is the bare entity id echoed back.

Step 2:

```http
PATCH /api/GroupMembers/8862385
{"GroupMemberStatus":0}

HTTP/1.1 204 No Content
(empty body)
```

Day 0's `204`/empty-body finding confirmed.

Step 3, the confirming `GET`:

```json
{ "id": 8862385, "groupId": 1055022, "personId": 389650,
  "groupMemberStatus": 0,
  "inactiveDateTime": "2026-07-31T13:31:57.983",
  "isArchived": false,
  "modifiedDateTime": "2026-07-31T13:31:57.997" }
```

- **State change confirmed:** `groupMemberStatus` 1 → **0**.
- **Rock stamps `InactiveDateTime` itself** — we did not send it. So the app must
  not try to manage that field.
- **`isArchived` stays `false`.** A soft remove is **not** an archive. This also
  means §12's remove did **not** double as the §5 `IsArchived` write probe, which
  therefore remains open.

Step 4 — the attribute persisted and reads back, via `loadAttributes=simple`:

```json
"memberInactiveReason": {
  "attributeId": 160453,
  "value": "993f485b-52d7-4b65-b7d0-f758324fa1ae",
  "valueFormatted": "No longer interested"
}
```

**Round trips: the remove costs 2 writes + 1 confirming read = 3**, 688 ms total.
`loadAttributes=simple` is a 4th call if the UI needs to display the reason.

### Incidental — `patchRockData` emits a double slash

`patchRockData` and `deleteRockData` build `` `${process.env.ROCK_API}/${endpoint}` ``
while `ROCK_API` already ends in `/`, producing:

```
https://dev-rock.christfellowship.church/api//GroupMembers/8862385
```

**Rock tolerated it — 204.** `postRockData` uses the single-slash form, so the
helpers are inconsistent. Not currently breaking; latent if a proxy or a future
Rock version normalizes paths differently. Left alone (out of scope).

---

## 16. Q3 — payload, latency, and why pagination cannot show a total

Measured on dev, `$expand=GroupRole,Person` throughout (one call, no N+1 — §7).
The `$select` used is the loader's:
`Id,PersonId,GroupMemberStatus,GroupRole/Name,GroupRole/IsLeader,Person/NickName,Person/LastName,Person/Email`.

| Members | No `$select` (full entity) | With `$select` | Bytes saved |
| ------- | -------------------------- | -------------- | ----------- |
| 5       | 15,857 B · 159 ms          | 942 B · 150 ms | **94%**     |
| 25      | 77,197 B · 540 ms          | 4,658 B · 324 ms | **94%**   |
| 37 (group 1055022) | 120,363 B · 556 ms | 7,019 B · 244 ms | **94%** |
| 50      | 154,647 B · 442 ms         | 9,321 B · 270 ms | **94%**   |
| 100     | 309,834 B · 554 ms         | 18,714 B · 319 ms | **94%**  |
| 250     | 776,775 B · 809 ms         | 46,836 B · 391 ms | **94%**  |

Sizes above 37 are a synthetic sweep (`$top=N` over group type 31) rather than
real groups, since dev offers no single group that large; per-row cost is what
generalizes, and it is flat:

- **Full entity: ~3.1 KB per member.**
- **With `$select`: ~187 B per member.** A **~17× reduction.**
- Latency is mostly fixed overhead (~150–250 ms). Payload only starts dominating
  past ~100 members, and only without `$select`: 250 members full-entity is
  **809 ms and 776 KB**, vs **391 ms and 47 KB** selected.

**`$select` is not an optimization here, it is a requirement.** Without it a
250-member group ships three quarters of a megabyte to render a name list.

### No server-side total exists

| Attempt                     | Result                                                          |
| --------------------------- | --------------------------------------------------------------- |
| `GroupMembers/$count`       | **400** — `{"id":"The value '$count' is not valid for Int32."}` |
| `$count=true` (OData v4)    | **400** — `The query parameter '$count' is not supported.`      |
| `$inlinecount=allpages`     | **Silently ignored** — returns a bare array, HTTP 200           |
| `$skip` + `$top` + `$orderby` | **Works** — verified page 2 of 10 on group 1055022            |

The `/$count` failure is diagnostic: Rock routes the segment into
`GroupMembers/{id:int}`, so `$count` is not an unimplemented feature, it is **not
a route at all**. And `$inlinecount` being *silently* ignored is the dangerous
one — code that reads a total off the response gets `undefined`, not an error.

**So offset pagination works, but no total is available.** You cannot render
"25 of 213", a page count, a last-page control, or a scrollbar proportional to
the result set — any of which would require counting the whole collection
client-side first, which defeats paginating.

### Recommendation: page size 50, cursor-style UX

**Default page size 50, `$select` mandatory, `$orderby=Id`** (a stable sort key —
without `$orderby`, `$skip` is not guaranteed consistent across pages).

- 50 members ≈ **9.3 KB and ~270 ms** — comfortably under a perceptible delay,
  and the payload is a rounding error.
- It covers the overwhelming majority of real groups in **one page with no
  pagination UI at all** (group 1055022, the real test group, has 37 members and
  16 Active).
- 100 costs little more (18.7 KB / 319 ms) and would cover still more groups in
  one page — a defensible alternative if product prefers "almost never
  paginate" over a smaller first payload. **50 is the recommendation; 100 is the
  reasonable argument against it.**

**The pagination UX this forces: "Load more" / infinite scroll, not numbered
pages.** Ask for `$top=51` and use the 51st row purely as a has-more flag,
displaying 50. That needs no total, degrades gracefully, and never lies about how
much is left. Numbered pages, "showing X of Y", and jump-to-last are all off the
table unless we maintain our own count — which for an authorization-gated
per-group list is not worth it.

---

## 17. Q5 — failure modes observed, including one real bug

### A retry after a timeout cannot duplicate a member

Re-`POST`ing the identical add body:

```json
{ "Message": " apollos already belongs to the group member role for this group (Group Id: 1055022), and cannot be added again with the same role" }
```

**HTTP 400.** Rock enforces uniqueness on `(GroupId, PersonId, GroupRoleId)`. A
follow-up `GET` confirmed **exactly one** row for person 389650 in group 1055022.

**So the answer to "can a timeout after a successful write present as a failure to
the UI?" is: yes, but it is safe.** The write commits server-side before the
response, so a client-side timeout leaves the member added while the UI reports
failure. A retry then **cannot** double-add — Rock rejects it. The damage is
confined to a **misleading error message on an operation that actually succeeded**,
which a refetch corrects. That is a good failure mode and it comes free from
Rock's constraint, not from anything the app does.

Two caveats:

- The 400's `Message` is **not fit to show a user** — it leaks the service-account
  name ("apollos") and reads as an internal error. It must be caught and replaced.
- The app **cannot distinguish** "this person is genuinely already a member" from
  "my own retry landed". Both are the same 400. Recovering correctly means
  `GET`-ing the membership on 400 and treating an existing Active row as success.

### The real bug: a soft-removed member cannot be re-added

The 400 above fired while the existing row was **`GroupMemberStatus: 0`
(Inactive)**. Rock's uniqueness constraint **ignores status**.

**So the prototype's add path is broken for the most obvious leader workflow:
remove someone, then add them back.** It fails with an
opaque 400 forever, and no amount of retrying helps.

The add path must therefore be: look for an existing row for
`(groupId, personId, groupRoleId)` **regardless of status** and, if one exists,
**`PATCH` it back to Active** rather than `POST`. That also implies clearing
`MemberInactiveReason` on reactivation, or the row carries a stale removal reason.

This is a correctness gap in the **write model**, not a spike artifact — it would
have shipped. It is the top §9 open item.

### The two-write remove has no transaction

Confirmed by construction (§15): the attribute write lands **before** the `PATCH`,
and the compensating rollback in `action.ts` is hand-rolled. The observed window
between the two writes was **~190 ms**. If the process dies inside it, the member
stays **Active with a removal reason already attached** — an invisible
inconsistency, since no UI surfaces `MemberInactiveReason` for an active member.
Legacy has the same hole. Reversing the order (PATCH first, then attribute) would
at least fail toward "removed but no reason recorded", which is the more benign
inconsistency and the more honest one.

---

## 18. Records created this session — all reversed

Per the reversibility rule: **nothing was `DELETE`d.**

| Record                | What                                                    | Final state                                          |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| **`GroupMember` 8862385** | Person **389650** (service account "apollos"), group **1055022**, role **44** Group Member | **`GroupMemberStatus: 0` (Inactive)** — reversed via `PATCH` in §15 |

**This is the only record intentionally created.** It was created by the §15 add
and reversed by the §15 remove — the remove test *is* the reversal. Verified by
`GET` after the fact: `groupMemberStatus: 0`, `inactiveDateTime` set.

Side effects created by Rock, which cannot be reversed and should be known to
anyone auditing:

| Record | What | Note |
| ------ | ---- | ---- |
| `Interaction` **73324746** | `AddedToGroup`, alias 389595, component 273491 | Written by workflow 730 via trigger 63 (§14). Left in place — it is the Q2 evidence. |
| `AttributeValue` on 8862385 | `MemberInactiveReason` = `993f485b-…` "No longer interested" | Attached to the now-Inactive row; consistent with its state. |

The duplicate-add probe in §17 was **rejected with a 400 and created nothing**.

The service account was chosen as the test person deliberately: it is not a real
congregant, so no actual person's group membership or communication preferences
were touched, and the dev database is a clone of production containing real
people's rows.

---

# Session 4 (Day 3) — Q1 write model (b), tested for the first time (2026-07-31)

A dev user login now exists, so model (b) — forwarding a per-user `.ROCK` cookie
on a write — was in scope for the first time. All calls below are **dev only**.

**Credential handling.** The password lives only in a gitignored `.env`
(`.gitignore:76`, untracked) and is passed by variable reference. It appears in no
file, log line, captured request body, or commit in this repository.

---

## 19. Test fixtures — verified before use

Test user resolved from the `UserLogin` table: **PersonId 394626, "Ani
Skywalker"**, `UserLogin` 31560, `IsConfirmed: true`, `IsLockedOut: false`.

| Group   | Name                    | `GroupTypeId` | `GroupMember.Id` | `GroupRoleId`       | `IsLeader` | Status       | `IsArchived` |
| ------- | ----------------------- | ------------- | ---------------- | ------------------- | ---------- | ------------ | ------------ |
| 1838823 | Jedi Council Test Group | **31**        | **8862392** (was **8862386**, hard-deleted 2026-08-05 — §32) | **50** Group Leader | **true**   | **1 Active** | false        |
| 1055022 | CFDP Testing Group      | **31**        | 3329432          | **44** Group Member | **false**  | **1 Active** | false        |

Both memberships present and Active as of the §33 write-path run. **8862386** was
the original role-50 fixture for person 394626 in group 1838823; it was
hard-deleted through Rock's admin UI on 2026-08-05 and replaced by **8862392**
(created by the §33 insert). See §32.

### Group 1838823 examined for the first time

**Both groups are `GroupTypeId` 31 — the same group type.** Write results across
the two are therefore **directly comparable**, and Tier 2 was free to stay on
1055022's group type, where workflow 700 lives, without losing anything.

Its `GroupMemberWorkflowTriggers` are **the same four rows already documented in
§14**, because all four are scoped to the group type with `GroupId: null`:

```
GET /api/GroupMemberWorkflowTriggers?$filter=GroupTypeId eq 31
    or GroupId eq 1838823 or GroupId eq 1055022
```

| Id | `WorkflowTypeId` | `TriggerType` | `GroupId` |
| -- | ---------------- | ------------- | --------- |
| 49 | 700              | 0 (added)     | null      |
| 53 | 700              | 1 (removed)   | null      |
| 63 | 730              | 0 (added)     | null      |
| 64 | 730              | 0 (added)     | null      |

**Neither fixture group has any group-specific trigger.** Nothing about 1838823
is special.

### Correction — the `ROCK_TEST_USER` value is wrong

`ROCK_TEST_USER` is set to **`ani@jedi.order`**. The account's actual
`UserLogin.UserName` is **`anakin@jedi.order`**. The supplied value fails
authentication with **401 `{"Message":"Invalid login type."}`**. Note the message
says *invalid login type*, not *invalid username* — a misleading error that would
cost a developer real time. The correct username was used for everything below.
**Fix the env var.**

### Correction to the session brief — applied

The brief described `GroupMember` **3183436** (group 1055022) as role **50**; it is
role **47 Group Co-Leader**. This was already recorded in the session-3 preamble
above and needed no further in-place edit: **the brief document contains no
fixture ids, group ids, or role claims at all** — the role-50 statement exists
only in the session prompt, not in any committed file.

---

## 20. Q1 model (b) — **DEAD as currently configured**

### Step 1 — login succeeds

```http
POST https://dev-rock.christfellowship.church/api/Auth/Login
Content-Type: Application/Json

{"Username":"anakin@jedi.order","Password":"<REDACTED>","Persisted":true}
```

```http
HTTP/1.1 204 No Content
Set-Cookie: .ROCK=<424 chars, REDACTED>; expires=Sun, 30-Aug-2026 18:50:17 GMT;
            path=/; SameSite=Lax; HttpOnly
```

| Property   | Value                                                              |
| ---------- | ------------------------------------------------------------------ |
| Endpoint   | `POST /api/Auth/Login`                                             |
| Payload    | `{Username, Password, Persisted}` — matches `rock-authentication.ts:27` |
| Success    | **204 No Content**, empty body                                     |
| Cookie     | **`.ROCK`**, 424 chars                                             |
| Lifetime   | **30 days** (`Persisted: true`); expiry is absolute, not a session cookie |
| Flags      | `path=/`, `HttpOnly`, `SameSite=Lax`, **no `Secure` attribute**     |
| Latency    | 336 ms                                                             |

**Finding — the `.ROCK` cookie is issued without a `Secure` flag** over an HTTPS
origin. Nothing in our flow downgrades to HTTP, but a cookie that authenticates a
real person and lives 30 days should be marked `Secure`. Worth raising with the
Rock team; it is a Rock-side setting, not something the app controls.

The cookie is genuinely valid: with **no `Authorization-Token` header at all**,

```
GET /api/People/GetCurrentPerson   →  200   { "Id": 394626, "PrimaryAliasId": 394571 }
```

It resolves to the test person. **Authentication works. Model (b) does not fail at
the login step.**

### Step 2 — leader accept test: **REFUSED**

Group 1838823, where the test user is a **role-50 Group Leader, `IsLeader: true`,
Active**. Cookie only, no service header:

```http
POST /api/GroupMembers
Cookie: .ROCK=<REDACTED>          (no Authorization-Token)

{"GroupId":1838823,"PersonId":389650,"GroupRoleId":44,"GroupMemberStatus":1}
```

```http
HTTP/1.1 401 Unauthorized
(empty body)
```

**A verified group leader cannot write to their own group with their own cookie.**

### Why — it is not group security, and not a stale cookie

Both competing explanations were ruled out:

**1. The cookie had not expired.** Re-checked immediately after the failure:
`GET /People/GetCurrentPerson` → **200, person 394626**. Live throughout.

**2. It is not write-specific.** Every entity endpoint refuses the same way:

| Call (cookie only)                            | Status  |
| --------------------------------------------- | ------- |
| `GET /People/GetCurrentPerson`                | **200** |
| `GET /GroupMembers?$filter=GroupId eq 1838823` | **401** |
| `GET /GroupMembers/8862386` (own row)         | **401** |
| `GET /Groups/1838823`                         | **401** |
| `PATCH /GroupMembers/8862386` (own row)       | **401** |

**Reads fail too.** So this is not group security and not a write restriction —
it is **REST controller authorization**. Confirmed against the security tables:

```
RestController 39 = Rock.Rest.Controllers.GroupMembersController
Auths where EntityTypeId eq 180 and EntityId eq 39   →  []
```

**There are no `Auth` rules on the `GroupMembers` REST controller at all**, so an
ordinary authenticated person falls through to Rock's default deny. The service
account works because its API key sits in an administrative role that bypasses
this. `GetCurrentPerson` works because it is the one endpoint scoped to "whoever
you are", not to a secured entity controller.

### Step 3 — non-leader deny test: uninterpretable, as predicted

Run for completeness, and explicitly **not** the designed test:

```http
POST /api/GroupMembers    Cookie: .ROCK=<REDACTED>
{"GroupId":1055022,"PersonId":389650,"GroupRoleId":44,"GroupMemberStatus":1}
→ HTTP/1.1 401 Unauthorized   (empty body)
```

**Byte-for-byte identical to the leader result.** Since a *leader* on their own
group gets the same 401, this refusal carries **no information about whether Rock
enforces group security**. The brief anticipated exactly this: the result is
uninterpretable and is recorded as such. Nothing was created — a service-token
`GET` confirms the only row for person 389650 in group 1055022 is still Day 2's
`8862385` at status 0.

### The gap that stays open — and it is now bigger than expected

The known gap was that with only two groups, a Rock refusal could not distinguish
"members are denied writes" from "only leaders are allowed". **That gap is now
wider:** because the denial happens at the REST controller layer, these results
cannot distinguish *any* group-security hypothesis. **Whether Rock independently
enforces per-group security on REST writes remains completely untested** — not
merely under-specified. No third group would have helped; the blocker is
controller ACLs, not fixture coverage.

### Independent human re-verification (2026-08-04)

**Distinct from the agent-run tests above.** Independently re-verified by Danny
Wood on 2026-08-04, by curl against dev, with the dev host hardcoded:

```
POST /api/Auth/Login (anakin@jedi.order)                       → 204, Set-Cookie: .ROCK
GET  /api/People/GetCurrentPerson         (cookie only)        → 200, person 394626
GET  /api/GroupMembers/3329432            (cookie only)        → 401
GET  /api/GroupMembers?$filter=GroupId eq 1838823 (cookie only) → 401
```

No `Authorization-Token` header was sent on any request. The 200 on
`GetCurrentPerson` establishes that Rock recognises the session, so the 401s are
Rock refusing the endpoint rather than refusing the credential. **Model (b) is
confirmed dead at the controller layer — human-verified, not only agent-reported.**

### Verdict: **DEAD as currently configured**

Not "viable with caveats". A per-user cookie cannot read or write group data on
this Rock at all, so model (b) cannot be built today.

It is **revivable only by a Rock security change**: granting the `GroupMembers`
REST controller (and every other controller the feature touches) permissions for
ordinary authenticated users. **That change has a system-wide blast radius** — it
would hand every logged-in user REST access to group data across the entire
instance, with Rock's per-entity group security as the only remaining control, and
that control is precisely what these tests **could not verify exists**. Anyone
proposing it should be required to demonstrate group-level enforcement first.

### What this implies for shipping service-account-plus-app-gate

**Model (a) — service account plus the app-side `requireGroupLeader` gate — is the
only implementable option, and it should ship.** But the honest framing of what it
buys:

> **The app-side gate is the only control protecting every group in the system.**

That sentence was written into the brief as the *bad* outcome of test 3. It is
true anyway — arrived at by a different route. Under model (a) every write carries
the service account's administrative authority, so Rock applies no per-group
check; `requireGroupLeader` is the entire authorization surface. This is not a new
risk introduced by the test — it is the standing architecture, now confirmed to
have no backstop rather than an unverified one.

Three consequences worth carrying into build:

1. **A bug in `requireGroupLeader` is a full authorization bypass**, not a
   degraded check. It deserves the test coverage and review attention of a
   security control.
2. **§12's admin-editable `IsLeader` risk compounds this.** The single control is
   keyed on a field that a Rock admin can toggle in the UI with no deploy and no
   audit trail on our side.
3. **Defense in depth is unavailable, not merely unused.** It cannot be added
   later by "also forwarding the user cookie" — that path is closed until Rock's
   REST security changes.

---

## 21. Records created or mutated in session 4

**None.** Both `POST` attempts returned 401 and created nothing; verified by
service-token `GET` after the fact. No `PATCH` succeeded. Nothing to reverse.

The only state change anywhere was **one successful login**, which issued a
`.ROCK` cookie (30-day lifetime) and updated `UserLogin` 31560's last-login
timestamp. The cookie was held in the scratchpad for the duration of the session
and is not committed.

_(Superseded by §23 — Tier 2 mutated and restored one row after this was written.)_

---

## 22. Q2 — **RESOLVED in full.** Trigger 53 does not fire on a soft remove

With `WorkflowType` 700 temporarily `IsPersisted: true` (since reverted —
2026-08-04), a completed run leaves a `Workflow` row. Note `LoggingLevel` stayed
**0**, so `WorkflowLog` stays empty either way — the `Workflow` row is the only
signal. (`/api/WorkflowLogs` is **not a route at all** on this Rock: `No HTTP
resource was found`.)

### What WorkflowType 700 actually does — correction (2026-08-04)

Rock labels 700 **"Web and App Cache Flush"**, which reads as though it flushes
something belonging to Rock. **It does not.** Inspected in the Rock admin UI on
2026-08-04, it has three actions:

1. **"Get Group Member"** — Attribute Set from Entity, populating a `GroupMember`
   workflow attribute.
2. **"POST Cache Clear"** — a Web Request action: `POST` to
   `{{ 'Global' | Attribute:'ApollosAPIUrl' }}` with a GraphQL body,
   `mutation flushRock(entityId, entityTypeId, key)`, where `entityId` is the
   GroupMember's `Person.Id`, `entityTypeId` is **15**, and `key` is a shared
   secret carried in the workflow config **in plaintext**.
3. **"If Group Member is Blank, Complete"** — Workflow Complete.

**700 is entirely Apollos-specific.** It tells the Apollos GraphQL API to drop its
cache for one person. It touches no Rock cache, and it has no relationship to the
new project's Redis. The `Workflow` rows 700 accumulated during the spike
(5696074, 5696075) were runs of that Apollos cache-flush call — harmless, and why
they had no observable Rock-side effect.

**Decommissioning note:** the plaintext shared key in the workflow config, and
this trigger + workflow, should be removed when Apollos is retired rather than
left pointing at a dead host with a live secret in Rock's configuration.

### The add trigger fires — trigger 49 confirmed, no longer an inference

The baseline query already contained exactly one row, before this session touched
anything:

```
GET /api/Workflows?$filter=WorkflowTypeId eq 700
```

```json
{ "Id": 5696074,
  "Name": "Web and App Cache Flush (Adds members to groups on web and app quickly)",
  "ActivatedDateTime": "2026-07-31T14:22:07.883",
  "CompletedDateTime": "2026-07-31T14:22:07.977",
  "Status": "Completed" }
```

`GroupMember` **8862386** — the test user's own membership in group 1838823 — has
`DateTimeAdded: 2026-07-31T14:22:07.837`. **Workflow 700 activated 46 ms later.**

**This retroactively confirms §14's trigger-49 inference.** §14 could only argue by
analogy that the Apollos-flush trigger fired alongside the observable one; the
persisted row now proves it directly. `IsPersisted: true` paid for itself before
the first deliberate test ran.

### The remove trigger does not fire — on either kind of removal

Both probes ran on `GroupMember` **8862385** (service account, group 1055022),
chosen because Day 2 left it Inactive, so the sequence nets to zero state change.

| Step | Write | `Workflow` rows for type 700 |
| ---- | ----- | ---------------------------- |
| baseline | — | **1** (5696074) |
| reactivate | `PATCH {GroupMemberStatus: 1}` → 204 | **1** — unchanged |
| **soft remove** | `PATCH {GroupMemberStatus: 0}` → 204 | **1** — unchanged |
| **archive** | `PATCH {IsArchived: true}` → 204 | **1** — unchanged |

Each check waited 3–5 s for the async transaction to land.

**Answer: a soft remove does not fire trigger 53. Neither does an archive.** This
is not a "fired but left no row" result — the mechanism that would have hidden
that is gone, and the add trigger proves rows do appear when a trigger fires.

**Also worth recording: reactivating (status 0 → 1) did not fire the *add* trigger
49 either.** So group type 31's triggers respond to **row creation and deletion,
not to status transitions in either direction.** Rock's `MemberStatusChanged`
trigger type would cover that, and **group type 31 has none configured** (§14's
table lists only trigger types 0 and 1).

### Why this matters — §14's warning, corrected

§14 flagged that "a soft remove never flushes the legacy web/app cache." **The
Rock behaviour is confirmed: our remove path writes `GroupMemberStatus: 0`, and
Rock fires nothing** — not on soft remove, not on archive, and reactivation does
not fire the add trigger either. Group type 31 has no `MemberStatusChanged`
trigger configured.

**What that means, corrected (2026-08-04):** trigger 49/53 → workflow 700 is an
**Apollos** cache flush, not a Rock-internal one (see above). Legacy-my-groups
retires the day the new app launches, so there is **no coexistence window** in
which Apollos-side staleness could be observed. The ask that followed from this
finding is **withdrawn** (decision memo §7 ask 3).

**What survives:** writes originating **in Rock** (admin UI, imports, other
workflows) never notify the new project's Redis. That is a build requirement, not
a Rock-team ask about legacy — see the decision memo.

### `IsPersisted` — reverted (2026-08-04)

It was flipped to `true` **for this test only**. **CLOSED:** a Rock admin
reverted it to `false` on 2026-08-04. Two `Workflow` rows accrued while it was
set (5696074, 5696075); no further accrual.

---

## 23. Tier 3 item 7 done early — `IsArchived`, and §5 is now decisively proven

Run as part of the trigger-53 probe above, since it was the same write.

**Setting `IsArchived: true` removes the row from REST results entirely — even
with no `IsArchived` predicate in the query at all:**

| Query on group 1055022, person 389650 | Before archive | After archive |
| -------------------------------------- | -------------- | ------------- |
| `…&$filter=… and IsArchived eq false`  | `[{"Id":8862385}]` | **`[]`** |
| `…&$filter=…` (**no** archive predicate) | `[{"Id":8862385}]` | **`[]`** |

**This is the decisive experiment §5 asked for, and it settles §5 and §12.**
Rock's REST layer excludes archived rows from the `GroupMembers` queryable
*before* OData is applied. The row vanishes whether or not you filter for it.

So **`IsArchived eq false` in `require-group-leader.ts` is confirmed to be a
genuine no-op** — not "probably a no-op" as §5 had it. §12 kept the predicate as
"free insurance" on the grounds that it was never decisively proven and prod is a
major version behind. **The first half of that reasoning is now closed; the second
half still stands.** The predicate cannot over-deny (it excludes only rows REST
already hides), so leaving it costs nothing — but it should no longer be described
as protection. It is documentation of an invariant Rock enforces itself.

**Secondary finding — REST archive does not stamp `ArchivedDateTime`.**
`ArchivedDateTime` stayed **`null`** through the archive, and `ArchivedByPersonAliasId`
likewise. Contrast §15, where Rock stamped `InactiveDateTime` itself on a status
change. **A REST `PATCH {IsArchived: true}` produces a half-archived row**: hidden
from REST, but with no audit trail of when or by whom. That is a good reason to
prefer the soft remove the prototype already implements, and a reason not to
"upgrade" the remove path to archive later without going through Rock's service
layer.

---

## 24. Records created or mutated — sessions 4 and Tier 2, all reversed

**Nothing was created. Nothing was `DELETE`d.** One pre-existing row was mutated
and restored to its exact starting state.

| Record | Start state | Mutations | Final state | Reversed? |
| ------ | ----------- | --------- | ----------- | --------- |
| `GroupMember` **8862385** (person 389650, group 1055022, role 44) | `GroupMemberStatus: 0`, `IsArchived: false` | → status 1 → status 0 → archived true → archived false | **`GroupMemberStatus: 0`, `IsArchived: false`** | **Yes — identical to start** |

Verified by `GET` after the final write. The row is the one Day 2 created and left
Inactive (§18); it is the service account, not a real congregant.

The two Tier 1 `POST` attempts (groups 1838823 and 1055022) both returned **401
and created nothing** — confirmed by service-token `GET`.

**Side effects created by Rock, not reversible:** none observed this session. No
new `Workflow` row, no new `Interaction` — the reactivate/remove/archive sequence
fired no triggers at all, which is itself §22's finding.

**Still owed to the Rock team (not ours to change):** none from this session.
`WorkflowType` 700 `IsPersisted` was later reverted to **`false`** by a Rock
admin (2026-08-04) — see §22 / §32.

---

## 25. Q4 — **YES, a second invalidation is required.** And the remove path cannot currently issue it

Redis confirmed live locally (`PING` → `PONG`, empty keyspace).

### The answer

**Invalidating the actor does not clear the removed member's "my groups" list.**
Proven, not reasoned:

```
seeded:
  ACTOR  my-groups     rock:u394626:GroupMembers:1d7803140d67
  ACTOR  member-list   rock:u394626:GroupMembers:68d2754a4e9b
  TARGET my-groups     rock:u389650:GroupMembers:51e5f404c57f

invalidateUser(redis, 394626)  ->  deleted 2

  ACTOR  my-groups     cleared
  ACTOR  member-list   cleared
  TARGET my-groups     SURVIVES
```

This is inherent to the design, not a bug in it. `buildUserCacheKey` puts the
person in the **namespace** (`rock:u{personId}:…`) and `invalidateUser` SCANs
`rock:u{personId}:*`. That is exactly why no reverse index is needed — and it is
also why one person's invalidation can never reach another's keys. The property
that makes the helper cheap is the property that makes a second call mandatory.

`action.ts:73` calls `invalidateUser(redis, auth.personId)` — **the actor only** —
for both intents.

### Why this is worse than it looks

**§22 established that Rock fires nothing on a soft remove.** So on the remove
path there is no legacy cache flush *and*, without a second invalidation, no flush
of the removed member's own cached view. A removed member keeps seeing the group
in **two independent caches at once**, ours and legacy's, until TTL expiry or an
unrelated write. The add path is fine on both counts: trigger 49 fires, and the
added member's stale "my groups" is a *missing* group rather than a phantom one —
still wrong, but it fails toward under-showing rather than showing access the
person no longer has.

### Where it belongs — and the blocker

The natural insertion point is beside the existing call at
`app/routes/spike-manage-members.$groupId/action.ts:73`:

```ts
await invalidateUser(redis, auth.personId);
if (result.ok && result.affectedPersonId) {
  await invalidateUser(redis, result.affectedPersonId);
}
```

**But `removeMember` does not return a `personId`, and does not know one.** It is
keyed entirely on `groupMemberId` (form field → `GroupMembers/{id}` for both the
attribute write and the `PATCH`); its result is
`{ ok, intent, groupMemberId, patchStatus, timings }`. `addMember` *does* read
`personId` from the form (`action.ts:87`), so **the add path can do this today and
the remove path cannot.**

Two ways to close it:

1. **Pass `personId` through the remove form** alongside `groupMemberId` — the
   member list already has it, so it costs nothing. **Safe despite being
   client-supplied**, because it is used *only* as a cache key: a forged value
   invalidates some unrelated person's cache, which is a wasted round trip, not a
   disclosure. It must never be used for the authorization decision.
2. **Resolve it server-side** before the `PATCH`, from the row being removed.
   Costs a round trip the remove path does not currently make (it is 2 writes + 1
   read today, §15) — but note the upsert spec in the outstanding work already
   proposes a pre-read on the *add* path, so a symmetric pre-read on remove may be
   the more coherent design.

**Recommendation: option 1**, with a comment stating the value is cache-only and
must not reach `requireGroupLeader`. Option 2 if the upsert work lands first, so
both paths share one shape.

**Both writes should invalidate both people.** An add changes the added person's
"my groups" just as a remove changes the removed person's.

---

# Session 5 (Day 4) — role-change collision, by-id `$select` sweep, two specs (2026-08-03)

All REST calls below are **dev only** (`dev-rock.christfellowship.church`,
hardcoded — both `.env` and `.env.local` point `ROCK_API` at prod). Service-account
token only; no user credential was used this session, so no password appears in any
artifact.

---

## 26. Role change collides with a dormant row — **the same 400 as the re-add bug**

### The hypothesis

Uniqueness is on `(GroupId, PersonId, GroupRoleId)` and **ignores status** (§17).
So changing a member's role — an ordinary leader action — should fail whenever the
target role already has a soft-removed row for that person. §17 proved this for
`POST`; this is the `PATCH GroupRoleId` case, which is a different code path in
Rock and had to be tested rather than inferred.

### The construction

Person **389650** (service account) in group **1055022** already held the dormant
row from Day 2: `GroupMember` **8862385**, role **44**, `GroupMemberStatus: 0`.
A second, **Active** row was created at a role with no existing row, then PATCHed
onto role 44.

```http
POST /api/GroupMembers
{"GroupId":1055022,"PersonId":389650,"GroupRoleId":49,"GroupMemberStatus":1}

HTTP/1.1 201 Created
8862387
```

Role **49** (Group Coach) was chosen deliberately: `IsLeader: false` (§4), so no
leader privilege was granted even momentarily.

### The result — 400, and byte-identical to the re-add bug

```http
PATCH /api/GroupMembers/8862387
{"GroupRoleId":44}

HTTP/1.1 400 Bad Request
{"Message":" apollos already belongs to the group member role for this group
 (Group Id: 1055022), and cannot be added again with the same role"}
```

**153 ms.** The message is **character-for-character the §17 message**, including
the leading space and the service-account name "apollos". Rock does not
distinguish "you tried to add a duplicate" from "you tried to rename into a
duplicate" — the same validator fires with the same string.

### The control — role change itself is fine

To rule out "PATCH `GroupRoleId` is simply not supported":

```http
PATCH /api/GroupMembers/8862387
{"GroupRoleId":46}          # no row exists at role 46 for this person

HTTP/1.1 204 No Content     # 165 ms
```

Confirmed by `GET`: the row moved to role 46. **So `PATCH GroupRoleId` works
normally; the 400 is specifically the dormant-row collision.**

### The failed PATCH is atomic — nothing partially applied

`GET` immediately after the 400:

```
8862385  role 44  status 0     <- dormant row, untouched
8862387  role 49  status 1     <- still on its original role
```

The rejected write left **no** partial mutation. Good news: no compensating
rollback is needed for this failure.

### What this means for the build

1. **The upsert fix in item 4 does not cover role change.** That spec keys the
   pre-read on `(groupId, personId, groupRoleId)` and reactivates the match. Role
   change is a *third* shape: an Active row at role A, a dormant row at role B,
   and an intent to end up Active at B only. Handling it means **reactivate the
   dormant B row and deactivate the A row** — two writes, no `GroupRoleId` PATCH
   at all — or Rock-side cleanup of the dormant row first.
2. **A role-change UI cannot be shipped on a naive `PATCH GroupRoleId`.** It works
   until the leader demotes/promotes someone who was previously in the target role
   and got removed, and then it fails permanently and opaquely for that one person.
   Exactly the §17 failure profile: rare enough to pass QA, permanent once hit.
3. **The 400 body must never reach a user** — same reason as §17. One catch can
   cover both call sites, because the string is identical. That is also the
   trap: **the app cannot tell the two causes apart from the response**, so the
   handler must key off the *intent it sent*, not off the message.
4. Role change is **out of the current prototype's scope** (add and remove only).
   This finding is the argument for keeping it out until the dormant-row problem
   has one deliberate answer that covers all three shapes.

### Records — reversed

| Record | Start | Mutations | Final | Reversed? |
| ------ | ----- | --------- | ----- | --------- |
| `GroupMember` **8862387** (person 389650, group 1055022) — **created this session** | did not exist | `POST` role 49 status 1 → PATCH role 44 **rejected 400** → PATCH role 46 (204) → PATCH role 49 + status 0 | **role 49, `GroupMemberStatus: 0`, `IsArchived: false`** | **Yes — soft-removed per the reversibility rule; never `DELETE`d** |
| `GroupMember` **8862385** (the designated disposable row) | role 44, status 0, `IsArchived: false` | none — only read | **role 44, status 0, `IsArchived: false`** | **Untouched, as instructed** |

Fixture rows **8862386** (group 1838823, role 50, Active) and **3329432** (group
1055022, role 44, Active) re-verified unchanged after the probe. No group other
than 1055022 was written to.

**Rock-side side effect, not reversible:** the `POST` fired the add triggers 49 /
63 / 64 (§14), so workflow 700 and 730 ran once more and one further
`AddedToGroup` `Interaction` row exists for alias 389595. Expected, unavoidable for
any `POST`, and consistent with §18.

---

## 27. By-id `$select` / `$expand` sweep — **the shipped blast radius is smaller than feared**

### Method

`$expand` / `$select` reach Rock as `queryParams` **object keys**, not as literal
query strings (`RockQueryParams`, `fetch-rock-data.ts:57–70`), so a text grep for
`$expand=` finds almost nothing — it matches one file. The sweep therefore
brace-matched every `fetchRockData` / `postRockData` / `patchRockData` /
`putRockData` / `deleteRockData` call in `app/`, pulled the `endpoint` literal out
of each block, and classified a call as **by-id** when a path segment after the
first is an interpolation or bare digits.

**55 call sites** pass `$expand` or `$select`. **3 are by-id.** The other 52 are
collection form, where both parameters work correctly (§7).

Gaps closed explicitly, all empty: no call site builds `endpoint` from a variable
(only type declarations match), none embeds a query string inside the endpoint
literal, and no interpolated endpoint was classified as a collection — so the
three below are the complete set, not a sample.

### The hit list

| # | Site | Endpoint | Param | Property expected | Actual | Verdict |
| - | ---- | -------- | ----- | ----------------- | ------ | ------- |
| 1 | `app/lib/.server/rock-person.ts:52` | `People/${id}` | `$select: 'Email'` | `emailInRock.email` (scalar) | full ~104-field person; `email` **present** | **Waste, not a bug** |
| 2 | `app/routes/volunteer/outreach-opportunity/outreach-mission-rock.server.ts:236` | `People/${personId}` | `$select: 'FirstName,LastName,NickName,Email'` | `p.firstName`, `p.lastName`, `p.nickName`, `p.email` (all scalar) | full person; all four **present** | **Waste, not a bug** |
| 3 | `app/routes/spike-manage-members.$groupId/action.ts:127` | `GroupMembers/${newGroupMemberId}` | `$expand: 'GroupRole'` | `GroupRole` (**nav property**) | **`null`** (§15) | **Real — spike code, not shipped** |

### The distinction that matters

`$select` being ignored and `$expand` being ignored fail **differently**:

- **`$select` on scalars is silently harmless.** The whole entity comes back, so
  every property the caller wanted is there. The cost is payload, not correctness
  — and per §16 that is roughly a **17×** overfetch. Both live sites run at
  `ttl: TTL.NONE`, so they pay it on **every** call, uncached.
- **`$expand` of a nav property returns `null`.** That is the crash shape: the
  fetch succeeds, the property is `null`, and the failure surfaces later in
  whatever reads `.Name` off it.

**Only one site is in the second category, and it is the spike's own read-back.**
So the concern that motivated this sweep — shipped code reading a nav property off
a by-id fetch and crashing downstream — **does not currently exist in shipped
code.** Recording that plainly, because it changes the priority: this is a
cleanup, not a latent production incident.

### One near-miss, tested rather than assumed

`app/lib/.server/author-utils.ts:16` fetches `People/GetByAttributeValue` with
`$expand: 'Photo'` — a nav property, and its callers read
`authorData.photo?.guid` (`author-utils.ts:79`, `:95`). It looks like hit #4. It
is not:

```
GET /api/People/GetByAttributeValue?attributeKey=Pathname&value=tom-mullins&$expand=Photo
  -> returns a LIST; Photo = {"FileName":"PastorTom.jpg", …}   POPULATED

GET /api/People/224061?$expand=Photo
  -> Photo = null                                             IGNORED (104 keys)

GET /api/People?$filter=Id eq 224061&$expand=Photo&$select=Id,PhotoId,Photo/Guid
  -> [{"PhotoId":2346410,"Id":224061,"Photo":{"Guid":"f83a25a6-…"}}]  WORKS
```

**So the defect is specific to the `Entity/{id}` route, not to "single-entity
fetches" as a class.** `GetByAttributeValue` honors `$expand` — it returns a list
and serializes differently (76 top-level keys vs 104 for by-id). Two different
Rock code paths.

This also **generalizes §15**: by-id ignoring `$expand` is not a `GroupRole`
quirk, it is any nav property. And the callers are optional-chained
(`photo?.guid`), so even had it been ignored the failure would have been a missing
image, not a crash.

### Not fixed, deliberately

Per the session scope, nothing above was changed. If it is picked up later:

- Sites 1 and 2 want the **collection form** (`People?$filter=Id eq {id}` +
  `$select`), which is one call, the same latency, and actually honors `$select`.
- Site 3 needs the collection form or a third call, per §15.
- A **lint rule or a guard inside `fetchRockData`** that warns when `$expand` or
  `$select` is passed with an `Entity/{id}` endpoint would stop this recurring.
  That is the durable fix; the three edits are not.

---

## 28. SPEC — remove-path `personId` (**implemented — see §31**)

Closes the §25 blocker: `removeMember` must invalidate the removed person's cache
but is keyed entirely on `groupMemberId` and never learns their id.

### Decision: **option 2, resolve it server-side.** This reverses §25's lean, for a reason §25 did not have

§25 recommended option 1 (pass `personId` through the form) on cost grounds — the
member list already has the id, so it is free — and held option 2 in reserve "if
the upsert work lands first". Writing the spec surfaced a third reason that
settles it independently of coherence or cost.

**`removeMember` currently has no check that `groupMemberId` belongs to
`groupId`.** The gate authorizes the actor against `groupId` from the URL
(`require-group-leader.ts`, `params.groupId`), and returns *the actor's own*
membership row. The write then targets `GroupMembers/{groupMemberId}` taken
straight from the form (`action.ts:151`). The only validation is that the id is a
positive integer and is **not the actor's own row** (`action.ts:162`). Nothing
binds the two together.

So a leader of any group can soft-remove **any `GroupMember` row in the Rock
instance** by posting its id to their own group's endpoint. Per §20 there is **no
backstop**: the `GroupMembers` controller has no `Auth` rules, the write runs as
the service account with full rights, and the app-side gate is the only
authorization control in the system. The happy path is completely correct, which
is exactly why this would ship.

**The pre-read that resolves `personId` is the same read that closes this.** One
call yields both. That makes option 2 not merely more coherent — it is required
anyway, and `personId` comes free.

### The pre-read

**Collection form, not by-id** — and this is a direct consequence of §27: a by-id
`GET GroupMembers/{id}?$select=…` silently returns the entire ~3.1 KB entity,
because `$select` is ignored there. The collection form honors it.

```
GET /api/GroupMembers
    ?$filter=Id eq {groupMemberId}
    &$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus
```

No `$expand`. No status predicate — a row already Inactive must be *recognised*,
not hidden (the §17 lesson). Uncached: `ttl: TTL.NONE`, same as the gate, since
this read now carries an authorization decision.

Then, in order, before either write:

| Check | Failure |
| ----- | ------- |
| Exactly one row returned | `ok: false`, "member not found" |
| **`row.groupId === groupId`** | **`AuthorizationError`** — same class as the gate, not a validation error |
| `row.id !== leadership.groupMemberId` | existing "cannot change your own record" (keep it; now redundant but harmless) |
| `row.groupMemberStatus !== 0` | `ok: true`, no-op — already removed; still invalidate both caches |

`row.personId` is then the cache key, and `row.groupRoleId` is available for
symmetry with item 4.

**The group-scope check is the security fix; the `personId` extraction is the
cache fix. Ship them together — they are one read.**

### Cost

**+1 round trip.** Measured shape from §16: a `$select`ed single-row collection
read is **~150 ms** on dev. Remove goes from 2 writes to 1 read + 2 writes,
~190 ms → ~340 ms. Acceptable for a leader-initiated action, and it buys an
authorization check the system does not currently have.

The read also **shrinks the failure window** flagged in §17: the pre-read catches
"row doesn't exist" and "wrong group" *before* the attribute write, so the
two-write window is entered only for requests already known to be valid.

### Interaction with item 4's pre-read — the two paths become one shape

Item 4 puts a pre-read on the add path keyed on `(GroupId, PersonId, GroupRoleId)`.
This puts one on the remove path keyed on `Id`. **Same endpoint, same
`$select`, same collection form, same `TTL.NONE` — different `$filter`.** One
helper serves both:

```ts
// Reads a GroupMember with NO status predicate — dormant rows must be visible
// (§17). Collection form because by-id ignores $select (§27).
const readGroupMemberRows = (filter: string) =>
  fetchRockData({
    endpoint: 'GroupMembers',
    queryParams: {
      $filter: filter,
      $select: 'Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus',
    },
    ttl: TTL.NONE,
  });
```

Both write paths then read the same shape, validate group scope the same way, and
end with the same two invalidations. If item 4 lands first this is nearly free; if
this lands first, item 4 inherits the helper. **Either order works — but both
should land together, because each one alone leaves an asymmetry that invites the
next bug.**

### Both intents invalidate both people

At `action.ts:73`, replacing the single call:

```ts
// The actor's own member-list view is cached per-user, so it always drops.
await invalidateUser(redis, auth.personId);

// The affected person's "my groups" lives in a DIFFERENT namespace
// (rock:u{personId}:*) that the actor's invalidation provably cannot reach —
// §25. Both intents need it: an add gives them a group, a remove takes one away.
if (result.ok && result.affectedPersonId !== auth.personId) {
  await invalidateUser(redis, result.affectedPersonId);
}
```

Both `addMember` and `removeMember` add **`affectedPersonId`** to their result:
`addMember` already has it (`form.get('personId')`, `action.ts:87`); `removeMember`
takes it from the pre-read. One field name for both intents, so the call site does
not branch on intent.

Gated on `result.ok` because a failed write changed nothing. The actor call stays
unconditional — that is existing behaviour and it is cheap. Note the second call
is **not** rolled back if the write later fails: a spurious invalidation costs one
cache miss, so it fails safe in the harmless direction.

### If option 1 is chosen instead — the one thing that must be written down

Should the form route be taken anyway (it is strictly cheaper, and the loader
already exposes `PersonId` on every row), then:

> **The form-supplied `personId` is a cache key and nothing else. It must never
> reach `requireGroupLeader`, the group-scope check, or any write payload.** A
> forged value then buys the attacker one wasted `SCAN` over an unrelated
> namespace — a needless cache miss, not a disclosure and not an escalation.

That comment belongs *at the point of use*, not in a doc. But note what option 1
does **not** buy: it leaves the group-scope hole open, because it supplies an id
rather than verifying one. **Option 1 closes the cache bug and none of the
security bug.** That is the whole argument for option 2.

---

## 29. SPEC — add-path upsert (**implemented — see §31**)

Fixes §17: a soft-removed member cannot be re-`POST`ed, so `POST`-only is wrong.

### The baseline shape

```
GET /api/GroupMembers
    ?$filter=GroupId eq {groupId} and PersonId eq {personId} and GroupRoleId eq {groupRoleId}
    &$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus

row found -> PATCH GroupMembers/{id}  { GroupMemberStatus: 1 }   + clear the reason
no row    -> POST  GroupMembers       { GroupId, PersonId, GroupRoleId, GroupMemberStatus: 1 }
```

**No status predicate** — the entire point is to see dormant rows. Collection form,
because by-id ignores `$select` (§27). `ttl: TTL.NONE`.

### Recommended refinement: drop `GroupRoleId` from the *filter*, keep it in the *decision*

The baseline filter is blind to a row for the same person at a **different** role,
and Rock's uniqueness key is per-role — so it will happily `POST`, leaving that
person with **two rows in one group**. A leader who adds an existing Group Member
as a Group Leader gets a duplicate in the member list, not a promotion. Legacy
never hit this because it went through workflow `GROUP_ADD_PERSON`, not a direct
entity write.

Reading **all** rows for `(GroupId, PersonId)` costs the *same single round trip*
and is strictly more informative:

```
?$filter=GroupId eq {groupId} and PersonId eq {personId}
&$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus
```

| Pre-read result | Action |
| --------------- | ------ |
| No rows | `POST` — the only genuine insert |
| Row at the requested role, `GroupMemberStatus: 0` | `PATCH` → 1, **and clear `MemberInactiveReason`** |
| Row at the requested role, already `1` | **No-op, report success.** Idempotent; also the correct recovery from §17's "my retry landed" ambiguity |
| Rows only at *other* roles | **Do not `POST`.** Surface it: this is a role change, not an add (see below) |

The last row is the one the baseline gets wrong, and it costs nothing to get right.

### Interaction with item 1 — the case this spec must refuse to handle silently

§26 proved that `PATCH GroupRoleId` **400s** when a dormant row already holds the
target role, with the byte-identical message to §17. So the "rows only at other
roles" branch cannot be resolved by patching the role:

- Active at 44, want Active at 50, **no** row at 50 → `PATCH GroupRoleId` works
  (§26 control, 204). But it is a *role change*, and calling it an "add" hides that.
- Active at 44, want Active at 50, **dormant row at 50 exists** → `PATCH
  GroupRoleId` is a permanent, opaque **400**. The correct sequence is
  **reactivate the dormant 50 row, then deactivate the 44 row** — two writes, no
  `GroupRoleId` write at all.

**Three shapes, not two: insert, reactivate, and role change.** The upsert covers
the first two. Role change is out of the current prototype's scope and should stay
out until it is specified deliberately — the add path must **detect** it and
decline, not improvise into it. Anything else ships §26's permanent 400.

### `MemberInactiveReason` must be cleared on reactivation — proven, not assumed

Direct evidence this session:

```
GET /api/AttributeValues
    ?$filter=EntityId eq 8862385 and Attribute/Key eq 'MemberInactiveReason'
    &$select=Id,EntityId,Value,ModifiedDateTime

[{"Id":541832959,"EntityId":8862385,
  "Value":"993f485b-52d7-4b65-b7d0-f758324fa1ae",
  "ModifiedDateTime":"2026-07-31T13:31:57.717"}]
```

That `ModifiedDateTime` **predates §22's reactivation of the same row** (workflow
timestamps put it at 14:22 the same day). The row was removed, reactivated, and
removed again, and the attribute was **never touched**. So **Rock does not clear
it on a status transition — the app must.** Otherwise every reactivated member
carries a stale removal reason, invisible in any UI (§17), and the *next* remove's
compensating rollback (`action.ts`, `attributeValue=`) would restore a reason from
a previous removal cycle rather than clearing it.

**CORRECTION — the mechanism named here was wrong.** This section originally said
clearing was "already proven in-tree" because the existing rollback issues:

```http
POST /api/GroupMembers/AttributeValue/{id}?attributeKey=MemberInactiveReason&attributeValue=
```

That call is a **400**. It was never proven, only assumed — the rollback that uses
it has never successfully run. See **§31**, which establishes the mechanism that
does work (`PATCH /api/AttributeValues/{id}` with `{"Value":""}`) and the cost of
finding the row first.

Order it **after** the status `PATCH`, the mirror of the remove path's ordering
argument (§17): if the process dies between them, the member is Active with a
stale reason attached — the benign, already-existing inconsistency — rather than
reason-cleared but still Inactive, which would look like a successful add that
did nothing.

Also observed: `GroupMember` 8862387 was PATCHed to `GroupMemberStatus: 0` in §26
with **no reason attribute written at all**, and Rock returned 204. **The
mandatory-reason rule is an app/legacy invariant, not a Rock constraint.** Nothing
below the app enforces it — same posture as §20's authorization finding.

### Round-trip cost

| Path | Today | With upsert |
| ---- | ----- | ----------- |
| Insert (no existing row) | `POST` 275 ms + read-back `GET` 154 ms = **435 ms** | + pre-read ~150 ms = **~585 ms** |
| Reactivate (dormant row) | **permanent 400** (§17) | pre-read ~150 + `PATCH` ~165 + clear ~165 = **~480 ms** |
| Already active | opaque 400 | pre-read only = **~150 ms** |
| Role change / other-role row | silent duplicate row | pre-read only, declines = **~150 ms** |

Latencies from §16 / §26 measurements on dev. **One extra round trip on the insert
path buys three broken paths becoming correct.**

The pre-read also **subsumes the §17 recovery advice**. §17 concluded the app must
`GET` on a 400 and treat an existing Active row as success. With the pre-read, that
400 is not reached — the check moves from an error handler, which is only exercised
when something goes wrong, to the main line, which is exercised every time. That is
the more testable placement.

### Both paths become one shape

Yes. With §28's remove pre-read, both intents open with the same collection-form
read of the same fields with the same `TTL.NONE` and no status predicate, differing
only in `$filter` — `Id eq {groupMemberId}` for remove, `GroupId eq X and PersonId
eq Y` for add. Both then validate group scope from the returned row rather than
trusting the form, and both end with the same two invalidations (§28).

**Land them together.** Each alone leaves the other path trusting a client-supplied
id and reading a different shape, which is the asymmetry that produced both bugs.

### Out of scope, deliberately

`GroupMemberStatus: 2` (Pending) is untouched — the upsert reactivates to **1**
regardless of prior status. If a Pending row should stay Pending, that is a
product decision, not a defaultable one.

---

## 30. Records created or mutated — session 5 (Day 4), all reversed

**Nothing was `DELETE`d.** One row was created (unavoidable — the §26 collision
needs two rows for one person) and soft-removed per the reversibility rule.

| Record | Start state | Mutations | Final state | Reversed? |
| ------ | ----------- | --------- | ----------- | --------- |
| `GroupMember` **8862387** — person 389650 (service account), group **1055022** | **did not exist** | `POST` role 49 status 1 → `PATCH` role 44 **rejected 400** → `PATCH` role 46 (204) → `PATCH` role 49 + status 0 (204) | **role 49, `GroupMemberStatus: 0`, `IsArchived: false`** | **Yes — soft-removed** |
| `GroupMember` **8862385** — the designated disposable row | role 44, status 0, `IsArchived: false` | **none — read only** | role 44, status 0, `IsArchived: false` | **Untouched, as instructed** |

Re-verified by `GET` after the final write:

```
GET /api/GroupMembers?$filter=GroupId eq 1055022 and PersonId eq 389650
    &$select=Id,GroupRoleId,GroupMemberStatus,IsArchived

[{"Id":8862385,"GroupRoleId":44,"GroupMemberStatus":0,"IsArchived":false},
 {"Id":8862387,"GroupRoleId":49,"GroupMemberStatus":0,"IsArchived":false}]
```

Fixture rows re-verified unchanged: **8862386** (group 1838823, role 50, Active)
and **3329432** (group 1055022, role 44, Active). **No group other than 1055022
was written to.** Groups 241543 and 1829030 were not touched.

**Rock-side side effects, not reversible:** the one `POST` fired add triggers 49 /
63 / 64 (§14), so `WorkflowType` 700 and 730 each ran once more and one further
`AddedToGroup` `Interaction` row exists for alias 389595. Unavoidable for any
`POST`; consistent with §18.

**Reads only, no mutation:** `AttributeValues` (§29 evidence), `People/224061` and
`People/GetByAttributeValue` (§27 `$expand` controls), `AttributeValues` for
`Pathname` (§27 fixture lookup).

### Credential handling

**No user credential was used this session.** All calls ran on the
service-account token, read from the gitignored `.env` by variable reference and
never written to a file, log, findings doc, fixture, or commit. `ROCK_TEST_PASS`
was not read at all. The dev host `dev-rock.christfellowship.church` was
hardcoded throughout; `ROCK_API` still points at prod in both `.env` and
`.env.local` and was deliberately not relied upon.

### Not ours to do — carried forward / closed

1. ~~Revert `WorkflowType` **700** `IsPersisted` to **`false`**~~ — **DONE
   (2026-08-04)** by a Rock admin (§22 / §32).
2. Fix the **`ROCK_TEST_USER`** env var — it holds `ani@jedi.order`; the real
   username is `anakin@jedi.order` (§19).
3. Raise with the Rock team: the **missing `Secure` flag** on the `.ROCK` cookie
   (30-day lifetime, §20). ~~The removal-cache-flush gap (§22)~~ was raised as
   ask 3 and is **WITHDRAWN (2026-08-04)** — see decision memo §7.

None of the four items this session touched any of these.

---

# Session 5, part 2 — the specs implemented (2026-08-03)

## 31. Both specs built — and one of them was wrong

§28 and §29 are now implemented in
`app/routes/spike-manage-members.$groupId/action.ts`, with tests in
`action.test.ts`. Implementing them **falsified part of §29**, which is recorded
here rather than quietly patched.

### The correction: `MemberInactiveReason` cannot be cleared the way §29 said

§29 asserted the clearing mechanism was "already proven in-tree" because the
existing compensating rollback issues an empty-value attribute write. Executed
against dev for the first time:

```http
POST /api/GroupMembers/AttributeValue/8862385?attributeKey=MemberInactiveReason&attributeValue=
Content-Length: 0

HTTP/1.1 400 Bad Request
{"id":"","attributeKey":"","attributeValue":"",
 "attributeValue.String":"A value is required but was not present in the request."}
```

**That endpoint can only SET a value. It cannot clear one.** Omitting the
parameter entirely is worse — **404**, no route match. (A first attempt without
`Content-Length` returned **411**; the 400 above is the real answer, with the
header present.)

What does work is patching the `AttributeValue` row itself:

```http
PATCH /api/AttributeValues/541832959
{"Value":""}

HTTP/1.1 204 No Content
```

Verified: `Value` became `""` and `ModifiedDateTime` advanced to
`2026-08-03T14:32:53.987`. The row is emptied, not deleted — no `DELETE` was used.

**So clearing costs two calls, not one**, because the `AttributeValue` id has to be
found first:

```
GET /api/AttributeValues
    ?$filter=EntityId eq {groupMemberId} and Attribute/Key eq 'MemberInactiveReason'
    &$select=Id
PATCH /api/AttributeValues/{id}   {"Value":""}
```

§29's reactivation cost estimate of ~480 ms therefore becomes **~630 ms** (4 calls:
pre-read, status `PATCH`, attribute lookup, attribute `PATCH`). Still bounded, and
still infinitely better than the permanent 400 it replaces.

### The second-order finding: the existing rollback has never worked

`removeMember`'s compensating rollback issued **exactly the call above that 400s**.
So on every invocation it would have failed, been swallowed by its own `catch`, and
reported `rolledBack: false`. Nobody noticed because the rollback only runs when the
status `PATCH` fails — which never happened in any session.

**§17 called this rollback "hand-rolled"; it was in fact non-functional.** The
inconsistency window it exists to close was never actually closed. It now shares the
verified helper.

This is the general lesson of the by-id sweep repeating itself: **an untaken code
path is an unverified claim.** Both defects — the null `$expand` read-back and this
rollback — sat in code that looked reviewed.

### What was built

| Piece | Where | Notes |
| ----- | ----- | ----- |
| `readGroupMemberRows(filter)` | shared by both intents | Collection form, `$select`, `TTL.NONE`, **no status predicate** |
| `clearInactiveReason(id)` | shared by add-reactivate and the remove rollback | Lookup + `PATCH` per the correction above; returns a result, never throws |
| Remove pre-read + **group-scope check** | `removeMember` | Throws `AuthorizationError` when the row's `GroupId` ≠ the URL's. **The security fix.** |
| Add upsert, 4 branches | `addMember` | `already-active` / `reactivated` / declined role change / `inserted` |
| Second `invalidateUser` | `action` | Keyed on `affectedPersonId` from the pre-read, both intents, gated on `ok` |

The add path's by-id read-back (§27 hit #3) was **left in place**, with a comment
saying its `groupRole` is always null. §27's conclusion stands: the durable fix is a
guard inside `fetchRockData`, not scattered edits.

### Verification — and its limits, stated plainly

- **Typecheck:** 0 errors. **ESLint:** clean. **Full suite: 858 tests, 99 files, all
  passing** — no regression elsewhere.
- **10 new tests**, each asserting on the *writes issued* rather than just the
  returned value, because a test that only checked `ok` would pass while POSTing
  into a permanent 400.
- **The two most important tests were mutation-checked**, not merely observed green:
  neutering the group-scope check failed exactly one test, and adding
  `GroupMemberStatus eq 'Active'` back into the pre-read filter failed exactly one
  test. Both reverted; suite green again. Per Rule 9, a test that cannot fail when
  the logic changes is not a test.
- **Every REST call the new code emits was executed against dev individually** — the
  collection-form pre-read, the status `PATCH` both directions, the attribute
  lookup, the attribute `PATCH`, and the reason-set write (which returns **202**,
  not 200).
- **NOT verified: the route end-to-end.** `requireUser` needs a `.ROCK` cookie from
  `/Auth/Login`, and **`ROCK_TEST_PASS` is not present in either `.env` or
  `.env.local`** on this machine, so no login was possible. Control flow is covered
  by mocks; wire behaviour is covered by the direct dev calls; the two have not been
  exercised together. **That gap is real and should close before this ships.**

### Records — session 5 part 2, all restored

| Record | Start | Mutations | Final | Reversed? |
| ------ | ----- | --------- | ----- | --------- |
| `GroupMember` **8862385** | role 44, status **0**, reason `993f485b-…` | status → 1 → 0; reason cleared to `""` then reset | **role 44, status 0, reason `993f485b-…`** | **Yes — identical to start** |
| `AttributeValue` **541832959** (the reason on 8862385) | `Value: 993f485b-…` | → `""` → `993f485b-…` | **`Value: 993f485b-…`** | **Yes — emptied, never deleted** |
| `GroupMember` **8862387** | role 49, status 0 (from §26) | none | role 49, status 0 | Untouched |

Only `ModifiedDateTime` on 541832959 differs from the start state, which is not
resettable and is the expected trace of any write. Confirmed by `GET`. No `DELETE`
was issued anywhere this session. Groups other than **1055022** were not written to.

**Reactivation fires no triggers (§22), so this sequence created no `Workflow` or
`Interaction` rows** — unlike §26's `POST`.

---

# Close-out (2026-08-03, revised 2026-08-05)

## 32. Consolidated record ledger — every record touched, Days 0–4

The per-session tables (§18, §21, §24, §26, §30, §31) scattered these ids across
six sections. This is the single table. **Every `GroupMember` row below was
re-verified by a live `$select`ed READ against dev on 2026-08-03 as part of the
close-out, except where a later 2026-08-05 note says otherwise.** No write of any
kind was issued during the 2026-08-03 verification. The §33 write-path sequence
(2026-08-05) then created and mutated rows recorded below.

**Nothing was ever `DELETE`d by the spike's REST sessions.** The reversibility
rule held for the whole spike: `DELETE` was never issued against any entity via
the API, on any host, in any session — the `DELETE`-cascade question was
deliberately never probed (§9). Every reversal was a soft remove or a
restore-to-prior-value. **Exception outside REST:** `GroupMember` **8862386** was
hard-deleted through Rock's admin UI on 2026-08-05 (exploratory, before the route
sequence) — recorded below.

**All ids below are DEV ids. See the warning at the top of this document.**

### Rows we created

| Id | Entity | Group | What changed | Current state (read-verified 2026-08-03 unless noted) | Reversed? |
| -- | ------ | ----- | ------------ | ---------------------------------------- | --------- |
| **8862385** | `GroupMember` — person **389650** (service account "apollos"), role **44** | 1055022 | Created by §15's `POST`; soft-removed by §15; reactivated + re-removed + archived + un-archived (§22); status cycled 0→1→0 again in §31 | `GroupMemberStatus` **0**, `IsArchived` false, role 44, `DateTimeAdded` 2026-07-31T13:31:27.84, `ModifiedDateTime` 2026-08-03T14:33:21.36 | **Yes** — soft-removed, never deleted |
| **8862387** | `GroupMember` — person **389650**, role **49** | 1055022 | Created by §26's `POST` to construct the role-change collision; PATCHed 49→44 (**rejected 400**) →46 (204) →49 + status 0 | `GroupMemberStatus` **0**, `IsArchived` false, role 49, `DateTimeAdded` 2026-08-03T13:57:18.017 | **Yes** — soft-removed, never deleted |
| **8862392** | `GroupMember` — person **394626** (`anakin@jedi.order`), role **50** | 1838823 | Created by the §33 write-path **insert** through `/spike-manage-members/1838823` at 2026-08-05T10:55:25.323; soft-removed then reactivated in the same sequence | **Active (status 1)**, role 50, `CreatedDateTime` 2026-08-05T10:55:25.323, `ModifiedDateTime` 2026-08-05T11:24:55.157 (verified by GET) | **No — spike residue on dev.** Soft-remove → reactivate left it Active. Cleanup: soft-remove or admin-delete when the spike route is retired |
| **541832959** | `AttributeValue` — `MemberInactiveReason` on `GroupMember` 8862385 | — | Set by §15; cleared to `""` and reset in §31 | `Value` = `993f485b-…` ("No longer interested"), `ModifiedDateTime` 2026-08-03T14:33:21.127 | **Yes** — restored to its original value; emptied, never deleted |

**Both created `GroupMember` rows at status 0 (8862385, 8862387) belong to the
service account, not to a real congregant.** They are dormant fixtures, not live
memberships. Deliberately left in place rather than deleted, per the reversibility
rule — and note that leaving them is not neutral: they are exactly the dormant rows
that make a re-add or a role change 400 (§17, §26), so anyone re-testing person
389650 in group 1055022 will hit the upsert path, not the insert path.
**8862392** is different: it is an Active row for a real test user, left by the
§33 sequence — spike residue, flagged for cleanup.

### Rows that pre-existed and were only read, or read and restored

| Id | Entity | Group | What changed | Current state (read-verified 2026-08-03 unless noted) | Reversed? |
| -- | ------ | ----- | ------------ | ---------------------------------------- | --------- |
| **3183436** | `GroupMember` — person **27099**, role **47 Group Co-Leader** | 1055022 | **Nothing — read only.** Used as the ALLOW fixture for the gate (§13) | Active (status 1), role **47**, `ModifiedDateTime` 2024-03-01 — predates the spike | N/A — never written |
| **3329432** | `GroupMember` — person **394626** ("Ani Skywalker"), role **44 Group Member** | 1055022 | **Nothing — read only.** The DENY fixture (§13) and the non-leader identity for §20 | Active (status 1), role 44 | N/A — never written |
| **8862386** | `GroupMember` — person **394626**, role **50 Group Leader** | 1838823 | Provisioned as a fixture on 2026-07-31T14:22:07.837, outside our REST sessions. Its creation is what produced the baseline `Workflow` row that proved trigger 49 fires (§22). **Hard-deleted through Rock's admin UI on 2026-08-05** during an earlier exploratory round, before the §33 route sequence. Replaced by **8862392** | **NO LONGER EXISTS** (confirmed absent; not a live fixture) | **Deleted outside REST** — admin UI, 2026-08-05 |
| **TODO — Danny Wood leader row** | `GroupMember` — Danny Wood's own person, leader role in group **1838823** | 1838823 | Created via Rock's admin UI on 2026-08-05 so the actor could pass `requireGroupLeader` for the §33 sequence | Active leader — **spike residue on dev.** **TODO: record the `GroupMember.Id` once known** — do not invent one | **No — spike residue.** Cleanup when the spike route is retired |
| **31560** | `UserLogin` — person 394626 | — | Last-login timestamp advanced by the one successful `/Auth/Login` in §20 | Not resettable; unremarkable | No — nothing to reverse |
| 799452 · 822084 · 800501 · 800502 | `GroupMember` rows, roles 50/49/47/48 | 241543 | **Nothing — read only.** The §2/§3 filter-shootout fixtures, dev **and** prod | Untouched | N/A — never written |

> **Correction, applied here and in the session-3 preamble:** `GroupMember`
> **3183436 is role 47 (Group Co-Leader), not role 50 (Group Leader).** The
> role-50 description originated in a session prompt and never entered a committed
> file. It is immaterial to the ALLOW result — 47 is `IsLeader: true` (§4) — but
> the result must not be read as evidence about role 50. Role 50 was exercised
> separately, via `GroupMember` 8862386 in group 1838823 (now deleted; successor
> fixture is **8862392**).

### Rock-side side effects — not reversible, listed for auditability

| Record | What | Origin |
| ------ | ---- | ------ |
| `Interaction` **73324746** | `AddedToGroup`, alias 389595, component 273491, 2026-07-31T13:31:28.383 | Workflow 730 via trigger 63, fired by §15's `POST`. **This row is the Q2 evidence** — deliberately left in place |
| `Interaction` **73329123** | `AddedToGroup`, alias 389595, 2026-08-03T13:57:19.11 | Same mechanism, fired by §26's `POST` |
| `Workflow` **5696074** | Type 700 "Web and App Cache Flush", Completed, 2026-07-31T14:22:07.883 | Trigger 49, fired by the creation of fixture 8862386. Exists only because `IsPersisted` was flipped. **Apollos flush call** (GraphQL `flushRock` for the member's `Person.Id`) — not a Rock-internal cache write; see §22 |
| `Workflow` **5696075** | Type 700, Completed, 2026-08-03T13:57:18.11 | Trigger 49, fired by §26's `POST`. Same Apollos flush; harmless, no Rock-side effect |

Any `POST` to `GroupMembers` on group type 31 writes an `Interaction` and runs
workflows 700 and 730 (§14). Workflow 700 POSTs an Apollos GraphQL cache flush
(§22); 730 writes the `Interaction`. Budget for both when testing — **especially
against prod.**

### Configuration changed — resolved

| Setting | Changed to | Reverted to | Status |
| ------- | ---------- | ----------- | ------ |
| `WorkflowType` **700** `IsPersisted` | **`true`** (flipped for the §22 trigger-53 test) | **`false`** | **CLOSED (2026-08-04).** Reverted by a Rock admin. Two `Workflow` rows accrued while set (5696074, 5696075); no further accrual |

`WorkflowType` 730 was re-read at close-out and was unchanged
(`IsPersisted: false`, `LoggingLevel: 0`).

### Flags from the verification sweep

1. **Two rows are not at `GroupMemberStatus` 0 — and both are correct (as of
   2026-08-03).** 3183436 and 3329432 are pre-existing Active memberships of real
   people that the spike only ever read. At that sweep, **8862386** was also an
   Active fixture leader row; it was hard-deleted on 2026-08-05 (§32) and replaced
   by **8862392**, which the §33 sequence left Active. **Every row the spike
   *created via REST before 2026-08-05* is at status 0.** 8862392 is the
   exception — Active spike residue from the write-path run.
2. **As of the 2026-08-03 close-out sweep:** no `GroupMember` row anywhere on
   dev had been modified since 2026-08-03T14:33:30 — the timestamp of the last
   write recorded in §31. Verified by
   `$filter=ModifiedDateTime gt datetime'2026-08-03T14:33:30'`, which returned
   `[]`. **Superseded 2026-08-05:** the §33 write-path sequence created and
   mutated `GroupMember` **8862392** (and related attribute writes) on group
   1838823. Flag 2's empty result described the state *before* that run, not
   after.
3. **Only one `GroupMember` row was created on dev on 2026-08-03: 8862387.**
   Verified by `$filter=DateTimeAdded gt datetime'2026-08-03T00:00:00'`.
   **Addendum 2026-08-05:** `GroupMember` **8862392** was created that day by
   the §33 insert.
4. **CLOSED. Read-only prod sweep run by Danny Wood, 2026-08-04.** Both queries
   returned an empty array: the group-scoped query on 1838823 and 1055022, and the
   unscoped `PersonId eq 389650` query. The sweep's window began
   **2026-07-30** and its filters were `(GroupId eq 1838823 or GroupId eq
   1055022)` and `PersonId eq 389650`. Person **394626** was never in the filter
   and nothing before 07-30 was in the window, so `[]` means "nothing matching
   those predicates," not "nothing anywhere." If the spike's first session
   predates 2026-07-30, one further sweep with `PersonId eq 394626` and an
   earlier start would close it fully. Recorded for reproducibility:
   `GroupMembers?$filter=ModifiedDateTime gt datetime'2026-07-30T00:00:00' and (GroupId eq 1838823 or GroupId eq 1055022)&$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus,ModifiedDateTime`
   plus the same filter on `PersonId eq 389650` unscoped by group.

---

## 33. The end-to-end run — human-verified, and exactly how far it reaches

**Status: the spike route was exercised end to end manually by Danny Wood, in a
browser, against dev, and reports as working.** That closes the §31 gap — "the
route has never been exercised end to end" — for the auth chain, the loader, the
non-leader denial, **and** (as of 2026-08-05) the write-path sequence. What
remains unexercised is named branch-by-branch below; do not read "DONE" as
"every branch ran."

### Earlier run (auth / loader / denial) — boundary

| | |
| --- | --- |
| **Verified by** | Danny Wood, manually, in a browser, on **dev**, as `anakin@jedi.order` |
| **Agent-observed** | **No.** No request, response, status code, or rendered page from that run was captured (original run — see item 3 for the later, instrumented observation) |
| **Host** | Dev, confirmed. Corroborated independently at the time: no `GroupMember` row anywhere on dev was modified after the last agent write (§32 flag 2 as of 2026-08-03; superseded by the 2026-08-05 write sequence below) |

### What the earlier run DID verify

- **The auth chain runs.** `requireUser` → `requireGroupLeader` → loader, together,
  with a real `.ROCK` cookie, for the first time. Until this run, control flow was
  mock-covered and wire behaviour was dev-verified but the two had never been
  exercised together (§31).
- **The gate denies a non-leader through the route.** Person 394626 is role **44**
  on group 1055022, and the route refused. §13 proved `requireGroupLeader` throws
  for that person when called directly; this confirms the *route* refuses too.
- **The denial is HTTP 500 rendering the generic not-found page** — status and
  page both observed (item 3 below). Ticket 2b is confirmed by observation.
- **Unauthenticated requests fail closed via redirect.** A signed-out document
  request to the same route returns **302** to
  `/login?returnTo=%2Fspike-manage-members%2F1055022` — `requireUser` redirects
  before the gate runs. This is why removing `/login` (ticket 4) must be coupled
  with removing the spike route.

### Write-path sequence — DONE (2026-08-05)

1. **DONE (2026-08-05). Write-path sequence ran through the spike route.**

   **Substitution:** target was person **394626** (`anakin@jedi.order`), **not**
   389650 as originally written. Reason: avoid involving additional real people.
   Actor was **Danny Wood's own account**, granted a leader role in group
   **1838823** via Rock's admin UI in order to pass the gate (see §32 TODO row
   for that membership; id not yet recorded). All three steps ran at
   `/spike-manage-members/1838823`.

   **Observed:**

   - **Insert** created `GroupMember` **8862392** (group 1838823, role 50) at
     `2026-08-05T10:55:25.323`.
   - **Remove** and **re-add** followed. The re-add returned:
     `ok: true`, `intent: 'add'`, `outcome: 'reactivated'`, `groupMemberId:
     8862392`, `affectedPersonId: 394626`, `patchStatus: 204`, `reasonCleared:
     { cleared: true }`, `preReadMs: 56`, `totalMs: 638`.
   - **Externally verified:** `GET /api/GroupMembers?$filter=Id eq 8862392`
     returns one row, status **1**, `CreatedDateTime` 10:55:25.323,
     `ModifiedDateTime` 11:24:55.157 — same id, modified after created,
     therefore a `PATCH` against the existing row and not a fresh insert.
   - The documented ~630 ms reactivation cost is corroborated (**638 ms**
     observed).

   **Partially exercised — precise breakdown:**

   | Exercised end to end | Not exercised |
   | -------------------- | ------------- |
   | Insert branch | No-op branch (row at requested role already Active) |
   | Reactivate branch | Decline / role-change branch |
   | Two-call `MemberInactiveReason` clear | Group-scope check's `AuthorizationError` path (a row from a different group was never submitted) |
   | Group-scope check's **PASS** path | "Cannot change your own record" guard (actor and target were different people) |

   Unit tests still cover the unexercised branches; the live route has not.
   Residue: `GroupMember` **8862392** and Danny's leader row on 1838823 — both
   flagged in §32 for cleanup.
2. **CLOSED.** Production sweep — see §32 flag 4. Nothing matching the sweep
   predicates reached production; see the flag for what the empty result does and
   does not mean.
3. **CLOSED. Observed by Danny Wood, 2026-08-04, browser on localhost, signed in as
   `anakin@jedi.order` (person 394626, role 44 on group 1055022 — not a leader).**
   The document request to `/spike-manage-members/1055022` returned **HTTP 500**
   while rendering the generic not-found page. The server console confirms the
   mechanism directly: `AuthorizationError: Person 394626 is not an active leader
   of group 1055022`, thrown at `require-group-leader.ts:111` and propagating
   uncaught through `spike-manage-members.$groupId/loader.ts:51`. A thrown
   non-`Response` is an unhandled error, so React Router answers 500 while
   `app/error.tsx:11` renders `NotFound` unconditionally. **Ticket 2b is now
   confirmed by observation, not inference.** Separately confirmed: an
   unauthenticated request to the same route returns **302** to
   `/login?returnTo=%2Fspike-manage-members%2F1055022` — `requireUser` redirects
   before the gate runs. Fails closed. This is why removing `/login` (ticket 4)
   must be coupled with removing the spike route.

**Do not upgrade "partially exercised" to "fully verified" without the
unexercised branches above.** The route is throwaway code (see the port
manifest) — but its group-scope check and its four-branch upsert are requirements
that survive it, and the live run covered only the subset named in the table.

---

## 34. Rock-UI status edits reach the gate immediately — and expose the cached-read gap

**Observational support for the §3b invalidation build requirement — not a new
requirement.**

During the 2026-08-05 session, status changes made directly in Rock's admin UI
were reflected by the app's leader gate immediately, with no invalidation step.
That is expected and validating: the gate query runs at `TTL.NONE`, so it always
re-reads. The observation specifically supports:

- the quoted `GroupMemberStatus eq 'Active'` filter,
- the `GroupRole/IsLeader eq true` predicate, and
- the choice of `TTL.NONE` for an authorization decision.

It is also the spike's only **direct** observation of the Rock-originated
staleness gap named in decision memo §3b: the same admin-UI edit would have gone
stale in any **cached** membership-list read, because this project's Redis never
hears about writes that originate outside the app. Present as corroboration of
the existing invalidation requirement (endpoint + trigger vs short TTLs) — not as
an additional one.
