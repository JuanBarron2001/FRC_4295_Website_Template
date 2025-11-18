require("dotenv").config();

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("lambda_url", process.env.LAMBDA_URL);

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