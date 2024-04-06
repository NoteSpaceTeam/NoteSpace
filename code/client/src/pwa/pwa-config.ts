import { injectConfig } from './inject-config';
import { manifestConfig } from './manifest-config';
import { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  strategies: 'injectManifest',
  srcDir: './src/pwa',
  filename: 'sw.ts',
  //injectRegister: false,
  injectManifest: injectConfig,
  registerType: 'autoUpdate',
  manifest: manifestConfig,
  devOptions: {
    enabled: true,
    navigateFallback: '../../index.html',
    type: 'module',
  },
};
