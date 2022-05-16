/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const debug = require("debug")("Eleventy:TwigTemplate");
const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");

/**
 * @typedef {object} TWIG_OPTIONS
 * @property {object[]} [shortcodes]
 * @property {string} shortcodes[].symbol
 * @property {function():string} shortcodes[].callback
 * @property {Object.<string, string>} [namespaces]
 * @property {boolean} [cache]
 */

/**
 * Iterates over all shortcodes and add symbols with
 * their corresponding callbacks for twig
 *
 * @param {TWIG_OPTIONS["shortcodes"]} shortcodes
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
 * This extends the default eleventyConfig with the
 * twig templating engine
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {TWIG_OPTIONS} twigOptions
 */
module.exports = (eleventyConfig, twigOptions) => {
  debug(eleventyConfig, twigOptions);

  if (Array.isArray(twigOptions.shortcodes)) {
    registerShortcodes(twigOptions.shortcodes);
  }

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
        // @ts-ignore somehow the namespace type is not part of the interface
        // provided for twig via @types
        namespaces: twigOptions.namespaces || {},
      });
      // @ts-ignore somehow a promise is defined in the interface
      // provided for twig via @types
      return async (data) => {
        return template.render(data);
      };
    },
  };

  eleventyConfig.addExtension("twig", extensionOptions);
  eleventyConfig.addTemplateFormats("twig");
};
