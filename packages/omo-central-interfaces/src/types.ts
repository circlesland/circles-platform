import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Server = {
  __typename?: 'Server';
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
  contacts?: Maybe<Array<Contact>>;
  purchases?: Maybe<Array<Purchase>>;
  activities?: Maybe<Array<Activity>>;
  keyPairs?: Maybe<Array<KeyPair>>;
};

export type KeyPair = {
  __typename?: 'KeyPair';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  publicKey: Scalars['String'];
  privateKey: Scalars['String'];
};

export type AddKeyPairInput = {
  type: Scalars['String'];
  name: Scalars['String'];
  publicKey: Scalars['String'];
  privateKey: Scalars['String'];
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  isMuted?: Maybe<Scalars['Boolean']>;
  anchorProfile?: Maybe<Profile>;
  contactProfile?: Maybe<Profile>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  readAt?: Maybe<Scalars['String']>;
  topic: Scalars['String'];
  type: Scalars['String'];
  content: Scalars['String'];
  sender: Profile;
  senderFissionName: Scalars['String'];
  recipient: Profile;
  recipientFissionName: Scalars['String'];
};

export type SendMessageInput = {
  toFissionName: Scalars['String'];
  topic: Scalars['String'];
  type: Scalars['String'];
  content: Scalars['String'];
};

export type QueryConversationInput = {
  withFissionName: Scalars['String'];
};

