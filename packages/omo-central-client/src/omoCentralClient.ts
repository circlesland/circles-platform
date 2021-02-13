import {GraphQLClient} from "graphql-request";
import {getSdk} from "./generated";

const client = new GraphQLClient("http://localhost:8989/graphql");
export const omoCentralClient = getSdk(client);