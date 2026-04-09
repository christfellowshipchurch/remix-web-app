# Rock `form-embed` iframe — Private Network Access (PNA)

**Purpose:** Handoff for engineers. Explains why Chrome blocks the Rock workflow embed on the public web app and what fixes are available.

**Last updated:** 2026-04-09

---

## Problem

On pages that embed Rock’s `form-embed` URL in an iframe (`RockProxyEmbed`), Chrome may:

- Prompt to allow access to the **local network**, or
- Show: *“The connection is blocked because it was initiated by a public page to connect to devices or servers on your local network.”*

The form may not load until the user allows (or may stay blocked if denied).

---

## Root cause

### `rock.gocf.org` resolves to private IPs

```
rock.gocf.org
  → CNAME internal-rock-prod-internal-1944357908.us-east-2.elb.amazonaws.com
  → 10.100.10.87
  → 10.100.20.62
```

The hostname points at an **internal** AWS ELB; DNS returns **RFC 1918** addresses (`10.x.x.x`).

When a **public** site (e.g. production web app on Vercel/Netlify) sets an iframe `src` to `https://rock.gocf.org/form-embed?...`, the browser resolves that host to `10.x.x.x`. Chrome treats that as **public origin → private network** and applies **Private Network Access (PNA)**: the navigation can be blocked or gated behind a permission prompt.

### Why opening Rock in a new tab works

**Top-level navigations** (address bar, new tab) are not subject to the same PNA rules as **iframe navigations** initiated from a public page. So the same URL can load fine alone but fail when embedded.

### Separate check: Rock `frame-ancestors` CSP

Rock responds with a `Content-Security-Policy` that includes `frame-ancestors` listing allowed parent origins (e.g. `rock.christfellowship.church`, `cf-web-v3.vercel.app`, Netlify preview patterns, etc.). If the app runs on a host **not** in that list, embedding can fail for **CSP** reasons too — distinct from PNA, but worth verifying for new deploy URLs.

---

## How this repo embeds Rock

| Piece | Role |
|-------|------|
| `app/components/rock-embed/index.tsx` | `RockProxyEmbed` — builds iframe `src` |
| `useAdvancedProxy={false}` | Iframe loads **Rock URL directly** (e.g. `https://rock.gocf.org/form-embed?...`) — browser hits private IPs |
| `useAdvancedProxy={true}` | Iframe loads `/rock-page?url=...`; server fetches HTML in `app/routes/rock-page.ts` |
| `rock-page.ts` | `ALLOWED_HOSTS` is currently **`rock.christfellowship.church` only** — `rock.gocf.org` is **rejected** (403), so gocf flows use direct embed unless the allowlist is updated |

Changing iframe mode does not change PNA by itself: direct embed triggers the browser → private IP path; the proxy avoids the **initial** browser fetch to Rock but has limits (see Option 3 below).

---

## Fix options (ordered by practicality)

### 1. Infrastructure — public routing for Rock (recommended)

Put `rock.gocf.org` (or a dedicated embed hostname) behind a **public** load balancer / CDN so DNS resolves to **public** IPs. Then iframe loads from the public web app are no longer “public → RFC1918.”

**Pros:** Full fix for embeds, forms, and redirects.  
**Cons:** Infra/security review (SGs, WAF, who may still use internal DNS).

### 2. Server headers — `Access-Control-Allow-Private-Network`

Configure Rock (or a reverse proxy in front) so responses participate in Chrome’s PNA opt-in (preflight + `Access-Control-Allow-Private-Network: true` and appropriate CORS for the embedding origin).

**Pros:** Can avoid changing public DNS if done correctly.  
**Cons:** Server/proxy work; behavior is Chrome-centric; validate against current PNA docs.

### 3. App proxy only (`/rock-page`)

Add `rock.gocf.org` to `ALLOWED_HOSTS` and use `useAdvancedProxy={true}`. The **server** fetches HTML; the first paint may avoid the browser talking to `10.x` for the document.

**Cons:** Form POSTs, AJAX, and ASP.NET postbacks inside the iframe still target `rock.gocf.org` in the browser → same PNA issue unless HTML/JS are rewritten heavily. Treat as partial or diagnostic, not a full substitute for (1) or (2).

### 4. Dedicated public embed hostname

e.g. `embed.<public-domain>` → public endpoint → same Rock app. Update embed URLs in the app once routing is stable.

---

## Recommended next steps

1. **Infra:** Plan public ALB/CDN (or equivalent) for the hostname used in iframes so it resolves publicly.
2. **Rock / web team:** Keep `frame-ancestors` aligned with all production and preview origins that embed Rock.
3. **Hygiene:** Prefer `https://` everywhere for Rock links; fix any `http://rock.gocf.org` in CMS/footer.
4. **If using `/rock-page`:** Extend `ALLOWED_HOSTS` in `app/routes/rock-page.ts` only after understanding Option 3 limits.

---

## Verifying in DevTools

- **Network:** Inspect the **iframe document** request to `rock.gocf.org` (may show blocked / failed when PNA denies).
- **Console / Issues:** PNA-related messages often appear here; searching Network for `localhost` alone is **not** sufficient — the target is **`10.x`** via **`rock.gocf.org`**, not necessarily `localhost`.
- **Optional:** `dig +short rock.gocf.org` (or `nslookup`) to confirm private IPs from your network.

---

## Repo files

| File | Notes |
|------|--------|
| `app/components/rock-embed/index.tsx` | Direct vs proxied iframe `src` |
| `app/routes/rock-page.ts` | Proxy loader; `ALLOWED_HOSTS` |
| `app/routes/events/event-single/components/clickthrough-registration.component.tsx` | `form-embed` uses `ROCK_PUBLIC_SITE_ORIGIN` (`rock.christfellowship.church`), direct iframe (`useAdvancedProxy={false}`) — avoids PNA vs private `rock.gocf.org` |

---

## References

- Chrome: Private Network Access (often discussed alongside “CORS-RFC1918”).
- MDN / Chromium docs for current PNA and preflight behavior.

---

## Open questions

- Can internal-only Rock consumers keep using the current internal ELB while a **public** hostname serves embed traffic?
- Who owns DNS (`rock.gocf.org`) and ALB changes for a public path?
- Does Rock/IIS need help from a proxy (e.g. CloudFront + ALB) for TLS and `frame-ancestors`/CORS?
