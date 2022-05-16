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

Download the latest `eleventy-plugin-twig` release from github: https://github.com/factorial-io/eleventy-plugin-twig and link ([yarn link](https://classic.yarnpkg.com/lang/en/docs/cli/link/) or [npm link](http://npm.github.io/publishing-pkgs-docs/publishing/the-npm-link-command.html)) that to your project or simply install as a `node_module`:

```shellsession
$ yarn add -dev eleventy-plugin-twig
```

or

```shellsession
$ npm install --save-dev eleventy-plugin-twig
```

## Usage

For Eleventy to recognize this you have to register this as a plugin and set the templating format as well. To do so modify the `.eleventy.js` config file:

```js
const eleventy-plugin-twig = require("eleventy-plugin-twig");

module.exports = function(eleventyConfig) {
  ...
  eleventyConfig.addPlugin(eleventy-plugin-twig, TWIG_OPTIONS);
  eleventyConfig.setTemplateFormats(["twig"]);
  ...
}
```

As mentioned in the `eleventyConfig.addPlugin(eleventy-plugin-twig, TWIG_OPTIONS)` some options have to be defined. Currently `eleventy-plugin-twig` provides the following configuration object:

```js
/**
 * @typedef {Object} TWIG_OPTIONS
 * @property {object[]} [shortcodes]
 * @property {string} shortcodes[].symbol
 * @property {function():string} shortcodes[].callback
 * @property {Object.<string, string>} [namespaces]
 * @property {boolean} [cache]
 */
```

- Shortcodes: Uses `twig.extendFunction()` [Extending](https://twig.symfony.com/doc/2.x/advanced.html)
- Namespaces: Uses `Twig` built-in loaders to provide [namespaces](https://twig.symfony.com/doc/3.x/api.html#built-in-loaders)

You could use this as a starting point and customize to your individual needs:

```js
/*
 * @typedef {import("eleventy-plugin-twig").TWIG_OPTIONS} TWIG_OPTIONS
 * @type {TWIG_OPTIONS}
 */
const TWIG_OPTIONS = {
  shortcodes: [
    {
      symbol: "asset_path",
      callback: () => "build/assets/",
    },
  ],
  cache: false,
  namespaces: {
    elements: "src/include/elements",
    patterns: "src/include/patterns",
    "template-components": "src/include/template-components",
    templates: "src/include/templates",
  },
};
```

## To be done

- Proper caching
  ...

## Acknowledgements

This **Eleventy + Twig.js** plugin uses open source software and would not have been possible without the excellent work of the [Eslint](https://babeljs.io/team), [Eleventy](https://www.11ty.dev/docs/credits/), [Prettier](https://unifiedjs.com/community/member/), [debug](https://github.com/debug-js/debug) and [Twig.js](https://github.com/twigjs/twig.js/) teams! Thanks a lot!
