import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-empty-interface': 'error',
    },
  },
];
