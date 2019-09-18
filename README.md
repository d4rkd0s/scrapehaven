![scrapehaven-logo](https://github.com/d4rkd0s/scrapehaven/raw/master/scrape-haven-logo.png)

<p style="text-align: center;">Automatically downloads full res images from wallhaven.cc with javascript+puppeteer</p>

## Setup

Clone the repo

`git clone https://github.com/d4rkd0s/scrapehaven`

Change into the repo directory

`cd scrapehaven/`

Run NPM install

`npm install`

Copy the example env to a .env

`cp .env.example .env`

Fill out the `.env` file with your Wallhaven credentials

You are ready to go!

## Use

To search and download for a term run

```
node index.js --search='sexy' \
                --pages=1 \
                --max=10 \
                --general=false \
                --anime=false \
                --people=true \
                --sfw=false \
                --sketchy=true \
                --nsfw=false
```

More options like sorting are coming soon.
