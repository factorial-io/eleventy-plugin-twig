const fs = require("fs");

/**
 * This parses the manifest and returns the related asset path
 * NOTE: This is a trivial implementation and not complete yet!
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 * @param {import("../plugin").USER_OPTIONS} userOptions
 * @param {string} originalAsset
 * @returns {string}
 */
module.exports = (eleventyConfig, userOptions, originalAsset) => {
  if (!userOptions.mixManifest) return originalAsset;

  const mix = JSON.parse(
    fs.readFileSync(
      `./${userOptions.dir.output}/${userOptions.mixManifest}`,
      "utf-8"
    )
  );
  return mix[originalAsset];
};
