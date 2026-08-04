# Decision Memo — Manage Group Members on Rock REST + Redis + React Router v7

**Owner:** Danny Wood · **Prepared:** 2026-08-03 · **Audience:** engineering ·
**Spike:** closed

Appendix: [`day2-findings-manage-group-members.md`](day2-findings-manage-group-members.md)
— cited by section (§n) throughout rather than restated. **Read its top warning
before using any id from it: dev ids have drifted from prod.**
Port list: [`manage-group-members-port-manifest.md`](manage-group-members-port-manifest.md).
Tickets: [`manage-group-members-followup-tickets.md`](manage-group-members-followup-tickets.md).

> This memo is written for someone building in the **new My Groups project** who has
> never opened `remix-web-app`. Everything below is Rock knowledge, not
> `remix-web-app` knowledge. Where a `remix-web-app` path is cited, it is cited as
> the place the evidence was gathered — not as a dependency.

---

## 1. Verdict

**Yes. Build it on Rock REST + Redis + React Router v7. Apollos/GraphQL is not
required and nothing found in five sessions argues for it.** Every capability the
feature needs is proven against live Rock: the leader gate is a single OData call
(`GroupRole/IsLeader eq true` as a `$filter`, §3), the member list is one
`$expand`ed call with no N+1 (§7), reads are cheap with `$select` (~187 B/member,
§16), and all three write shapes — add, remove, role change — have been executed
and characterised on the wire (§15, §17, §26, §31). A REST `POST` **does** trip
Rock's own `GroupMemberWorkflowTriggers` (§14), so the write path does not have to
reimplement Rock's internal side effects. The costs are real and bounded. Most are
known: authorization lives entirely in the app because Rock's REST layer provides
no backstop (§20); there is no server-side row count, which constrains the
pagination UX (§4 below); and `ADD` is an upsert rather than an insert because
Rock's uniqueness constraint ignores member status (§3a below). One cost remains
untested — whether Rock enforces per-group security on REST writes (§6 item 2) —
but under model (a) that answer cannot change the design, so it is not a blocker.
**Version basis: verified
on dev Rock 18.3 → 18.4.1.0 — a range, because the host moved mid-spike — targeting
an 18.x launch; prod is 17.7.0.0.** Note that **19.1 and 20.x have already
shipped**, so launching on 18 puts us two majors behind. That is not spike-blocking
— nothing below depends on an 18-only behaviour, and every cross-checked surface
behaved identically on 17.7 and 18.4 despite the gap (§0) — but the prod upgrade is
a conversation to start now, not after launch, and §5 below is the reason.

---

## 2. What the spike proved

Load-bearing results only.

**A REST `POST` fires Rock's `GroupMemberWorkflowTriggers`, exactly as a UI write
does (§14).** This was open for two sessions because the method was wrong: group
type 31's triggers point at workflow types 700 and 730, both `IsPersisted: false`
and `LoggingLevel: 0`, so a completed run leaves **no `Workflow` row and no
`WorkflowLog` row** — looking for a run record was guaranteed to find nothing
whether or not it fired. The answer came from a **persisted side effect** instead:
workflow 730's entire job is to write an `Interaction`, and an `Interaction`
survives `IsPersisted: false`. `POST /api/GroupMembers` at 13:31:27.84 produced
`Interaction` **73324746**, `Operation: "AddedToGroup"`, at 13:31:28.383 — **0.54 s
later**, on `InteractionComponentId` 273491 (`"Group: CFDP Testing Group"`, scoped
to the exact group written). Baseline: that alias had 3 `AddedToGroup` interactions
in its entire history. Trigger 49 (the cache flush) was later confirmed directly
once `IsPersisted` was flipped: `GroupMember` 8862386 added at 14:22:07.837, workflow
700 activated at 14:22:07.883 — **46 ms later** (§22).

