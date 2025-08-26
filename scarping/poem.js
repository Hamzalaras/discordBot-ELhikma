const {chromium} = require('playwright');
const { ScarpingError } = require('../centralUnits/errorUnit.js');

async function poemScarping(url, msg){
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const poemlines = await page.$$eval('#poem_content h3', (h3) => h3.map((line) => line.textContent.trim() + `\n`))
        return poemlines;
    } catch (error) {
        throw new ScarpingError(error.message);
    }
}

module.exports = { poemScarping };