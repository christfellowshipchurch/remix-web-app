# Port Manifest — Manage Group Members → the new My Groups project

**Owner:** Danny Wood · **Prepared:** 2026-08-03 · **Status:** manifest only —
**no copy has been taken and no new project exists.**

My Groups is being built as a **separate React Router v7 project**. `remix-web-app`
will not have authenticated features. So the Rock access layer is **copied**, not
shared as a package.

**Copies drift.** A defect fixed in `remix-web-app` *before* the copy is fixed
once. The same defect fixed *after* the copy is fixed twice, in two repos, by two
people, at two different times — and in practice the second fix does not happen.
That asymmetry is the whole reason this document has a "fix before the copy"
section, and it is the reason tickets 1 and 3 gate the copy.

This is a list of **what crosses over**. It is not an instruction to copy anything
yet.

---

## 1. What crosses over

Paths are relative to `remix-web-app`.

### Ports as-is

| File | What it does | Notes |
| ---- | ------------ | ----- |
| `app/lib/.server/error-types.ts` | `AuthorizationError`, `AuthenticationError`, `RockAPIError`, `EncryptionError`, `RateLimitError` | Plain `Error` subclasses, no dependencies. **`AuthorizationError` must gain `.status = 403` in the new project — ticket 2b.** Its docstring already claims "this maps to a 403"; today nothing makes that true |
| `app/lib/.server/cache-utils.ts` | `TTL`, `buildCacheKey`, `buildUserCacheKey`, `invalidateUser`, `invalidateItem`, `deleteByPrefix`, `itemTagKey`, `extractContentItemIds`, `stabilizeFilterForCacheKey` | `buildUserCacheKey` puts the person in the key **namespace** (`rock:u{id}:…`), which is why `invalidateUser` can `SCAN` one prefix and needs no reverse index. That design is load-bearing and proven (§25) — **do not "improve" it into a shared keyspace with a lookup table.** `invalidateUser` uses `SCAN`, never `KEYS`; keep it that way |
| `app/lib/.server/authentication/require-group-leader.ts` | The leader gate. One OData call, `GroupRole/IsLeader eq true` as a `$filter`, `TTL.NONE` | Verified on dev (18.4.1) **and** prod (17.7.0) — §2, §3, §4. The extensive docstring is the spec; port it with the comments intact. Two things not to touch: `GroupMemberStatus eq 'Active'` must stay **quoted** (`eq 1` is a 400, §2), and `IsLeader` is deliberately the predicate rather than `CanManageMembers` (§4, decided) |
| `app/lib/.server/authentication/require-user.ts` | `getAuthContext` (never throws on auth failure) + `requireUser` (throws `redirect`) | The C6 fix: an expired token is indistinguishable from an absent one — both are `null`. **Port that property deliberately**; the older `getUserFromRequest`/`currentUser` pair it replaces returns four shapes and renders a broken authed page on expiry. `loginPath` defaults to `/login`, which in the new project is a real route rather than the throwaway one (ticket 4) |
| `readGroupMemberRows(filter)` — in `app/routes/spike-manage-members.$groupId/action.ts:86` | The single pre-read both write paths open with. Collection form, `$select`ed, `TTL.NONE`, **no status predicate** | Lift the function; leave the route behind. Three properties are requirements, not style: **collection form** (a by-id `GET` silently ignores `$select` — §27), **no status predicate** (dormant Inactive rows are the entire point — §17, §26), and **`TTL.NONE`** (it carries an authorization decision) |
| `clearInactiveReason(id)` — `action.ts:121` | Clears `MemberInactiveReason`: `GET AttributeValues` by `EntityId` + key, then `PATCH AttributeValues/{id} {"Value":""}` | Two calls, and **not** the obvious one-call form. The obvious form is a 400 and shipped broken in this repo for weeks (§31). Returns rather than throws, deliberately. Port verbatim |

### Ports with changes

