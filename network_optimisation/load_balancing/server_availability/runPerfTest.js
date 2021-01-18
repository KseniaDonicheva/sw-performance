
const puppeteer = require('puppeteer');
const fs = require ('fs');
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async () => {
    const testStack = [];
    const repeat = 50;
    for (let i = 0 ; i < repeat; i++) {
        let iternum = "-----------"+`Try Nr${i+1}`+"----------" + '\n';
        fs.writeFileSync('perfData.json', iternum, {flag:"a"});
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        
        //  redirect logs from page to console
        // function consoleLog() {
        page.on('console', consoleObj => {
            const text = '\n'+ consoleObj.text();
            console.log('[Page] '+text);
            fs.writeFileSync('perfData.json', text, {flag:"a"});
            });
        // }
        await page.goto('http://localhost:8080', {waitUntil: 'domcontentloaded'});
    
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
            console.log("resource timing:" + imgTiming .toFixed(4) + " ms");
            const resTime = '\n' + JSON.stringify(imgTiming) + '\n';
            fs.writeFileSync('perfData.json', resTime, {flag:"a"});
            // get resource data
            //await consoleLog();
        };
           
        await browser.close();
    }
})();