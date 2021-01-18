((document) => {
    const $ = document.querySelector.bind(document)
    // add image selection listener to select
    $('#image-selector').onchange = () => {
        const imgUrl = $('select').value
        if (imgUrl) {
            $('img').src = imgUrl
            //print_PerformanceEntries(imgUrl)
        }
    }
    $('#image-selector').disabled = false
})(document)
