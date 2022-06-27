const twig = require("twig");

/**
 * This utilizes twigs extendFunction
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {import("../plugin").FUNCTION} func
 */
const extendTwig = (eleventyConfig, userOptions, func) => {
  twig.extendFunction(func.symbol, (...args) => {
    return func.callback(eleventyConfig, userOptions, ...args);
  });
};

/**
 * Iterates over all functions and add symbols with
 * their corresponding callbacks to twig
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  (userOptions.twig?.functions || []).forEach((func) => {
    try {
      extendTwig(eleventyConfig, userOptions, func);
    } catch (error) {
      console.error(error);
    }
  });
};
