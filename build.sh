#!/bin/bash


echo "Installing build dependencies .."
npm i
npx --no-install lerna bootstrap || exit

echo "Building 'webnative' .."
cd packages/omo-webnative || exit
npm install
npm run build

cd ../..

echo "Cleaning all 'omo-*/dist' directories  .."
rm -r circles-land/dist
rm -r packages/omo-central/dist
rm -r packages/omo-central-webnative/dist
rm -r packages/omo-central-server/dist
rm -r packages/omo-circles/dist
rm -r packages/omo-directory/dist
rm -r packages/omo-events/dist
rm -r packages/omo-fission/dist
rm -r packages/omo-indexes/dist
rm -r packages/omo-kernel/dist
rm -r packages/omo-kernel-interfaces/dist
rm -r packages/omo-models/dist
rm -r packages/omo-quirks/dist
rm -r packages/omo-process/dist
rm -r packages/omo-utils/dist

npx --no-install  lerna bootstrap

echo "Building 'omo-quirks' .."
cd packages/omo-quirks || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-utils' .."
cd omo-utils || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-events' .."
cd omo-events || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-models' .."
cd omo-models || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-circles' .."
cd omo-circles || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-process' .."
cd omo-process || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central-interfaces' .."
cd omo-central-interfaces || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central-webnative' .."
cd omo-central-webnative || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central-server' .."
cd omo-central-server || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central' .."
cd omo-central || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-kernel-interfaces' .."
cd omo-kernel-interfaces || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-kernel' .."
cd omo-kernel || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-fission' .."
cd omo-fission || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-indexes' .."
cd omo-indexes || exit
npx --no-install tsc || exit
cd ../.. || exit

echo "Building 'dapps' .."
cd dapps || exit
npm run build
cd .. || exit

npx --no-install lerna bootstrap
