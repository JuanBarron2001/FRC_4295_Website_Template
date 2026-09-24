// Checks that every https://hudsonrobotics4295.com/... URL in the built site
// points at a file that exists in _site. Lychee skips URLs inside <meta> tags
// (og:image, twitter:image) and JSON-LD, which is where share images and logos
// live, so this covers them. Checking _site instead of the live site also means
// a pull request can add a file and link to it in the same change.
//
// Usage: node scripts/check-site-urls.mjs [file to append a Markdown report to]
import { readFileSync, readdirSync, existsSync, statSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const SITE_DIR = "_site";
const URL_PATTERN = /https:\/\/(?:www\.)?hudsonrobotics4295\.com(\/[^"'\s<>)\\]*)?/g;

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
for (const file of htmlFiles(SITE_DIR)) {
  for (const match of readFileSync(file, "utf8").matchAll(URL_PATTERN)) {
    if (!existsInSite(match[1] || "/")) missing.push({ file, url: match[0] });
  }
}

if (missing.length === 0) {
  console.log("All site URLs point at files in _site.");
  process.exit(0);
}

const report = ["", "## Site URLs with no matching file in _site", ""];
for (const { file, url } of missing) report.push(`* ${file}: ${url}`);
console.error(report.join("\n"));
if (process.argv[2]) appendFileSync(process.argv[2], report.join("\n") + "\n");
process.exit(1);
