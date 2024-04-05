/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { pwaConfig } from './src/pwa/pwa-config';

export default defineConfig({
  publicDir: './public',
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA(pwaConfig),
  ],
  test: {
    globals: true,
    alias: {
      '@src': new URL('./src', import.meta.url).pathname,
      '@editor': new URL('./src/editor', import.meta.url).pathname,
    },
    environment: 'jsdom',
  },
});
