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

  // Never touch navigation requests (page loads/refreshes on any route
  // like /wallet, /profile, /session/...). Let the browser and Vercel's
  // own routing handle these directly — this avoids any risk of the
  // service worker returning an invalid response.
  if (request.mode === 'navigate') return

  // Only handle same-origin requests — never intercept Firebase/Firestore/
  // Google APIs or any other cross-origin traffic.
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // For static assets (JS, CSS, images), network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})