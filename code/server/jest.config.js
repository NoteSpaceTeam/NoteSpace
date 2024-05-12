// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['./*'],
      '@controllers/*': ['./src/ts/controllers/*'],
      '@databases/*': ['./src/ts/databases/*'],
      '@src/*': ['./src/ts/*'],
      '@domain/*': ['./src/ts/domain/*'],
      '@services/*': ['./src/ts/services/*'],
    },
    { prefix: '<rootDir>/' }
  ),
  transformIgnorePatterns: ['/node_modules/(?!@notespace/shared).+\\.js$'],
};