> **Consequence for the build: the add path does not need to launch workflow 654
> (`GROUP_ADD_PERSON`) to keep Rock's internal state consistent.** Rock's own
> trigger machinery runs on the entity write. 654 matters only for **legacy email
> parity** — it is what sends the confirmation emails (§6) — so whether to launch it
> is a product question about email, not a correctness question about Rock. Corollary:
> **`POST`ing is not side-effect-free.** Every add writes an `Interaction` and runs
> two workflows. Budget for that in testing, especially against prod.

**The leader gate is a single OData call (§3).** `GroupRole/IsLeader eq true` works
as a `$filter` on the nav property, so Rock returns only authorized rows and there
is no app-side scan to get wrong:

```
GET /api/GroupMembers
  ?$filter=GroupId eq {groupId} and PersonId eq {personId}
     and GroupMemberStatus eq 'Active' and IsArchived eq false
     and GroupRole/IsLeader eq true
  &$expand=GroupRole
```

The gate reduces to *"did this return ≥ 1 row?"*. Three details are load-bearing:
`GroupMemberStatus` must be **quoted** — `eq 'Active'` and `eq '1'` are equivalent,
bare `eq 1` is a **400**, because Rock types the field as `Edm.String` in `$filter`
while returning it as an integer in entity JSON (§2). `IsArchived eq false` is a
**proven no-op** — REST excludes archived rows from the queryable *before* OData is
applied (§23) — harmless to keep, but do not describe it as protection. Verified
identically on dev 18.4.1 and prod 17.7.0. Run it at **`TTL.NONE`**: an
authorization decision must not outlive a role change.

**Q1 model (b) — forwarding a per-user `.ROCK` cookie — is DEAD as currently
configured (§20).** Login works: `POST /api/Auth/Login` → **204**, `Set-Cookie:
.ROCK` (424 chars, 30-day lifetime), and `GET /api/People/GetCurrentPerson` with
that cookie and **no** `Authorization-Token` returns 200 and the right person. But
every *entity* endpoint refuses it — `GET /GroupMembers?$filter=…`, `GET
/GroupMembers/{own row}`, `GET /Groups/{id}`, `PATCH /GroupMembers/{own row}` are all
**401**, including for a verified `IsLeader: true` role-50 leader on their own group.
The cause is not group security and not an expired cookie: `RestController` 39
(`GroupMembersController`) has **no `Auth` rules at all**, so an ordinary
authenticated person falls through to Rock's default deny. The service account works
because its key sits in an administrative role that bypasses this. **Reviving model
(b) requires a Rock security change with instance-wide blast radius** — it would
grant every logged-in user REST access to group data across the instance, with
Rock's per-entity group security as the only remaining control, and that control is
exactly what these tests could not verify exists. Independently re-verified by curl
on 2026-08-04 (§20) — human-verified, not only agent-reported.

> **The recorded gap, stated as a gap:** because the refusal happens at the
> controller layer, **whether Rock independently enforces per-group security on REST
> writes is completely UNTESTED** — not merely unverified. That question bears on
> whether model (b) could ever be revived (§6 item 2); it does **not** invent a
> second layer under model (a). Under model (a) the service account holds
> administrative rights, so Rock's per-group security cannot apply to it regardless
> of the answer. **Model (a) — service account + app-side gate — is the only
> implementable option, and under it the app-side gate is the entire authorization
> surface for every group in the instance, with no Rock-side backstop.** A bug in
> the gate is a full authorization bypass, not a degraded check. Defense in depth is
> *unavailable*, not merely unused: it cannot be added later by "also forwarding the
> user cookie."

### 2a. Authorization model — DECIDED

**DECIDED (2026-08-04):** authorization for group member writes is enforced entirely
in the application. Rock provides no backstop — the service account holds
administrative rights and Rock's per-group security cannot apply to it. The
throwaway-Rock test in §6 item 2 is explicitly **not** a prerequisite for the MVP,
because its answer would not change the design.

Accepted consequences, to be carried into the new project as requirements:

