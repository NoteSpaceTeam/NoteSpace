self.addEventListener('install', event => {
  console.log('Service worker installing...');
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event);
});
