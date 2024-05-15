//import { injectConfig } from './inject-config';
import { manifestConfig } from '@pwa/manifest-config';
import { VitePWAOptions } from 'vite-plugin-pwa';
import { workboxConfig } from '@pwa/workbox-config';

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
