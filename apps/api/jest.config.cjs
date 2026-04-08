module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@my-monorepo/database$': '<rootDir>/../../libs/repository/src/index.ts',
    '^@my-monorepo/types$': '<rootDir>/../../libs/types/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: '../../coverage/apps/api',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/dto/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/common/filters/**/*.ts',
    '!src/common/guards/googleGuard.ts',
    '!src/common/guards/jwt-auth.guard.ts',
    '!src/common/middleware/**/*.ts',
    '!src/common/strategies/**/*.ts',
    '!src/routes/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  roots: ['<rootDir>/src'],
};
