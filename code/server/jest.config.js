// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: pathsToModuleNameMapper(
    {
      /*Controllers*/
      '@controllers/*': ['./src/ts/controllers/*'],
      /*Databases*/
      '@databases/*': ['./src/ts/databases/*'],
      /*Others*/
      '@src/*': ['./src/ts/*'],
      '@domain/*': ['./src/ts/domain/*'],
      '@services/*': ['./src/ts/services/*'],
    },
    { prefix: '<rootDir>/' }
  ),
  transformIgnorePatterns: ['/node_modules/(?!@notespace/shared).+\\.js$'],
};
