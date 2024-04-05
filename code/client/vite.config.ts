/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  publicDir: './public',
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      mode: 'development',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith('/');
            },
            handler: 'NetworkFirst' as const,
            options: {
              cacheName: 'app-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      manifest: {
        name: 'NoteSpace',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        scope: '.',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          /* favicon */
          {
            src: '/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
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
