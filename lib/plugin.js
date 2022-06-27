/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const twig = require("twig");
const { TemplatePath } = require("@11ty/eleventy-utils");
const registerFunctions = require("./functions/functions");
const registerFilters = require("./filters/filters");

/**
 * @typedef {object} FUNCTION
 * @property {string} symbol - method name for twig to register
 * @property {function(import("@11ty/eleventy").UserConfig, USER_OPTIONS, ...* ):any} callback - callback which is called by twig
 */

/**
 * @typedef {object} FILTER
 * @property {string} symbol - filter name for twig to register
 * @property {function(import("@11ty/eleventy").UserConfig, USER_OPTIONS, ...* ):any} callback - callback which is invoked by the filter
 */

/**
 * @typedef {object} TWIG_OPTIONS
 * @property {Function[]} [functions] - array of functions to extend twig
 * @property {FILTER[]} [filter] - array of filter to extend twig
 * @property {boolean} [cache] - you could enable the twig cache for whatever reasons here
 * @property {Object<string, string>} [namespaces] - define namespaces to include/extend templates more easily by "@name"
 */

/**
 * @typedef {object} USER_OPTIONS
 * @property {TWIG_OPTIONS} [twig] - twig options
 */

/**
 * Throws errors if certain required options are not part of the
 * userOptions object
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {USER_OPTIONS} userOptions
 */
const handleErrors = (eleventyConfig, userOptions) => {
  const errors = [];

  if (typeof eleventyConfig !== "object" && eleventyConfig == null) {
    errors.push(
      "Missing eleventyConfig option. Please provide a proper configuration object."
    );
  }

  if (typeof userOptions !== "object" && userOptions == null) {
    errors.push(
      "Missing userOptions option. Please provide a proper configuration object."
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
  handleErrors(eleventyConfig, userOptions);

  registerFunctions(eleventyConfig, userOptions);
  registerFilters(eleventyConfig, userOptions);

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
