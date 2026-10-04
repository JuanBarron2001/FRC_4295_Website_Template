// Checks that every https://hudsonstingers4295.org/... URL in the built site
// points at a file that exists in _site. Lychee skips URLs inside <meta> tags
// (og:image, twitter:image) and JSON-LD, which is where share images and logos
// live, so this covers them. Checking _site instead of the live site also means
// a pull request can add a file and link to it in the same change.
// It also fails on any link to the old hudsonrobotics4295.com address, so one
// can't come back by accident. The team's email addresses stay on that domain,
// and they don't match because they have no https://.
//
// Usage: node scripts/check-site-urls.mjs [file to append a Markdown report to]
import { readFileSync, readdirSync, existsSync, statSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = "_site";
const URL_PATTERN = /https:\/\/(?:www\.)?hudsonstingers4295\.org(\/[^"'\s<>)\\]*)?/g;
const OLD_URL_PATTERN = /https?:\/\/(?:www\.)?hudsonrobotics4295\.com[^"'\s<>)\\]*/g;

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

function existsInSite(urlPath) {
  const path = decodeURIComponent(urlPath.split(/[?#]/)[0] || "/");
  const target = join(SITE_DIR, path);
  if (path.endsWith("/")) return existsSync(join(target, "index.html"));
  return existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html")));
}

const missing = [];
const old = [];
for (const file of htmlFiles(SITE_DIR)) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(URL_PATTERN)) {
    if (!existsInSite(match[1] || "/")) missing.push({ file, url: match[0] });
  }
  for (const match of html.matchAll(OLD_URL_PATTERN)) old.push({ file, url: match[0] });
}

if (missing.length === 0 && old.length === 0) {
  console.log("All site URLs point at files in _site.");
  process.exit(0);
}

const report = [];
if (missing.length > 0) {
  report.push("", "## Site URLs with no matching file in _site", "");
  for (const { file, url } of missing) report.push(`* ${file}: ${url}`);
}
if (old.length > 0) {
  report.push("", "## Links to the old hudsonrobotics4295.com address", "");
  for (const { file, url } of old) report.push(`* ${file}: ${url}`);
}
console.error(report.join("\n"));
if (process.argv[2]) appendFileSync(process.argv[2], report.join("\n") + "\n");
process.exit(1);