export type Offer = {
  __typename?: 'Offer';
  id: Scalars['Int'];
  createdBy?: Maybe<Profile>;
  createdByFissionName: Scalars['String'];
  publishedAt: Scalars['String'];
  unlistedAt?: Maybe<Scalars['String']>;
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
  id?: Maybe<Scalars['Int']>;
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
  unlistedAt?: Maybe<Scalars['String']>;
  unlistedAt_lt?: Maybe<Scalars['String']>;
  unlistedAt_gt?: Maybe<Scalars['String']>;
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

export enum PurchaseStatus {
  Invalid = 'INVALID',
  ItemLocked = 'ITEM_LOCKED',
  PaymentProven = 'PAYMENT_PROVEN'
}

export type Purchase = {
  __typename?: 'Purchase';
  id: Scalars['Int'];
  purchasedAt: Scalars['String'];
  status: PurchaseStatus;
  purchasedFrom?: Maybe<Profile>;
  purchasedBy: Profile;
  purchasedItem: Offer;
};

export type QueryPurchaseInput = {
  id?: Maybe<Scalars['Int']>;
  purchasedByFissionName?: Maybe<Scalars['String']>;
  purchasedItemId?: Maybe<Scalars['Int']>;
};

export enum ActivityPredicate {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Proved = 'PROVED',
  Received = 'RECEIVED',
  Closed = 'CLOSED'
}

export type Activity = {
  __typename?: 'Activity';
  timestamp: Scalars['String'];
  isPublic: Scalars['Boolean'];
  subjectType: Scalars['String'];
  subjectKey: Scalars['String'];
  predicate: Scalars['String'];
  objectType: Scalars['String'];
  objectKey: Scalars['String'];
};

export type QueryActivityInput = {
  subjectType: Scalars['String'];
  subjectKey: Scalars['String'];
};

export type CirclesTokenTransfer = {
  __typename?: 'CirclesTokenTransfer';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subject: CirclesWallet;
  predicate: CirclesTokenTransferPredicate;
  object: CirclesWallet;
  value: Scalars['String'];
};

export type AddCirclesTokenTransferInput = {
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  tokenAddress: Scalars['String'];
  subjectAddress: Scalars['String'];
  predicate: CirclesTokenTransferPredicate;
  objectAddress: Scalars['String'];
  value: Scalars['String'];
};

export enum CirclesTokenTransferPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export type CirclesTrustRelation = {
  __typename?: 'CirclesTrustRelation';
  id: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subject: CirclesWallet;
  predicate: CirclesTrustRelationPredicate;
  object: CirclesWallet;
  weight: Scalars['Int'];
};

export type AddCirclesTrustRelationInput = {
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  subjectAddress: Scalars['String'];
  predicate: CirclesTrustRelationPredicate;
  objectAddress: Scalars['String'];
  weight: Scalars['Int'];
};

export enum CirclesTrustRelationPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export type CirclesToken = {
  __typename?: 'CirclesToken';
  address: Scalars['String'];
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
  owner?: Maybe<CirclesWallet>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
};

export type AddCirclesTokenInput = {
  address: Scalars['String'];
  owner?: Maybe<AddCirclesWalletInput>;
  createdAt: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  createdInBlockHash: Scalars['String'];
};

export type CirclesWallet = {
  __typename?: 'CirclesWallet';
  address: Scalars['String'];
  ownToken?: Maybe<CirclesToken>;
  tokens?: Maybe<Array<CirclesToken>>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
  trustRelations?: Maybe<Array<CirclesTrustRelation>>;
};

export type AddCirclesWalletInput = {
  address: Scalars['String'];
  ownToken?: Maybe<AddCirclesTokenInput>;
};

export type QueryCirclesWalletInput = {
  address?: Maybe<Scalars['String']>;
  ownTokenAddress?: Maybe<Scalars['String']>;
  trusts?: Maybe<Scalars['String']>;
  isTrustedBy?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  server?: Maybe<Server>;
  fissionRoot: Scalars['String'];
  profiles: Array<Profile>;
  offers: Array<Offer>;
  activities: Array<Activity>;
  contacts: Array<Contact>;
  conversation: Array<Message>;
  purchases: Array<Purchase>;
  circlesWallets: Array<CirclesWallet>;
};


export type QueryFissionRootArgs = {
  query: QueryUniqueProfileInput;
};


export type QueryProfilesArgs = {
  query: QueryProfileInput;
};


export type QueryOffersArgs = {
  query: QueryOfferInput;
};


export type QueryActivitiesArgs = {
  query: QueryActivityInput;
};


export type QueryContactsArgs = {
  query: QueryUniqueProfileInput;
};


export type QueryConversationArgs = {
  query: QueryConversationInput;
};


export type QueryPurchasesArgs = {
  query: QueryPurchaseInput;
};


export type QueryCirclesWalletsArgs = {
  query: QueryCirclesWalletInput;
};

export type Mutation = {
  __typename?: 'Mutation';
  upsertProfile: Profile;
  addKeyPair: KeyPair;
  removeKeyPair: Scalars['Boolean'];
  createOffer: Offer;
  unlistOffer: Scalars['Boolean'];
  sendMessage: Message;
  markMessageAsRead: Scalars['Boolean'];
  lockOffer: LockOfferResult;
  provePayment: ProvePaymentResult;
  addCirclesWallet: CirclesWallet;
  addCirclesToken: CirclesToken;
  addCirclesTrustRelation: CirclesTrustRelation;
  addCirclesTokenTransfer: CirclesTokenTransfer;
};


export type MutationUpsertProfileArgs = {
  data: UpdateProfileInput;
};


export type MutationAddKeyPairArgs = {
  data: AddKeyPairInput;
};


export type MutationRemoveKeyPairArgs = {
  keyPairId: Scalars['Int'];
};


export type MutationCreateOfferArgs = {
  data: CreateOfferInput;
};


export type MutationUnlistOfferArgs = {
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


export type MutationAddCirclesWalletArgs = {
  data: AddCirclesWalletInput;
};


export type MutationAddCirclesTokenArgs = {
  data: AddCirclesTokenInput;
};


export type MutationAddCirclesTrustRelationArgs = {
  data: AddCirclesTrustRelationInput;
};


export type MutationAddCirclesTokenTransferArgs = {
  data: AddCirclesTokenTransferInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  activities?: Maybe<Activity>;
  messages?: Maybe<Message>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Server: ResolverTypeWrapper<Server>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Profile: ResolverTypeWrapper<Profile>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  KeyPair: ResolverTypeWrapper<KeyPair>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  AddKeyPairInput: AddKeyPairInput;
  Contact: ResolverTypeWrapper<Contact>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Message: ResolverTypeWrapper<Message>;
  SendMessageInput: SendMessageInput;
  QueryConversationInput: QueryConversationInput;
  Offer: ResolverTypeWrapper<Offer>;
  CreateOfferInput: CreateOfferInput;
  QueryOfferInput: QueryOfferInput;
  File: ResolverTypeWrapper<File>;
  CreateFileInput: CreateFileInput;
  QueryUniqueProfileInput: QueryUniqueProfileInput;
  QueryProfileInput: QueryProfileInput;
  UpdateProfileInput: UpdateProfileInput;
  LockOfferInput: LockOfferInput;
  LockOfferResult: ResolverTypeWrapper<LockOfferResult>;
  PaymentProof: PaymentProof;
  ProvePaymentResult: ResolverTypeWrapper<ProvePaymentResult>;
  PurchaseStatus: PurchaseStatus;
  Purchase: ResolverTypeWrapper<Purchase>;
  QueryPurchaseInput: QueryPurchaseInput;
  ActivityPredicate: ActivityPredicate;
  Activity: ResolverTypeWrapper<Activity>;
  QueryActivityInput: QueryActivityInput;
  CirclesTokenTransfer: ResolverTypeWrapper<CirclesTokenTransfer>;
  AddCirclesTokenTransferInput: AddCirclesTokenTransferInput;
  CirclesTokenTransferPredicate: CirclesTokenTransferPredicate;
  CirclesTrustRelation: ResolverTypeWrapper<CirclesTrustRelation>;
  AddCirclesTrustRelationInput: AddCirclesTrustRelationInput;
  CirclesTrustRelationPredicate: CirclesTrustRelationPredicate;
  CirclesToken: ResolverTypeWrapper<CirclesToken>;
  AddCirclesTokenInput: AddCirclesTokenInput;
  CirclesWallet: ResolverTypeWrapper<CirclesWallet>;
  AddCirclesWalletInput: AddCirclesWalletInput;
  QueryCirclesWalletInput: QueryCirclesWalletInput;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Server: Server;
  String: Scalars['String'];
  Profile: Profile;
  ID: Scalars['ID'];
  KeyPair: KeyPair;
  Int: Scalars['Int'];
  AddKeyPairInput: AddKeyPairInput;
  Contact: Contact;
  Boolean: Scalars['Boolean'];
  Message: Message;
  SendMessageInput: SendMessageInput;
  QueryConversationInput: QueryConversationInput;
  Offer: Offer;
  CreateOfferInput: CreateOfferInput;
  QueryOfferInput: QueryOfferInput;
  File: File;
  CreateFileInput: CreateFileInput;
  QueryUniqueProfileInput: QueryUniqueProfileInput;
  QueryProfileInput: QueryProfileInput;
  UpdateProfileInput: UpdateProfileInput;
  LockOfferInput: LockOfferInput;
  LockOfferResult: LockOfferResult;
  PaymentProof: PaymentProof;
  ProvePaymentResult: ProvePaymentResult;
  Purchase: Purchase;
  QueryPurchaseInput: QueryPurchaseInput;
  Activity: Activity;
  QueryActivityInput: QueryActivityInput;
  CirclesTokenTransfer: CirclesTokenTransfer;
  AddCirclesTokenTransferInput: AddCirclesTokenTransferInput;
  CirclesTrustRelation: CirclesTrustRelation;
  AddCirclesTrustRelationInput: AddCirclesTrustRelationInput;
  CirclesToken: CirclesToken;
  AddCirclesTokenInput: AddCirclesTokenInput;
  CirclesWallet: CirclesWallet;
  AddCirclesWalletInput: AddCirclesWalletInput;
  QueryCirclesWalletInput: QueryCirclesWalletInput;
  Query: {};
  Mutation: {};
  Subscription: {};
}>;

export type ServerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Server'] = ResolversParentTypes['Server']> = ResolversObject<{
  did?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  fissionName?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fissionRoot?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  circlesAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  omoFirstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  omoLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  omoAvatarCid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  omoAvatarMimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offers?: Resolver<Maybe<Array<ResolversTypes['Offer']>>, ParentType, ContextType>;
  contacts?: Resolver<Maybe<Array<ResolversTypes['Contact']>>, ParentType, ContextType>;
  purchases?: Resolver<Maybe<Array<ResolversTypes['Purchase']>>, ParentType, ContextType>;
  activities?: Resolver<Maybe<Array<ResolversTypes['Activity']>>, ParentType, ContextType>;
  keyPairs?: Resolver<Maybe<Array<ResolversTypes['KeyPair']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type KeyPairResolvers<ContextType = any, ParentType extends ResolversParentTypes['KeyPair'] = ResolversParentTypes['KeyPair']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  privateKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isMuted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  anchorProfile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  contactProfile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  readAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topic?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  senderFissionName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  recipientFissionName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OfferResolvers<ContextType = any, ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  createdByFissionName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unlistedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purchasedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveryTerms?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pictures?: Resolver<Maybe<Array<ResolversTypes['File']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = ResolversObject<{
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LockOfferResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LockOfferResult'] = ResolversParentTypes['LockOfferResult']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lockedUntil?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProvePaymentResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProvePaymentResult'] = ResolversParentTypes['ProvePaymentResult']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Purchase'] = ResolversParentTypes['Purchase']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  purchasedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PurchaseStatus'], ParentType, ContextType>;
  purchasedFrom?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  purchasedBy?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  purchasedItem?: Resolver<ResolversTypes['Offer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = ResolversObject<{
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subjectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subjectKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesTokenTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesTokenTransfer'] = ResolversParentTypes['CirclesTokenTransfer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['CirclesTokenTransferPredicate'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesTrustRelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesTrustRelation'] = ResolversParentTypes['CirclesTrustRelation']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  predicate?: Resolver<ResolversTypes['CirclesTrustRelationPredicate'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesToken'] = ResolversParentTypes['CirclesToken']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdInBlockNo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdInBlockHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['CirclesWallet']>, ParentType, ContextType>;
  transfers?: Resolver<Maybe<Array<ResolversTypes['CirclesTokenTransfer']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CirclesWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['CirclesWallet'] = ResolversParentTypes['CirclesWallet']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownToken?: Resolver<Maybe<ResolversTypes['CirclesToken']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<Array<ResolversTypes['CirclesToken']>>, ParentType, ContextType>;
  transfers?: Resolver<Maybe<Array<ResolversTypes['CirclesTokenTransfer']>>, ParentType, ContextType>;
  trustRelations?: Resolver<Maybe<Array<ResolversTypes['CirclesTrustRelation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  server?: Resolver<Maybe<ResolversTypes['Server']>, ParentType, ContextType>;
  fissionRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryFissionRootArgs, 'query'>>;
  profiles?: Resolver<Array<ResolversTypes['Profile']>, ParentType, ContextType, RequireFields<QueryProfilesArgs, 'query'>>;
  offers?: Resolver<Array<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryOffersArgs, 'query'>>;
  activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<QueryActivitiesArgs, 'query'>>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType, RequireFields<QueryContactsArgs, 'query'>>;
  conversation?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryConversationArgs, 'query'>>;
  purchases?: Resolver<Array<ResolversTypes['Purchase']>, ParentType, ContextType, RequireFields<QueryPurchasesArgs, 'query'>>;
  circlesWallets?: Resolver<Array<ResolversTypes['CirclesWallet']>, ParentType, ContextType, RequireFields<QueryCirclesWalletsArgs, 'query'>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  upsertProfile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<MutationUpsertProfileArgs, 'data'>>;
  addKeyPair?: Resolver<ResolversTypes['KeyPair'], ParentType, ContextType, RequireFields<MutationAddKeyPairArgs, 'data'>>;
  removeKeyPair?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveKeyPairArgs, 'keyPairId'>>;
  createOffer?: Resolver<ResolversTypes['Offer'], ParentType, ContextType, RequireFields<MutationCreateOfferArgs, 'data'>>;
  unlistOffer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnlistOfferArgs, 'offerId'>>;
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'data'>>;
  markMessageAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkMessageAsReadArgs, 'messageId'>>;
  lockOffer?: Resolver<ResolversTypes['LockOfferResult'], ParentType, ContextType, RequireFields<MutationLockOfferArgs, 'data'>>;
  provePayment?: Resolver<ResolversTypes['ProvePaymentResult'], ParentType, ContextType, RequireFields<MutationProvePaymentArgs, 'data'>>;
  addCirclesWallet?: Resolver<ResolversTypes['CirclesWallet'], ParentType, ContextType, RequireFields<MutationAddCirclesWalletArgs, 'data'>>;
  addCirclesToken?: Resolver<ResolversTypes['CirclesToken'], ParentType, ContextType, RequireFields<MutationAddCirclesTokenArgs, 'data'>>;
  addCirclesTrustRelation?: Resolver<ResolversTypes['CirclesTrustRelation'], ParentType, ContextType, RequireFields<MutationAddCirclesTrustRelationArgs, 'data'>>;
  addCirclesTokenTransfer?: Resolver<ResolversTypes['CirclesTokenTransfer'], ParentType, ContextType, RequireFields<MutationAddCirclesTokenTransferArgs, 'data'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  activities?: SubscriptionResolver<Maybe<ResolversTypes['Activity']>, "activities", ParentType, ContextType>;
  messages?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "messages", ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Server?: ServerResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  KeyPair?: KeyPairResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  LockOfferResult?: LockOfferResultResolvers<ContextType>;
  ProvePaymentResult?: ProvePaymentResultResolvers<ContextType>;
  Purchase?: PurchaseResolvers<ContextType>;
  Activity?: ActivityResolvers<ContextType>;
  CirclesTokenTransfer?: CirclesTokenTransferResolvers<ContextType>;
  CirclesTrustRelation?: CirclesTrustRelationResolvers<ContextType>;
  CirclesToken?: CirclesTokenResolvers<ContextType>;
  CirclesWallet?: CirclesWalletResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
