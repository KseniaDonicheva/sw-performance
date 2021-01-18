
const puppeteer = require('puppeteer');
const fs = require ('fs');
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async () => {
    const testStack = [];
    const repeat = 50;
    let written = false;   
      let CUSTOM_PRESETS = {
        '2g': {
          // Simulated upload speed (bytes/s)
          downloadThroughput: 250 * 1024 / 8,
          // Simulated upload speed (bytes/s)
          uploadThroughput: 50 * 1024 / 8,
           // Simulated latency (ms)
          latency: 400 * 5,
          offline: false,
        },
        '3g': {
          // Simulated download speed (bytes/s)
          downloadThroughput: 750 * 1024 / 8,
          // Simulated upload speed (bytes/s)
          uploadThroughput: 250 * 1024 / 8,
          // Simulated latency (ms)
          latency: 150 * 3.75,
          offline: false,
        },
        '4g': {        
           // Simulated upload speed (bytes/s)
          downloadThroughput: 4 * 1024 * 1024 / 8,
          // Simulated upload speed (bytes/s)
          uploadThroughput: 3 * 1024 * 1024 / 8,
          // Simulated latency (ms)
          latency: 20,
          offline: false
        },
      }
      
    for (let i = 0 ; i < repeat; i++) {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        const client = await page.target().createCDPSession(); //connect to devTools
        
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', CUSTOM_PRESETS['2g']);
        await page.goto('http://localhost:8080', {waitUntil: 'domcontentloaded'})

         let connType =  await page.evaluate(() => navigator.connection.effectiveType);
         let iternum = "-----------"+`${connType}`+"----------" + '\n';
      
         if (written==false) {
           fs.writeFileSync('tests/perfData.json', iternum, {flag:"a"});
           written = true;
         }
      
        //  redirect logs from page to console
        function consoleLog() {
        page.on('console', consoleObj => {
            const text = consoleObj.text();
            console.log('[Page] '+text);
            if (text.startsWith('[showResourceTimingsResult]')) {
                const splitted = text.split(' ');
                const results = JSON.parse(splitted[2]);
                console.log('Results', splitted[1], results);
                testStack.push(results);
            }
            });
        }
   
        await consoleLog();
        await Sleep(3000);
        await page.select("select#image-selector", "images/example.jpg");    
        // increased wait, depending on the network type (20s for 2g, 10 for 3g, 5 for 4g)
        await Sleep(10000);
        
        const resourceTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType('resource')))
        const resourceTiming = JSON.parse(resourceTimingJson)
        const logoResourceTiming = resourceTiming.find(element => element.name.includes('.jpg'))        
        properties = ["fetchStart", "responseEnd"];
        const imgTiming = logoResourceTiming[properties[1]] - logoResourceTiming[properties[0]];
        //console.log(logoResourceTiming);
        console.log("resource timing:" + imgTiming .toFixed(4) + " ms");
        //console.log("\n" + imgTiming .toFixed(4));
        const resTime = '\n' + JSON.stringify(imgTiming);
        fs.writeFileSync('perfData.json', resTime, {flag:"a"});  
        await browser.close();
    }
})();