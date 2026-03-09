import { dirname } from "path";
import { fileURLToPath } from "url";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

// import.meta.dirname is Node >= 20.11 only; this pattern works on Node 18+.
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}", "!build/**/*", "!dist/**"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.node } },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,mts,cts,jsx,tsx}", "!build/**", "!dist/**"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx", "!build/**", "!dist/**"],
    ...pluginReact.configs.flat["recommended"],
    settings: {
      react: { version: "detect" },
      jsxRuntime: "automatic",
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
