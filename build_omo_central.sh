#!/bin/bash
rm -r dapps/dist
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
rm -r packages/omo-webnative/dist

echo "Installing build dependencies .."
npm i
npx --no-install lerna bootstrap || exit

echo "Building 'webnative' .."
cd packages/omo-webnative || exit
npm install
npm run build

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

echo "Building 'omo-ucan' .."
cd omo-ucan || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central' .."
cd omo-central || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-central-server' .."
cd omo-central-server || exit
npx --no-install prisma generate --schema=./schema_template.prisma || exit
npx --no-install tsc || exit
