#!/bin/sh

set -o errexit

# npm install --save cmake-js node-addon-api

# build opencv
cmake -S ./opencv -B ./build_opencv -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DBUILD_EXAMPLES=OFF -DWITH_OPENEXR=OFF -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64"

# generate build fold
./node_modules/.bin/cmake-js configure -m -r electron -v 7.2.4 --CDCMAKE_OSX_ARCHITECTURES="arm64;x86_64"

# build


set +o errexit
