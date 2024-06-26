import { manifestConfig } from '@pwa/manifest-config';
import { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  mode: 'development',
  strategies: 'generateSW',
  manifest: manifestConfig,
  devOptions: {
    enabled: true,
    navigateFallback: 'index.html',
    type: 'module',
  },
};
