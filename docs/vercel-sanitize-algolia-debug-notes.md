# Vercel deployment: Algolia, navbar, and HTML sanitization (debug notes)

Use this document as context when continuing work in a new chat. It summarizes symptoms, root causes, and code changes from a multi-step investigation.

## Symptoms

- **Production (Vercel):** Global navigation and Algolia-powered UI appeared broken; Algolia `queries?…` network requests often did not appear in DevTools.
- **Local dev:** Same branch behaved normally.
- **CSP:** Commenting out the root `Content-Security-Policy` header and redeploying **did not** fix the issue, so CSP was not the primary cause of the client-side failure.

## Findings (in order of discovery)

### 1. Algolia credentials were present on the server

Loader data in the HTML/stream included non-empty `ALGOLIA_APP_ID` and `ALGOLIA_SEARCH_API_KEY`. So “missing Vercel env vars” was ruled out for that deployment.

### 2. Client bundle failed before InstantSearch could run

**Console error (browser):**

```text
Uncaught TypeError: Failed to resolve module specifier "path".
Relative references must start with either "/", "./", or "../".
```

**Why:** The app had switched CMS sanitization to **`sanitize-html`**, which depends on **`postcss`**, which imports Node’s **`path`**. The Vite **client** build listed `fs`, `path`, and `url` as Rollup **`external`**, so those imports were left as bare `path` specifiers in the browser bundle—browsers cannot resolve Node built-ins.

**Effect:** Main client JS failed early → no hydration / no Algolia XHRs, even though loader data was fine.

### 3. CSP and Algolia (still useful for production)

Even though CSP was not the cause of the `path` crash, a strict `connect-src` should allow Algolia’s documented endpoints, including **`https://*.algolia.io`** (in addition to `*.algolia.net` and `*.algolianet.com`). See Algolia’s CSP article:  
<https://support.algolia.com/hc/en-us/articles/8947249849873>

**CSP + caching:** Any `Content-Security-Policy` header is cached **with** the full HTTP response. Nonce-based CSP and cached HTML can theoretically mismatch assets after deploys; document caching policy separately if you rely on nonces.

### 4. Vercel serverless crash after switching to `isomorphic-dompurify`

**Log error:**

```text
Error [ERR_REQUIRE_ESM]: require() of ES Module .../@exodus/bytes/encoding-lite.js
from .../html-encoding-sniffer/.../html-encoding-sniffer.js not supported.
```

**Why:** `isomorphic-dompurify` depends on **`jsdom`**. **`jsdom@28`** pulls **`html-encoding-sniffer@6`**, which **`require()`s** ESM-only **`@exodus/bytes`**. Vercel’s Node serverless bundle runs in a **CommonJS** context where that pattern throws **`ERR_REQUIRE_ESM`**.

## Changes made (summary)

| Area | Change |
|------|--------|
| **Sanitization** | Replaced **`sanitize-html`** with **`isomorphic-dompurify`** (`DOMPurify.sanitize` with `USE_PROFILES: { html: true }` and `ADD_ATTR` for `style` / `class`). Avoids postcss → `path` in the client graph. |
| **Vite** | Removed client Rollup **`external: ['fs', 'path', 'url']`** so Node builtins are not emitted as unresolved bare imports in the browser build. |
| **Root loader** | Nonce generation uses **`import { randomUUID } from 'node:crypto'`** (satisfies ESLint `no-undef` vs global `crypto`). |
| **CSP (when enabled)** | `connect-src` includes **`https://*.algolia.io`** alongside `*.algolia.net` and `*.algolianet.com`. |
| **pnpm** | **`pnpm.overrides`** pins **`jsdom` to `26.1.0`** so `isomorphic-dompurify` does not pull `jsdom@28` → `html-encoding-sniffer@6` → ESM `require()` crash on Vercel. The previous npm-style top-level **`"overrides"`** alone did not dedupe `jsdom` for `isomorphic-dompurify`; **`pnpm.overrides`** did. |
| **Babel** | Existing **`@babel/runtime`** override moved into the same **`pnpm.overrides`** block. |

## Files likely touched

- `app/lib/sanitize.ts` — DOMPurify-based sanitization + comments on Vite / Vercel constraints.
- `vite.config.ts` — client `rollupOptions` (no Node builtin externals for browser).
- `app/root.tsx` — CSP builder, nonce, `randomUUID`, `ScrollRestoration` / `Scripts` `nonce` when CSP is on.
- `package.json` — dependencies (`isomorphic-dompurify`; removed `sanitize-html`), **`pnpm.overrides`** (`jsdom`, `@babel/runtime`).

## Verification commands (local)

```bash
pnpm why jsdom          # Expect a single jsdom@26.1.0 including under isomorphic-dompurify
pnpm build
node -e "require('isomorphic-dompurify').sanitize('<p>x</p>')"
```

## Quick glossary

| Term | Role |
|------|------|
| **`emptySearchClient`** (navbar search) | When Algolia env vars are missing, the UI uses a stub client that **never hits the network**—useful when debugging “no Algolia requests.” |
| **`ERR_REQUIRE_ESM`** | Often: CJS `require()` of an ESM-only package (here: jsdom 28 → html-encoding-sniffer 6 → `@exodus/bytes`). |
| **`pnpm.overrides`** | pnpm-specific; use this (not only npm `overrides`) to force transitive versions like `jsdom`. |

---

*Last updated from engineering notes; adjust if dependencies or hosting constraints change.*
