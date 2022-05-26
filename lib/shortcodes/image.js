const Image = require("@11ty/eleventy-img");
const path = require("path");
/**
 * Generates responsive images
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {...Array} imageOptions
 * @returns {string}
 */
module.exports = (eleventyConfig, userOptions, ...[filename, alt, classes]) => {
  if (filename.length === 0) {
    throw new Error("Missing image src\n");
  }
  if (alt === undefined) {
    throw new Error(`Missing alt on image from: ${filename}\n`);
  }
  if (!userOptions.dir.output) {
    throw new Error(`userOptions.dir.output is not defined`);
  }
  if (!userOptions.assets.root) {
    throw new Error(`userOptions.assets.root is not defined`);
  }
  if (!userOptions.assets?.base) {
    throw new Error(`userOptions.assets.base is not defined`);
  }
  if (!userOptions.assets?.images) {
    throw new Error(`userOptions.assets.image is not defined`);
  }
  if (!userOptions.images?.widths || !userOptions.images?.widths.length) {
    throw new Error(
      `userOptions.images.widths should include at least one width (for example [300, 600])`
    );
  }
  if (!userOptions.images?.formats || !userOptions.images?.formats.length) {
    throw new Error(
      `userOptions.images.formats should include at least one format (for example ["webp", "avif"])`
    );
  }

  const options = {
    widths: userOptions.images.widths,
    formats: userOptions.images.formats,
    outputDir: path.join(
      userOptions.dir.output,
      userOptions.assets.base,
      userOptions.assets.images
    ),
    urlPath: path.join(userOptions.assets.base, userOptions.assets.images),
  };
  const currentPath = path.join(
    userOptions.assets.root,
    userOptions.assets.base,
    userOptions.assets.images,
    filename
  );

  Image(currentPath, options);

  const metadata = Image.statsSync(currentPath, options);
  const lowsrc = metadata.jpeg[0];
  const highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  const sourceElements = `${Object.values(metadata)
    .map((imageFormat) => {
      return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map((entry) => entry.srcset)
        .join(", ")}">`;
    })
    .join("\n")}`;
  const imageElement = `<img src="${lowsrc.url}" width="${
    highsrc.width
  }" height="${highsrc.height}" alt="${alt}" ${
    classes ? `class="${classes.join(" ")}"` : ""
  }${userOptions.images.additionalAttributes}>`;

  return `<picture>${sourceElements}${imageElement}</picture>`;
};
