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
  contacts?: Maybe<Array<Contact>>;
  purchases?: Maybe<Array<Purchase>>;
  activities?: Maybe<Array<Activity>>;
};

export type Contact = {
  __typename?: 'Contact';
  id: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
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

export type QueryConversationInput = {
  withFissionName: Scalars['String'];
};

export type Offer = {
  __typename?: 'Offer';
  id: Scalars['Int'];
  createdBy?: Maybe<Profile>;
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
  purchasedFrom: Profile;
  purchasedBy: Profile;
  purchasedItem: Offer;
};

export type QueryPurchaseInput = {
  purchasedByFissionName: Scalars['String'];
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

export type Query = {
  __typename?: 'Query';
  omo?: Maybe<Omo>;
  fissionRoot: Scalars['String'];
  profiles: Array<Profile>;
  offer: Offer;
  offers: Array<Offer>;
  contacts: Array<Contact>;
  inbox: Array<Message>;
  outbox: Array<Message>;
  conversation: Array<Message>;
  purchases: Array<Purchase>;
  activities: Array<Activity>;
};


export type QueryFissionRootArgs = {
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


export type QueryContactsArgs = {
  query: QueryUniqueProfileInput;
};


export type QueryInboxArgs = {
  query?: Maybe<QueryInboxInput>;
};


export type QueryOutboxArgs = {
  query?: Maybe<QueryOutboxInput>;
};


export type QueryConversationArgs = {
  query: QueryConversationInput;
};


export type QueryPurchasesArgs = {
  query: QueryPurchaseInput;
};


export type QueryActivitiesArgs = {
  query: QueryActivityInput;
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
  Omo: ResolverTypeWrapper<Omo>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Profile: ResolverTypeWrapper<Profile>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Contact: ResolverTypeWrapper<Contact>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Message: ResolverTypeWrapper<Message>;
  SendMessageInput: SendMessageInput;
  QueryInboxInput: QueryInboxInput;
  QueryOutboxInput: QueryOutboxInput;
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
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Omo: Omo;
  String: Scalars['String'];
  Profile: Profile;
  ID: Scalars['ID'];
  Contact: Contact;
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  Message: Message;
  SendMessageInput: SendMessageInput;
  QueryInboxInput: QueryInboxInput;
  QueryOutboxInput: QueryOutboxInput;
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
  Query: {};
  Mutation: {};
  Subscription: {};
}>;

export type OmoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Omo'] = ResolversParentTypes['Omo']> = ResolversObject<{
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
  sentMessages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
  receivedMessages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
  contacts?: Resolver<Maybe<Array<ResolversTypes['Contact']>>, ParentType, ContextType>;
  purchases?: Resolver<Maybe<Array<ResolversTypes['Purchase']>>, ParentType, ContextType>;
  activities?: Resolver<Maybe<Array<ResolversTypes['Activity']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  unpublishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  purchasedFrom?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  omo?: Resolver<Maybe<ResolversTypes['Omo']>, ParentType, ContextType>;
  fissionRoot?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryFissionRootArgs, 'query'>>;
  profiles?: Resolver<Array<ResolversTypes['Profile']>, ParentType, ContextType, RequireFields<QueryProfilesArgs, 'query'>>;
  offer?: Resolver<ResolversTypes['Offer'], ParentType, ContextType, RequireFields<QueryOfferArgs, 'offerId'>>;
  offers?: Resolver<Array<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryOffersArgs, 'query'>>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType, RequireFields<QueryContactsArgs, 'query'>>;
  inbox?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryInboxArgs, never>>;
  outbox?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryOutboxArgs, never>>;
  conversation?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryConversationArgs, 'query'>>;
  purchases?: Resolver<Array<ResolversTypes['Purchase']>, ParentType, ContextType, RequireFields<QueryPurchasesArgs, 'query'>>;
  activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<QueryActivitiesArgs, 'query'>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  upsertProfile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType, RequireFields<MutationUpsertProfileArgs, 'data'>>;
  createOffer?: Resolver<ResolversTypes['Offer'], ParentType, ContextType, RequireFields<MutationCreateOfferArgs, 'data'>>;
  unpublishOffer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnpublishOfferArgs, 'offerId'>>;
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'data'>>;
  markMessageAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkMessageAsReadArgs, 'messageId'>>;
  lockOffer?: Resolver<ResolversTypes['LockOfferResult'], ParentType, ContextType, RequireFields<MutationLockOfferArgs, 'data'>>;
  provePayment?: Resolver<ResolversTypes['ProvePaymentResult'], ParentType, ContextType, RequireFields<MutationProvePaymentArgs, 'data'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  messages?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "messages", ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Omo?: OmoResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  LockOfferResult?: LockOfferResultResolvers<ContextType>;
  ProvePaymentResult?: ProvePaymentResultResolvers<ContextType>;
  Purchase?: PurchaseResolvers<ContextType>;
  Activity?: ActivityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
