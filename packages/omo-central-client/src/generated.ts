import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import { GraphQLError } from 'graphql-request/dist/types';
import { Headers } from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type Omo = {
  __typename?: 'Omo';
  did: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  fissionName: Scalars['ID'];
  fissionRoot?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  omoAvatarCid?: Maybe<Scalars['String']>;
  omoAvatarMimeType?: Maybe<Scalars['String']>;
  offers?: Maybe<Array<Offer>>;
  sentMessages?: Maybe<Array<Message>>;
  receivedMessages?: Maybe<Array<Message>>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  readAt?: Maybe<Scalars['String']>;
  namespace: Scalars['String'];
  topic: Scalars['String'];
  preview: Scalars['String'];
  cid: Scalars['String'];
  sender: Profile;
  senderFissionName: Scalars['String'];
  recipient: Profile;
  recipientFissionName: Scalars['String'];
};

export type SendMessageInput = {
  toFissionName: Scalars['String'];
  namespace: Scalars['String'];
  topic: Scalars['String'];
  preview: Scalars['String'];
  cid: Scalars['String'];
};

export type QueryInboxInput = {
  senderFissionName?: Maybe<Scalars['String']>;
  createdAt_lt?: Maybe<Scalars['String']>;
  createdAt_gt?: Maybe<Scalars['String']>;
};

export type QueryOutboxInput = {
  recipientFissionName?: Maybe<Scalars['String']>;
  createdAt_lt?: Maybe<Scalars['String']>;
  createdAt_gt?: Maybe<Scalars['String']>;
};

export type Offer = {
  __typename?: 'Offer';
  id: Scalars['Int'];
  createdBy: Profile;
  createdByFissionName: Scalars['String'];
  publishedAt: Scalars['String'];
  unpublishedAt?: Maybe<Scalars['String']>;
  purchasedAt?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  price: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  deliveryTerms: Scalars['String'];
  pictures?: Maybe<Array<File>>;
};

export type CreateOfferInput = {
  id?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  price: Scalars['String'];
  deliveryTerms: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  pictures: Array<CreateFileInput>;
};

export type QueryOfferInput = {
  createdByFissionName?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  price_lt?: Maybe<Scalars['String']>;
  price_gt?: Maybe<Scalars['String']>;
  deliveryTerms?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  publishedAt_lt?: Maybe<Scalars['String']>;
  publishedAt_gt?: Maybe<Scalars['String']>;
  unpublishedAt_lt?: Maybe<Scalars['String']>;
  unpublishedAt_gt?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  size?: Maybe<Scalars['Int']>;
  mimeType?: Maybe<Scalars['String']>;
  cid: Scalars['String'];
};

export type CreateFileInput = {
  size?: Maybe<Scalars['Int']>;
  mimeType?: Maybe<Scalars['String']>;
  cid: Scalars['String'];
};

export type QueryUniqueProfileInput = {
  fissionName?: Maybe<Scalars['String']>;
  fissionRoot?: Maybe<Scalars['String']>;
};

export type QueryProfileInput = {
  fissionName?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
};

export type UpdateProfileInput = {
  fissionRoot?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  omoAvatarCid?: Maybe<Scalars['String']>;
  omoAvatarMimeType?: Maybe<Scalars['String']>;
};

export type LockOfferInput = {
  offerId: Scalars['Int'];
};

export type LockOfferResult = {
  __typename?: 'LockOfferResult';
  success: Scalars['Boolean'];
  lockedUntil?: Maybe<Scalars['String']>;
};

export type PaymentProof = {
  forOfferId: Scalars['Int'];
  tokenOwners: Array<Scalars['String']>;
  sources: Array<Scalars['String']>;
  destinations: Array<Scalars['String']>;
  values: Array<Scalars['String']>;
};

export type ProvePaymentResult = {
  __typename?: 'ProvePaymentResult';
  success: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  omo?: Maybe<Omo>;
  fissionRoot: Scalars['String'];
  profile: Profile;
  profiles: Array<Profile>;
  offer: Offer;
  offers: Array<Offer>;
  inbox: Array<Message>;
  outbox: Array<Message>;
};


export type QueryFissionRootArgs = {
  query: QueryUniqueProfileInput;
};


export type QueryProfileArgs = {
  query: QueryUniqueProfileInput;
};


export type QueryProfilesArgs = {
  query: QueryProfileInput;
};


