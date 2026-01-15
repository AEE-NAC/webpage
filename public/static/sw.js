// sw.js
const CACHE_NAME = 'my-pwa-cache';
const urlsToCache = [
  '/',
  '/sector',
  '/style.css',
  'https://unpkg.com/gridjs/plugins/selection/dist/selection.umd.js',
  'https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.umd.js',
  'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css',
  '/script.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});