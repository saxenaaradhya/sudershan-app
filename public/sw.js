const CACHE_NAME = 'sudershan-v1'

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// No fetch handler — the service worker no longer intercepts any requests.
// The browser and Vercel handle all caching and routing normally.