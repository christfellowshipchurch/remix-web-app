#!/usr/bin/env node
/**
 * site-parity-check.mjs
 *
 * Compares the OLD site's URL inventory against the NEW site's, and reports
 * which pages are missing / moved / present so nothing gets dropped on launch.
 *
 * SOURCES
 *   - Old side : XML sitemap (index-aware) + optional Google Search Console CSV export
 *   - New side : live crawl of the staging deploy (+ its sitemap if one exists)
 *
 * Comparison is done on the normalized PATHNAME, because the two sites live on
 * different hosts. Output is a CSV you can use directly as a 301 redirect map.
 *
 * Usage:
 *   node site-parity-check.mjs
 *   GSC_CSV=./gsc-export.csv node site-parity-check.mjs
 *
 * Requires: Node 18+ (global fetch), fast-xml-parser, cheerio
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';

// ---------------------------------------------------------------------------
// CONFIG — edit these for your environment
// ---------------------------------------------------------------------------
const CONFIG = {
  oldSitemapUrl: 'https://www.christfellowship.church/sitemap.xml',
  newBaseUrl: 'https://cf-web-v3.vercel.app',
  newSitemapUrl: 'https://cf-web-v3.vercel.app/sitemap.xml',
  gscCsvPath: process.env.GSC_CSV || null, // optional Search Console export

  // GSC-only URLs (present in the export but NOT in the old sitemap) with fewer than
  // this many lifetime clicks are bucketed as "low-traffic" instead of "missing",
  // stripping the long tail of dead/expired/campaign URLs. Pages in the old sitemap
  // are NEVER filtered by clicks. Set to 0 to disable. Override per-run with
  // GSC_MIN_CLICKS=10 pnpm parity
  gscMinClicks: Number(process.env.GSC_MIN_CLICKS ?? 5),

  // Verify each non-matched old URL still returns 200 on the OLD site. GSC reports URLs
  // clicked in the last 16 months that may since have been deleted/disabled — those now
  // 404 or redirect away, so they're already gone, not pages this migration is dropping.
  // Bucketed as "gone-on-old". Set VERIFY_OLD=0 to skip (avoids ~hundreds of HEAD requests
  // to the old production site).
  verifyOldStatus: process.env.VERIFY_OLD !== '0',
  oldStatusConcurrency: 8,

  // Sitemaps get their own (longer) timeout: a dynamic, DB-backed sitemap behind a cold
  // serverless function can take far longer than a normal page to respond.
  sitemapTimeoutMs: 60000,

  crawl: {
    maxPages: 3000,
    maxDepth: 8,
    concurrency: 6,
    timeoutMs: 15000,
  },

  normalize: {
    stripQuery: true, // treat /x?foo=1 and /x as the same page
    stripTrailingSlash: true,
    lowercase: true,
  },

  // Old-sitemap entries matching these are reported as "ignore" (not real pages).
  ignorePatterns: [
    /^\/error$/,
    /^\/icons-rendering$/,
    /\.styles$/i, // e.g. /groups/Groups.styles
    /-old$/, // e.g. /easter-2024-old
  ],

  fuzzy: {
    enabled: true,
    maxEditDistance: 3, // for whole-path similarity
    matchBySlug: true, // also match on the last path segment
  },

  outCsv: 'parity-report.csv',
  userAgent: 'cfdp-parity-check/1.0 (+launch QA)',
};

// ---------------------------------------------------------------------------
// Fetch helper (handles gzip transparently, adds timeout + UA)
// ---------------------------------------------------------------------------
async function fetchText(url, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': CONFIG.userAgent, Accept: '*/*' },
      redirect: 'follow',
    });
    const contentType = res.headers.get('content-type') || '';
    const body = res.ok ? await res.text() : '';
    return {
      ok: res.ok,
      status: res.status,
      contentType,
      body,
      finalUrl: res.url,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      contentType: '',
      body: '',
      error: String(err),
    };
  } finally {
    clearTimeout(t);
  }
}

