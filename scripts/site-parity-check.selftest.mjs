import {
  normalizePath, levenshtein, findLikelyMove, isIgnored, loadGsc, toCsv,
} from "./site-parity-check.mjs";
import { XMLParser } from "fast-xml-parser";
import { writeFileSync } from "node:fs";

let pass = 0, fail = 0;
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) { console.log("      got :", JSON.stringify(got)); console.log("      want:", JSON.stringify(want)); fail++; } else pass++;
};

// --- normalization: cross-host comparison reduces to pathname ---
eq("root no-slash -> /", normalizePath("https://www.christfellowship.church"), "/");
eq("new host same path", normalizePath("https://cf-web-v3.vercel.app/about"), "/about");
eq("trailing slash stripped", normalizePath("https://x.com/groups/"), "/groups");
eq("uppercase lowered", normalizePath("https://x.com/About"), "/about");

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
eq("detects sitemapindex", !!idx.sitemapindex?.sitemap, true);
eq("child loc extracted", idx.sitemapindex.sitemap.loc, "https://www.christfellowship.church/sitemap-0.xml");
const us = p.parse(urlsetXml);
const locs = (Array.isArray(us.urlset.url) ? us.urlset.url : [us.urlset.url]).map((u) => u.loc);
eq("urlset locs extracted", locs.length, 3);

// --- ignore filter catches the junk we saw ---
eq("ignore /error", isIgnored("/error"), true);
eq("ignore /icons-rendering", isIgnored("/icons-rendering"), true);
eq("ignore *.styles", isIgnored("/groups/groups.styles"), true);
eq("ignore *-old", isIgnored("/easter-2024-old"), true);
eq("keep real page", isIgnored("/about"), false);

// --- fuzzy "likely moved" ---
const newPaths = ["/", "/about", "/messages", "/messages/easter", "/small-groups"];
eq("slug move /sermons/easter -> /messages/easter",
   findLikelyMove("/sermons/easter", newPaths)?.suggestion, "/messages/easter");
eq("edit-distance move /group -> /groups? (no /groups present, near /messages? no)",
   findLikelyMove("/grops", ["/groups", "/about"])?.suggestion, "/groups");
eq("truly missing -> null", findLikelyMove("/heart-for-the-house", newPaths), null);

// --- levenshtein sanity ---
eq("lev kitten/sitting", levenshtein("kitten", "sitting"), 3);

// --- GSC CSV parse (Search Console export shape) ---
const gscCsv = `Top pages,Clicks,Impressions,CTR,Position
https://www.christfellowship.church/give,1820,40000,4.55%,3.1
https://www.christfellowship.church/orphan-but-ranking,512,9000,5.6%,6.2
"https://www.christfellowship.church/about",300,8000,3.75%,4.0`;
writeFileSync("/tmp/gsc.csv", gscCsv);
const gsc = loadGsc("/tmp/gsc.csv");
eq("gsc parsed 3 rows", gsc.size, 3);
eq("gsc clicks for /give", gsc.get("/give"), 1820);
eq("gsc quoted url parsed", gsc.has("/about"), true);

// --- CSV escaping ---
const csv = toCsv([{ old_path: "/a,b", old_url: "u", status: "missing", suggested_new_path: "", match_reason: "", in_gsc: "yes", gsc_clicks: 5 }]);
eq("csv escapes comma", csv.includes('"/a,b"'), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
