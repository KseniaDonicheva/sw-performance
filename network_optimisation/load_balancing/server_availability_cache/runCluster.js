const { Cluster } = require('puppeteer-cluster');
const fs = require ('fs');


(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 100,
    puppeteerOptions: {
        headless:true,
        //monitor: true,
    },
    workerCreationDelay: 200,

  });

  function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
let concurrency = 100;
 
    await cluster.task(async ({ page, data: url }) => {
    await page.on('console', consoleObj => {
            const text = consoleObj.text();
            console.log('[Page] '+text);           
      });
    await page.goto(url, {waitUntil: 'load'});
    await Sleep(5000);

    for (let k = 1; k<=3; k++) {
        
        await page.select("select#image-selector", "images/"+`${k}`+".jpg");
        await Sleep(5000);
        // wait until the image is fully loaded in case of delay
        const resourceTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType('resource')))
        const resourceTiming = JSON.parse(resourceTimingJson)
        const logoResourceTiming = resourceTiming.find(element => element.name.includes(`${k}`+'.jpg'))        
        properties = ["fetchStart", "responseEnd"];
        const imgTiming = logoResourceTiming[properties[1]] - logoResourceTiming[properties[0]];
        //console.log(logoResourceTiming);
        console.log("\n" + imgTiming.toFixed(4));
        let resTiming = '\n' + imgTiming.toFixed(4) +'\n' 
        fs.writeFileSync('perfClusterData.json', resTiming, {flag:"a"});
        let iternum = "-----------"+`ImgNR:${k}`+"----------" + '\n';
        console.log(iternum)
        fs.writeFileSync('perfClusterData.json', iternum, {flag:"a"});
        // get resource data
        // await consoleLog();
    };

   
  });

  for (i=0; i < concurrency; i++) {
    cluster.queue('http://localhost:8080');
    
  }
 



  // many more pages
 
  await cluster.idle();
  await cluster.close();
})();