import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-unused-private-class-members': 'warn',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
    },
  },
];
