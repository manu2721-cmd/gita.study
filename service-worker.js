/**
 * service-worker.js — Bhagavad Gita Study Platform PWA
 * v2: network-first strategy (avoids stale content during active development).
 * Falls back to cache only when the network is unavailable (offline support).
 */

const CACHE_NAME = 'gita-study-v2';
const CORE_ASSETS = [
  './index.html',
  './nav.js',
  './manifest.json',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Network-first for everything: try fresh content first, only fall
       back to cache if the network request fails (offline mode) ── */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp && resp.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