// Checks whether a URL is still served on the OLD site. Follows redirects so we can
// tell a real 404 from a 200, and capture where redirects land.
async function checkLiveStatus(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const opts = {
    redirect: 'follow',
    signal: ctrl.signal,
    headers: { 'User-Agent': CONFIG.userAgent },
  };
  try {
    let res = await fetch(url, { method: 'HEAD', ...opts });
    if (res.status === 405 || res.status === 501)
      res = await fetch(url, { method: 'GET', ...opts });
    return {
      status: res.status,
      redirected: res.redirected,
      finalPath: normalizePath(res.url || url),
    };
  } catch {
    return { status: 0, redirected: false, finalPath: normalizePath(url) };
  } finally {
    clearTimeout(t);
  }
}

// "Live" = still a real page on the old site at this same path. A 404/410/5xx is gone;
// a 200 that redirected to a DIFFERENT path means the content moved away. A status of 0
// (network error / timeout) is treated as live — we never hide something we couldn't
// verify. A same-path redirect (e.g. slash/case canonicalization) still counts as live.
function isLiveStatus(r, originalPath) {
  if (!r || r.status === 0) return true;
  if (r.status !== 200) return false;
  if (r.redirected && r.finalPath && r.finalPath !== originalPath) return false;
  return true;
}

// Run an async fn over items with bounded concurrency.
async function pooledForEach(items, concurrency, fn) {
  let i = 0;
  const worker = async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) || 1 }, worker),
  );
}

// ---------------------------------------------------------------------------
// Sitemap parsing (index-aware, recurses into child sitemaps, dedupes)
// ---------------------------------------------------------------------------
const xml = new XMLParser({ ignoreAttributes: true, isArray: () => false });

async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return [];
  seen.add(sitemapUrl);

  // Dynamic sitemaps (Rock enumeration + serverless cold start) can be slow on the first
  // hit, so give them a long budget and retry once before giving up.
  let res = await fetchText(sitemapUrl, { timeoutMs: CONFIG.sitemapTimeoutMs });
  if (!res.ok || !res.body) {
    console.warn(
      `  ! sitemap fetch failed (${res.status}) — retrying once: ${sitemapUrl}`,
    );
    res = await fetchText(sitemapUrl, { timeoutMs: CONFIG.sitemapTimeoutMs });
  }
  if (!res.ok || !res.body) {
    console.warn(`  ! sitemap fetch failed (${res.status}): ${sitemapUrl}`);
    return [];
  }

  let doc;
  try {
    doc = xml.parse(res.body);
  } catch (err) {
    console.warn(`  ! could not parse sitemap XML: ${sitemapUrl} (${err})`);
    return [];
  }

  // Sitemap INDEX: <sitemapindex><sitemap><loc>child</loc>...
  if (doc.sitemapindex?.sitemap) {
    const children = asArray(doc.sitemapindex.sitemap)
      .map((s) => s.loc)
      .filter(Boolean);
    const all = [];
    for (const child of children) {
      console.log(`  -> following child sitemap: ${child}`);
      all.push(...(await collectSitemapUrls(child, seen)));
    }
    return dedupe(all);
  }

  // URL SET: <urlset><url><loc>page</loc>...
  if (doc.urlset?.url) {
    return dedupe(
      asArray(doc.urlset.url)
        .map((u) => u.loc)
        .filter(Boolean),
    );
  }

  return [];
}

// ---------------------------------------------------------------------------
// Crawler (BFS, same-origin, skips assets, simple concurrency pool)
// ---------------------------------------------------------------------------
const ASSET_RE =
  /\.(png|jpe?g|gif|svg|webp|ico|css|js|mjs|map|json|xml|txt|pdf|zip|woff2?|ttf|eot|mp4|webm|mp3|wav)$/i;

