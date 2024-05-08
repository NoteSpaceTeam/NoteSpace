import { GenerateSWOptions } from 'workbox-build';

export const workboxConfig: Partial<GenerateSWOptions> = {
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/'),
      handler: async ({ event }) => {
        console.log('Fetching:', event);
        try {
          const resp = await fetch(event.request);
          console.log('Fetched:', resp);
          return resp;
        } catch (error) {
          // Fetch failed, fetch from cache
          console.error('Error:', error);
          return caches.match(event.request);
        }
      },
      options: {
        cacheName: 'app-cache',
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // api calls to localhost:8080
    {
      urlPattern: ({ url }) => url.origin === 'http://localhost:8080',
      handler: async ({ event }) => {
        console.log('Fetching:', event);
        try {
          const resp = fetch(event.request);
          console.log('Fetched:', resp);
          return resp;
        } catch (error) {
          console.error('Error:', error);
          const cache = await caches.open('api-cache');
          const cachedResponse = await cache.match(event.request);
          return cachedResponse;
        }
      },
      options: {
        cacheName: 'api-cache',
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60,
        },
      },
    },
  ],
  //importScripts: ['./service-worker.ts'],
  //cleanupOutdatedCaches: true,
};
