const CACHE_NAME = 'sudershan-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event

  // Only handle GET requests
  if (request.method !== 'GET') return

  // Only handle same-origin requests — never intercept Firebase/Firestore/
  // Google APIs or any other cross-origin traffic. Let the browser handle those normally.
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // For page navigations (SPA routes like /wallet, /profile, /session/...),
  // always fall back to the cached index.html if network fails
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // For other same-origin assets (JS, CSS, images), network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})