import baseConfig from '../../eslint.config.js';
import reactPlugin from 'eslint-plugin-react';

export default [
  ...baseConfig,
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
];