- Every member write is audit-logged with actor, target, group, and outcome.
- The gate keys on a **role allow-list owned in application code**, not on Rock's
  `IsLeader` flag — an admin-editable checkbox that also controls role visibility
  inside the group (see §7's standing risk; the two are one argument).
- Tests covering the gate are treated as **security tests**: no merge on failure,
  and changes to them require a second reviewer.

---

## 3. The three write shapes

**The most build-facing section.** All three follow from one Rock behaviour:

> **Rock enforces uniqueness on `(GroupId, PersonId, GroupRoleId)` and that
> constraint IGNORES `GroupMemberStatus`.** A soft-removed row still occupies its
> slot.

Everything below is a consequence of that sentence.

### 3a. ADD is an upsert, not an insert

A soft-removed member **cannot be re-`POST`ed**. The identical body that created the
row returns **400** while the row sits Inactive (§17):

```
POST /api/GroupMembers   {"GroupId":1055022,"PersonId":389650,"GroupRoleId":44,"GroupMemberStatus":1}
→ 201 Created, body = 8862385   (bare integer, 7 bytes, NO Location header)

… soft remove …  then the same POST again:
→ 400 {"Message":" apollos already belongs to the group member role for this group
        (Group Id: 1055022), and cannot be added again with the same role"}
```

Remove-then-add-back is the most obvious leader workflow in the feature, and a
`POST`-only add path fails it **permanently and opaquely** — no amount of retrying
helps. So the add path opens with a pre-read.

**The pre-read filters on `(GroupId, PersonId)` WITHOUT the role.** This is not a
detail. A role-scoped filter is blind to a same-person-different-role row, and
because uniqueness is per-role Rock would happily accept the `POST` — leaving that
person with **two rows in one group**. A leader promoting an existing member gets a
duplicate in the list, not a promotion. Reading every row for the person costs the
**same single round trip** and is strictly more informative. **No status
predicate** — dormant rows are the entire point. **Collection form, not by-id** — a
by-id `GET` silently ignores `$select` (§27).

```
GET /api/GroupMembers
  ?$filter=GroupId eq {groupId} and PersonId eq {personId}
  &$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus     ttl: NONE
```

**Four branches:**

| Pre-read result | Action |
| --------------- | ------ |
| Row at requested role, status **1** | **No-op, report success.** Idempotent — and the correct recovery from the "already a member" / "my retry landed" ambiguity, which the app cannot distinguish from the 400 |
| Row at requested role, status **0** | **Reactivate:** `PATCH GroupMembers/{id} {"GroupMemberStatus":1}` → **204**, then clear `MemberInactiveReason` |
| Rows only at **other** roles | **Decline.** This is a role change, not an add — see 3c. Do not improvise |
| No rows | **Insert:** `POST` as above |

**Reactivation must also clear `MemberInactiveReason`, and Rock will not do it.**
Proven by `ModifiedDateTime`: the attribute survived a full remove → reactivate →
remove cycle untouched (§29). Without clearing, every reactivated member carries a
stale removal reason that no UI surfaces — and the *next* removal's compensating
rollback would restore a reason from a previous cycle.

**Clearing takes two calls, and not the obvious one (§31):**

```
POST /api/GroupMembers/AttributeValue/{id}?attributeKey=MemberInactiveReason&attributeValue=
→ 400  {"attributeValue.String":"A value is required but was not present in the request."}
   … and omitting the parameter entirely → 404, no route match.

What works:
GET   /api/AttributeValues?$filter=EntityId eq {groupMemberId}
        and Attribute/Key eq 'MemberInactiveReason'&$select=Id
PATCH /api/AttributeValues/{id}   {"Value":""}      → 204
```

That endpoint can **set** a value, never clear one. This mattered in practice: the
existing compensating rollback in `remix-web-app` issued exactly the 400-ing call,
so it had **never once worked** — swallowed by its own `catch`, reported
`rolledBack: false` every time, unnoticed because the `catch` only runs when the
status `PATCH` fails, which it never had. *An untaken code path is an unverified
claim.*

Order the clear **after** the status `PATCH`. If the process dies between them, the
member is Active with a stale reason — the benign, already-existing inconsistency —
rather than reason-cleared but still Inactive, which looks like a successful add that
did nothing.

**Cost:** insert **~585 ms** (pre-read ~150 + `POST` 275 + read-back 154);
reactivation **~630 ms** (4 calls: pre-read, status `PATCH`, attribute lookup,
attribute `PATCH`); already-active and declined-role-change are the pre-read only,
**~150 ms**. One extra round trip on the insert path makes three broken paths
correct. The pre-read also moves the check from an error handler — exercised only
when something goes wrong — onto the main line, exercised every time.

*`GroupMemberStatus: 2` (Pending) is deliberately out of scope: the upsert reactivates
to 1 regardless of prior status. Whether a Pending row should stay Pending is a
product decision, not a defaultable one.*

### 3b. REMOVE is a soft remove, and it REQUIRES a group-scope check

```
POST  /api/GroupMembers/AttributeValue/{id}?attributeKey=MemberInactiveReason&attributeValue={guid}
      (query string, EMPTY body)                        → 202 Accepted, body = bare id
PATCH /api/GroupMembers/{id}   {"GroupMemberStatus":0}   → 204 No Content, empty body
```

Rock stamps `InactiveDateTime` itself — do not send it. `IsArchived` stays `false`:
**a soft remove is not an archive.** Reason guids come from defined type **289**
(3 of 5 values active: `993f485b-…` No longer interested, `564a345a-…` Taking a
break, `f4eb8667-…` Moved/Passed Away). The mandatory-reason rule is an **app/legacy
invariant with nothing enforcing it underneath** — Rock returned 204 for a status
change with no reason attribute at all (§29). Prefer soft remove over archive: a
REST `PATCH {IsArchived: true}` leaves `ArchivedDateTime` **null**, producing a
half-archived row hidden from REST with no audit trail of when or by whom (§23).

> **The security requirement.** The gate authorizes the actor against the **URL's
> `groupId`**, and returns *the actor's own* membership row. The write then targets a
> bare **`groupMemberId` from the form**. Nothing binds the two. **So a leader of any
> group can soft-remove ANY `GroupMember` row in the instance by posting its id** —
> and per §20 there is **no Rock-side backstop**: the controller has no `Auth` rules
> and the write runs as the service account with full rights. The happy path is
> completely correct, which is exactly why this would have shipped.

**The pre-read that resolves `personId` for cache invalidation is the same read that
closes it.** One call, two jobs — which is why resolving server-side beats passing
`personId` through the form. A form-supplied id closes the cache bug and **none** of
the security bug, because it supplies an id rather than verifying one.

```
GET /api/GroupMembers?$filter=Id eq {groupMemberId}
  &$select=Id,GroupId,PersonId,GroupRoleId,GroupMemberStatus    ttl: NONE

then, in order, BEFORE either write:
  exactly one row returned          → else "member not found"
  row.groupId === groupId           → else AuthorizationError   ← the security fix
  row.id !== actor's own row        → else "cannot change your own record"
  row.groupMemberStatus !== 0       → else no-op success, still invalidate both caches
```

**Both the group-scope check and the server-side `personId` resolution are
non-negotiable build requirements.** Cost: **+1 round trip, ~190 → ~340 ms.**
Acceptable for a leader-initiated action, and it buys an authorization check the
system does not otherwise have. It also shrinks the untransacted two-write window
(§17): "row missing" and "wrong group" are rejected *before* the first write, so the
window is entered only for requests already known to be valid.

> **Open product question (undecided by omission):** may a co-leader remove the
> group leader, or a leader remove another leader? Rock will not prevent it, and
> the checks above do not address it. The pre-read already returns `GroupRoleId`,
> so enforcing a rule costs no extra call once the rule exists.

**Cache invalidation — both intents must invalidate both people.** Per-user cache
keys put the person in the key **namespace** (`rock:u{personId}:…`), so
`invalidateUser` can `SCAN` one prefix and needs no reverse index. The property that
makes it cheap is the property that makes a second call **mandatory**: invalidating
the actor provably cannot reach the affected person's keys (§25, demonstrated
against live Redis). An add gives someone a group; a remove takes one away. Gate the
second call on write success; do not roll it back on later failure — a spurious
invalidation costs one cache miss.

