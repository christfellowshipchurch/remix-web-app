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

- **Test leader and non-leader credentials (checklist #7).** Not provisioned —
  requires Rock admin action and cannot be done from here. §8 covers the
  authorization _logic_, but **the authentication half of Q1 is still blocked**:
  every call in this document ran on the service-account token, so nothing here
  exercises `/Auth/Login`, the `.ROCK` cookie, or write model (b).
- **The `IsArchived` write probe** (§5).
- **Confirming 654** against the deployed `ROCK_MAPPINGS` (§6).
- **Whether a REST `POST` trips Rock's `GroupMemberWorkflowTriggers`** — the
  prototype's add path exists to answer this, but it needs a logged-in user to
  drive it.

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

## 9. Corrections owed to existing docs

Recorded, not applied — consistent with the Day 1 approach.

| Doc                                     | Location                                    | Correction                                                                                                                                 |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `day1-findings-manage-group-members.md` | §0, §3 "Coaches count as leaders", §8.4     | Role 49 is `IsLeader: false` on dev **and** prod. Coaches do **not** pass `userIsLeader`. The `!== 49` guard is not evidence that they do. |
| `day1-findings-manage-group-members.md` | §0, §4                                      | The `eq '1'` silent-deny risk is refuted — `eq '1'` and `eq 'Active'` return identical rows on both hosts.                                 |
| `day1-findings-manage-group-members.md` | §3 "Recommended `requireGroupLeader` query" | `GroupRole/IsLeader eq true` works as a `$filter`; it can be a dependency, not just an optimization.                                       |
| `rock-rest-api-survey.md`               | Key Finding #1                              | `$expand=Group` → 400 confirmed on prod as well as dev.                                                                                    |
