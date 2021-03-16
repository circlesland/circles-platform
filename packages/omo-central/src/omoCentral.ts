import {Message} from "./generated";
import {Observable} from "rxjs";
import {ApolloQueryResult} from "apollo-client/core/types"
import {authorize} from "./fission/auhtorize";
import {ApiConnection} from "./server/apiConnection";
import {AuthSucceeded, buildUcan, Continuation, redirectToLobby, Scenario, State} from "../../omo-webnative/dist";
import ApolloClient from "apollo-client";
import {NormalizedCacheObject} from "apollo-cache-inmemory"
import {
    OffersDocument,
    OffersQuery,
    OffersQueryVariables,
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
    PaymentProof,
    ProvePaymentMutation,
    ProvePaymentMutationVariables,
    ProvePaymentDocument,
    ConversationQuery,
    ConversationQueryVariables,
    ConversationDocument,
    ContactsQuery,
    ContactsQueryVariables,
    ContactsDocument,
    FissionRootQuery, FissionRootQueryVariables, FissionRootDocument
} from "./generated";
import {AsyncBroadcast} from "omo-utils/dist/asyncBroadcast";
import {api} from "omo-webnative/dist/common";

export const omoCentralServerUrl = "http://localhost:8989/graphql"
export const lobbyThemeCid = "QmPjh5wi3j9L7rJ8wYUAnFBbjT33EiNtzkeyepDjau5F2P";

/**
 * Provides the main interface for communication and storage within omo.
 */
export class OmoCentral {
    static readonly instance = new AsyncBroadcast<void, OmoCentral>(async () => {
        if (!OmoCentral._instance) {
            OmoCentral._instance = await OmoCentral.create();
        }
        return OmoCentral._instance;
    });
    private static _instance:OmoCentral|undefined;

    get events(): Observable<Message> {
        return this._apiConnection.events;
    }

    get fissionAuthState(): AuthSucceeded|Continuation {
        return this._fissionAuthState;
    }

    private constructor(fissionAuthState: AuthSucceeded|Continuation, apiConnection: ApiConnection) {
        this._fissionAuthState = fissionAuthState;
        this._apiConnection = apiConnection;
    }

    private static async create() {
        const fissionAuthState = await authorize(lobbyThemeCid, true /*false*/);
        if (!fissionAuthState) {
            throw new Error(`Not authorized.`);
        }

        const apiConnection = new ApiConnection(omoCentralServerUrl, async () => await buildUcan());
        return new OmoCentral(fissionAuthState, apiConnection);
    }

    private readonly _apiConnection: ApiConnection;
    private readonly _fissionAuthState: AuthSucceeded|Continuation;

    private async withClient<TOut>(func: (client: ApolloClient<NormalizedCacheObject>) => TOut): Promise<TOut> {
        const client = await this._apiConnection.client.subscribeToResult();
        return func(client);
    }

    private throwOnErrorOrData<T>(result: ApolloQueryResult<T>) {
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach(err => console.warn(err));
            throw new Error(`${result.errors.length} errors occurred in a operation. See the previous warnings for details.`);
        }
        return result.data;
    }

    destroy() {
        if (this._apiConnection) {
            this._apiConnection.destroy();
        }
    }

    //
    // Mutations
    //
    async upsertProfile(data: UpdateProfileInput) {
        return await this.withClient(async client =>
            await client.mutate<UpsertProfileMutation, UpsertProfileMutationVariables>({
            mutation: UpsertProfileDocument,
            variables: {
                data
            }
        }));
    }

    async createOffer(data: CreateOfferInput) {
        return await this.withClient(async client =>
            await client.mutate<CreateOfferMutation, CreateOfferMutationVariables>({
            mutation: CreateOfferDocument,
            variables: {
                data
            }
        }));
    }

    async sendMessage(input: SendMessageInput) {
        return await this.withClient(async client =>
            await client.mutate<SendMessageMutation, SendMessageMutationVariables>({
            mutation: SendMessageDocument,
            variables: {
                data: input
            }
        }));
    }

    async lockOffer(input: LockOfferInput) {
        return await this.withClient(async client =>
            await client.mutate<LockOfferMutation, LockOfferMutationVariables>({
            mutation: LockOfferDocument,
            variables: {
                data: input
            }
        }));
    }

    async provePayment(input: PaymentProof) {
        return await this.withClient(async client =>
            await client.mutate<ProvePaymentMutation, ProvePaymentMutationVariables>({
            mutation: ProvePaymentDocument,
            variables: {
                data: input
            }
        }));
    }

    //
    // Queries
    //

    async fissionRoot(fissionUsername: string) {
        return this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<FissionRootQuery, FissionRootQueryVariables>({
                    query: FissionRootDocument,
                    variables: {
                        query: {
                            fissionName: fissionUsername
                        }
                    }
                })));
    }

    async queryProfileByCirclesAddress(circlesAddress: string) {
        const result = this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<ProfilesQuery, ProfilesQueryVariables>({
                    query: ProfilesDocument,
                    variables: {
                        query: {
                            circlesAddress: circlesAddress
                        }
                    }
            })));

        return result.profiles.length > 0 ? result.profiles[0] : undefined;
    }

    async queryContacts(fissionUsername: string) {
        return this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<ContactsQuery, ContactsQueryVariables>({
                    query: ContactsDocument,
                    variables: {
                        query: {
                            fissionName: fissionUsername
                        }
                    }
                })));
    }

    async queryOffersOfUser(fissionUsername: string) {
        return this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<OffersQuery, OffersQueryVariables>({
                    query: OffersDocument,
                    variables: {
                        query: {
                            createdByFissionName: fissionUsername
                        }
                    }
                })));
    }

    async queryRecentOffers() {
        return this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<OffersQuery, OffersQueryVariables>({
                    query: OffersDocument,
                    variables: {
                        query: {
                            publishedAt_gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toJSON()
                        }
                    }
                })));
    }

    async queryConversation(withFissionName: string) {
        return this.throwOnErrorOrData(
            await this.withClient(async client =>
                await client.query<ConversationQuery, ConversationQueryVariables>({
                    query: ConversationDocument,
                    variables: {
                        query: {
                            withFissionName: withFissionName
                        }
                    }
                })));
    }
}