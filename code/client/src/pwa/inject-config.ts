import { CustomInjectManifestOptions } from 'vite-plugin-pwa';

export const injectConfig: Partial<CustomInjectManifestOptions> = {
  minify: false,
  enableWorkboxModulesLogs: true,
};
