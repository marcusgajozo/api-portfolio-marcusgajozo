/** @jest-config-loader ts-node */

import { defineConfig } from 'jest';

export default defineConfig({
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
});
