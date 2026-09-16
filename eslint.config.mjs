import next from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...next(),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "src/**",
      ".build*/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
