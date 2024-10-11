module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
    "plugin:@tanstack/query/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "off",
  },
};
