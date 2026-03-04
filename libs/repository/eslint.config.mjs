import baseConfig from '../../eslint.config.js';

export default [
  { ignores: ['src/lib/generated/**'] },
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
];
