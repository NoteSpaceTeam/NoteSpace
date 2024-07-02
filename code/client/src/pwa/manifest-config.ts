import { ManifestOptions } from 'vite-plugin-pwa';

export const manifestConfig: Partial<ManifestOptions> = {
  name: 'NoteSpace',
  short_name: 'NoteSpace',
  description: 'A multi-platform real-time note-taking app',
  start_url: '/',
  scope: '.',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#ffffff',
  orientation: 'portrait-primary',
  icons: [
    {
      src: 'pwa-64x64.png',
      sizes: '64x64',
      type: 'image/png',
    },
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};
