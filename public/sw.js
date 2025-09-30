// Simple Service Worker for PWA functionality
const CACHE_NAME = 'babymama-v1'
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/account'
]

async function getManifestUrl() {
  try {
    // Try common manifest paths
    const manifestPaths = [
      '/manifest.webmanifest',
      '/manifest.json',
      '/site.webmanifest'
    ]
    
    for (const path of manifestPaths) {
      try {
        const response = await fetch(path, { method: 'HEAD' })
        if (response.ok) {
          return path
        }
      } catch (e) {
        // Continue to next path
      }
    }
    return null
  } catch (e) {
    return null
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      
      // Cache static URLs
      await cache.addAll(staticUrlsToCache)
      
      // Try to cache manifest if found
      const manifestUrl = await getManifestUrl()
      if (manifestUrl) {
        try {
          await cache.add(manifestUrl)
          console.log('Manifest cached:', manifestUrl)
        } catch (e) {
          console.log('Failed to cache manifest:', e)
        }
      }
    })()
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