async function crawl(baseUrl, opts) {
  const origin = new URL(baseUrl).origin;
  const visited = new Set(); // normalized full URLs we've queued
  const found = new Set(); // normalized PATHS that returned 200 HTML
  const queue = [{ url: baseUrl, depth: 0 }];

  const enqueue = (raw, depth) => {
    let u;
    try {
      u = new URL(raw, baseUrl);
    } catch {
      return;
    }
    if (u.origin !== origin) return; // same-origin only
    if (!/^https?:$/.test(u.protocol)) return;
    if (ASSET_RE.test(u.pathname)) return;
    u.hash = '';
    if (CONFIG.normalize.stripQuery) u.search = '';
    const key = u.toString();
    if (visited.has(key)) return;
    visited.add(key);
    queue.push({ url: key, depth });
  };

  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      if (!job || job.depth > opts.maxDepth) continue;
      if (found.size >= opts.maxPages) return;

      const res = await fetchText(job.url, { timeoutMs: opts.timeoutMs });
      if (!res.ok) continue;
      if (!res.contentType.includes('text/html')) continue;

      found.add(normalizePath(res.finalUrl || job.url));

      const $ = cheerio.load(res.body);
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) enqueue(href, job.depth + 1);
      });
    }
  }

  const workers = Array.from({ length: opts.concurrency }, () => worker());
  await Promise.all(workers);
  return found;
}

// ---------------------------------------------------------------------------
// Normalization — everything collapses to a comparable pathname
// ---------------------------------------------------------------------------
function normalizePath(urlOrPath) {
  let path;
  try {
    path = new URL(urlOrPath, 'https://placeholder.local').pathname;
  } catch {
    path = String(urlOrPath);
  }
  if (CONFIG.normalize.lowercase) path = path.toLowerCase();
  if (CONFIG.normalize.stripTrailingSlash && path.length > 1) {
    path = path.replace(/\/+$/, '');
  }
  return path === '' ? '/' : path;
}

