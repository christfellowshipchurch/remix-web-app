import {
  normalizePath,
  levenshtein,
  findLikelyMove,
  isIgnored,
  isLowTraffic,
  isLiveStatus,
  loadGsc,
  toCsv,
} from './site-parity-check.mjs';
import { XMLParser } from 'fast-xml-parser';
import { writeFileSync } from 'node:fs';

let pass = 0,
  fail = 0;
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}`);
  if (!ok) {
    console.log('      got :', JSON.stringify(got));
    console.log('      want:', JSON.stringify(want));
    fail++;
  } else pass++;
};

// --- normalization: cross-host comparison reduces to pathname ---
eq(
  'root no-slash -> /',
  normalizePath('https://www.christfellowship.church'),
  '/',
);
eq(
  'new host same path',
  normalizePath('https://cf-web-v3.vercel.app/about'),
  '/about',
);
eq(
  'trailing slash stripped',
  normalizePath('https://x.com/groups/'),
  '/groups',
);
eq('uppercase lowered', normalizePath('https://x.com/About'), '/about');

// --- sitemap INDEX parsing (the real old-site shape) ---
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap><loc>https://www.christfellowship.church/sitemap-0.xml</loc></sitemap>
</sitemapindex>`;
const urlsetXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.christfellowship.church</loc><lastmod>2026-05-14T18:00:40.570Z</lastmod></url>
<url><loc>https://www.christfellowship.church/about</loc></url>
<url><loc>https://www.christfellowship.church/groups/Groups.styles</loc></url>
</urlset>`;
const p = new XMLParser({ ignoreAttributes: true });
const idx = p.parse(indexXml);
eq('detects sitemapindex', !!idx.sitemapindex?.sitemap, true);
eq(
  'child loc extracted',
  idx.sitemapindex.sitemap.loc,
  'https://www.christfellowship.church/sitemap-0.xml',
);
const us = p.parse(urlsetXml);
const locs = (
  Array.isArray(us.urlset.url) ? us.urlset.url : [us.urlset.url]
).map((u) => u.loc);
eq('urlset locs extracted', locs.length, 3);

// --- ignore filter catches the junk we saw ---
eq('ignore /error', isIgnored('/error'), true);
eq('ignore /icons-rendering', isIgnored('/icons-rendering'), true);
eq('ignore *.styles', isIgnored('/groups/groups.styles'), true);
eq('ignore *-old', isIgnored('/easter-2024-old'), true);
eq('keep real page', isIgnored('/about'), false);

// --- fuzzy "likely moved" ---
const newPaths = [
  '/',
  '/about',
  '/messages',
  '/messages/easter',
  '/small-groups',
];
eq(
  'slug move /sermons/easter -> /messages/easter',
  findLikelyMove('/sermons/easter', newPaths)?.suggestion,
  '/messages/easter',
);
eq(
  'edit-distance move /group -> /groups? (no /groups present, near /messages? no)',
  findLikelyMove('/grops', ['/groups', '/about'])?.suggestion,
  '/groups',
);
eq(
  'truly missing -> null',
  findLikelyMove('/heart-for-the-house', newPaths),
  null,
);

// --- levenshtein sanity ---
eq('lev kitten/sitting', levenshtein('kitten', 'sitting'), 3);

// --- GSC CSV parse (Search Console export shape) ---
const gscCsv = `Top pages,Clicks,Impressions,CTR,Position
https://www.christfellowship.church/give,1820,40000,4.55%,3.1
https://www.christfellowship.church/orphan-but-ranking,512,9000,5.6%,6.2
"https://www.christfellowship.church/about",300,8000,3.75%,4.0`;
writeFileSync('/tmp/gsc.csv', gscCsv);
const gsc = loadGsc('/tmp/gsc.csv');
eq('gsc parsed 3 rows', gsc.size, 3);
eq('gsc clicks for /give', gsc.get('/give'), 1820);
eq('gsc quoted url parsed', gsc.has('/about'), true);

// --- click threshold: only GSC-only URLs below threshold are low-traffic ---
eq(
  'low-traffic: gsc-only, under threshold',
  isLowTraffic({ fromSitemap: false, clicks: 2, minClicks: 5 }),
  true,
);
eq(
  'low-traffic: gsc-only, at threshold is NOT low',
  isLowTraffic({ fromSitemap: false, clicks: 5, minClicks: 5 }),
  false,
);
eq(
  'low-traffic: sitemap page is NEVER filtered, even 0 clicks',
  isLowTraffic({ fromSitemap: true, clicks: 0, minClicks: 5 }),
  false,
);
eq(
  'low-traffic: gsc-only, no clicks -> low',
  isLowTraffic({ fromSitemap: false, clicks: '', minClicks: 5 }),
  true,
);
eq(
  'low-traffic: disabled when minClicks=0',
  isLowTraffic({ fromSitemap: false, clicks: 0, minClicks: 0 }),
  false,
);

// --- live status: distinguishes still-served from retired-on-old ---
eq(
  'live: 200 same path -> live',
  isLiveStatus(
    { status: 200, redirected: false, finalPath: '/about' },
    '/about',
  ),
  true,
);
eq(
  'live: 404 -> not live',
  isLiveStatus({ status: 404, redirected: false, finalPath: '/gone' }, '/gone'),
  false,
);
eq(
  'live: 200 redirected elsewhere -> not live',
  isLiveStatus(
    { status: 200, redirected: true, finalPath: '/articles' },
    '/old-article',
  ),
  false,
);
eq(
  'live: 200 same-path slash canonicalization -> still live',
  isLiveStatus(
    { status: 200, redirected: true, finalPath: '/about' },
    '/about',
  ),
  true,
);
eq(
  'live: network error (0) -> assume live, never hide',
  isLiveStatus({ status: 0, redirected: false, finalPath: '/x' }, '/x'),
  true,
);
eq('live: undefined -> assume live', isLiveStatus(undefined, '/x'), true);

// --- CSV escaping ---
const csv = toCsv([
  {
    old_path: '/a,b',
    old_url: 'u',
    status: 'missing',
    suggested_new_path: '',
    match_reason: '',
    in_gsc: 'yes',
    gsc_clicks: 5,
  },
]);
eq('csv escapes comma', csv.includes('"/a,b"'), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