| File | What it does | Change required |
| ---- | ------------ | --------------- |
| `app/lib/.server/fetch-rock-data.ts` | `fetchRockData` + the four write helpers (`postRockData`, `patchRockData`, `putRockData`, `deleteRockData`), Redis read-through, `$filter` merging, preview mode | **Three changes, all mandatory. (a)** Fix the env contract — ticket 1. `baseUrl` is captured at module load from `process.env.ROCK_API` (line 33); when unset it becomes the literal string `"undefined"` and every URL is built against it. **(b)** Add the by-id `$expand`/`$select` guard — ticket 3. **(c)** Drop what My Groups does not have: `isPreviewMode`, `filterByStatusApproved`, `stripApprovedStatusFilter`, `extractContentItemIds` / the content-item reverse index, `isSingleItemAttributeValueFetch`. All of it is content-channel machinery. **Keep**: `customHeaders` on all four write helpers, `cacheUserId`, `TTL.NONE`, and the `definedQueryParams` filter at line 279 that drops `undefined` params before `URLSearchParams` stringifies them as `"undefined"` |
| `addMember` — `action.ts:204` | The four-branch upsert: `already-active` / `reactivated` / declined role change / `inserted` | The **logic** ports; the surrounding route does not. Rewrite as a service function taking `(groupId, personId, groupRoleId)` rather than a `FormData`. Drop the by-id read-back at `action.ts:333` — it is §27 hit #3, its `groupRole` is always `null`, and once ticket 3's guard exists it will warn or throw. If the UI needs the role name, re-read via the collection form |
| `removeMember` — `action.ts:350` | Pre-read → **group-scope check** → self-edit guard → attribute write → status `PATCH`, with a compensating rollback | Same: logic ports, `FormData` plumbing does not. **The group-scope check (`row.groupId !== groupId` → `AuthorizationError`) is non-negotiable and must survive the rewrite** — it is one of only two authorization controls in the system (§20, §28). The rollback must keep using `clearInactiveReason`, not the empty-value `POST` it used to use |
| `invalidateUser` call pair — `action.ts:181` and `:193` | Invalidate the actor, then the affected person | Ports as a pattern, not as code. **Both intents must invalidate both people** (§25). `affectedPersonId` must come from the server-side pre-read, never from the form |
| `AuthModal` + `auth-provider` | Login UI and client auth context | **Stay in `remix-web-app`** and are also needed by the new project. Do not delete them here. Whether the new project copies them or builds its own login is out of scope for this manifest — but note the new project **owns login**, which makes the missing `Secure` flag on the `.ROCK` cookie a design input rather than a footnote (memo ask 2) |

### Throwaway

| File | Why |
| ---- | --- |
| `app/routes/spike-manage-members.$groupId/route.tsx` | Deliberately unstyled prototype UI |
| `app/routes/spike-manage-members.$groupId/loader.ts` | Spike loader. Its **read shape** is worth keeping (collection form, `$expand=GroupRole,Person`, `$select`, `cacheUserId`), but it runs at `TTL.NONE` so writes stay observable — wrong for production |
| `app/routes/spike-manage-members.$groupId/action.ts` | The route wrapper. `addMember` / `removeMember` / `readGroupMemberRows` / `clearInactiveReason` port out of it, per above; the `action` export and the `WRITE_AS_USER` switch do not |
| `app/routes/spike-manage-members.$groupId/types.ts` | Spike-shaped |
| `app/routes/spike-manage-members.$groupId/action.test.ts` | 10 tests, two mutation-checked. **Port the assertions, not the file** — they assert on the *writes issued*, which is the right shape and the reason the suite caught real defects |
| `app/routes/login/route.tsx` | Temporary. Delete from `remix-web-app` (ticket 4); the new project needs a real one |

**The spike route cannot live in `remix-web-app` at all.** It depends on
`requireUser`, which depends on a `.ROCK` cookie, and `remix-web-app` will have no
authenticated features. This is not a cleanup preference — the route has no home
here.

### Requirements the route encodes, which must outlive it

Both are behaviours, not files. **They must be written into the new project's
build before the route is deleted**, or they are lost with it. Both are stated in
the decision memo, §3b and §3a:

