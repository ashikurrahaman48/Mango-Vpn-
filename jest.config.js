
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/config/',
    '.*/models/.*', // Often models are simple schemas, can be excluded
  ],
  // Mocks for Next.js API routes which expect req/res objects
  // This helps supertest work with the handler functions directly
  moduleNameMapper: {
    '^next$': '<rootDir>/tests/mocks/next.js',
    'next/router': '<rootDir>/tests/mocks/next/router.js',
  },
  testTimeout: 30000, // Increase timeout for DB operations
};
