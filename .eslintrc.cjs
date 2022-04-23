/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports ={
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    // Add under other rules
    "@vue/prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "plugins": [
  ],
  "rules": {
  }
}