export type QueryOfferArgs = {
  offerId: Scalars['Int'];
};


export type QueryOffersArgs = {
  query: QueryOfferInput;
};


export type QueryInboxArgs = {
  query?: Maybe<QueryInboxInput>;
};


export type QueryOutboxArgs = {
  query?: Maybe<QueryOutboxInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  upsertProfile: Profile;
  createOffer: Offer;
  unpublishOffer: Scalars['Boolean'];
  sendMessage: Message;
  markMessageAsRead: Scalars['Boolean'];
  lockOffer: LockOfferResult;
  provePayment: ProvePaymentResult;
};


export type MutationUpsertProfileArgs = {
  data: UpdateProfileInput;
};


export type MutationCreateOfferArgs = {
  data: CreateOfferInput;
};


export type MutationUnpublishOfferArgs = {
  offerId: Scalars['Int'];
};


export type MutationSendMessageArgs = {
  data: SendMessageInput;
};


export type MutationMarkMessageAsReadArgs = {
  messageId: Scalars['Int'];
};


export type MutationLockOfferArgs = {
  data: LockOfferInput;
};


export type MutationProvePaymentArgs = {
  data: PaymentProof;
};

export type Subscription = {
  __typename?: 'Subscription';
  messages?: Maybe<Message>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type UpsertProfileMutationVariables = Exact<{
  data: UpdateProfileInput;
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'fissionName' | 'fissionRoot' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
  ) }
);

export type CreateOfferMutationVariables = Exact<{
  data: CreateOfferInput;
}>;


export type CreateOfferMutation = (
  { __typename?: 'Mutation' }
  & { createOffer: (
    { __typename?: 'Offer' }
    & Pick<Offer, 'category' | 'city' | 'country' | 'deliveryTerms' | 'description' | 'id' | 'price' | 'publishedAt' | 'title' | 'unpublishedAt'>
    & { createdBy: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'fissionName' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'circlesAddress' | 'omoFirstName' | 'omoLastName'>
    ), pictures?: Maybe<Array<(
      { __typename?: 'File' }
      & Pick<File, 'size' | 'mimeType' | 'cid'>
    )>> }
  ) }
);

export type UnpublishOfferMutationVariables = Exact<{
  offerId: Scalars['Int'];
}>;


export type UnpublishOfferMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'unpublishOffer'>
);

export type SendMessageMutationVariables = Exact<{
  data: SendMessageInput;
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'createdAt' | 'readAt' | 'topic' | 'senderFissionName' | 'recipientFissionName' | 'cid'>
  ) }
);

export type MarkMessageAsReadMutationVariables = Exact<{
  messageId: Scalars['Int'];
}>;


export type MarkMessageAsReadMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'markMessageAsRead'>
);

export type LockOfferMutationVariables = Exact<{
  data: LockOfferInput;
}>;


export type LockOfferMutation = (
  { __typename?: 'Mutation' }
  & { lockOffer: (
    { __typename?: 'LockOfferResult' }
    & Pick<LockOfferResult, 'success' | 'lockedUntil'>
  ) }
);

export type ProvePaymentMutationVariables = Exact<{
  data: PaymentProof;
}>;


export type ProvePaymentMutation = (
  { __typename?: 'Mutation' }
  & { provePayment: (
    { __typename?: 'ProvePaymentResult' }
    & Pick<ProvePaymentResult, 'success'>
  ) }
);

export type OmoQueryVariables = Exact<{ [key: string]: never; }>;


export type OmoQuery = (
  { __typename?: 'Query' }
  & { omo?: Maybe<(
    { __typename?: 'Omo' }
    & Pick<Omo, 'did'>
  )> }
);

export type FissionRootQueryVariables = Exact<{
  fields: QueryUniqueProfileInput;
}>;


export type FissionRootQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'fissionRoot'>
);

export type ProfileQueryVariables = Exact<{
  query: QueryUniqueProfileInput;
}>;


export type ProfileQuery = (
  { __typename?: 'Query' }
  & { profile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'fissionName' | 'fissionRoot' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
  ) }
);

export type ProfilesQueryVariables = Exact<{
  query: QueryProfileInput;
}>;


export type ProfilesQuery = (
  { __typename?: 'Query' }
  & { profiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'fissionName' | 'fissionRoot' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
  )> }
);

