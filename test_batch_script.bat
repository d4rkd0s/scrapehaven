SET MY_PATH=C:\`code\scrapehaven

RMDIR /S /Q %MY_PATH%\images
MKDIR %MY_PATH%\images

CD %MY_PATH%

node index.js --search='marvel' --max=20 --general=true --people=true --sfw=true --sketchy=true --res=1080p --sort=random --ratio=16x9 --headless=true

node index.js --search='dc comics' --max=20 --general=true --people=true --sfw=true --sketchy=true --res=1080p --sort=random --ratio=16x9 --headless=true

node index.js --search='cars' --max=20 --general=true --people=true --sfw=true --sketchy=true --res=1080p --sort=random --ratio=16x9  --headless=true

node index.js --search='joker' --max=20 --general=true --people=true --sfw=true --sketchy=true --res=1080p --sort=random --ratio=16x9 --headless=true

node index.js --search='sunrise' --max=20 --general=true --people=true --sfw=true --sketchy=true --res=1080p --sort=random --ratio=16x9 --headless=true

cmd /k