import { ManifestOptions } from 'vite-plugin-pwa';

export const manifestConfig: Partial<ManifestOptions> = {
  name: 'NoteSpace',
  short_name: 'NoteSpace',
  start_url: '/',
  scope: '.',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#ffffff',
  orientation: 'portrait-primary',
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
};