// ---------------------------------------------------------------------------
// Google Search Console CSV (optional) — flags pages with real traffic
// ---------------------------------------------------------------------------
function loadGsc(path) {
  const map = new Map(); // normalized path -> clicks
  if (!path) return map;
  if (!existsSync(path)) {
    console.warn(`  ! GSC CSV not found: ${path} (skipping)`);
    return map;
  }
  const rows = parseCsv(readFileSync(path, 'utf8'));
  if (!rows.length) return map;

  const header = rows[0].map((h) => h.toLowerCase().trim());
  const urlCol = header.findIndex(
    (h) => h.includes('page') || h.includes('url') || h.includes('address'),
  );
  const clickCol = header.findIndex((h) => h.includes('click'));
  const useHeader = urlCol !== -1;

  for (let i = useHeader ? 1 : 0; i < rows.length; i++) {
    const row = rows[i];
    const cell = useHeader ? row[urlCol] : row[0];
    if (!cell || !/^https?:\/\//.test(cell)) continue;
    const clicks = clickCol !== -1 ? Number(row[clickCol]) || 0 : 0;
    map.set(normalizePath(cell), clicks);
  }
  return map;
}

// Minimal CSV parser (handles quoted fields, commas, escaped quotes)
function parseCsv(text) {
  const rows = [];
  let row = [],
    field = '',
    inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (field !== '' || row.length) {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      }
      if (c === '\r' && text[i + 1] === '\n') i++;
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Classification + fuzzy "likely moved" detection
// ---------------------------------------------------------------------------
function isIgnored(path) {
  return CONFIG.ignorePatterns.some((re) => re.test(path));
}

// A GSC-only URL (not in the old sitemap) below the click threshold is long-tail
// noise — real sitemap pages are never filtered this way regardless of clicks.
function isLowTraffic({ fromSitemap, clicks, minClicks }) {
  return !fromSitemap && minClicks > 0 && (Number(clicks) || 0) < minClicks;
}

function slugOf(path) {
  const parts = path.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[n];
}

function findLikelyMove(oldPath, newPaths) {
  if (!CONFIG.fuzzy.enabled) return null;
  const oldSlug = slugOf(oldPath);

  // 1) Same final slug under a different parent (most common migration pattern)
  if (CONFIG.fuzzy.matchBySlug && oldSlug) {
    const bySlug = newPaths.filter((p) => slugOf(p) === oldSlug);
    if (bySlug.length) return { suggestion: bySlug[0], reason: 'same slug' };
  }

  // 2) Closest whole-path within edit-distance threshold
  let best = null,
    bestDist = Infinity;
  for (const p of newPaths) {
    const d = levenshtein(oldPath, p);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  if (best && bestDist <= CONFIG.fuzzy.maxEditDistance) {
    return { suggestion: best, reason: `edit distance ${bestDist}` };
  }
  return null;
}

// ---------------------------------------------------------------------------
// CSV output
// ---------------------------------------------------------------------------
function toCsv(rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const headers = [
    'old_path',
    'old_url',
    'status',
    'suggested_new_path',
    'match_reason',
    'in_gsc',
    'gsc_clicks',
    'old_status',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map((h) => esc(r[h])).join(','));
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
const asArray = (x) => (Array.isArray(x) ? x : [x]);
const dedupe = (arr) => [...new Set(arr)];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('1) Pulling OLD site inventory from sitemap...');
  const oldUrls = await collectSitemapUrls(CONFIG.oldSitemapUrl);
  console.log(`   ${oldUrls.length} URLs from sitemap`);
  // Paths that genuinely come from the old sitemap — never filtered by click count.
  const sitemapPaths = new Set(oldUrls.map(normalizePath));

  const gsc = loadGsc(CONFIG.gscCsvPath);
  if (gsc.size) {
    console.log(`   ${gsc.size} URLs from GSC export`);
    // Fold GSC-only paths into the old inventory (orphan pages w/ traffic)
    for (const p of gsc.keys()) {
      if (!oldUrls.some((u) => normalizePath(u) === p)) {
        oldUrls.push(`${new URL(CONFIG.oldSitemapUrl).origin}${p}`);
      }
    }
    console.log(`   ${oldUrls.length} URLs after merging GSC orphans`);
  } else {
    console.log(
      '   (no GSC export provided — pass GSC_CSV=./export.csv to include traffic data)',
    );
  }

  console.log('\n2) Building NEW site inventory...');
  let newPathsSet = new Set();
  // Try the new sitemap first (cheap); fall back to / augment with a crawl.
  const newSitemapUrls = await collectSitemapUrls(CONFIG.newSitemapUrl);
  if (newSitemapUrls.length) {
    console.log(`   ${newSitemapUrls.length} URLs from new sitemap`);
    newSitemapUrls.forEach((u) => newPathsSet.add(normalizePath(u)));
  } else {
    console.log('   new sitemap unavailable — crawling staging instead');
  }
  console.log('   crawling ' + CONFIG.newBaseUrl + ' ...');
  const crawled = await crawl(CONFIG.newBaseUrl, CONFIG.crawl);
  crawled.forEach((p) => newPathsSet.add(p));
  console.log(
    `   ${crawled.size} URLs from crawl; ${newPathsSet.size} new paths total`,
  );

  const newPaths = [...newPathsSet];

  // Optional 2b) Check which non-matched old URLs are still live on the OLD site.
  const oldLive = new Map(); // normalized old path -> { status, redirected, finalPath }
  if (CONFIG.verifyOldStatus) {
    const candidates = oldUrls.filter((u) => {
      const p = normalizePath(u);
      return !newPathsSet.has(p) && !isIgnored(p);
    });
    console.log(
      `\n2b) Checking ${candidates.length} non-matched old URLs still return 200 on the old site...`,
    );
    let done = 0;
    await pooledForEach(candidates, CONFIG.oldStatusConcurrency, async (u) => {
      oldLive.set(normalizePath(u), await checkLiveStatus(u));
      if (++done % 100 === 0) console.log(`   ...${done}/${candidates.length}`);
    });
    const gone = [...oldLive.entries()].filter(
      ([p, r]) => !isLiveStatus(r, p),
    ).length;
    console.log(
      `   ${gone} of ${candidates.length} are already gone/redirected on the old site`,
    );
  }

  console.log('\n3) Diffing...');
  const rows = [];
  for (const oldUrl of oldUrls) {
    const oldPath = normalizePath(oldUrl);
    const inGsc = gsc.has(oldPath);
    const clicks = gsc.get(oldPath) ?? '';
    const fromSitemap = sitemapPaths.has(oldPath);
    const live = oldLive.get(oldPath);

    let status,
      suggested = '',
      reason = '';
    if (isIgnored(oldPath)) {
      status = 'ignore';
    } else if (newPathsSet.has(oldPath)) {
      status = 'present';
    } else if (CONFIG.verifyOldStatus && live && !isLiveStatus(live, oldPath)) {
      // Old site no longer serves this (404/redirect) — already gone, not a regression
      status = 'gone-on-old';
    } else if (
      isLowTraffic({ fromSitemap, clicks, minClicks: CONFIG.gscMinClicks })
    ) {
      // GSC-only long-tail URL under the click threshold — not worth chasing
      status = 'low-traffic';
    } else {
      const move = findLikelyMove(oldPath, newPaths);
      if (move) {
        status = 'likely-moved';
        suggested = move.suggestion;
        reason = move.reason;
      } else {
        status = 'missing';
      }
    }

    rows.push({
      old_path: oldPath,
      old_url: oldUrl,
      status,
      suggested_new_path: suggested,
      match_reason: reason,
      in_gsc: inGsc ? 'yes' : '',
      gsc_clicks: clicks,
      old_status: live
        ? live.status === 0
          ? 'err/timeout'
          : `${live.status}${live.redirected && live.finalPath !== oldPath ? ' →' + live.finalPath : ''}`
        : '',
    });
  }

  // Sort: missing (with traffic first) > likely-moved > low-traffic > gone-on-old > present > ignore
  const order = {
    missing: 0,
    'likely-moved': 1,
    'low-traffic': 2,
    'gone-on-old': 3,
    present: 4,
    ignore: 5,
  };
  rows.sort(
    (a, b) =>
      order[a.status] - order[b.status] ||
      (Number(b.gsc_clicks) || 0) - (Number(a.gsc_clicks) || 0) ||
      a.old_path.localeCompare(b.old_path),
  );

  writeFileSync(CONFIG.outCsv, toCsv(rows), 'utf8');

  // Summary
  const counts = rows.reduce(
    (acc, r) => ((acc[r.status] = (acc[r.status] || 0) + 1), acc),
    {},
  );
  console.log('\n=== SUMMARY ===');
  for (const k of [
    'missing',
    'likely-moved',
    'low-traffic',
    'gone-on-old',
    'present',
    'ignore',
  ]) {
    if (counts[k]) console.log(`  ${k.padEnd(13)} ${counts[k]}`);
  }
  const missingWithTraffic = rows.filter(
    (r) => r.status === 'missing' && r.in_gsc,
  ).length;
  if (missingWithTraffic) {
    console.log(
      `\n  ⚠  ${missingWithTraffic} MISSING page(s) currently receive search traffic — prioritize these.`,
    );
  }
  if (CONFIG.gscMinClicks > 0 && counts['low-traffic']) {
    console.log(
      `  ${counts['low-traffic']} GSC-only URL(s) under ${CONFIG.gscMinClicks} click(s) set aside as low-traffic — run GSC_MIN_CLICKS=0 pnpm parity to see them all.`,
    );
  }
  if (counts['gone-on-old']) {
    console.log(
      `  ${counts['gone-on-old']} URL(s) already 404/redirect on the old site (gone-on-old) — already retired, not regressions.`,
    );
  }
  console.log(`\nReport written to ${CONFIG.outCsv}`);
}

// Run only when invoked directly (so functions can be imported for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export {
  collectSitemapUrls,
  crawl,
  normalizePath,
  loadGsc,
  parseCsv,
  findLikelyMove,
  levenshtein,
  isIgnored,
  isLowTraffic,
  isLiveStatus,
  toCsv,
};
