const image = require("./image");
const twig = require("twig");
const mix = require("./mix");
const assetPath = require("./assetPath");



/**
 * Default shortcodes
 *
 * @type {import("../plugin").TWIG_OPTIONS["shortcodes"]}
 */
const defaultShortcodes = [
  {
    symbol: "mix",
    callback: mix,
  },
  {
    symbol: "asset_path",
    callback: assetPath,
  },
  {
    symbol: "image",
    callback: image,
  },
];

/**
 * This utilize twigs extendFunction to implement the shortcodes after
 * it checks if all options for a given shortcode are defined
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {import("../plugin").SHORTCODE} shortcode
 */
const extendTwig = (eleventyConfig, userOptions, shortcode) => {
  twig.extendFunction(shortcode.symbol, (...args) => {
    return shortcode.callback(eleventyConfig, userOptions, ...args);
  });
};

/**
 * Iterates over all shortcodes and add symbols with
 * their corresponding callbacks for twig
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  [...defaultShortcodes, ...(userOptions.twig?.shortcodes || [])].forEach(
    (shortcode) => {
      try {
        extendTwig(eleventyConfig, userOptions, shortcode);
      } catch (error) {
        console.error(error);
      }
    }
  );
};
