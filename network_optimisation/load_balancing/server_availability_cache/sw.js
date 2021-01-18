const SERVER_HOST = 'http://localhost'
const NUMBER_OF_SERVERS = 3
let actualServerNumber = 0

const actualServerUrl = serverNumber => `${SERVER_HOST}:${5000 + serverNumber}`
const defaultServer = 'http://localhost:8080'

// A request is a resource request if it is a `GET` for something inside `images`.
const isResourceRequest = request => {
  return request.url.match(/\/images\/.*$/) && request.method === 'GET'
}

const handleImageRequest = async request => {

  let tries = 0
  while (tries < 10) {
    try {
      
        // post message to console from sw.js:
      const channel = new BroadcastChannel('sw-messages');
      channel.postMessage({serverNumber: actualServerNumber});
      console.log('get image from server', actualServerNumber)
      const url = new URL(request.url)
      const fetchController = new AbortController()
      // we are waiting 50 ms otherwise abort the fetch 
      const timeoutHandle = setTimeout(() => {
        return fetchController.abort()
      }, 50)
      // we got it below 50 ms
      const serverNumber = actualServerNumber
      actualServerNumber = (actualServerNumber + 1) % NUMBER_OF_SERVERS
      const response = await fetch(`${actualServerUrl(serverNumber)}${url.pathname}`, {signal: fetchController.signal})
      clearTimeout(timeoutHandle)
      const cache = await caches.open('img_cache');
      cache.add(response.url);
      performance.mark('end');
      var swPerf = performance.measure('total', 'start', 'end');
      channel.postMessage({SWScript_duration: swPerf.duration});
      return response
      
    } catch (exception) {
      if (exception instanceof DOMException) {
        console.log('aborted', exception)
      } else {
        console.log(`try ${tries}`, exception)
        tries++
      }
    }
  }
}

// The code in `oninstall` and `onactivate` force the service worker to
// control the clients ASAP.
self.oninstall = function(event) {
  console.log('oninstall')
  event.waitUntil(self.skipWaiting())
}

self.onactivate = function(event) {
  console.log('onactivate')
  event.waitUntil(self.clients.claim())
}


self.onfetch = event => {
  const request = event.request

  console.log('onfetch', request.url)
  if (isResourceRequest(request)) {
    console.log('image request')
    //event.respondWith(handleImageRequest(request))   
    event.respondWith(async function () {
      performance.mark('start');
      var serverNumber = actualServerNumber
      const cachedResource  = (request.url).replace(defaultServer, actualServerUrl(serverNumber))  
      const cachedResponse = await caches.match(cachedResource);
      if (cachedResponse) { console.log("served from cache " + cachedResource); actualServerNumber++; return cachedResponse;} 
     else {
     return await handleImageRequest(request)}
    
    }());
  } else {
    console.log('other request')
    event.respondWith(fetch(request))
  }

}

 







