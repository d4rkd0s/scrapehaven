const puppeteer = require('puppeteer');

(async () => {
    require('dotenv').config({path: __dirname + '/.env'})
    const argv = require('yargs').argv
    
    function delay(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
    
    if(!argv.search) { console.log("Please pass a search term with --search=thingtosearch"); process.exit(0); }
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false});
    const page = await browser.newPage();
    await page.goto('https://wallhaven.cc/login');
    await page.type('#username', process.env.WALLHAVEN_USERNAME);
    await page.type('#login > input[type=password]:nth-child(3)', process.env.WALLHAVEN_PASSWORD);
    await page.click('#login > p:nth-child(4) > button');
    await page.click('#header-search-text');
    await page.type('#header-search-text', argv.search);
    await page.click('#header-search > button');
    // await loadAnotherPage(page);
    // const nodeChildren = await page.$eval('#thumbs > section > ul', (uiElement) => {
    //     return uiElement.children;
    // });

    // Wait for the results page to load and display the results.
    const resultsSelector = '#thumbs';
    await page.waitForSelector(resultsSelector);


    const links = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        return anchors.map(anchor => {
        const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
        });
    }, resultsSelector);
    console.log(links.join('\n'));

    // const ul = await page.evaluate(() => document.querySelector('#thumbs > section > ul'));
    // const imageLis = await page.evaluate(() => {
    //     const lis = Array.from(document.querySelectorAll('#thumbs > section > ul'));
    //     return lis;
    //     const images = lis.map(lis => lis.src);
    //     return images;
    // });
    // console.log(ul);
    // for (let imageLi of imageLis) {
    //     console.log(imageLi);
    // };

    // console.log(nodeChildren); // Outputs the array of the nodes children
    
    console.log("Closing in 3 seconds");
    await delay(3000);
    // await browser.close();
})();

async function getImageFromLI(element) {

}

async function loadAnotherPage(page, scrollStep = 250, scrollDelay = 100) {
    const lastPosition = await page.evaluate(
        async (step, delay) => {
            const getScrollHeight = (element) => {
            const { scrollHeight, offsetHeight, clientHeight } = element
            return Math.max(scrollHeight, offsetHeight, clientHeight)
        }
        
        const position = await new Promise((resolve) => {
            let count = 0
            const intervalId = setInterval(() => {
                const { body } = document
                const availableScrollHeight = getScrollHeight(body)
                
                window.scrollBy(0, step)
                count += step
                
                if (count >= availableScrollHeight) {
                    clearInterval(intervalId)
                    resolve(count)
                }
            }, delay)
        })
        return position
    },
    scrollStep,
    scrollDelay,
    )
    return lastPosition
}