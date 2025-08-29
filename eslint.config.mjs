import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: [
    "src/lib/env.js",
    "src/stories/**",
    "src/__tests__/**",
    "tests/**",
    "playwright.config.ts",
    "storybook-static/**",
    "test-results/**"
  ] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/lib/performance.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "warn",
    },
  }
];

export default eslintConfig;
