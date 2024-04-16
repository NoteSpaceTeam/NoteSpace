/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qrcode } from 'vite-plugin-qrcode';
import { config } from 'dotenv';

config();

export default defineConfig({
  publicDir: './public',
  server: {
    port: Number.parseInt(process.env.CLIENT_PORT) || 5173,
  },
  plugins: [tsconfigPaths(), qrcode(), react() /*VitePWA(pwaConfig)*/],
  test: {
    globals: true,
    alias: {
      '@src': new URL('./src', import.meta.url).pathname,
      '@editor': new URL('./src/editor', import.meta.url).pathname,
    },
    environment: 'jsdom',
  },
});
