require("dotenv").config();

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("lambda_url", process.env.LAMBDA_URL);

    // Copy the entire css folder to _site
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("node_modules/lite-youtube-embed/src");
  };