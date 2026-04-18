module.exports = async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("mobile-style.css");
    eleventyConfig.addPassthroughCopy("bootstrap");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("search.js");
    eleventyConfig.addPassthroughCopy("main.js");
};