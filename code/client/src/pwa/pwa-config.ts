//import { injectConfig } from './inject-config.ts';
import { manifestConfig } from './manifest-config.ts';
import { VitePWAOptions } from 'vite-plugin-pwa';
import { workboxConfig } from './workbox-config.ts';

export const pwaConfig: Partial<VitePWAOptions> = {
  mode: 'development',
  strategies: 'generateSW',
  //injectRegister: false,
  //injectManifest: injectConfig,
  //registerType: 'prompt',
  manifest: manifestConfig,
  workbox: workboxConfig,
  devOptions: {
    enabled: true,
    navigateFallback: 'index.html',
    type: 'module',
  },
};
