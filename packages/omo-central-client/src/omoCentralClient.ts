import {GraphQLClient} from "graphql-request";
import {
    getSdk,
    InboxDocument,
    InboxQuery,
    InboxQueryVariables,
    OffersDocument,
    OffersQuery,
    OffersQueryVariables,
    OutboxDocument,
    OutboxQuery,
    OutboxQueryVariables,
    ProfileDocument,
    ProfileQuery,
    ProfileQueryVariables,
    ProfilesDocument,
    ProfilesQuery,
    ProfilesQueryVariables,
    SendMessageDocument,
    SendMessageInput,
    SendMessageMutation,
    SendMessageMutationVariables,
    UpdateProfileInput,
    CreateOfferDocument,
    CreateOfferInput,
    CreateOfferMutation,
    CreateOfferMutationVariables,
    UpsertProfileDocument,
    UpsertProfileMutation,
    UpsertProfileMutationVariables,
    LockOfferMutation,
    LockOfferMutationVariables,
    LockOfferDocument,
    LockOfferInput,
    PaymentProof, ProvePaymentMutation, ProvePaymentMutationVariables, ProvePaymentDocument
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
            console.log("Received event:", next);
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

    async createOffer(data: CreateOfferInput) {
        return await this._client.mutate<CreateOfferMutation, CreateOfferMutationVariables>({
            mutation: CreateOfferDocument,
            variables: {
                data
            }
        });
    }

    async queryProfile(fissionUsername:string) {
        return await this._client.query<ProfileQuery, ProfileQueryVariables>({
            query: ProfileDocument,
            variables: {
                query: {
                    fissionName: fissionUsername
                }
            }
        })
    }

    async queryProfileByCirclesAddress(circlesAddress:string) {
        const result = await this._client.query<ProfilesQuery, ProfilesQueryVariables>({
            query: ProfilesDocument,
            variables: {
                query: {
                    circlesAddress: circlesAddress
                }
            }
        });
        if (result.errors){
            console.error(result.errors);
            throw new Error(`An error occurred by querying circles address ${circlesAddress}: ${result.errors.map(o => o.message).join(`\n`)}`);
        }

        return result.data.profiles.length > 0 ? result.data.profiles[0] : undefined;
    }

    async queryOffersOfUser(fissionUsername:string) {
        return await this._client.query<OffersQuery, OffersQueryVariables>({
            query: OffersDocument,
            variables: {
                query: {
                    createdByFissionName: fissionUsername
                }
            }
        })
    }

    async queryRecentOffers() {
        return await this._client.query<OffersQuery, OffersQueryVariables>({
            query: OffersDocument,
            variables: {
                query: {
                    publishedAt_gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toJSON()
                }
            }
        })
    }

    async queryInbox(senderFissionName:string|undefined = undefined) {
        const messages = await this._client.query<InboxQuery, InboxQueryVariables>({
            query: InboxDocument,
            variables: {
                query: {
                    senderFissionName: senderFissionName
                }
            }
        });

        return messages;
    }

    async queryOutbox(recipientFissionName:string|undefined = undefined) {
        return await this._client.query<OutboxQuery, OutboxQueryVariables>({
            query: OutboxDocument,
            variables: {
                query: {
                    recipientFissionName: recipientFissionName
                }
            }
        })
    }

    async sendMessage(input:SendMessageInput) {
        return await this._client.mutate<SendMessageMutation, SendMessageMutationVariables>({
            mutation: SendMessageDocument,
            variables: {
                data: input
            }
        });
    }

    async lockOffer(input:LockOfferInput) {
        return await this._client.mutate<LockOfferMutation, LockOfferMutationVariables>({
            mutation: LockOfferDocument,
            variables: {
                data: input
            }
        });
    }

    async provePayment(input:PaymentProof) {
        return await this._client.mutate<ProvePaymentMutation, ProvePaymentMutationVariables>({
            mutation: ProvePaymentDocument,
            variables: {
                data: input
            }
        });
    }
}