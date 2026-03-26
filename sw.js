const CACHE_NAME = 'video-cache-v2';

const VIDEO_URLS = [
  '/summerlaptop/summerlaptop.thumbnail.mp4',
  '/thumbnails/macbookmockup-dearflower.mp4',
  '/thumbnails/musicchatapp-v01.mp4',
  '/thumbnails/dotyourstory-001.mp4',
];

// Cache videos on install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Cache-first for video files, network-first for everything else
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('.mp4')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;

          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
  }
});