1. **The group-scope check.** `requireGroupLeader` authorizes the actor against the
   URL's `groupId`; the write targets a bare `groupMemberId` from the form. Without
   binding the two, a leader of any group can soft-remove **any `GroupMember` row
   in the instance**. There is no Rock-side backstop (§20). The pre-read that
   resolves `personId` for cache invalidation is the same read that closes it.
2. **The four-branch upsert.** `ADD` is an upsert, not an insert: already-active
   (idempotent) / reactivate / decline role change / insert. A role-scoped pre-read
   filter is blind to a same-person-different-role row and would `POST` a
   duplicate, so the filter is on `(GroupId, PersonId)` **without** the role.

---

## 2. Known defects that must NOT be copied forward

Two defects live in the files above. **Both should be fixed in `remix-web-app`
BEFORE the copy is taken, so they are fixed once rather than twice.** Both are
drafted as tickets in
[`manage-group-members-followup-tickets.md`](manage-group-members-followup-tickets.md).

### Defect 1 — `ROCK_API` defaults to production (ticket 1). **Gates the copy.**

`.env` and `.env.local` both point `ROCK_API` at `rock.christfellowship.church`.
`fetch-rock-data.ts:33` captures it at module load; the four write helpers read
`process.env.ROCK_API` at call time. There is no non-prod assertion anywhere.

Write paths now exist in committed code, and per the fixture-drift warning at the
top of the findings doc the ids in that document resolve to **different real
entities** on prod — 1838823 is a Known Relationship system group there. A fixture
id pasted into a session that did not hardcode the dev host does not fail; it
succeeds against the wrong entity.

Copying this contract into a second repo doubles the surface. **Fix first.**

### Defect 2 — no by-id `$expand`/`$select` guard in `fetchRockData` (ticket 3). **Gates the copy.**

`$expand` and `$select` are silently ignored on `Entity/{id}` routes. `$select`
being ignored is ~17× payload waste (3.1 KB vs 187 B per row, §16) and is not a
correctness bug — the whole entity comes back, so scalars are present. `$expand` of
a nav property yields **`null`**, which is the crash shape.

Two shipped sites overfetch (`rock-person.ts:52`,
`outreach-mission-rock.server.ts:236`, both at `TTL.NONE`, so uncached every call).
One site expects a nav property and gets `null` — the spike's own read-back, which
is throwaway.

The durable fix is **one guard inside `fetchRockData`**, not three call-site edits.
The new project will build a Rock layer from scratch against the same API and will
regenerate this defect from first principles unless the guard comes with the copy.

Note the boundary precisely: **`People/GetByAttributeValue` DOES honor `$expand`**
(§27). The defect is specific to the `Entity/{id}` route, not to single-entity
fetches as a class — so the guard must key on the endpoint *shape*, not on
"returns one row".

### Not a defect to fix before the copy, but do not carry it forward

`app/error.tsx:11` renders `<NotFound />` **unconditionally** — no
`isRouteErrorResponse` check, no status branching. An `AuthorizationError` is a
plain `Error`, so React Router answers **HTTP 500** with a 404 body. It fails
closed and leaks nothing, but only by accident. **This is a requirement of the new
project (ticket 2b), not a bug to fix in `remix-web-app`** — the boundary here is
adequate for a site with no authenticated routes. Do not copy it.

---

## 3. Sequence

```
1. Fix ticket 1 (ROCK_API prod default)   in remix-web-app
2. Fix ticket 3 (by-id guard)             in remix-web-app
3. TAKE THE COPY
4. Build — with ticket 2b (AuthorizationError → 403) as a requirement of the new project
5. Delete the spike route + ticket 4 (/login) from remix-web-app,
   once §1's two requirements are recorded in the new project's build
```

Steps 1 and 2 are the only ones that must happen in `remix-web-app`, and they must
happen **before** step 3. Ticket 2a (`auth-provider` swallowing error identity) is
independent of this sequence — it is a live bug in `remix-web-app`, which keeps
`auth-provider`, and it does not gate the copy.
