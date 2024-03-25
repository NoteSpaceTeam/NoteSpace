// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  moduleNameMapper: pathsToModuleNameMapper({ '@src/*': ['./src/*'] }, { prefix: '<rootDir>/' }),
  transform: {}
};
