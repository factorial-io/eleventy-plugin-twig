const fs = require("fs");
const twig = require("twig");

/**
 * This parses the manifest and returns the related asset path
 * NOTE: This is a trivial implementation and not complete yet!
 *
 * @param {import("@11ty/eleventy").UserConfig["dir"]["output"]} output
 * @param {import("./plugin.js").USER_OPTIONS["mixManifest"]} mixManifest
 * @param {string} originalAsset
 * @returns {string}
 */
const mixAssets = (output, mixManifest, originalAsset) => {
  const mix = JSON.parse(fs.readFileSync(`./${output}/${mixManifest}`));
  return mix[originalAsset];
};

/**
 * Default shortcodes
 *
 * @type {import("./plugin.js").TWIG_OPTIONS["shortcodes"]}
 */
const defaultShortcodes = [
  {
    symbol: "mix",
    callback: (eleventyConfig, userOptions, originalAsset) =>
      mixAssets(
        eleventyConfig.dir.output,
        userOptions.mixManifest,
        originalAsset
      ),
    requiredOptions: ["mixManifest"],
  },
  {
    symbol: "asset_path",
    callback: (eleventyConfig, userOptions) =>
      `${eleventyConfig.dir.output}/${userOptions.assetsPath.base}`,
    requiredOptions: ["assetsPath"],
  },
];

/**
 * This utilize twigs extendFunction to implement the shortcodes after
 * it checks if all options for a given shortcode are defined
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("./plugin.js").USER_OPTIONS} userOptions
 * @param {import("./plugin.js").SHORTCODE} shortcode
 */
const extendTwig = (eleventyConfig, userOptions, shortcode) => {
  const availableOptions = Object.keys(userOptions);
  const hasRequiredOptions = shortcode.requiredOptions.reduce(
    (acc, curr) => (acc = availableOptions.includes(curr)),
    true
  );
  if (hasRequiredOptions) {
    twig.extendFunction(shortcode.symbol, (args) => {
      return shortcode.callback(eleventyConfig, userOptions, args);
    });
  } else {
    console.error(
      `Shortcode ${shortcode.symbol} is missing at least one requiredOption ${shortcode.requiredOptions}`
    );
  }
};

/**
 * Iterates over all shortcodes and add symbols with
 * their corresponding callbacks for twig
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("./plugin.js").USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  [...defaultShortcodes, ...(userOptions.twig.shortcodes || [])].forEach(
    (shortcode) => {
      try {
        extendTwig(eleventyConfig, userOptions, shortcode);
      } catch (error) {
        console.error(error);
      }
    }
  );
};
