#!/bin/bash
# run the codegenerator
echo "Generating 'omo-central' client ..";
npx graphql-codegen

# sed -i "s/import { GraphQLClient } from 'graphql-request';/import type { GraphQLClient } from 'graphql-request';/" generated.ts
# sed -i "s/import { GraphQLError, Headers } from 'graphql-request\\/dist\\/src\\/types';/import type { GraphQLError } from 'graphql-request\\/dist\\/types';\nimport type { Headers } from 'graphql-request\\/dist\\/types.dom';/" generated.ts
