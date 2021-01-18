(async (document) => {

   // Loading of image files 
    
   const image = num => {
    for (let i = 1; i < num + 1; i++) { 
      const imgPath = "../views/images/1.jpg"
      const row = document.getElementById("row")
      fetch(imgPath)  
      .then(response => response.blob())
      .then(function(response) {
        // console.log('response', response);
      var objectURL = URL.createObjectURL(response);
      const img = document.createElement("img")
      row.appendChild(img)
      img.src = objectURL;
  
    }); 
    }
  }
  image(30)
    })(document)