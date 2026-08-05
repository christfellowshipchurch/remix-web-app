# Follow-up Tickets — Manage Group Members spike close-out

**Owner:** Danny Wood · **Prepared:** 2026-08-03 · **Status:** drafts, ready to
file. **None of these has been fixed.** This session drafted them and deliberately
fixed nothing.

Two of them gate the copy described in
[`manage-group-members-port-manifest.md`](manage-group-members-port-manifest.md):
tickets **1** and **3** must land in `remix-web-app` *before* the Rock layer is
copied into the new My Groups project, so they are fixed once rather than twice.

| # | Title | Repo | Priority | Gates the copy? |
| - | ----- | ---- | -------- | --------------- |
| 1 | `ROCK_API` defaults to production | `remix-web-app` | **Highest** | **Yes** |
| 2a | Server errors render as "Email or phone not found" | `remix-web-app` | Medium | No |
| 2b | `AuthorizationError` must carry `.status = 403` | **new project** | Medium — *requirement, not a bug* | No |
| 3 | `fetchRockData` guard for by-id `$expand`/`$select` | `remix-web-app` | Medium | **Yes** |
| 4 | Remove the temporary `/login` page | `remix-web-app` | Low | No |

---

## Ticket 1 — `ROCK_API` defaults to production

**Repo:** `remix-web-app` · **Priority: HIGHEST. This gates the copy.**

### Problem

`.env` and `.env.local` both set `ROCK_API` to
`https://rock.christfellowship.church/api/` — **production**. There is no
non-prod default, no assertion, and no way to tell from the code which host a
given call will hit.

