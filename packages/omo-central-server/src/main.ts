import {ApolloServer} from "apollo-server";
const { print } = require('graphql');

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {Context} from "./context";
import {resolvers} from "./resolvers/resolvers";
import {Resolvers} from "omo-central-interfaces/dist/types";
import {Generate} from "omo-utils/dist/generate";

const corsOrigins = [
    "http://localhost:5000",
    "https://localhost:5000",
    "http://omo.local:5000",
    "https://omo.local:5000",
    "https://omo.li",
    "https://circles.land"
];

/*
class BasicLogging {
    requestDidStart(args:{queryString:any, parsedQuery:any, variables:any}) {
        const {queryString, parsedQuery, variables} = args;
        const query = queryString || print(parsedQuery);
        console.log(query);
        console.log(variables);
    }

    willSendResponse(args:{graphqlResponse:any}) {
        console.log(JSON.stringify(args, null, 2));
    }
}
 */


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
            // extensions: [() => new BasicLogging()],
            context: Context.create,
            typeDefs: apiSchemaTypeDefs,
            resolvers: this._resolvers,
            cors: {
                origin: corsOrigins,
                credentials: true
            },
            formatError: (err) => {
                const errorId = Generate.randomHexString(8);
                console.error({
                    timestamp: new Date().toJSON(),
                    errorId: errorId,
                    error: err
                });
                return {
                    path: err.path,
                    message: `An error occurred while processing your request.\n`
                        + `If the error persists contact the admins at '${process.env.ADMIN_EMAIL}' `
                        + `and include the following error id in your request:\n`
                        + `${errorId}`
                }
            }
        });
    }

    async run()
    {
        await this._server.listen({
            port: parseInt("8989")
        }).then(o => {
            console.log(`Listening on http://0.0.0.0:${process.env.AUTH_PORT}`);
        });
    }
}

new Main()
    .run()
    .then(() => "Running");
