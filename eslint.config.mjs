import globals from "globals";
import pluginJs from "@eslint/js";
import pluginStylistic from "@stylistic/eslint-plugin-js";

export default [
  {
    ignores: ["dist/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
    ...pluginJs.configs.recommended,
    plugins: {
      "@stylistic/js": pluginStylistic,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      // "@stylistic/js/linebreak-style": ["error", "unix"],
      // "@stylistic/js/quotes": ["error", "double"],
      // "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
    },
  },
];
