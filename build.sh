#!/bin/bash

echo "Installing build dependencies .."
npm i
npx lerna bootstrap

echo "Building 'webnative' .."
cd packages/omo-webnative || exit
yarn install
yarn build
npx --no-install tsc

cd ../..
npx lerna bootstrap

echo "Building 'omo-quirks' .."
cd packages/omo-quirks || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-utils' .."
cd omo-utils || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-events' .."
cd omo-events || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-models' .."
cd omo-models || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-circles' .."
cd omo-circles || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-process' .."
cd omo-process || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-kernel-interfaces' .."
cd omo-kernel-interfaces || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-kernel' .."
cd omo-kernel || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-fission' .."
cd omo-fission || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-indexes' .."
cd omo-indexes || exit
npx --no-install tsc
cd .. || exit

echo "Building 'omo-shell' .."
cd omo-shell || exit
npm run build
cd ../.. || exit

npx lerna bootstrap
