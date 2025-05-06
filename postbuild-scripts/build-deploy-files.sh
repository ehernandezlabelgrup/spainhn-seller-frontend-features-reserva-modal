#!/bin/sh
DATE=$(date "+%Y-%m-%d_%H%M%S")
echo $DATE
FILE_NAME="seller-staging-$DATE.zip"
npm run create-zip -- $DATE
scp -i ~/.ssh/id_ed25519 $FILE_NAME spainhn@82.223.115.219:/home/spainhn/sites/cm-seller.spainheritagenetwork.com
ssh spainhn@82.223.115.219 -i ~/.ssh/id_ed25519 "cd /home/spainhn/sites/cm-seller.spainheritagenetwork.com && unzip -o $FILE_NAME"
