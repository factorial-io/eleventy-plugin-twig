import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	// Global settings
	{
		files: ["index.js", "lib/**/*.{js,mjs}"],
		plugins: {
			jsdoc,
		},
		rules: {
			...js.configs.recommended.rules,
			...jsdoc.configs["flat/recommended"].rules,
			"jsdoc/require-jsdoc": [
				"warn",
				{
					require: {
						MethodDefinition: true,
					},
				},
			],
			"jsdoc/require-param-description": "off",
			"jsdoc/require-returns-description": "off",
		},
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
	},

];
