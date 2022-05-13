/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const debug = require("debug")("Eleventy:TwigTemplate");
const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");

// TODO: Add
// √ PRIO grab shortcodes for nunjucks and extend twig for each shortcode (asset_path!!!)
// √ PRIO userOptions to integrate different namespaces (see miyagi and consolidate.js)
// - types
// - proper caching
// - isIncrementalMatch

/**
 * @type {object}
 */
const DEFAULT_OPTIONS = {
  shortcodes: [],
  namespaces: {},
  cache: false,
};

/**
 *
 * @param {Array} shortcodes
 */
const registerShortcodes = (shortcodes) => {
  shortcodes.forEach((shortcode) => {
    try {
      twig.extendFunction(shortcode.symbol, shortcode.callback);
    } catch (error) {
      debug(error);
    }
  });
};

/**
 * @param {object} eleventyConfig
 * @param {object} twigOptions
 */
module.exports = (eleventyConfig, twigOptions = DEFAULT_OPTIONS) => {
  debug(eleventyConfig, twigOptions);

  registerShortcodes(twigOptions.shortcodes);
  twig.cache(twigOptions.cache ?? false);

  const extensionOptions = {
    outputFileExtension: "html",

    /**
     *
     * @param {string} inputPath
     * @returns {string}
     */
    getInstanceFromInputPath: (inputPath) => {
      const requirePath = TemplatePath.absolutePath(inputPath);
      return require(requirePath);
    },

    /**
     *
     * @param {string} inputContent
     * @returns {Promise<string>}
     */
    compile: async (inputContent) => {
      const template = twig.twig({
        data: inputContent,
        namespaces: twigOptions.namespaces || {},
      });
      return async (data) => {
        return template.render(data);
      };
    },
  };

  eleventyConfig.addExtension("twig", extensionOptions);
  eleventyConfig.addTemplateFormats("twig");
};
