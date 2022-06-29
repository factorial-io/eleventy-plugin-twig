const Image = require("@11ty/eleventy-img");
const path = require("path");

/**
 * Throws errors if certain required options are not part of the
 * userOptions object or shortcode options
 *
 * @param {object} options
 * @param {import("../plugin").USER_OPTIONS} options.userOptions
 * @param {string} options.filename
 * @param {string} options.alt
 */
const handleErrors = ({ userOptions, filename, alt }) => {
  const errors = [];

  if (filename.length === 0) {
    errors.push("Missing image src\n");
  }

  if (alt === undefined) {
    errors.push(`Missing alt on image from: ${filename}\n`);
  }

  if (!userOptions.dir.output) {
    errors.push(`userOptions.dir.output is not defined`);
  }

  if (!userOptions.assets.root) {
    errors.push(`userOptions.assets.root is not defined`);
  }

  if (!userOptions.assets?.base) {
    errors.push(`userOptions.assets.base is not defined`);
  }

  if (!userOptions.assets?.images) {
    errors.push(`userOptions.assets.images is not defined`);
  }

  if (!userOptions.images?.widths?.length) {
    errors.push(
      `userOptions.images.widths should include at least one width (for example [300, 600])`
    );
  }

  if (!userOptions.images?.formats?.length) {
    errors.push(
      `userOptions.images.formats should include at least one format (for example ["webp", "avif"])`
    );
  }

  if (!userOptions.images?.formats?.includes("jpeg")) {
    errors.push(`userOptions.images.formats must include "jpeg"`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

/**
 * Generates responsive images
 *
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {string} filename
 * @param {string} alt
 * @param {string[]} [classes]
 * @returns {string}
 */
module.exports = (eleventyConfig, userOptions, filename, alt, classes) => {
  handleErrors({ userOptions, filename, alt });

  const options = {
    widths: userOptions.images.widths,
    formats: userOptions.images.formats,
    outputDir: path.join(
      userOptions.dir.output,
      userOptions.assets.base,
      userOptions.assets.images
    ),
    useCache: false,
    urlPath: `/${userOptions.assets.base}/${userOptions.assets.images}`,
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

  const classAttribute = classes ? `class="${classes.join(" ")}"` : "";
  const additionalAttributes = userOptions.images.additionalAttributes ?? "";
  const imageElement = `<img
    src="${lowsrc.url}"
    width="${highsrc.width}"
    height="${highsrc.height}"
    alt="${alt}"
    ${classAttribute} ${additionalAttributes}>`;

  return `<picture>
    ${sourceElements}
    ${imageElement}
  </picture>`;
};
