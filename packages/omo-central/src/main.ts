import {ApolloServer} from "apollo-server";
import {resolvers} from "./resolvers";

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {Resolvers} from "./types";
import {RequestContext} from "./requestContext";

const corsOrigins = [
    "localhost",
    "omo.local",
    "omo.li",
    "circles.land"
];

export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;

    constructor()
    {
        const apiSchemaTypeDefs = importSchema("../src/schema.graphql");
        this._resolvers = resolvers;

        console.log("cors origins: ", corsOrigins);

        this._server = new ApolloServer({
            context: RequestContext.create,
            typeDefs: apiSchemaTypeDefs,
            resolvers: this._resolvers,
            cors: {
                origin: corsOrigins,
                credentials: true
            }
        });
    }

    async run()
    {
        await this._server.listen({
            port: parseInt("8989")
        });
    }
}

new Main()
    .run()
    .then(() => "Running");
