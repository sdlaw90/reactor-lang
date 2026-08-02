import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
      "public/**",
      "docs/**",
      "tts-output/**",
      "tts-probe/**",
    ],
  },
  ...nextCoreWebVitals,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      "no-undef": "error",
      // eslint-config-next 16 ships eslint-plugin-react-hooks v7 (React Compiler era).
      // These three rules are new and fire on pre-existing code across the app.
      // Kept visible as warnings; cleaning them up is its own task, not part of the
      // Next 16 / React 19 upgrade. See docs/changelog/unreleased.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/immutability": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
