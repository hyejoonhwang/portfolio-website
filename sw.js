// Retired. This worker used to cache .mp4 files, but the Cache API can't
// answer the byte-range requests browsers make for video, so videos failed
// to load while it was in control. The pages no longer register it; this
// version only cleans up browsers that still have the old one: it deletes
// its cache, unregisters itself and reloads open pages once. Video caching
// is handled by the Cache-Control headers in vercel.json.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) await caches.delete(name);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window' })) {
      client.navigate(client.url);
    }
  })());
});
