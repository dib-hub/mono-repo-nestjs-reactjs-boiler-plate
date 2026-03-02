import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
];
