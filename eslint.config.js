import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in modern React/Vite
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  prettierConfig, // Always put Prettier last to disable conflicting rules
  {
    ignores: ['vendor/**', 'public/build/**', 'node_modules/**'],
  }
);
