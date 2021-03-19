FROM node:latest

WORKDIR /usr/omo-central

COPY ./packages/omo-quirks /usr/omo-central/packages/omo-quirks
COPY ./packages/omo-webnative /usr/omo-central/packages/omo-webnative
COPY ./packages/omo-events /usr/omo-central/packages/omo-events
COPY ./packages/omo-utils /usr/omo-central/packages/omo-utils
COPY ./packages/omo-circles /usr/omo-central/packages/omo-circles
COPY ./packages/omo-ucan /usr/omo-central/packages/omo-ucan
COPY ./packages/omo-models /usr/omo-central/packages/omo-models
COPY ./packages/omo-central-interfaces /usr/omo-central/packages/omo-central-interfaces
COPY ./packages/omo-central /usr/omo-central/packages/omo-central
COPY ./packages/omo-central-server /usr/omo-central/packages/omo-central-server
COPY ./build_omo_central.sh /usr/omo-central/build_omo_central.sh
COPY ./package.json /usr/omo-central/package.json
COPY ./package-lock.json /usr/omo-central/package-lock.json
COPY ./lerna.json /usr/omo-central/lerna.json

RUN ls /usr/omo-central
RUN /usr/omo-central/build_omo_central.sh

WORKDIR /usr/omo-central/packages/omo-central-server/dist
CMD ["node", "main.js"]