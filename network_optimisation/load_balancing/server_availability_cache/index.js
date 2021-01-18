(async (document, navigator) => {

  const $ = document.querySelector.bind(document)

  $('#image-selector').onchange = () => {
    const imgUrl = $('select').value
    // The bumping parameter `_b` is just to avoid HTTP cache.
    imgUrl && ($('img').src = `${imgUrl}?_b=${Date.now()}`) //?_b=${Date.now()}
  }

  const enableUI = async () => {
    console.log('ui enabled')
    $('#image-selector').disabled = false
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js')
    navigator.serviceWorker.ready.then(enableUI)
    registration && console.log(`sw registered, scope: ${registration.scope}`)
  } catch (error) {
    console.log(`sw registration failed: ${error}`)
  }
 

})(document, navigator)