import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  /* Disable incompatible library warning for data-table.tsx
   * useReactTable on TanStack Table is a known third-party incompatibility
   * so we disable the warning for this file
   */
  {
    files: ["**/data-table.tsx"],
    rules: { "react-hooks/incompatible-library": "off" },
  },
]);

export default eslintConfig;
