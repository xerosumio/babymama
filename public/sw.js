// Simple Service Worker for PWA functionality
const CACHE_NAME = 'babymama-v1'
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/account',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        
        // Fetch from network and cache for future use
        return fetch(event.request).then(fetchResponse => {
          // Only cache successful responses
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone)
            })
          }
          return fetchResponse
        })
      })
  )
})