**And Rock flushes nothing on a soft remove (§22).** Trigger 53 does not fire on a
status change; neither does an archive; and reactivation does not fire the *add*
trigger either. Group type 31's triggers respond to **row creation and deletion, not
status transitions**, and no `MemberStatusChanged` trigger is configured. So without
the second invalidation a removed member sits stale in **two independent caches at
once** — ours and legacy's. See ask 3.

### 3c. ROLE CHANGE is a distinct third shape the upsert does not cover

`PATCH`ing `GroupRoleId` collides with a dormant row at the target role and returns
a 400 that is **byte-identical** to the re-add 400 (§26) — same validator, same
string, including the leading space and the service-account name:

```
PATCH /api/GroupMembers/8862387  {"GroupRoleId":44}    ← dormant row already at 44
→ 400 {"Message":" apollos already belongs to the group member role for this group
        (Group Id: 1055022), and cannot be added again with the same role"}     153 ms

Control — same row, a role with no existing row:
PATCH /api/GroupMembers/8862387  {"GroupRoleId":46}    → 204 No Content          165 ms
```

**So the app cannot tell the two causes apart from the response and must key off the
intent it sent**, never off the message. And the message must never reach a
user — it leaks the service-account name and reads as an internal error.

The control proves `PATCH GroupRoleId` works normally; the 400 is specifically the
dormant-row collision. **The rejected `PATCH` applies nothing** — a `GET` immediately
after showed both rows on their original roles — so **no compensating rollback is
needed for this failure.**

