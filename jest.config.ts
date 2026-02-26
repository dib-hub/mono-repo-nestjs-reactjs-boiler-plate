module.exports = {
  displayName: 'root',
  projects: [
    '<rootDir>/apps/api',
    '<rootDir>/apps/web',
    '<rootDir>/apps/api-e2e',
    '<rootDir>/apps/web-e2e',
    '<rootDir>/libs/repository',
    '<rootDir>/libs/types',
  ],
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
};
