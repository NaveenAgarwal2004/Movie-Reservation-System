import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tsPlugin,
      'react-refresh': reactRefresh,
    },

    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'error',

      // JS
      'no-undef': 'error',
    },
  },
];
