const puppeteer = require('puppeteer');
const fs = require('fs');

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async () => {
    const testStack = [];
    const repeat = 1;

    for (let i = 0 ; i < repeat; i++) {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/');
        
        let iternum = '\n' + "-----------"+`${i+1}`+"----------" + '\n'; 
        fs.writeFileSync('perfData.json', iternum, {flag:"a"});
        let init = '\n' + "---------Initial Request--------" + '\n'
        fs.writeFileSync('perfData.json', init, {flag:"a"}); 
        await consoleLog();
       
        // redirect logs from page to console
        function consoleLog() {
        page.on('console', consoleObj => {
            const text = consoleObj.text();
            console.log('[Page] '+text + '\n');
            fs.writeFileSync('perfData.json', text, {flag:"a"});
        });
    }  
        await Sleep(5000);
        let rel = '\n' + " ---------Reload--------" +'\n'
        fs.writeFileSync('perfData.json', rel, {flag:"a"})
        await page.setCacheEnabled(false);
        await page.reload({ waitUntil: ["domcontentloaded"] });
        await Sleep(5000);
        await console.log("------Reload-------");
        await browser.close();       
    }

})();