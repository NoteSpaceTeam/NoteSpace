export default {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  paths: {
    '@src/*': ['./src/*'],
    '@editor/*': ['./src/editor/*'],
  },
};
