# Extend function examples

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

## Side note:

Please read the [Twig](https://twig.symfony.com/doc/2.x/advanced.html#extending-twig) Documentation about how to extend twig properly first. Checkout the [Twig.js] documentation for `extendFunction()` as well. Also notice that functions should be used for content generation and frequent use whereas filters are more for value transformations in general.

## `mix`

Its most likely that your project uses hashed assets. Therefore you have to include them somehow dynamically and Eleventy as well as Twig should be aware of this.

Lets define a function `mix()` which returns the hashed path to the given non hashed asset like:

```twig
{{ mix("/path/to/unhased/asset.extension") }} --> will result in /path/to/hashed/asset.hash.extension
```

There is an example implementation in `examples/mix.js`. To activate that implementation you have to add this module to the `userOptions.twig.functions` in your Eleventy configuration file and define the `userOptions.mixManifest` as well as the `userOptions.dir.output` property optionally like:

```js
const mix = require("@factorial/eleventy-plugin-twig/functions/examples/mix");

const userOptions = {
  twig: {
    functions: [
      symbol: "mix",
      callback: mix,
    ]
  }
  mixManifest: "mixManifest.json" // path relative to the output directory
  dir: {
    output: "build" // optionally, eleventy has a default output folder "_site", see https://www.11ty.dev/docs/config/#output-directory
  }
}
```

## `asset_path`

If you have to reference lots of assets (e.g. images etc...) or have different environments like storybook / miyagi / prod / staging / dev etc. then its sometimes helpful to define a helper function like `asset_path()` with returns the path to your assets folder in the specific environment.

For this to work lets define a `asset_path()` function which prefixes a given path with the `userOptions.assets.base` path like:

```twig
{{ asset_path()/subfolder/filename.extension }} --> will result in /path/to/your/assets/subfolder/filename.extension
```

There is an example implementation in `examples/assetPath.js`. To activate that implementation you have to add this module to the `userOptions.twig.functions` in your Eleventy configuration file and define the `userOptions.assets.base` property like:

```js
const assetPath = require("@factorial/eleventy-plugin-twig/functions/examples/assetPath");

const userOptions = {
  twig: {
    functions: [
      symbol: "asset_path",
      callback: assetPath,
    ]
  },
  assets: {
    base: "assets" // base folder relative to the build folder; could be defined by environmetal variables for different szenarios as well
  }
}
```

## `image`

Eleventy comes with a great responsive image plugin called [@11ty/eleventy-img](https://github.com/11ty/eleventy-img). This autogenerates different file formats and sizes for those images included in your templates.

Lets define a `image()` function which returns a proper `<picture>` element with `<source>` elements:

```twig
{{ image("src", "alt", "classes") }} --> will result in a <picture> element with different <source> elements for each format and defined widths
```

First install the latest `@11ty/eleventy-img` release as a node module with `yarn`:

```sh
yarn add --dev @11ty/eleventy-img
```

or `npm`:

```sh
npm install --save-dev @11ty/eleventy-img
```

You can find an example implementation in `examples/image.js`. To activate that implementation you have to add this module to the `userOptions.twig.functions` in your eleventy configuration file, as well as a couple of other necessary properties like:

```js
const image = require("@factorial/eleventy-plugin-twig/functions/examples/image");

const userOptions = {
  twig: {
    function: [
      symbol: "image",
      callback: image,
    ]
  },
  assets: {
    root: "src", // path to the root folder from projects root (e.g. src)
    base: "assets", // base path for assets relative to the root folder (e.g. assets)
    images: "images", // path to the image folder relative to the base (e.g. images)
  },
  images: {
    widths: [300, 600, 900], // those image sizes will be autogenereated / aspect-ratio will be respected
    formats: ["webp", "avif"], // jpeg/avif/webp/png/gif
    additionalAttributes: "" // optionally - those attributes will be added to the image element
  }
}
```
