# [Eleventy](https://www.11ty.dev) + [Twig.js](https://github.com/twigjs/twig.js/)

<p style="font-size: 2rem">
<img
  style="margin:2rem; width:8rem; height:8rem;"
  align="center"
  width="128"
  height="128"
  alt="11ty Logo"
  src="https://camo.githubusercontent.com/124e337fb005b0e70eb3758b431b051eaf5419b3a709062fbcce6d661a6ea116/68747470733a2f2f7777772e313174792e6465762f696d672f6c6f676f2d6769746875622e737667">+
<img
  style="margin:2rem; width:8rem; height:8rem;"
  align="center"
  width="128"
  height="128"
  alt="Twig.js Logo"
  src="https://user-images.githubusercontent.com/3282350/29336704-ab1be05c-81dc-11e7-92e5-cf11cca7b344.png">
</p>

This package adds a `.twig` template engine to Eleventy that lets you use the pure JavaScript implementation of the [Twig PHP templating language ](http://twig.sensiolabs.org/) called [Twig.js](https://github.com/twigjs/twig.js/).

## Getting Started

Install the latest `@factorial/eleventy-plugin-twig` release as well as `twig` as node modules with `yarn`:

```sh
yarn add --dev @factorial/eleventy-plugin-twig twig
```

or `npm`:

```sh
npm install --save-dev @factorial/eleventy-plugin-twig twig
```

## Usage

For Eleventy to recognize this you have to **register this as a plugin**. To do so modify the `.eleventy.js` config file:

```js
const eleventyPluginTwig = require("@factorial/eleventy-plugin-twig");

module.exports = function(eleventyConfig) {
  ...
  eleventyConfig.addPlugin(eleventyPluginTwig, USER_OPTIONS);
  ...
}
```

As mentioned in the `eleventyConfig.addPlugin(eleventy-plugin-twig, USER_OPTIONS)` some options can be defined **optionally**. Currently `@factorial/eleventy-plugin-twig` provides the following configuration object:

```js
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
 * @property {Object<string, string>} [namespaces] - define namespaces to include/extend templates more easily by "@name"
 */

/**
 * @typedef {object} USER_OPTIONS
 * @property {string} mixManifest - path to the mixManifest file relative to the build folder
 * @property {ASSETS_PATH} [assetsPath] - where to find all the assets relative to the build folder
 * @property {ELEVENTY_DIRECTORIES} dir - 11ty folder decisions
 * @property {TWIG_OPTIONS} [twig] - twig options
 */
```

- Shortcodes: Uses `twig.extendFunction()` [Extending](https://twig.symfony.com/doc/2.x/advanced.html)
- Namespaces: Uses `Twig` built-in loaders to provide [namespaces](https://twig.symfony.com/doc/3.x/api.html#built-in-loaders)

You could use this as a starting point and customize to your individual needs:

```js
/**
 * @type {USER_OPTIONS} USER_OPTIONS
 */
const USER_OPTIONS = {
  twig: {
    shortcodes: [],
    namespaces: {
      elements: "src/include/elements",
      patterns: "src/include/patterns",
      "template-components": "src/include/template-components",
      templates: "src/include/templates",
    },
  },
  mixManifest: "mix-manifest.json",
  assetsPath: {
    base: "assets",
    css: "css",
    js: "js",
  },
  dir: {
    input: "src/include/templates",
    output: "build",
    layouts: "src/layouts",
    watch: "src/**/*.{css,js,twig}",
  },
};
```

## To be done

- Proper caching
  ...

## Acknowledgements

This **Eleventy + Twig.js** plugin uses open source software and would not have been possible without the excellent work of the [Eslint](https://babeljs.io/team), [Eleventy](https://www.11ty.dev/docs/credits/), [Prettier](https://unifiedjs.com/community/member/), [debug](https://github.com/debug-js/debug) and [Twig.js](https://github.com/twigjs/twig.js/) teams! Thanks a lot!

## Sponsored by

<a href="https://factorial.io"><img src="https://logo.factorial.io/color.png" width="40" height="56" alt="Factorial"></a>
