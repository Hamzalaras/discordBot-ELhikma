const {chromium} = require('playwright');
const { ScarpingError } = require('../centralUnits/errorUnit.js');
const { random } = require('../centralUnits/randomItem.js');

async function expressionScarping(url){
    try {

        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const randomExpression = await page.evaluate(() => {

            const items = document.querySelectorAll('.quote-container');
            const chosenContainer = random(items);
            const quoteAuthor = chosenContainer.children[1].textContent.trim();
            const quoteText = chosenContainer.children[0].children[0].textContent.trim();
            const quoteSubject = chosenContainer.children[0].children[1].children[2].textContent.trim();
            return {
                author: quoteAuthor,
                text: quoteText,
                quoteSubject: quoteSubject
            };
        })

        await browser.close();
        return randomExpression;
    } catch (error) {
        throw new ScarpingError(error.message);
    }
}

module.exports = { expressionScarping }