The correct sequence when a dormant row holds the target role is **reactivate the
target row, then deactivate the source row** — two writes, and **no `GroupRoleId`
write at all.** A naive `PATCH GroupRoleId` UI works until a leader
promotes/demotes someone who was previously in the target role and got removed, and
then fails permanently and opaquely for that one person. Rare enough to pass QA,
permanent once hit.

### And one good failure mode, free from the constraint

**Retry after a write timeout is safe.** The write commits server-side before the
response, so a client-side timeout leaves the member added while the UI reports
failure — but a retry **cannot** double-add, because the uniqueness constraint makes
a duplicate impossible (§17, confirmed: exactly one row afterwards). **Worst case is
a misleading error on an operation that actually succeeded**, which a refetch
corrects. This comes from Rock's constraint, not from anything the app does.

---

## 4. Read and pagination constraints

**`$select` is a requirement, not an optimization.** Measured across 5 → 250 members
with `$expand=GroupRole,Person` throughout (§16):

| Members | Full entity | With `$select` |
| ------- | ----------- | -------------- |
| 5 | 15,857 B · 159 ms | 942 B · 150 ms |
| 50 | 154,647 B · 442 ms | **9,321 B · 270 ms** |
| 250 | 776,775 B · 809 ms | 46,836 B · 391 ms |

**~3.1 KB per member full-entity vs ~187 B selected — a ~17× reduction, flat at
every size.** Latency is mostly fixed overhead (~150–250 ms); payload only dominates
past ~100 members and only without `$select`. Without it, a 250-member group ships
three quarters of a megabyte to render a name list.

**`$expand=Person` works; `$expand=Group` does not** (400, `Could not find a
property named 'Group'`, on **both** dev and prod — §7). So the *member list* is one
call with no N+1. The "my groups" read is the one that has an N+1.

**There is no server-side total. All three mechanisms are unavailable (§16):**

| Attempt | Result |
| ------- | ------ |
| `GroupMembers/$count` | **400** — Rock routes the segment into `GroupMembers/{id:int}`; it is **not a route at all** |
| `$count=true` (OData v4) | **400** — `The query parameter '$count' is not supported` |
| `$inlinecount=allpages` | **Silently ignored** — returns a bare array, HTTP 200 |
| `$skip` / `$top` / `$orderby` | **Work** — page 2 of 10 verified |

**`$inlinecount` is the dangerous one:** code that reads a total off the response
gets `undefined`, not an error.

