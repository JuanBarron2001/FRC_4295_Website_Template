require("dotenv").config();
const { execSync } = require("child_process");
const fs = require("fs");

// Font Awesome Free, self-hosted instead of the kit script. Only the core,
// solid and brands styles are used, and only the rules for icons that appear
// in the built pages or in js/ are kept (the full set is ~2,000 icons).
// Its @font-face rules use font-display: block, which hides icons (and fails
// Lighthouse) while the font loads; swap shows the page right away and fills
// the icons in when the font arrives.
const FONT_AWESOME = "node_modules/@fortawesome/fontawesome-free";
const ICON_RULE = /((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"[^"]*"\}/g;
const FA_CLASS = /\bfa-[a-z0-9-]+/g;

function filesIn(dir, extensions) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const p = `${dir}/${entry.name}`;
        if (entry.isDirectory()) return filesIn(p, extensions);
        return extensions.some((ext) => entry.name.endsWith(ext)) ? [p] : [];
    });
}

function buildFontAwesome() {
    const used = new Set();
    for (const file of [...filesIn("_site", [".html"]), ...filesIn("js", [".js", ".mjs"])]) {
        for (const name of fs.readFileSync(file, "utf8").match(FA_CLASS) || []) used.add(name);
    }

    const full = ["fontawesome", "solid", "brands"]
        .map((name) => fs.readFileSync(`${FONT_AWESOME}/css/${name}.min.css`, "utf8"))
        .join("\n");

    // A class Font Awesome doesn't define (a Pro-only icon, a typo) shows as an empty box.
    const defined = new Set(full.match(FA_CLASS));
    const unknown = [...used].filter((name) => !defined.has(name));
    if (unknown.length) console.warn(`[fontawesome] Not in Font Awesome Free 7: ${unknown.join(", ")}`);

    const css = full
        .replace(ICON_RULE, (rule, selectors) =>
            selectors.split(",").some((s) => used.has(s.slice(1))) ? rule : "")
        .replace(/font-display:block/g, "font-display:swap");
    fs.mkdirSync("_site/styles", { recursive: true });
    fs.writeFileSync("_site/styles/fontawesome.css", css);
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("lambda_url", process.env.LAMBDA_URL);
    eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

    // Compile Tailwind after every build. tailwind.config.js scans the built
    // pages in _site, so this has to run after Eleventy has written them.
    // BROWSERSLIST_IGNORE_OLD_DATA hides the "caniuse-lite is outdated" warning:
    // Tailwind 3.4.17 bundles its own copy, so `npx update-browserslist-db`
    // cannot update it, and it only affects vendor prefixes.
    eleventyConfig.on("eleventy.after", () => {
        execSync("npx tailwindcss -i styles/tailwind.css -o _site/styles/tailwind.css --minify", {
            stdio: "inherit",
            env: { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: "1" },
        });
        buildFontAwesome();
    });
    // Reload the browser when the compiled CSS changes during `npm start`.
    eleventyConfig.setServerOptions({ watch: ["_site/styles/**/*.css"] });

    // Add date filter
    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'
        });
    });

    // Create blog collection sorted by date (newest first)
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByTag("blog").sort((a, b) => {
            return b.date - a.date;
        });
    });

    // Ignore examples folder
    eleventyConfig.ignores.add("examples/**");

    // Pass through copy for static assets
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("sitemap.xml");
    eleventyConfig.addPassthroughCopy("node_modules/lite-youtube-embed/src");
    // The Font Awesome CSS above loads its fonts from ../webfonts/, i.e. /webfonts/.
    eleventyConfig.addPassthroughCopy({
        [`${FONT_AWESOME}/webfonts/fa-solid-900.woff2`]: "webfonts/fa-solid-900.woff2",
        [`${FONT_AWESOME}/webfonts/fa-brands-400.woff2`]: "webfonts/fa-brands-400.woff2",
    });
    // The calendar only uses the month grid, so it loads FullCalendar's core and
    // day-grid plugin instead of the full bundle with every view.
    eleventyConfig.addPassthroughCopy({
        "node_modules/@fullcalendar/core/index.global.min.js": "lib/fullcalendar/core.global.min.js",
        "node_modules/@fullcalendar/daygrid/index.global.min.js": "lib/fullcalendar/daygrid.global.min.js",
    });
    
    return {
      dir: {
        output: "_site"
      }
    };
  };