const CACHE_NAME = 'devflow-v1';
const ASSETS = [
  '/',
  '/manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2592/2592317.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't fail if some assets are missing
      return Promise.allSettled(ASSETS.map(asset => cache.add(asset)));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Use a network-first strategy for the app
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
