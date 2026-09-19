import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'dist/'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: { ...globals.browser, ...globals.es2021, ...globals.node },
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      ...importPlugin.flatConfigs.typescript.settings,
      react: { version: 'detect' },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs['flat/recommended'][1].rules,
      ...tsPlugin.configs['flat/recommended'][2].rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...importPlugin.flatConfigs.errors.rules,
      ...importPlugin.flatConfigs.warnings.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-unresolved': ['error', { ignore: ['^@storybook/react$'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
    },
  },
];
