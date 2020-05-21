#!/bin/sh

set -o errexit

npm install --save cmake-js node-addon-api 
./node_modules/.bin/cmake-js configure -m

set +o errexit
