/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const debug = require("debug")("Eleventy:TwigTemplate");
const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");
const registerShortcodes = require("./shortcodes");

/**
 *
 * @typedef {object} shortcode
 * @property {string} symbol
 * @property {function():any} callback
 * @property {Array<string>} [requiredOptions]
 */

/**
 * @typedef {object} twigOptions
 * @property {string} [mixManifest]
 * @property {string} [assetFolder]
 * @property {Array.<shortcode>} [shortcodes]
 * @property {Object<string, string>} [namespaces]
 * @property {boolean} [cache]
 */

/**
 * This extends the default eleventyConfig with the
 * twig templating engine
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {twigOptions} twigOptions
 */
module.exports = (eleventyConfig, twigOptions = {}) => {
  debug(twigOptions);

  registerShortcodes(eleventyConfig, twigOptions);

  twig.cache(twigOptions.cache ?? false);

  const extensionOptions = {
    outputFileExtension: "html",

    /**
     * @param {string} inputPath
     * @returns {string}
     */
    getInstanceFromInputPath: (inputPath) => {
      const requirePath = TemplatePath.absolutePath(inputPath);
      return require(requirePath);
    },

    /**
     * @param {string} inputContent
     * @param {string} inputPath
     * @returns {Promise<string>}
     */
    compile: async (inputContent, inputPath) => {
      const template = twig.twig({
        data: inputContent,
        path: `./${inputPath}`,
        // @ts-ignore somehow the namespace type is not part of the interface
        // provided for twig via @types
        allowInlineIncludes: true,
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
