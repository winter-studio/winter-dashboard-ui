import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import vueParser from 'vue-eslint-parser'

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,ts,vue,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        parser: tseslint.parser,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error',
      'prettier/prettier': [
        'error',
        {
          // endOfLine: "auto"
        }
      ],
      'max-len': [
        'error',
        {
          code: 100,
          tabWidth: 2,
          comments: 100,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: false
        }
      ],
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'vue/custom-event-name-casing': 'off',
      'no-use-before-define': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-named-as-default-member': 'off',
      'vue/script-setup-uses-vars': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'space-before-function-paren': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/max-len': [
        'error',
        {
          code: 100,
          template: 100,
          tabWidth: 2,
          comments: 100,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: false,
          ignoreHTMLAttributeValues: false,
          ignoreHTMLTextContents: false
        }
      ],
      'vue/v-on-event-hyphenation': [
        'warn',
        'always',
        {
          autofix: true,
          ignore: []
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'kebab-case',
        {
          registeredComponentsOnly: false,
          ignores: []
        }
      ]
    }
  }
]
