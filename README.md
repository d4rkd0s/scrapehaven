![scrapehaven-logo](https://github.com/amritzzzz/scrapehaven/raw/master/scrape-haven-logo.png)

<p style="text-align: center;">Automatically downloads full res images from wallhaven.cc with javascript+puppeteer</p>

## Setup

Clone the repo

`git clone https://github.com/amritzzzz/scrapehaven`

Change into the repo directory

`cd scrapehaven/`

Run NPM install

`npm install`

Copy the example env to a .env

`cp .env.example .env`

Fill out the `.env` file with your Wallhaven credentials (Account is required)

You are ready to go!

## Use

To search and download for a term run

```
node index.js --search='space' \
                --pages=1 \
                --max=10 \
                --general=false \
                --anime=false \
                --people=true \
                --sfw=false \
                --sketchy=true \
                --nsfw=false
```


## Additional Options

### res

`--res=1080p`

options: 720p, 1080p, 4k

### ratio

`--ratio=16x9`

options: 16x9, 16x10

### sort

`--sort=random`

options: sorting, date (desc)

### headless
This option defines if the browser is visible when navigating the website

`--headless=true`

## Defaults

`--search` is required

`--page`default is 10

`--max` default is 10000

`--general; --anime; --people; --sfw; --sketchy; --nsfw` default to unchecked/unselected overriding your default user options

`--res` defaults is none

`--ratio` defaults is none

`--sort` defaults is relevance

`--headless` defaults to false

## Batch Script

`test_batch_script.bat` is a simple batch script to allow you to group multiple different search scenarios.

Edit `test_batch_script.bat` with the directory of this project on your local machine. Update `MY_PATH`.

`cmd /k` will open the cmd prompt. Remove if wanted to run in the background.

## Windows Task Scheduler

You can use this batch script to create a [Task Schedule](https://www.thewindowsclub.com/how-to-schedule-batch-file-run-automatically-windows-7) to automate and refresh your backgrounds on your own defined schedule.

