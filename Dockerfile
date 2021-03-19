FROM node:latest
COPY . .

#    "@prisma/client": "^2.18.0",
#    "apollo-server": "^2.21.0",
#    "graphql": "^15.5.0",
#    "graphql-import": "^1.0.2",
#    "omo-ucan": "0.1.212",
#    "omo-circles": "1.0.0",
#    "omo-central-interfaces": "1.0.0",
#    "subscriptions-transport-ws": "^0.9.18",
#    "omo-utils": "1.0.0",
#    "ix": "^4.2.0"
COPY ./packages/omo-central-server ./packages/omo-central-server
COPY ./packages/omo-circles ./packages/omo-circles
COPY ./packages/omo-central-interfaces ./packages/omo-central-interfaces
COPY ./packages/omo-utils ./packages/omo-utils

RUN ./build.sh
