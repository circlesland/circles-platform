#!/bin/bash
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${DO_PGSQL_CONNECTIONSTRING//\//\\/}/g"
cp -f packages/omo-central-server/schema_template.prisma packages/omo-central-server/schema.prisma
sed -i "${sedArgument}" packages/omo-central-server/schema.prisma
cd packages/omo-central-server/
npx prisma --version
npx prisma db push --preview-feature