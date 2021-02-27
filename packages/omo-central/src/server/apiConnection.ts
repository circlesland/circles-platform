import {Message, MessagesDocument, MessagesSubscriptionVariables} from "../generated";
import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {WebSocketLink} from "apollo-link-ws";
import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {AsyncBroadcast} from "omo-utils/dist/asyncBroadcast";
import {decodeUcan} from "../../../omo-ucan/dist/decodeUcan";
import {Observable, Subject} from "rxjs";

/**
 * Maintains a connection with the omo-central-server.
 */
export class ApiConnection
{
    private readonly _apiEndpointUrl: string;
    private readonly _ucanFactory:() => Promise<string>;
    private readonly _refreshIntervalHandle:any;
    private readonly _events = new Subject<Message>();

    private _client:ApolloClient<NormalizedCacheObject>|undefined;
    private _validTo: Date|undefined;
    private _eventSubscription:ZenObservable.Subscription|undefined;

    readonly client = new AsyncBroadcast<void, ApolloClient<NormalizedCacheObject>>(async () =>
    {
        const now = Date.now();
        if (!this._client || !this._validTo || this._validTo.getTime() <= now - 60 * 1000)
        {
            if (this._eventSubscription)
            {
                this._eventSubscription.unsubscribe();
            }
            if (this._client)
            {
                this._client.stop();
            }

            
            const newClient = await this.connect();
            
            this._validTo = newClient.validTo;
            this._client = newClient.client;
        }

        
        return this._client;
    });

    get events():Observable<Message>
    {
        return this._events;
    }

    constructor(apiEndpointUrl: string, ucanFactory:() => Promise<string>)
    {
        this._apiEndpointUrl = apiEndpointUrl;
        this._ucanFactory = ucanFactory;

        this._refreshIntervalHandle = setInterval(async () => {
            // This will reconnect if the ucan is about to expire
            const client = await this.client.subscribeToResult();
            if (!this._eventSubscription) {
                
                await this.subscribe();
                
            }
        }, 30000);
    }

    destroy()
    {
        clearInterval(this._refreshIntervalHandle);
        this._events.complete();

        if (this._eventSubscription)
        {
            this._eventSubscription.unsubscribe();
            this._eventSubscription = undefined;
        }

        if (this._client)
        {
            this._client.stop();
            this._client = undefined;
            this._validTo = undefined;
        }
    }

    private static readonly _defaultOptions:DefaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    };

    async subscribe()
    {
        if (this._eventSubscription)
        {
            return;
        }

        
        const client = await this.client.subscribeToResult();
        

        this._eventSubscription = client.subscribe<MessagesSubscriptionVariables>({
            query: MessagesDocument
        }).subscribe(next =>
        {
            
            const newEvent = <Message>(<any>next.data).event;
            this._events.next(newEvent);
        });
    }

    private async connect() : Promise<{
        client: ApolloClient<NormalizedCacheObject>,
        validTo: Date
    }> {
        const ucan = await this._ucanFactory();
        const decodedUcan = decodeUcan(ucan);
        const headers = { authorization: ucan }

        const httpLink = new HttpLink({
            fetch: fetch,
            uri: this._apiEndpointUrl,
            headers: headers
        });

        const subscriptionLink = new WebSocketLink({
            webSocketImpl: WebSocket,
            uri: this._apiEndpointUrl
                .replace("http://", "ws://")
                .replace("https://", "wss://"),
            options: {
                reconnect: true,
                connectionParams: headers
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

        const client = new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
            defaultOptions: ApiConnection._defaultOptions
        });

        const validTo = new Date(decodedUcan.payload.exp * 1000);
        return {
            client,
            validTo
        }
    }
}