export type InboxQueryVariables = Exact<{
  query?: Maybe<QueryInboxInput>;
}>;


export type InboxQuery = (
  { __typename?: 'Query' }
  & { inbox: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'createdAt' | 'readAt' | 'senderFissionName' | 'recipientFissionName' | 'preview' | 'cid'>
    & { sender: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'fissionName' | 'circlesAddress' | 'omoAvatarCid' | 'omoFirstName' | 'omoLastName'>
    ), recipient: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'fissionName' | 'circlesAddress' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
    ) }
  )> }
);

export type OutboxQueryVariables = Exact<{
  query?: Maybe<QueryOutboxInput>;
}>;


export type OutboxQuery = (
  { __typename?: 'Query' }
  & { outbox: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'createdAt' | 'readAt' | 'senderFissionName' | 'recipientFissionName' | 'preview' | 'cid'>
    & { sender: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'fissionName' | 'circlesAddress' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
    ), recipient: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'fissionName' | 'circlesAddress' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
    ) }
  )> }
);

export type OffersQueryVariables = Exact<{
  query: QueryOfferInput;
}>;


export type OffersQuery = (
  { __typename?: 'Query' }
  & { offers: Array<(
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'publishedAt' | 'unpublishedAt' | 'title' | 'description' | 'price' | 'category' | 'country' | 'city' | 'deliveryTerms'>
    & { createdBy: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'circlesAddress' | 'fissionName' | 'omoAvatarCid' | 'omoAvatarMimeType' | 'omoFirstName' | 'omoLastName'>
    ), pictures?: Maybe<Array<(
      { __typename?: 'File' }
      & Pick<File, 'size' | 'mimeType' | 'cid'>
    )>> }
  )> }
);

export type MessagesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessagesSubscription = (
  { __typename?: 'Subscription' }
  & { messages?: Maybe<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'topic' | 'createdAt' | 'readAt' | 'senderFissionName' | 'recipientFissionName' | 'cid'>
  )> }
);


export const UpsertProfileDocument = gql`
    mutation upsertProfile($data: UpdateProfileInput!) {
  upsertProfile(data: $data) {
    circlesAddress
    fissionName
    fissionRoot
    omoAvatarCid
    omoAvatarMimeType
    omoFirstName
    omoLastName
  }
}
    `;
export const CreateOfferDocument = gql`
    mutation createOffer($data: CreateOfferInput!) {
  createOffer(data: $data) {
    category
    city
    country
    createdBy {
      fissionName
      omoAvatarCid
      omoAvatarMimeType
      circlesAddress
      omoFirstName
      omoLastName
    }
    deliveryTerms
    description
    id
    pictures {
      size
      mimeType
      cid
    }
    price
    publishedAt
    title
    unpublishedAt
  }
}
    `;
export const UnpublishOfferDocument = gql`
    mutation unpublishOffer($offerId: Int!) {
  unpublishOffer(offerId: $offerId)
}
    `;
export const SendMessageDocument = gql`
    mutation sendMessage($data: SendMessageInput!) {
  sendMessage(data: $data) {
    id
    createdAt
    readAt
    topic
    senderFissionName
    recipientFissionName
    cid
  }
}
    `;
export const MarkMessageAsReadDocument = gql`
    mutation markMessageAsRead($messageId: Int!) {
  markMessageAsRead(messageId: $messageId)
}
    `;
export const LockOfferDocument = gql`
    mutation lockOffer($data: LockOfferInput!) {
  lockOffer(data: $data) {
    success
    lockedUntil
  }
}
    `;
export const ProvePaymentDocument = gql`
    mutation provePayment($data: PaymentProof!) {
  provePayment(data: $data) {
    success
  }
}
    `;
export const OmoDocument = gql`
    query omo {
  omo {
    did
  }
}
    `;
export const FissionRootDocument = gql`
    query fissionRoot($fields: QueryUniqueProfileInput!) {
  fissionRoot(query: $fields)
}
    `;
export const ProfileDocument = gql`
    query profile($query: QueryUniqueProfileInput!) {
  profile(query: $query) {
    circlesAddress
    fissionName
    fissionRoot
    omoAvatarCid
    omoAvatarMimeType
    omoFirstName
    omoLastName
  }
}
    `;
export const ProfilesDocument = gql`
    query profiles($query: QueryProfileInput!) {
  profiles(query: $query) {
    circlesAddress
    fissionName
    fissionRoot
    omoAvatarCid
    omoAvatarMimeType
    omoFirstName
    omoLastName
  }
}
    `;
