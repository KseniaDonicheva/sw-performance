(async ( navigator) => {
  // register service worker
  try {
    const registration = await navigator.serviceWorker.register('./sw.js')
    registration ;
    console.log(`sw registered, scope: ${registration.scope}`)
  } catch (error) {
    console.log(`sw registration failed: ${error}`)
  };
  
})( navigator)