/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");
const registerShortcodes = require("./shortcodes");

/**
 * @typedef {object} ELEVENTY_DIRECTORIES
 * @property {string} input
 * @property {string} output
 * @property {string} [includes]
 * @property {string} [layouts]
 * @property {string} [watch]
 */

/**
 * @typedef {object} ASSETS_PATH
 * @property {string} base
 * @property {string} css
 * @property {string} js
 */

/**
 * @typedef {object} SHORTCODE
 * @property {string} symbol
 * @property {function(import("@11ty/eleventy").UserConfig, USER_OPTIONS, ...* ):any} callback
 * @property {Array<string>} [requiredOptions]
 */

/**
 * @typedef {object} TWIG_OPTIONS
 * @property {SHORTCODE[]} [shortcodes]
 * @property {boolean} [cache]
 * @property {Object.<string, string>} namespaces
 */

/**
 * @typedef {object} USER_OPTIONS
 * @property {string} mixManifest,
 * @property {ASSETS_PATH} [assetsPath]
 * @property {ELEVENTY_DIRECTORIES} dir
 * @property {TWIG_OPTIONS} [twig]
 */

/**
 * This extends the default eleventyConfig with the
 * twig templating engine
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  registerShortcodes(eleventyConfig, userOptions);

  twig.cache(userOptions.twig.cache ?? false);

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
        namespaces: userOptions.namespaces || {},
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