That was tolerable when the Rock layer was read-only. It is not now: **write paths
exist in committed code** (`postRockData`, `patchRockData`, `putRockData`,
`deleteRockData`, and the add/remove implementations merged in #385).

It compounds with fixture drift. Per the warning at the top of
`day2-findings-manage-group-members.md`, dev is a prod clone whose **ids have
drifted**: group **1838823** is "Jedi Council Test Group" on dev and a **Known
Relationship system group (type 11)** on prod; group **1055022** is a real group on
prod under the same id. A fixture id copied out of the findings doc into a session
that did not hardcode the dev host **does not fail loudly — it succeeds, against
the wrong entity.**

Every write in the spike was made against a deliberately hardcoded dev host for
exactly this reason (§30). That discipline is not enforced by anything.

### Where

- `.env`, `.env.local` — `ROCK_API=https://rock.christfellowship.church/api/`
- `app/lib/.server/fetch-rock-data.ts:33` —
  `const baseUrl = \`${process.env.ROCK_API}\`` , captured at module load
- `app/lib/.server/fetch-rock-data.ts:354, :390, :426, :458` — the four write
  helpers, each reading `process.env.ROCK_API` at call time

### Two proposed fixes

**Option A — no prod default; require the host explicitly and fail loudly if
unset.** Delete the value from the committed env files, and throw at module load
when `ROCK_API` is absent or empty. Every environment then states its host on
purpose.

*Cost:* a missing env var becomes a hard startup failure rather than a silent
misroute — which is the point, but it makes the worktree problem below immediate
and visible instead of mysterious and delayed.

**Option B — assert non-prod inside the write helpers.** Leave reads pointed
wherever they are; make the four write helpers refuse a prod host unless an
explicit opt-in flag (say `ROCK_ALLOW_PROD_WRITES=true`) is set.

*Cost:* narrower. It does not stop a *read* against the wrong host, so a fixture id
resolving to the wrong entity still misleads — it only stops the write that would
follow.

### Recommendation

**Option A, with Option B on top.** A alone fixes the class of bug; B alone only
catches the last step. A is the contract change — no host means no start — and B is
the backstop for the case where someone genuinely does point a dev process at prod
and then forgets. If only one ships, ship A.

### The worktree angle — this has already cost a full session

`.env` and `.env.local` are gitignored. **`git worktree add` therefore produces a
tree with no env files at all**, silently — the worktree looks complete and is
broken. `netlify dev` is what loads those files into `process.env`; without them
nothing does.

`fetch-rock-data.ts:33` interpolates directly, so an absent `ROCK_API` resolves to
the **literal string `"undefined"`** and every URL is built against it. The failure
does not surface as "missing configuration". It surfaced as **"user does not
exist"** — and cost a full session to diagnose.

*(Confirmed again during this close-out: the worktree this work was done in has
neither `.env` nor `.env.local`.)*

Whatever fix lands should make this case loud. A missing `ROCK_API` must never
stringify into a URL.

### Done when

- No committed env file names a production Rock host as a default.
- An unset or empty `ROCK_API` fails loudly, at startup, with a message naming the
  variable — and never reaches a URL as the string `"undefined"`.
- Documented for `git worktree` users: env files are gitignored and must be copied
  in, and `netlify dev` is what loads them.

---

## Ticket 2a — every server-side auth failure renders "Email or phone not found"

**Repo:** `remix-web-app` (`auth-provider` stays in this project — this is a live
bug here) · **Priority:** Medium

### Problem

`app/providers/auth-provider/index.tsx:202` returns `result.userExists` from the
`/auth` `checkUserExists` response:

```ts
const result = await response.json();
return result.userExists;
```

On **any** error body — a 500, a Rock timeout, a malformed payload, a
misconfigured `ROCK_API` (see ticket 1) — `userExists` is simply absent, so this
returns `undefined`, which is falsy, and the UI renders **"Email or phone not
found."**

So a server failure is presented to the user as a definitive statement about their
account. They retype an address that is correct, get the same message, and
conclude they have no account. There is nothing in the UI, and nothing in the
client-side logs, that distinguishes the two.

### Constraint on the fix — read this before changing anything

**The uniform message is accidentally good security.** Because every failure looks
identical, the endpoint does not leak whether a given email or phone number
corresponds to a real account. That is a genuine property and it should be kept
deliberately rather than lost by accident while fixing the bug.

> **Do not make the client response distinguish "real not-found" from "server
> error." Log the distinction server-side; keep the client message uniform.**

The fix is therefore about **observability**, not about the user-facing copy:

- Server-side, in the `/auth` action: log the actual failure with enough context
  to diagnose it — status, host, error class. Distinguish "Rock said no such
  person" from "Rock did not answer."
- Client-side, at `index.tsx:202`: treat a missing `userExists` as an **error**
  rather than as `false`. It may still *render* the same message, but it must not
  silently take the not-found branch as though the server had answered.
- Optionally, a generic "something went wrong, try again" for the transport-error
  case only — that leaks nothing, because it is reachable without a valid identity.

### Done when

- A server-side failure is distinguishable from a genuine not-found **in the
  server logs**.
- The client-visible message still does not reveal account existence.
- A test asserts that an error body does not take the `userExists === false` path.

---

## Ticket 2b — `AuthorizationError` must carry `.status = 403`, and the boundary must respect it

**Repo:** the **new My Groups project** · **Priority:** Medium ·
**This is a REQUIREMENT of the new project, not a bug to fix in `remix-web-app`.**

### Why it is not a `remix-web-app` bug

`remix-web-app` will have no authenticated features, so it has no route that can
legitimately produce a 403. Its error boundary is adequate for what it is. **The
point of this ticket is to stop the current behaviour being carried into a project
where it would matter.**

### The behaviour that must not be copied

In `remix-web-app` today:

- `app/lib/.server/error-types.ts:13` — `AuthorizationError` is a plain `Error`.
  It is not a `Response` and has **no `.status`**. Its own docstring claims "this
  maps to a 403"; nothing makes that true.
- Nothing consumes it. A `grep` over `app/` finds no handler other than the gate
  that throws it and its tests (§13).
- React Router treats a thrown non-`Response` as an **unhandled error** → **HTTP
  500**.
- `app/error.tsx:11` renders `<NotFound />` **unconditionally** — no
  `isRouteErrorResponse` check, no status branching.

**Net result: a denied leader gets HTTP 500 with a "page not found" body.** Three
problems at once — the status is wrong, the page contradicts the status, and "not
signed in" / "not allowed" / "the server crashed" are indistinguishable.

What is correct today is that it **fails closed**, and the error message — which
names the person and the group — never reaches the client. Both are accidents of
the boundary ignoring the error, not design. Neither survives a boundary that
starts reading errors, unless it is written to preserve them.

### Requirement for the new project

1. `AuthorizationError` carries `status = 403`; `AuthenticationError` carries
   `401`.
2. The root error boundary branches on status: `isRouteErrorResponse` first, then
   a known-error mapping, then a generic 500. A 403 renders a "you don't have
   access to this group" page; a 404 renders not-found. They must not be the same
   page.
3. **The error *message* must still never reach the client.** `AuthorizationError`
   messages name the person id and the group id by design, because they are for
   logs. Render a fixed string; log the detail server-side.
4. Fail closed remains the default: an unmapped error is a 500, not an allow.

### Done when

- A non-leader hitting a group route receives **403**, with a page that says so.
- The response body contains no person id, group id, or error message from the
  thrown error.
- A test asserts both, and asserts that an *unrecognised* error still denies.

---

## Ticket 3 — `fetchRockData` guard for by-id `$expand` / `$select`

**Repo:** `remix-web-app` · **Priority:** Medium. **This gates the copy.**

### Problem

Rock **silently ignores `$expand` and `$select` on `Entity/{id}` routes.** No
error, no warning — the full entity comes back.

The two parameters fail differently, and the distinction is the whole ticket:

- **`$select` ignored is waste, not a bug.** The whole entity returns, so every
  scalar the caller asked for is present. Per §16 that is a **~17× overfetch** —
  ~3.1 KB per row instead of ~187 B.
- **`$expand` of a nav property returns `null`.** That is the crash shape: the
  fetch succeeds, the property is `null`, and the failure surfaces later in
  whatever reads a field off it.

### Blast radius — smaller than it sounds, and that is deliberate to state

A sweep of all 55 `$expand`/`$select` call sites found **3 by-id** (§27):

| Site | Param | Verdict |
| ---- | ----- | ------- |
| `app/lib/.server/rock-person.ts:52` | `$select: 'Email'` | **Waste, not a bug** — `email` is present |
| `app/routes/volunteer/outreach-opportunity/outreach-mission-rock.server.ts:236` | `$select: 'FirstName,LastName,NickName,Email'` | **Waste, not a bug** — all four present |
| `app/routes/spike-manage-members.$groupId/action.ts:333` | `$expand: 'GroupRole'` | **Real** — `groupRole` is always `null`. **Spike code, throwaway** |

**Per §27 there is no shipped correctness bug.** Both live sites `$select` scalars.
They are, however, both at `ttl: TTL.NONE`, so they pay the 17× overfetch on
**every single call**, uncached.

### The fix

**One guard inside `fetchRockData`** that warns (or throws in development) when
`$expand` or `$select` is passed alongside an `Entity/{id}`-shaped endpoint. Not
three call-site edits — the call sites are the symptom, and the codebase will
regenerate them.

**Get the boundary right.** `People/GetByAttributeValue` **does** honor `$expand`
— it returns a list and serializes through a different Rock code path (§27,
tested rather than assumed). The defect belongs to the `Entity/{id}` **route
shape**, not to "single-entity fetches" as a class. A guard that keys on "returns
one row" will produce false positives on a working endpoint.

Detection: a path segment after the first that is bare digits or an interpolated
value. That is the same classifier the §27 sweep used, and it found the complete
set — not a sample.

Where a call site genuinely needs one entity with a trimmed payload, the answer is
the **collection form**: `People?$filter=Id eq {id}&$select=…`. One call, the same
latency, and `$select` is actually honored.

### Why it gates the copy

The new project builds against the same Rock API and will hit the same silent
behaviour from first principles. **Fix it before the copy** so the guard travels
with the layer instead of being rediscovered — probably via a `null` nav property
in production.

### Done when

- `fetchRockData` warns or throws when `$expand`/`$select` meets an `Entity/{id}`
  endpoint.
- `People/GetByAttributeValue` and every collection-form call site are unaffected —
  asserted by test, not by inspection.
- The two live overfetch sites are moved to the collection form, or explicitly
  accepted with a comment.

---

## Ticket 4 — remove the temporary `/login` page

**Repo:** `remix-web-app` · **Priority:** Low, but do not skip it

### Problem

`app/routes/login/route.tsx` is a throwaway login page added for spike auth
testing. Its own header says so: *"TEMP — throwaway login page for local/spike auth
testing… do not ship this as the real login UX."*

`remix-web-app` will have **no authenticated features**. A login page on a site with
nothing to log in to is an **unowned auth surface** — routable, indexable, and
attached to real authentication. Small, and worth closing precisely because nobody
will own it.

### Scope — be exact about what goes

**Remove:** `app/routes/login/route.tsx` and its route registration.

**Keep — both stay in `remix-web-app`:**

- `app/providers/auth-provider/` — still in use, and the subject of ticket 2a
- `AuthModal` (`app/components`) — still in use

Only the temporary page goes.

### Sequencing

`requireUser` defaults `loginPath` to `/login`
(`app/lib/.server/authentication/require-user.ts:84`). The only caller is the spike
route, which is also being deleted. **Remove the spike route first, or in the same
change** — deleting `/login` alone would leave `requireUser` redirecting to a 404.

Per the port manifest, the spike route may only be deleted once its two surviving
requirements — the group-scope check and the four-branch upsert — are recorded in
the new project's build. They are specified in the decision memo §3.

### Done when

- `/login` no longer resolves in `remix-web-app`.
- `auth-provider` and `AuthModal` are untouched.
- No route redirects to a path that does not exist.