export const InboxDocument = gql`
    query inbox($query: QueryInboxInput) {
  inbox(query: $query) {
    id
    createdAt
    readAt
    senderFissionName
    sender {
      fissionName
      circlesAddress
      omoAvatarCid
      omoFirstName
      omoLastName
    }
    recipientFissionName
    recipient {
      fissionName
      circlesAddress
      omoAvatarCid
      omoAvatarMimeType
      omoFirstName
      omoLastName
    }
    preview
    cid
  }
}
    `;
export const OutboxDocument = gql`
    query outbox($query: QueryOutboxInput) {
  outbox(query: $query) {
    id
    createdAt
    readAt
    senderFissionName
    sender {
      fissionName
      circlesAddress
      omoAvatarCid
      omoAvatarMimeType
      omoFirstName
      omoLastName
    }
    recipientFissionName
    recipient {
      fissionName
      circlesAddress
      omoAvatarCid
      omoAvatarMimeType
      omoFirstName
      omoLastName
    }
    preview
    cid
  }
}
    `;
export const OffersDocument = gql`
    query offers($query: QueryOfferInput!) {
  offers(query: $query) {
    id
    publishedAt
    unpublishedAt
    createdBy {
      circlesAddress
      fissionName
      omoAvatarCid
      omoAvatarMimeType
      omoFirstName
      omoLastName
    }
    title
    description
    price
    category
    country
    city
    deliveryTerms
    pictures {
      size
      mimeType
      cid
    }
  }
}
    `;
export const MessagesDocument = gql`
    subscription messages {
  messages {
    id
    topic
    createdAt
    readAt
    senderFissionName
    recipientFissionName
    cid
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    upsertProfile(variables: UpsertProfileMutationVariables): Promise<{ data?: UpsertProfileMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UpsertProfileMutation>(print(UpsertProfileDocument), variables));
    },
    createOffer(variables: CreateOfferMutationVariables): Promise<{ data?: CreateOfferMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<CreateOfferMutation>(print(CreateOfferDocument), variables));
    },
    unpublishOffer(variables: UnpublishOfferMutationVariables): Promise<{ data?: UnpublishOfferMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UnpublishOfferMutation>(print(UnpublishOfferDocument), variables));
    },
    sendMessage(variables: SendMessageMutationVariables): Promise<{ data?: SendMessageMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<SendMessageMutation>(print(SendMessageDocument), variables));
    },
    markMessageAsRead(variables: MarkMessageAsReadMutationVariables): Promise<{ data?: MarkMessageAsReadMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<MarkMessageAsReadMutation>(print(MarkMessageAsReadDocument), variables));
    },
    lockOffer(variables: LockOfferMutationVariables): Promise<{ data?: LockOfferMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LockOfferMutation>(print(LockOfferDocument), variables));
    },
    provePayment(variables: ProvePaymentMutationVariables): Promise<{ data?: ProvePaymentMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ProvePaymentMutation>(print(ProvePaymentDocument), variables));
    },
    omo(variables?: OmoQueryVariables): Promise<{ data?: OmoQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<OmoQuery>(print(OmoDocument), variables));
    },
    fissionRoot(variables: FissionRootQueryVariables): Promise<{ data?: FissionRootQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<FissionRootQuery>(print(FissionRootDocument), variables));
    },
    profile(variables: ProfileQueryVariables): Promise<{ data?: ProfileQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ProfileQuery>(print(ProfileDocument), variables));
    },
    profiles(variables: ProfilesQueryVariables): Promise<{ data?: ProfilesQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ProfilesQuery>(print(ProfilesDocument), variables));
    },
    inbox(variables?: InboxQueryVariables): Promise<{ data?: InboxQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<InboxQuery>(print(InboxDocument), variables));
    },
    outbox(variables?: OutboxQueryVariables): Promise<{ data?: OutboxQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<OutboxQuery>(print(OutboxDocument), variables));
    },
    offers(variables: OffersQueryVariables): Promise<{ data?: OffersQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<OffersQuery>(print(OffersDocument), variables));
    },
    messages(variables?: MessagesSubscriptionVariables): Promise<{ data?: MessagesSubscription | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<MessagesSubscription>(print(MessagesDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;