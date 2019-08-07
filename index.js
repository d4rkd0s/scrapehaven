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
    const nodeChildren = await page.$eval('#thumbs > section > ul', (uiElement) => {
        return uiElement.children;
    });
    console.log(nodeChildren); // Outputs the array of the nodes children
    nodeChildren.forEach(child => {
        console.log(child.src);
    });

    console.log("Closing in 3 seconds");
    await delay(3000);
    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 500;
            var speed = 50;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, speeds);
        });
    });
}
