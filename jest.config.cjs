/**
 * Jest configuration for ESM TypeScript project
 * @type {import('jest').Config}
 */
module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Map .js imports to .ts source files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Transform TypeScript files with ts-jest
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          // Override tsconfig for tests to ensure compatibility with Jest
          module: "NodeNext",
          moduleResolution: "NodeNext",
          target: "ES2022",
          isolatedModules: true
        }
      },
    ],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};