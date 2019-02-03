#!/bin/bash

HEROKU_APP_NAME="travel-prices"
BASE_URL="https://$HEROKU_APP_NAME.herokuapp.com"

echo " "
echo "========> Destroying environment..."
heroku apps:destroy $HEROKU_APP_NAME --confirm $HEROKU_APP_NAME

echo " "
echo "========> Creating environment..."
heroku create $HEROKU_APP_NAME --buildpack https://github.com/jontewks/puppeteer-heroku-buildpack.git


echo " "
echo "========> Sending app..."
git push heroku master


echo " "
echo "========> Scaling environment..."
heroku ps:scale web=1 --app $HEROKU_APP_NAME

echo " "
echo "========> Setting environment variables..."
heroku config:set \
  NODE_ENV="production" \
  BASE_URL="$BASE_URL" \
  --app $HEROKU_APP_NAME

echo " "
echo "========> Setting redis..."
heroku addons:create heroku-redis:hobby-dev --app $HEROKU_APP_NAME

echo " "
echo "========> Done!"

heroku open --app $HEROKU_APP_NAME
git remote remove heroku
