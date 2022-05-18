const debug = require("debug")("Eleventy:TwigTemplate:Shortcodes");
const fs = require("fs");
const twig = require("twig");

/**
 * This parses the manifest and returns the related asset path
 * NOTE: This is a trivial implementation and not complete yet!
 *
 * @param {import("@11ty/eleventy").UserConfig["dir"]["output"]} output
 * @param {import("./plugin.js").twigOptions["mixManifest"]} mixManifest
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
 * @type {import("./plugin.js").twigOptions["shortcodes"]}
 */
const defaultShortcodes = [
  {
    symbol: "mix",
    callback: (eleventyConfig, twigOptions, originalAsset) =>
      mixAssets(
        eleventyConfig.dir.output,
        twigOptions.mixManifest,
        originalAsset
      ),
    requiredOptions: ["mixManifest"],
  },
  {
    symbol: "asset_path",
    callback: (eleventyConfig, twigOptions) =>
      `${eleventyConfig.dir.output}/${twigOptions.assetFolder}`,
    requiredOptions: ["assetFolder"],
  },
];

/**
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("./plugin.js").twigOptions} twigOptions
 * @param {import("./plugin.js").shortcode} shortcode
 */
const extendTwig = (eleventyConfig, twigOptions, shortcode) => {
  const availableOptions = Object.keys(twigOptions);
  const hasNecessaryOptions = shortcode.requiredOptions.reduce(
    (acc, curr) => (acc = availableOptions.includes(curr)),
    true
  );
  if (hasNecessaryOptions) {
    twig.extendFunction(shortcode.symbol, (args) => {
      return shortcode.callback(eleventyConfig, twigOptions, args);
    });
  } else {
    debug(
      `Shortcode ${shortcode.symbol} is missing at least one requiredOption ${shortcode.requiredOptions}`
    );
  }
};

/**
 * Iterates over all shortcodes and add symbols with
 * their corresponding callbacks for twig
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("./plugin.js").twigOptions} twigOptions
 */
module.exports = (eleventyConfig, twigOptions) => {
  [...defaultShortcodes, ...(twigOptions.shortcodes || [])].forEach(
    (shortcode) => {
      try {
        extendTwig(eleventyConfig, twigOptions, shortcode);
      } catch (error) {
        debug(error);
      }
    }
  );
};
