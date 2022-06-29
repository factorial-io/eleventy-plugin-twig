# [Eleventy](https://www.11ty.dev) + [Twig.js](https://github.com/twigjs/twig.js/)

<p style="font-size: 2rem">
<img
  style="margin:2rem; width:8rem; height:8rem;"
  align="center"
  width="128"
  height="128"
  alt="Eleventy Logo"
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

- Use **functions** and [`twig.extendFunction()`](https://twig.symfony.com/doc/2.x/advanced.html#functions) to extend Twig with custom functions
- Use **filters** and [`twig.extendFilter()`](https://twig.symfony.com/doc/2.x/advanced.html#filters) to extend Twig with custom filters
- Uses `Twig` built-in loaders to provide **[namespaces](https://twig.symfony.com/doc/3.x/api.html#built-in-loaders)**

Furthermore please take a look at some of the **sample implementations** for functions and filters to showcase how [Eleventy](https://www.11ty.dev/docs/credits/) and [Twig.js](https://github.com/twigjs/twig.js/) can work together:

- **[Responsive Images](lib/functions/README.md)**: Uses [`@11ty/eleventy-img`](https://github.com/11ty/eleventy-img) plugin to autogenerate responsive images
- **[Hashed Assets](lib/functions/README.md)**: If you have generated a manifest (e.g. with [`@factorial/eleventy-plugin-fstack`](https://github.com/factorial-io/eleventy-plugin-fstack)) you could let Eleventy replace unhashed assets like `css/js` automatically with their hashed versions

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
```

You could use this as a starting point and customize to your individual needs:

```js
/**
 * @type {USER_OPTIONS} USER_OPTIONS
 */
const USER_OPTIONS = {
  twig: {
    namespaces: {
      // for example:
      // elements: "src/include/elements",
      // patterns: "src/include/patterns",
      // "template-components": "src/include/template-components",
      // templates: "src/include/templates",
    },
    filters: [
      // see filters/README.md
    ],
    functions: [
      // see functions/README.md
    ],
  },
};
```

## To be done

- Proper caching
- Make `twig.exports.extendTag()` possible

## Acknowledgements

This **Eleventy + Twig.js** plugin uses open source software and would not have been possible without the excellent work of the [Eslint](https://babeljs.io/team), [Eleventy](https://www.11ty.dev/docs/credits/), [Prettier](https://unifiedjs.com/community/member/), [debug](https://github.com/debug-js/debug) and [Twig.js](https://github.com/twigjs/twig.js/) teams! Thanks a lot!

## Sponsored by

<a href="https://factorial.io"><img src="https://logo.factorial.io/color.png" width="40" height="56" alt="Factorial"></a>
