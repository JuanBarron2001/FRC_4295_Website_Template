require("dotenv").config();
const { execSync } = require("child_process");

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("lambda_url", process.env.LAMBDA_URL);
    eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

    // Compile Tailwind after every build. tailwind.config.js scans the built
    // pages in _site, so this has to run after Eleventy has written them.
    eleventyConfig.on("eleventy.after", () => {
        execSync("npx tailwindcss -i styles/tailwind.css -o _site/styles/tailwind.css --minify", { stdio: "inherit" });
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
    eleventyConfig.addPassthroughCopy({"node_modules/fullcalendar": "lib/fullcalendar"});
    
    return {
      dir: {
        output: "_site"
      }
    };
  };