**Recommendation: page size 50, `$select` mandatory, `$orderby=Id`.** 50 members is
**9.3 KB / ~270 ms** and covers almost every real group in **one page with no
pagination UI at all**. Without `$orderby`, `$skip` is not guaranteed consistent
across pages, so the stable sort key is required. **Ask for `$top=51`, display 50,
and use the 51st row purely as a has-more flag.** (100 costs little more — 18.7 KB /
319 ms — and is the defensible alternative if product prefers "almost never
paginate"; 50 is the recommendation.)

> **Consequence, stated plainly: no server-side total means "load more" or infinite
> scroll. Numbered pages, a page count, jump-to-last, "showing 25 of 213", and a
> scrollbar proportional to the result set are all OFF THE TABLE** — each needs a
> count of the whole collection, which defeats paginating. The alternative is
> maintaining our own count, which for an authorization-gated per-group list is not
> worth it. Design the UX around this from the start; it is not a late-stage tweak.

---

## 5. API surface

**Prefer the classic v1 endpoints (`/api/{Entity}`) for anything long-lived.** They
are what the whole spike was measured against, on both 17.7 and 18.4, and they
behaved identically.

**The v2 `models` surface is still changing under us.** `PeopleController.PostItem`
gained a `createPersonIfMissing` parameter in **20.0.1**, and v2 has coverage gaps on
**`GroupTypeRoles`** and **`AttributeValues`** — both of which this feature needs:
role metadata drives the gate, and `AttributeValues` is the only way to clear
`MemberInactiveReason` (§3a). Building on v2 means building on a surface that gains
parameters between minors while lacking endpoints we depend on.

This is where the version gap in §1 becomes concrete: **prod is 17.7.0.0, dev moved
18.3 → 18.4.1.0 mid-spike, and 19.1 and 20.x have already shipped.** Two majors
behind is a prod-upgrade conversation, not a spike blocker — the v1 surface this
feature uses is stable across the range we tested. But every v2 endpoint we might
want is a moving target until prod catches up.

---

## 6. What this spike did not answer

Short and honest. Each item names the test that would close it.

**1. Whether a soft remove fires trigger 53 — *partially* answered, and the residue
is unobservable by design.** §22 established that no `Workflow` row appears for a
soft remove, an archive, or a reactivation, while an add reliably produces one — so
the mechanism that would hide a firing is gone and the negative result is real. What
remains genuinely unobservable is the *inverse* question: trigger 53 points at
workflow **700**, a cache flush, which writes **no queryable side effect** of its
own, and the only interaction-writing workflow (730) is an *added* trigger that
would not fire on a removal anyway. **The `IsPersisted` flip is what settles it** —
and it is currently still `true` on dev (verified §32), which is why ask 1 is both a
cleanup and the closing test. *Closing test:* with 700 `IsPersisted: true`, run one
soft remove and one archive, and confirm no `Workflow` row appears; then revert.

**2. Whether Rock enforces per-group security on REST writes — completely
untested.** The controller-level 401 masks it entirely (§20). This question bears
on whether **model (b) could ever be revived**, not on whether model (a) has a
backstop. Under model (a) the request runs as the service account, which holds
administrative rights and bypasses per-group security — so there is **no second
layer**, and the answer would not change what gets built (§2a). *Closing test:*
grant the `GroupMembers` REST controller an `Auth` rule for authenticated users **in
a throwaway Rock environment**, then have a non-leader attempt a write to a group
they do not lead. If Rock refuses, per-group security exists and model (b) has a
credible remaining control. Do not run this on dev or prod — the grant has
instance-wide blast radius. **Not a prerequisite for the MVP.**

**3. The outsider test — missing, and no fixture would have fixed it.** With only
two groups available, a refusal cannot distinguish "members are denied" from
"leaders only". §20 made this wider, not narrower: the denial happens at the
controller layer, so the results cannot distinguish *any* group-security hypothesis.
*Closing test:* it is item 2. A third group would not have helped.

**4. Workflow 654 is inferred, not confirmed (§6).** Three converging lines of
evidence (name match; workflow 780 documents itself as launched *from*
`workflowTypeId=654`; 654 carries a `GroupLeaderAdd` attribute), but the
authoritative value lives in the deployed `ROCK_MAPPINGS.WORKFLOW_IDS.GROUP_ADD_PERSON`
config, which is in no committed file. All 23 of its attributes are
`IsRequired: false`, so **a wrong-but-valid launch fails silently rather than
erroring.** Per §2 this is now low-stakes — 654 is needed for email parity, not
correctness. *Closing test:* read the deployed env config.

**5. `DELETE` cascade behaviour — never probed, by policy.** The reversibility rule
held for the whole spike; `DELETE` was never issued against any entity on any host.
*Closing test:* a hard-delete probe against a throwaway group in a throwaway
environment. Not on a prod clone.

**6. The write paths have never run end to end behind a real cookie (§33).** The
route was exercised manually on dev, which verified the auth chain, the loader, and
that a non-leader is denied and sees the generic not-found page. It was **read paths
only** — no add, no remove, and specifically **not** the reactivation path from §3a,
which is the single most load-bearing behaviour in the add path. Control flow is
covered by 10 tests (two mutation-checked) and every REST call was executed
individually against dev, but the two have not run together. *Closing test:* the
§33 write-path sequence on group 1838823 (add → remove → re-add as reactivate).

**7. Production is unaudited for spike-era writes.** A read-only prod sweep was
attempted at close-out and blocked by local tool policy (§32 flag 4). All spike
writes were made against a deliberately hardcoded dev host, and the manual run was on
dev — so there is no positive reason to expect prod writes. But given that `ROCK_API`
defaults to prod (ticket 1), "no reason to expect" is not "verified". *Closing test:*
the query is recorded verbatim in §32 flag 4.

---

## 7. Asks of the Rock team

Numbered so this section can be sent as-is.

1. **Revert `WorkflowType` 700 `IsPersisted` to `false`.** It was flipped to `true`
   to answer the trigger question in §22 and has not been flipped back — **verified
   still `true` on dev at close-out.** Left as-is, **every group-member add on group
   type 31 permanently accumulates a `Workflow` row**; two have already accrued
   (5696074, 5696075). Needs a Rock admin. *Before reverting, it is worth running the
   one remaining removal probe in §6 item 1 — the flag is the instrument that makes
   it observable, so the two-minute test is free while it is still set.*

2. **The `.ROCK` cookie is issued without a `Secure` flag, on a 30-day lifetime.**
   Observed over an HTTPS origin: `Set-Cookie: .ROCK=<424 chars>; expires=<+30 days>;
   path=/; SameSite=Lax; HttpOnly` — `HttpOnly` and `SameSite=Lax` present,
   **`Secure` absent** (§20). This is a Rock-side setting, not something the app
   controls. **Please treat this as a design input, not a footnote: the new My Groups
   project owns login**, so this cookie is the credential a real person's session
   rests on for 30 days, and the project is being designed around it now. A cookie
   that authenticates a real person for a month should be marked `Secure`.

3. **Removals never flush the legacy web/app cache.** Confirmed, not hypothesised
   (§22): group type 31's triggers fire on row creation and deletion, **not on status
   transitions**. Trigger 49 fires on an add; trigger 53 does not fire on a soft
   remove, and an archive does not fire it either. So a member removed through this
   feature can keep appearing in legacy surfaces until some unrelated event flushes
   the cache. Three options, and we would like the Rock team's preference: **(a)** add
   a `MemberStatusChanged` trigger to group type 31 — group type 31 has none
   configured; **(b)** we explicitly `LaunchWorkflow` 700 after each remove; or
   **(c)** accept the staleness. This is **not** fixable by choosing archive over soft
   remove.

**Deliberately not asked: the Campus Hub Leader / `CanManageMembers` question.**
**DECIDED (product, 2026-07-31): role 48 (Campus Hub Leader) does not need to manage
members, and the `IsLeader` gate stands as-is.** No Rock-team confirmation is
required and no code change follows. Recorded here so it is not reopened. Context, so
the decision is legible: in group type 31, roles **48 (Campus Hub Leader)** and **49
(Group Coach)** are configured `CanManageMembers: true` but `IsLeader: false`, so an
`IsLeader` gate denies two of the four roles Rock's own config says can manage
members. `IsLeader: false` on role 48 is intentional — it is what hides the role from
other members inside the group — so the flag does double duty as a *visibility*
control and an *authorization* control. Gating on `IsLeader` matches legacy exactly
(roles 47 and 50), so nobody's access changes.

> **The standing risk that decision does not close: `IsLeader` is admin-editable in
> the Rock UI.** Because the gate keys on it, and because under model (a) the gate is
> the only authorization control in the system (§2, §2a), **who can add and remove
> members can change with no deploy, no code review, and no audit trail on our side.**
> Someone toggling a checkbox to change who is *visible* in a group also silently
> changes who can *write* to it. §2a accepts this by requiring an application-owned
> role allow-list instead — so the authorization surface is intentional rather than
> inherited from an admin checkbox.

---

## 8. Next steps

The full file-by-file list is in the
[port manifest](manage-group-members-port-manifest.md); the four tickets are in
[follow-up tickets](manage-group-members-followup-tickets.md).

**Sequence — this order is deliberate:**

```
0. Run the §33 write-path sequence (group 1838823)  BEFORE deleting the spike
1. Fix ticket 1 (ROCK_API defaults to production)  in remix-web-app
2. Fix ticket 3 (fetchRockData by-id guard)        in remix-web-app
3. TAKE THE COPY of the Rock layer into the new project
4. Build, with ticket 2b as a REQUIREMENT of the new project
5. Delete the spike route AND ticket 4 (/login) in the SAME PR
6. Open a separate PR moving manage-group-members-*.md onto the default branch
```

**Why step 0 comes first.** The spike route is throwaway, but its group-scope check
and four-branch upsert become build requirements in the new project, and they are
currently documented from code that has never run end to end. Run the §33 sequence
while the route still exists.

**Why 1 and 2 come before 3.** The Rock layer is **copied**, not shared. A defect
fixed before the copy is fixed once; the same defect fixed after is fixed twice, in
two repos, by two people — and in practice the second fix does not happen. Ticket 1
is a prod-defaulting env contract in code that now contains write paths; ticket 3 is a
missing guard the new project will otherwise regenerate from first principles.
**Both gate the copy.**

**Ticket 2b is a requirement of the new project, not a fix to an existing one.**
`AuthorizationError` must carry `.status = 403` and the error boundary must respect
it. In `remix-web-app` today a denial surfaces as **HTTP 500 with a 404 body** — it
fails closed and leaks nothing, but only by accident, and the accident does not
survive a boundary that starts reading errors. `remix-web-app` has no authenticated
routes, so there is nothing to fix there. **Do not carry that boundary across.**

**Ticket 2a is independent of the sequence** — a live bug in `remix-web-app`, which
keeps `auth-provider`. It does not gate the copy.

**Step 5 couples the two removals.** `requireUser` redirects to `/login`
(observed: unauthenticated `GET /spike-manage-members/1055022` → **302** →
`/login?returnTo=…` — fail-closed, and the reason the removals must ship together).
Removing one without the other leaves a redirect at a dead route.

**Before step 5, the spike route's two surviving requirements must be recorded in
the new project's build**: the **group-scope check** (§3b) and the **four-branch
upsert** (§3a). They are behaviours, not files. Delete the route after they are
written down, not before — they are lost with it otherwise.

**Step 6 lands the durable output.** `manage-my-groups-research` will never merge —
`remix-web-app` is not getting My Groups — so these documents are otherwise stranded
on a dead branch. They are the spike's durable output and the new project's input.

**Worth doing while step 1 is in flight:** §6 item 1's removal probe, because
`WorkflowType` 700 `IsPersisted` is still `true` and that flag is the only instrument
that makes the answer observable. It is a two-minute test that gets cheaper now and
impossible after ask 1 is actioned.
