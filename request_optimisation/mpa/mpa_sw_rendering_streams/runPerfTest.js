"use strict"

import puppeteer from 'puppeteer'
import fs from 'fs'

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async () => {
    const testStack = [];
    const repeat = 50;

    for (let i = 0 ; i < repeat; i++) {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/');
        
        let iternum = '\n' + "-----------"+`${i+1}`+"----------" + '\n'; 
        fs.writeFileSync('tests/perfData.json', iternum, {flag:"a"});
        let init = '\n' + "---------Initial Request--------" + '\n'
        fs.writeFileSync('tests/perfData.json', init, {flag:"a"}); 
        
        await consoleLog();

        // redirect logs from page to console
            function consoleLog() {
            page.on('console', consoleObj => {
              const text = consoleObj.text();
              console.log('[Page] '+text + '\n');
              fs.writeFileSync('tests/perfData.json', text, {flag:"a"});      
            });
          }

        await Sleep(5000);
        
        let rel = '\n' + " ---------Reload--------" +'\n'
        fs.writeFileSync('tests/perfData.json', rel, {flag:"a"})
        await page.goto('http://localhost:3000/content1');
        await Sleep(5000);
        await browser.close();
    }
})();