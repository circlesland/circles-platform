#!/bin/bash
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${DO_PGSQL_CONNECTIONSTRING//\//\\/}/g"
cp -f packages/omo-central/schema_template.prisma packages/omo-central/schema.prisma
sed -i "${sedArgument}" packages/omo-central/schema.prisma
cd packages/omo-central/
npx prisma db push --preview-feature