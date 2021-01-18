
const puppeteer = require('puppeteer');
const fs = require ('fs');

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async () => {
    const testStack = [];
    const repeat = 50;
  
    for (let i = 0 ; i < repeat; i++) {
        const browser = await puppeteer.launch({headless:true});
         //const browser = await puppeteer.launch({executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', headless:true});
        const page = await browser.newPage();
        await page.goto('http://localhost:8080', {waitUntil: 'domcontentloaded'});
        let iternum = '\n' + "-----------"+`${i+1}`+"----------";
        fs.writeFileSync('tests/perfData.json', iternum, {flag:"a"});
        let init = '\n' + "---------Initial Request--------" + '\n'
        fs.writeFileSync('tests/perfData.json', init, {flag:"a"}); 
        
        await consoleLog();
       
      //  redirect logs from page to console
        function consoleLog() {
            page.on('console', consoleObj => {
            const text = consoleObj.text();
            console.log('[Page] '+text);
            fs.writeFileSync('tests/perfData.json', text, {flag:"a"});
            });
            }

        await Sleep(10000);
        let rel = '\n' + " ---------Reload--------" +'\n'
        fs.writeFileSync('tests/perfData.json', rel, {flag:"a"})
        await page.reload({
        waitUntil: ["networkidle0", "domcontentloaded"] });
        await Sleep(10000); 
        await browser.close();
        }

     //console.log('\n\n Got restults:\n ', testStack);

})();