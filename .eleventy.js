module.exports = function(eleventyConfig) {
    // Copy the entire css folder to _site
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("images");
  };
  