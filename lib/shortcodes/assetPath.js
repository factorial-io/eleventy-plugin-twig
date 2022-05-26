/**
 * Returns a simple string for the base dir of assets inside the build folder
 * 
 * @param {import("@11ty/eleventy").UserConfig}} eleventyConfig 
 * @param {import("../plugin").USER_OPTIONS}} userOptions 
 * @returns {string}
 */
module.exports = (eleventyConfig, userOptions) => {
    return `${userOptions.dir.output}/${userOptions.assets.base}`;
}