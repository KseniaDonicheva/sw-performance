// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 2

const CONNECTION_IMAGE_QUALITY_MAPPER = {
  'slow-2g': '2g'
}

const precache = [
  'images/2g/example.jpg',
]
const channel = new BroadcastChannel('sw-messages');

self.addEventListener('install', event => {
  const connectionType = navigator.connection.effectiveType
  if (connectionType == '4g') {
    channel.postMessage('good connection, we do not precache')
    console.log('good connection, we do not precache')
  } else {
    event.waitUntil(async function () {
      const cache = await caches.open('precache')
      await cache.addAll(precache)
      // post message to console from sw.js:
      channel.postMessage('bad connection, precache done');
      console.log('bad connection, precache done')
    }())
  }
  self.skipWaiting()
  console.log('sw end install')
})

self.addEventListener('activate', (event) => {
  console.log('sw start activate', event)
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim()
  console.log('sw end activate')
})

self.addEventListener('fetch', event => {
  if (/\.jpg$|.png$|.gif$|.webp$/.test(event.request.url)) {
    const connectionType = navigator.connection.effectiveType
    const imageQuality = CONNECTION_IMAGE_QUALITY_MAPPER[connectionType] || connectionType || '4g'
    const imageURLParts = event.request.url.split('/')
    imageURLParts.splice(imageURLParts.length - 1, 0, `${imageQuality}`)
    const finalImageURL = new URL(imageURLParts.join('/'))
    channel.postMessage(JSON.stringify(finalImageURL));
    event.respondWith(async function () {
      const cachedResponse = await caches.match(finalImageURL)
      channel.postMessage(`cached: ${!!cachedResponse}`)
      console.log(`cached: ${!!cachedResponse}`)
      if (cachedResponse) return cachedResponse
      try {
        console.log(`fetching ${finalImageURL}`)
        return await fetch(finalImageURL)
      } catch (err) {
        console.log('you are offline and the image is not cached')
      }
    }())
  }
})
