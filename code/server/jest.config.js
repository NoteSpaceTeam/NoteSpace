// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['./*'],
      '@controllers/*': ['./src/controllers/*'],
      '@databases/*': ['./src/databases/*'],
      '@src/*': ['./src/*'],
      '@domain/*': ['./src/domain/*'],
      '@services/*': ['./src/services/*'],
    },
    { prefix: '<rootDir>/' }
  ),
  transformIgnorePatterns: ['/node_modules/(?!@notespace/shared).+\\.js$'],
};
