/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

export default defineConfig({
  publicDir: './public',
  server: {
    port: Number.parseInt(process.env.VITE_PORT) || 5173,
  },
  plugins: [tsconfigPaths(), react()],
  build: {
    // Enable sourcemaps if needed
    // sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('slate')) return 'slate';
            return 'vendor';
          }
          if (id.includes('src')) return 'app';
        },
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  test: {
    globals: true,
    alias: {
      '@/': new URL('./src', import.meta.url).pathname,
      '@pwa': new URL('./src/pwa', import.meta.url).pathname,
      '@domain': new URL('./src/domain', import.meta.url).pathname,
      '@assets': new URL('./src/assets', import.meta.url).pathname,
      '@ui': new URL('./src/ui', import.meta.url).pathname,
      '@tests': new URL('./tests/', import.meta.url).pathname,
    },
    environment: 'jsdom',
  },
});
