// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: pathsToModuleNameMapper({
    /*Controllers*/
    "@controllers/*": ["./src/controllers/*"],
    /*Databases*/
    "@database/*": ["./src/database/*"],
    /*Others*/
    '@src/*': ['./src/*'],
    "@domain/*": ["./src/domain/*"],
    "@services/*": ["./src/services/*"],
  }, { prefix: '<rootDir>/' }),
  transformIgnorePatterns: ['/node_modules/(?!@notespace/shared).+\\.js$'],
};
