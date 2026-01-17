require("dotenv").config();

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("lambda_url", process.env.LAMBDA_URL);

    // Add date filter
    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
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
    eleventyConfig.addPassthroughCopy("favicon");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("node_modules/lite-youtube-embed/src");
    
    return {
      dir: {
        output: "_site"
      }
    };
  };