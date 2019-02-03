#!/bin/bash

HEROKU_APP_NAME="travel-prices"
HEROKU_GIT_URL="https://git.heroku.com/$HEROKU_APP_NAME.git"

echo " "
echo "========> Adding git remote..."
git remote add heroku $HEROKU_GIT_URL

echo " "
echo "========> Updating app..."
git push heroku master:master

echo " "
echo "========> Done!"

heroku open --app $HEROKU_APP_NAME
git remote remove heroku
