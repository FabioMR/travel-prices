#!/bin/bash

HEROKU_APP_NAME="travel-prices"

echo " "
echo "========> Heroku logging..."
heroku logs -t --app $HEROKU_APP_NAME
