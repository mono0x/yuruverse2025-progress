module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ["react", "react-hooks", "simple-import-sort"],
  globals: {
    __PATH_PREFIX__: true,
    graphql: false,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "sort-imports": "off",
    "simple-import-sort/sort": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier/react",
      ],
      plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "simple-import-sort",
      ],
      rules: {
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": 0,
        "sort-imports": "off",
        "simple-import-sort/sort": "error",
      },
    },
  ],
}
