const twig = require("twig");

/**
 * This utilizes twigs extendFilter
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {import("../plugin").FILTER} filter
 */
const extendTwig = (eleventyConfig, userOptions, filter) => {
  twig.extendFilter(filter.symbol, (...args) => {
    return filter.callback(eleventyConfig, userOptions, ...args);
  });
};

/**
 * Iterates over all filters and add symbols with
 * their corresponding callbacks to twig
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  (userOptions.twig?.filter || []).forEach((filter) => {
    try {
      extendTwig(eleventyConfig, userOptions, filter);
    } catch (error) {
      console.log(error);
    }
  });
};
