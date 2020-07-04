module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "plugins": [
    "react",
    "react-hooks",
  ],
  "globals": {
    "__PATH_PREFIX__": true,
    "graphql": false,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018,
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "rules": {
    "prettier/prettier": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    'react/react-in-jsx-scope': "off",
    "react/prop-types": 0,
  },
  "settings": {
    "react": {
      "version": "detect",
    },
    "linkComponents": [
      { "name": "Link", "linkAttribute": "to" },
    ],
  },
}
