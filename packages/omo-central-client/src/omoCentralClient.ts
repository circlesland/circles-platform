import {GraphQLClient} from "graphql-request";
import {
    getSdk,
    UpdateProfileInput,
    UpsertProfileDocument,
    UpsertProfileMutation,
    UpsertProfileMutationVariables
} from "./generated";
import {ApolloLink, split} from "apollo-link";
import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from 'apollo-utilities';
import {fetch} from 'cross-fetch'
import ws from "ws";
import {Message, MessagesDocument, MessagesSubscriptionVariables} from "./generated";
import {EventBroker, Topic} from "omo-utils/dist/eventBroker";
import {Observable} from "rxjs";

export const omoCentralUrl = "http://localhost:8989/graphql"
const client = new GraphQLClient(omoCentralUrl);
const omoCentralClient = getSdk(client);
const isBrowser = typeof window !== "undefined";

export class Client
{
    private readonly _eventBroker = new EventBroker();
    private readonly _apiEndpointUrl: string;
    private static readonly  _defaultOptions:DefaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    };

    private readonly defaultTopic:Topic<Message>;
    private readonly _link: ApolloLink;
    private readonly _client: ApolloClient<NormalizedCacheObject>;

    private _eventsSubscription?: ZenObservable.Subscription;

    get events() : Observable<Message> {
        return this.defaultTopic.observable;
    }

    private get client(): ApolloClient<NormalizedCacheObject>
    {
        if (!this._client)
            throw new Error("Call connect() first!");

        return this._client;
    }

    private constructor(apiEndpointUrl: string, link: ApolloLink, client: ApolloClient<NormalizedCacheObject>)
    {
        this._apiEndpointUrl = apiEndpointUrl;
        this._link = link;
        this._client = client;
        this.defaultTopic = this._eventBroker.createTopic("","");
    }

    close() {
        if (this._eventsSubscription) {
            this._eventsSubscription.unsubscribe();
        }
        this._client.stop();
    }

    static async connect(apiEndpointUrl: string, ucan:string)
    {
        const httpLink = new HttpLink({
            fetch: fetch,
            uri: apiEndpointUrl,
            headers: {
                authorization: ucan
            }
        });

        const connectionParams = {
            authorization: ucan
        };

        const wsImpl = !isBrowser ?  ws : WebSocket;
        const subscriptionLink = new WebSocketLink({
            webSocketImpl: wsImpl,
            uri: apiEndpointUrl
                .replace("http://", "ws://")
                .replace("https://", "wss://"),
            options: {
                reconnect: true,
                connectionParams: connectionParams
            }
        });

        const link = split(
            ({query}) =>
            {
                const {kind, operation} = <any>getMainDefinition(query);
                return kind === 'OperationDefinition' && operation === 'subscription';
            },
            subscriptionLink,
            httpLink
        );

        const apolloClient = new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: Client._defaultOptions
        });

        const omoClient = new Client(apiEndpointUrl, link, apolloClient);
        await omoClient.subscribeToEvents();

        return omoClient;
    }

    private async subscribeToEvents()
    {
        this._eventsSubscription = this.client.subscribe<MessagesSubscriptionVariables>({
            query: MessagesDocument
        }).subscribe(next =>
        {
            const newEvent = <Message>(<any>next.data).event;
            this.defaultTopic.publish(newEvent);
        });
    }

    static async fissionRoot(fissionUsername:string) : Promise<string|undefined> {
        const cid = await omoCentralClient.fissionRoot({
            fields: {
                fissionName: fissionUsername
            }
        });

        return cid.data?.fissionRoot ?? "";
    }

    async upsertProfile(data: UpdateProfileInput) {
        return await this._client.mutate<UpsertProfileMutation, UpsertProfileMutationVariables>({
            mutation: UpsertProfileDocument,
            variables: {
                data
            }
        });
    }
}