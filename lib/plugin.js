/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");
const registerShortcodes = require("./shortcodes/shortcodes");

/**
 * @typedef {object} ELEVENTY_DIRECTORIES
 * @property {string} input - Eleventy template path
 * @property {string} output - Eleventy build path
 * @property {string} [includes] - Eleventy includes path relativ to input
 * @property {string} [layouts] - Eleventy separate layouts path relative to input
 * @property {string} [watch] - add more watchTargets to Eleventy
 */

/**
 * @typedef {object} ASSETS
 * @property {string} root - path to the root folder from projects root (e.g. src)
 * @property {string} base - base path for assets relative to the root folder (e.g. assets)
 * @property {string} css - path to the css folder relative to the base (e.g. css)
 * @property {string} js - path to the js folder relative to the base (e.g. js)
 * @property {string} images - path to the image folder relative to the base (e.g. images)
 */

/**
 * @typedef {object} IMAGES
 * @property {Array<number>} widths - those image sizes will be autogenereated / aspect-ratio will be respected
 * @property {Array<import("@11ty/eleventy-img").ImageFormatWithAliases>} formats - jpeg/avif/webp/png/gif
 * @property {string} additionalAttributes - those attributes will be added to the image element
 */

/**
 * @typedef {object} SHORTCODE
 * @property {string} symbol - method name for twig to register
 * @property {function(import("@11ty/eleventy").UserConfig, USER_OPTIONS, ...* ):any} callback - callback which is called by twig
 */

/**
 * @typedef {object} TWIG_OPTIONS
 * @property {SHORTCODE[]} [shortcodes] - array of shortcodes
 * @property {boolean} [cache] - you could enable the twig cache for whatever reasons here
 * @property {Object<string, string>} [namespaces] - define namespaces to include/extend templates more easily by "@name"
 */

/**
 * @typedef {object} USER_OPTIONS
 * @property {string} mixManifest - path to the mixManifest file relative to the build folder
 * @property {ASSETS} [assets] - where to find all the assets relative to the build folder
 * @property {IMAGES} [images] - options for Eleventys image processing
 * @property {ELEVENTY_DIRECTORIES} dir - Eleventy folder decisions
 * @property {TWIG_OPTIONS} [twig] - twig options
 */

/**
 * Throws errors if certain required options are not part of the
 * userOptions object
 *
 * @param {USER_OPTIONS} userOptions
 */
const handleErrors = (userOptions) => {
  const errors = [];
  if (typeof userOptions !== "object" && userOptions == null) {
    errors.push(
      "Missing userOptions option. Please provide a proper configuration object."
    );
  }

  if (!userOptions.mixManifest) {
    errors.push("userOptions.mixManifest is not defined.");
  }

  if (!userOptions.mixManifest?.match(/^[\w-_]+.json$/)) {
    errors.push(
      "userOptions.mixManifest does not provide a valid filename (for example 'foobar.json')."
    );
  }

  if (userOptions.mixManifest && !userOptions.assets?.base) {
    errors.push(
      "userOptions.mixManifest requires userOptions.assetsPath.base to be defined."
    );
  }

  if (!userOptions.dir) {
    errors.push("userOptions.dir is not defined.");
  }

  if (userOptions.dir && !userOptions.dir.output) {
    errors.push(
      "userOptions.dir requires userOptions.dir.output to be defined."
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

/**
 * This extends the default eleventyConfig with the
 * twig templating engine
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {USER_OPTIONS} userOptions
 */
module.exports = (eleventyConfig, userOptions) => {
  handleErrors(userOptions);

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
