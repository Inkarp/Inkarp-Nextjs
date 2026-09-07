import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-audit/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party bundles shipped as static assets. Linting minified vendor
    // code produces noise we cannot act on (e.g. three.js's WebGL
    // `useProgram` call being flagged as a misused React Hook).
    "public/**",
  ]),
]);

export default eslintConfig;
