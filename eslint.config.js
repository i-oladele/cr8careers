import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'src/imports/**', 'src/app/components/ui/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { console: 'readonly', fetch: 'readonly', process: 'readonly', URL: 'readonly' },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        Blob: 'readonly', File: 'readonly', Image: 'readonly', URL: 'readonly',
        crypto: 'readonly', document: 'readonly', window: 'readonly', localStorage: 'readonly',
        console: 'readonly', confirm: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
);
