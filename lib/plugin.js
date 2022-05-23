/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");
const registerShortcodes = require("./shortcodes");

/**
 * @typedef {object} ELEVENTY_DIRECTORIES
 * @property {string} input - 11ty template path
 * @property {string} output - 11ty build path
 * @property {string} [includes] - 11ty includes path relativ to input
 * @property {string} [layouts] - 11ty separate layouts path relative to input
 * @property {string} [watch] - add more watchTargets to 11ty
 */

/**
 * @typedef {object} ASSETS_PATH
 * @property {string} base - base path for assets like assets/ relative to the build folder
 * @property {string} css - path to the css folder relative to the base
 * @property {string} js - path to the js folder relative to the base
 */

/**
 * @typedef {object} SHORTCODE
 * @property {string} symbol - method name for twig to register
 * @property {function(import("@11ty/eleventy").UserConfig, USER_OPTIONS, ...* ):any} callback - callback which is called by twig
 * @property {Array<string>} [requiredOptions] - options that MUST be set in the USER_OPTIONS to make that shortcode work
 */

/**
 * @typedef {object} TWIG_OPTIONS
 * @property {SHORTCODE[]} [shortcodes] - array of shortcodes
 * @property {boolean} [cache] - you could enable the twig cache for whatever reasons here
 * @property {Object<string, string>} namespaces - define namespaces to include/extend templates more easily by "@name"
 */

/**
 * @typedef {object} USER_OPTIONS
 * @property {string} mixManifest - path to the mixManifest file relative to the build folder
 * @property {ASSETS_PATH} [assetsPath] - where to find all the assets relative to the build folder
 * @property {ELEVENTY_DIRECTORIES} dir - 11ty folder decisions
 * @property {TWIG_OPTIONS} [twig] - twig options
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

  twig.cache(userOptions.twig?.cache ?? false);

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
        namespaces: userOptions.twig?.namespaces || {},
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
