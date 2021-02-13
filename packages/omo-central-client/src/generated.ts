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
  did?: Maybe<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  fissionName: Scalars['ID'];
  fissionRoot?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  omoAvatarCID?: Maybe<Scalars['String']>;
};

export type UniqueProfileFields = {
  fissionName?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
};

export type ProfileQueryFields = {
  fissionName?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
};

export type UpdateProfileFields = {
  fissionRoot?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  omoFirstName?: Maybe<Scalars['String']>;
  omoLastName?: Maybe<Scalars['String']>;
  omoAvatarCID?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  omo?: Maybe<Omo>;
  profiles: Array<Profile>;
  fissionRoot?: Maybe<Scalars['String']>;
};


export type QueryProfilesArgs = {
  fields?: Maybe<ProfileQueryFields>;
};


export type QueryFissionRootArgs = {
  fields?: Maybe<UniqueProfileFields>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateProfile?: Maybe<Profile>;
};


export type MutationUpdateProfileArgs = {
  jwt?: Maybe<Scalars['String']>;
  data?: Maybe<UpdateProfileFields>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type UpdateProfileMutationVariables = Exact<{
  jwt: Scalars['String'];
  data: UpdateProfileFields;
}>;


export type UpdateProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'fissionName' | 'fissionRoot' | 'omoAvatarCID' | 'omoFirstName' | 'omoLastName'>
  )> }
);

export type OmoQueryVariables = Exact<{ [key: string]: never; }>;


export type OmoQuery = (
  { __typename?: 'Query' }
  & { omo?: Maybe<(
    { __typename?: 'Omo' }
    & Pick<Omo, 'did'>
  )> }
);

export type ProfilesQueryVariables = Exact<{
  fields?: Maybe<ProfileQueryFields>;
}>;


export type ProfilesQuery = (
  { __typename?: 'Query' }
  & { profiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'fissionName' | 'fissionRoot' | 'omoAvatarCID' | 'omoFirstName' | 'omoLastName'>
  )> }
);

export type FissionRootQueryVariables = Exact<{
  fields?: Maybe<UniqueProfileFields>;
}>;


export type FissionRootQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'fissionRoot'>
);


export const UpdateProfileDocument = gql`
    mutation updateProfile($jwt: String!, $data: UpdateProfileFields!) {
  updateProfile(jwt: $jwt, data: $data) {
    circlesAddress
    fissionName
    fissionRoot
    omoAvatarCID
    omoFirstName
    omoLastName
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
export const ProfilesDocument = gql`
    query profiles($fields: ProfileQueryFields) {
  profiles(fields: $fields) {
    circlesAddress
    fissionName
    fissionRoot
    omoAvatarCID
    omoFirstName
    omoLastName
  }
}
    `;
export const FissionRootDocument = gql`
    query fissionRoot($fields: UniqueProfileFields) {
  fissionRoot(fields: $fields)
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    updateProfile(variables: UpdateProfileMutationVariables): Promise<{ data?: UpdateProfileMutation | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UpdateProfileMutation>(print(UpdateProfileDocument), variables));
    },
    omo(variables?: OmoQueryVariables): Promise<{ data?: OmoQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<OmoQuery>(print(OmoDocument), variables));
    },
    profiles(variables?: ProfilesQueryVariables): Promise<{ data?: ProfilesQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ProfilesQuery>(print(ProfilesDocument), variables));
    },
    fissionRoot(variables?: FissionRootQueryVariables): Promise<{ data?: FissionRootQuery | undefined; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<FissionRootQuery>(print(FissionRootDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;