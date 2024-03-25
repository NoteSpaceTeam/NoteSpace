// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: pathsToModuleNameMapper({ '@src/*': ['./src/*'] }, { prefix: '<rootDir>/' }),
  transformIgnorePatterns: ['/node_modules/(?!@notespace/shared).+\\.js$'],
};
