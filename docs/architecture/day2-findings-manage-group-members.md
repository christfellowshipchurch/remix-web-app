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

_Updated at the end of session 3 (2026-07-31). Resolved items struck through with
a pointer to where they were settled._

- ~~**Whether a REST `POST` trips Rock's `GroupMemberWorkflowTriggers`**~~ —
  **RESOLVED: it does.** See §14.
- **Re-adding a soft-removed member is a 400** and the prototype's add path does
  not handle it (§15). This is the highest-priority functional gap found this
  session — it makes remove-then-re-add, an obvious leader workflow, fail.
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
- **Removals never flush the legacy web/app cache** (§22) — the confirmed
  consequence of the above. Adds flush (trigger 49, now proven); removes do not.
  **Needs a decision before build:** explicitly launch workflow 700 after a remove,
  ask Rock to add a `MemberStatusChanged` trigger, or accept stale legacy surfaces.
- **`WorkflowType` 700 `IsPersisted` must be reverted to `false`** — flipped for
  the §22 test, deliberately not flipped back by us.
- **Confirming 654** against the deployed `ROCK_MAPPINGS` (§6).
- **Q4 cache invalidation** (brief Q4) — not exercised. Whether invalidating the
  _actor_ also clears the _removed member's_ own "my groups" list is unanswered;
  the two triggers on group type 31 flush a legacy cache, and whether that
  touches our Redis is still unknown.
- **`DELETE` cascade behavior** — never probed, by policy (reversibility rule).

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
  member is also writing interactions and flushing legacy caches. Budget for that
  when testing against prod.
- **Trigger 49 (cache flush on add) almost certainly also fired.** It shares the
  dispatch mechanism just proven for 63. It cannot be observed directly — a cache
  flush leaves no queryable row — so this is inference, clearly labelled.

### The one part still genuinely open

**Whether a soft remove fires the "removed" trigger (53) is unresolved.** Our
remove was a `PATCH` to `GroupMemberStatus: 0`, and no second `Interaction`
appeared — but trigger 53 points at workflow 700, the cache flush, which writes
**no observable side effect**, and the only interaction-writing workflow (730) is
an *added* trigger that would not fire on a removal anyway. So the absence of a
second interaction is uninformative here, for the same reason Day 0's absence was.

Worth flagging on its own merits, because Rock's `MemberRemovedFromGroup` trigger
conventionally fires on **delete/archive**, and a status change to Inactive may
well not count as "removed" at all. If it does not, **a soft remove never flushes
the legacy web/app cache**, and removed members could linger in legacy surfaces.

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
| 1838823 | Jedi Council Test Group | **31**        | 8862386          | **50** Group Leader | **true**   | **1 Active** | false        |
| 1055022 | CFDP Testing Group      | **31**        | 3329432          | **44** Group Member | **false**  | **1 Active** | false        |

Both memberships present and Active, exactly as the fixture spec required.

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

With `WorkflowType` 700 now `IsPersisted: true`, a completed run leaves a
`Workflow` row. Note `LoggingLevel` is **still 0**, so `WorkflowLog` stays empty
either way — the `Workflow` row is the only signal. (`/api/WorkflowLogs` is
**not a route at all** on this Rock: `No HTTP resource was found`.)

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
analogy that the cache-flush trigger fired alongside the observable one; the
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

### Why this matters — §14's warning is confirmed

§14 flagged the risk that "a soft remove never flushes the legacy web/app cache,
and removed members could linger in legacy surfaces." **That is now the confirmed
behavior, not a hypothesis.**

Our remove path writes `GroupMemberStatus: 0`. Rock fires nothing. **The legacy
web and app caches are never flushed on removal**, so a member removed through
this feature can continue to appear in legacy surfaces until some other event
flushes the cache. The add path is fine — trigger 49 fires and flushes.

**This is an asymmetry the build must handle**, and it is not fixable by choosing
archive over soft remove, because archive does not fire it either. Options:
explicitly `LaunchWorkflow` 700 after a remove, ask the Rock team to add a
`MemberStatusChanged` trigger to group type 31, or accept the staleness. **This
should go to the Rock team alongside the `IsPersisted` revert.**

### `IsPersisted` must be reverted

It was flipped to `true` **for this test only** and has **not** been flipped back —
per instruction, not by me. **It should be returned to `false`.** Left as-is,
every group-member add on group type 31 permanently accumulates a `Workflow` row.

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

**Still owed to the Rock team (not ours to change):** `WorkflowType` 700
`IsPersisted` back to **`false`**.
