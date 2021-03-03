import {ApolloServer} from "apollo-server";

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {Context} from "./context";
import {resolvers} from "./resolvers/resolvers";
import {Resolvers} from "omo-central-interfaces/dist/types";

const corsOrigins = [
    "http://localhost:5000",
    "https://localhost:5000",
    "http://omo.local:5000",
    "https://omo.local:5000",
    "https://omo.li",
    "https://circles.land"
];

export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;

    constructor()
    {
        const apiSchemaTypeDefs = importSchema("../src/server-schema.graphql");
        this._resolvers = resolvers;

        console.log("cors origins: ", corsOrigins);

        this._server = new ApolloServer({
            context: Context.create,
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
        }).then(o => {
            console.log("listening at port 8989")
        });
    }
}

new Main()
    .run()
    .then(() => "Running");
