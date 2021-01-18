// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1

const toCache = require('static-to-cache')();

self.addEventListener('install', event => {
  console.log('sw installing', event)
  skipWaiting();
  event.waitUntil(async function () {
    const cache = await caches.open('views');
    await cache.addAll(toCache);
  }());
});

self.addEventListener('activate', (event) => {
  console.log('sw start activate', event)
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim()
  console.log('sw end activate')
})

//Starting stream

class IdentityStream {
  constructor() {
    let readableController;
    let writableController;

    this.readable = new ReadableStream({
      start(controller) {
        readableController = controller;
      },
      cancel(reason) {
        writableController.error(reason);
      }
    });

    this.writable = new WritableStream({
      start(controller) {
        writableController = controller;
      },
      write(chunk) {
        readableController.enqueue(chunk);
      },
      close() {
        readableController.close();
      },
      abort(reason) {
        readableController.error(reason);
      }
    });
  }
}


function streamedContent(event, url) {
  const includeUrl = new URL(url);

    const parts = [
     caches.match('./views/partials/header.html'),
     fetch(includeUrl).catch(() => caches.match('views/partials/offline.html')),
     caches.match('./views/partials/footer.html')
    ];

   const identity = new IdentityStream();

   event.waitUntil(async function() {
    for (const responsePromise of parts) {
      const response = await responsePromise;
      await response.body.pipeTo(identity.writable, { preventClose: true });
    }
    identity.writable.getWriter().close();
  }());

  console.log(identity.writable);

   return new Response(identity.readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });

}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url); // inspect request urls


  event.respondWith(async function () {
    if (url.origin = location.origin &&  /content1/.test(url.pathname) ) { // compare origins, if it is content1 stream content (reg ex?)
      return streamedContent(event, url);
    } 
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;
    return await fetch(event.request);
  }());
});


