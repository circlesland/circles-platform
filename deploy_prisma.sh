#!/bin/bash
blubb="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/$DO_PGSQL_CONNECTIONSTRING/g"
sed -i "${blubb//\//\\/}" packages/omo-central/schema.prisma
cd packages/omo-central/
npx prisma db push --preview-feature