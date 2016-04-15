#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"

npm install

node_modules/webpack/bin/webpack.js -p --config webpack.production.config.js

mkdir temp
chmod 777 temp

[ -d "data" ] || mkdir data

chmod 777 data
