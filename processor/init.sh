#!/bin/sh

set -o errexit

# npm install --save cmake-js node-addon-api

# ./node_modules/.bin/cmake-js configure -m -r electron -v 7.2.4
# ./node_modules/.bin/cmake-js configure -m -r electron -v 7.2.4 --CDCMAKE_OSX_ARCHITECTURES="arm64;x86_64"

cmake -S /Users/zhuojia/Documents/opencv -B ./opencv -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DBUILD_EXAMPLES=OFF

set +o errexit
