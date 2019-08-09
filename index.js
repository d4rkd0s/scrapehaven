const puppeteer = require('puppeteer');

(async () => {
    require('dotenv').config({path: __dirname + '/.env'})
    const argv = require('yargs').argv
    const fs = require("fs");
    const request = require("request");
    const imageDownload = require('image-download');
    const imageType = require('image-type');
    const path = require('path');
    const https = require('https');
    const Q = require('q');
    
    function delay(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
    
    // Default number of pages
    let pages = 1;
    // Set max to really high
    let max = 10000;
    // Set max if passed
    if(argv.max) { max = argv.max }
    // Check if there was a page count passed
    if(argv.pages) { pages = argv.pages }
    // Check if there wasn't a search term passed
    if(!argv.search) { console.log("Please pass a search term with --search=thingtosearch"); process.exit(0); }
    // Setup the browser
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false});
    // Create a new page
    const page = await browser.newPage();
    // Goto wallhaven's login page
    await page.goto('https://wallhaven.cc/login', { 'waitUntil' : 'networkidle0' });
    // Enter the username
    await page.type('#username', process.env.WALLHAVEN_USERNAME);
    // Enter the password
    await page.type('#login > input[type=password]:nth-child(3)', process.env.WALLHAVEN_PASSWORD);
    // Click the login button
    await page.click('#login > p:nth-child(4) > button');
    // Enter the search box by clicking into it
    await page.click('#header-search-text');
    await delay(1000);
    // Check for unchecks
    if(argv.general == "false") {
        // Uncheck general
        await page.click('#search-category-checks > label:nth-child(2)');
        await delay(300);
    }
    if(argv.anime == "false") {
        // Uncheck anime
        await page.click('#search-category-checks > label:nth-child(4)');
        await delay(300);
    }
    if(argv.people == "false") {
        // Uncheck people
        await page.click('#search-category-checks > label:nth-child(6)');
        await delay(300);
    }
    if(argv.sfw == "false") {
        // Uncheck SFW
        await page.click('#search-purity-checks > label.purity.sfw');
        await delay(300);
    }
    if(argv.sketchy == "false") {
        // Uncheck Sketchy
        await page.click('#search-category-checks > label:nth-child(6)');
        await delay(300);
    }
    if(argv.nsfw == "false") {
        // Uncheck NSFW
        await page.click('#search-purity-checks > label.purity.nsfw');
        await delay(300);
    }
    
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
    
    // Setup download function
    function download(url, filepath) {
        var fileStream = fs.createWriteStream(path.join(__dirname, "images", filepath)),
        deferred = Q.defer();
        
        fileStream.on('open', function () {
            https.get(url, function (res) {
                res.on('error', function (err) {
                    deferred.reject(err);
                });
                
                res.pipe(fileStream);
            });
        }).on('error', function (err) {
            deferred.reject(err);
        }).on('finish', function () {
            deferred.resolve(filepath);
        });
        
        return deferred.promise;
    }
    
    // Set counter for max
    let imagesDownloaded = 0;
    // For each page
    for (let pageNum = 1; pageNum <= pages; pageNum++) { 
        // For each image
        // (numOfImages/pages) * pageNum
        for (let imageNum = 1; imageNum < 65; imageNum++) {
            const pageTarget = page.target(); //save this to know that this was the opener
            await page.click(`#thumbs > section:nth-child(${pageNum}) > ul > li:nth-child(${imageNum}) > figure > a.preview`);
            const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); //check that you opened this page, rather than just checking the url
            const newPage = await newTarget.page(); //get the page object
            await newPage.waitForSelector("body"); //wait for page to be loaded
            console.log("Browser ready");
            const tabThree = newPage;
            const imageUrl = await tabThree.evaluate(() =>
                document.querySelector("#wallpaper").getAttribute('src') // image selector
            );
            console.log(`Found image ${imageUrl}`);
            var filenameRegex = /[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g;
            let filename = imageUrl.match(filenameRegex)[0];
            console.log(filename);
            console.log(`Started download of ${imageUrl}`);
            await download(imageUrl, filename);
            imagesDownloaded++;
            if(numOfImages >= max) {
                console.log(`Downloaded ${filename} (${imagesDownloaded} of ${numOfImages})`);
            } else {
                console.log(`Downloaded ${filename} (${imagesDownloaded} of ${max}) you have a max set of ${max}`);
            }
            await tabThree.close();
            // Delay 1 second after closing tab to emulate a human, the api throttles otherwise around ~45/req
            await delay(1000);
            if(imagesDownloaded >= max) {
                console.log(`Max images downloaded ${max}, override with --max=1000`);
                process.exit(0);
            }
        }
    }
    console.log("All done! Closing in 3 seconds");
    await delay(3000);
    await browser.close();
    process.exit(0);
})();