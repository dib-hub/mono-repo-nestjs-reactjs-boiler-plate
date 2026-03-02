import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
];
