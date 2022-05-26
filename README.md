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

## Features

- **Built-in Shortcodes**: Uses [`twig.extendFunction()`](https://twig.symfony.com/doc/2.x/advanced.html) to extend Twig
- **Twig Namespaces**: Uses `Twig` built-in loaders to provide [namespaces](https://twig.symfony.com/doc/3.x/api.html#built-in-loaders)
- **Responsive Images**: Uses [`@11ty/eleventy-twig`](https://github.com/11ty/eleventy-img) plugin to autogenerate responsive images
- **Hashed Assets**: If you have generated a manifest (e.g. with [`@factorial/eleventy-plugin-fstack`](https://github.com/factorial-io/eleventy-plugin-fstack)) you could let eleventy replace unhashed assets like `css/js` automatically with their hashed versions

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
 * @property {IMAGES} [images] - options for 11tys image processing
 * @property {ELEVENTY_DIRECTORIES} dir - 11ty folder decisions
 * @property {TWIG_OPTIONS} [twig] - twig options
 */
```

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
  assets: {
    root: "src",
    base: "assets",
    css: "css",
    js: "js",
    images: "images",
  },
  images: {
    widths: [300, 600, 1000, 1800],
    formats: ["webp", "avif", "jpeg"],
    additionalAttributes: "",
  },
  dir: {
    output: "build",
    src: "src",
    input: "src/include/templates",
    layouts: "src/layouts",
    watch: "src/**/*.{css,js,twig}",
  },
};
```

## To be done

- Proper caching
- Make features optional
- ...

## Acknowledgements

This **Eleventy + Twig.js** plugin uses open source software and would not have been possible without the excellent work of the [Eslint](https://babeljs.io/team), [Eleventy](https://www.11ty.dev/docs/credits/), [Prettier](https://unifiedjs.com/community/member/), [debug](https://github.com/debug-js/debug) and [Twig.js](https://github.com/twigjs/twig.js/) teams! Thanks a lot!
