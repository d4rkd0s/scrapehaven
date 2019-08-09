const puppeteer = require('puppeteer');

(async () => {
    require('dotenv').config({path: __dirname + '/.env'})
    const argv = require('yargs').argv
    const fs = require('fs');
    const imageDownload = require('image-download');
    const imageType = require('image-type');

    function delay(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    function wallpaperIdFromElement(elementObject) {
        var elementArray = Object.keys(elementObject).map(function(key) {
            return [Number(key), elementObject[key]];
        });
        return elementArray[0][1]['wallpaperId'];  
    }
    // Default number of pages
    let pages = 1;
    // Check if there was a page count passed
    if(argv.pages) { pages = argv.pages }
    // Check if there wasn't a search term passed
    if(!argv.search) { console.log("Please pass a search term with --search=thingtosearch"); process.exit(0); }
    // Setup the browser
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false});
    // Create a new page
    const page = await browser.newPage();
    // Goto wallhaven's login page
    await page.goto('https://wallhaven.cc/login');
    // Enter the username
    await page.type('#username', process.env.WALLHAVEN_USERNAME);
    // Enter the password
    await page.type('#login > input[type=password]:nth-child(3)', process.env.WALLHAVEN_PASSWORD);
    // Click the login button
    await page.click('#login > p:nth-child(4) > button');
    // Enter the search box by clicking into it
    await page.click('#header-search-text');
    // Enter the text from argv.search
    await page.type('#header-search-text', argv.search);
    // Click search
    await page.click('#header-search > button');
    // Wait for the results page to load and display the results.
    await page.waitForSelector('#thumbs');
    // Setup a var to loop with
    let pagesLoaded = 1;
    // If more than 1 page was requested
    if(pages > 1) {
        // Loop through additional pages until we reach the pages count
        while (pages > pagesLoaded) {
            // Get a second page
            await page.keyboard.press('End');
            // Wait for context to load
            await delay(3000);
            // Increment pagesLoaded
            pagesLoaded++;
        }
    }

    console.log(`pages requested: ${pages} pages loaded: ${pagesLoaded}`);

    // Setup base count of images
    let numOfImages = 0;
    // Setup a var to loop with
    let pageToCount = 1;
    // If more than 1 page was requested
    if(pages > 1) {
        // Loop through additional pages until we reach the pages count
        while (pages > pageToCount) {
            numOfImages += await page.$$eval(`#thumbs > section:nth-child(${pageToCount}) > ul > li`, lis => lis.length);
            pageToCount++;
        }
    } else {
        // Just read page 1 content
        numOfImages = await page.$$eval('#thumbs > section > ul > li', lis => lis.length);
    }
    
    console.log(`number of images to download: ${numOfImages}`);


    

    console.log("a");
    // #thumbs > section:nth-child(2) > ul > li:nth-child(1) > figure > a.preview

    // #thumbs > section > ul > li:nth-child(1) > figure > a.preview

    // await page.click();

    // const resultsSelector = '.thumb';
    // const links = await page.evaluate(resultsSelector => {
    //     const anchors = Array.from(document.querySelectorAll(resultsSelector));
    //     return anchors;
    // }, resultsSelector);

    // fs.truncate('urls.txt', 0, function(){console.log('cleared file')})

    // links.forEach(function(elementObject){
    //     var wallpaperId = wallpaperIdFromElement(elementObject);
    //     var url1 = "https://w.wallhaven.cc/full/" + wallpaperId.substring(0, 2) + "/wallhaven-" + wallpaperId + ".jpg";
    //     var url2 = "https://w.wallhaven.cc/full/" + wallpaperId.substring(0, 2) + "/wallhaven-" + wallpaperId + ".png";
    //     fs.appendFile('urls.txt', url1 + "\n", function (err) {
    //         if (err) throw err;
    //             console.log('Saved ' + wallpaperId);
    //     });
    //     fs.appendFile('urls.txt', url2 + "\n", function (err) {
    //         if (err) throw err;
    //             console.log('Saved ' + wallpaperId);
    //     });
    // });

    console.log("Closing in 3 seconds");
    await delay(3000);
    // await browser.close();
})();