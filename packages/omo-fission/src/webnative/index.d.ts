import { Maybe } from './common';
import { Permissions } from './ucan/permissions';
import FileSystem from './fs';
export declare enum Scenario {
    NotAuthorised = "NOT_AUTHORISED",
    AuthSucceeded = "AUTH_SUCCEEDED",
    AuthCancelled = "AUTH_CANCELLED",
    Continuation = "CONTINUATION"
}
export declare type State = NotAuthorised | AuthSucceeded | AuthCancelled | Continuation;
export declare type NotAuthorised = {
    scenario: Scenario.NotAuthorised;
    permissions: Maybe<Permissions>;
    authenticated: false;
};
export declare type AuthSucceeded = {
    scenario: Scenario.AuthSucceeded;
    permissions: Maybe<Permissions>;
    authenticated: true;
    newUser: boolean;
    throughLobby: true;
    username: string;
    fs?: FileSystem;
};
export declare type AuthCancelled = {
    scenario: Scenario.AuthCancelled;
    permissions: Maybe<Permissions>;
    authenticated: false;
    cancellationReason: string;
    throughLobby: true;
};
export declare type Continuation = {
    scenario: Scenario.Continuation;
    permissions: Maybe<Permissions>;
    authenticated: true;
    newUser: false;
    throughLobby: false;
    username: string;
    fs?: FileSystem;
};
/**
 * Initialisation error
 */
export declare enum InitialisationError {
    InsecureContext = "INSECURE_CONTEXT",
    UnsupportedBrowser = "UNSUPPORTED_BROWSER"
}
/**
 * Check if we're authenticated, process any lobby query-parameters present in the URL,
 * and initiate the user's file system if authenticated (can be disabled).
 *
 * See `loadFileSystem` if you want to load the user's file system yourself.
 * NOTE: Only works on the main/ui thread, as it uses `window.location`.
 */
export declare function initialise(options: {
    permissions?: Permissions;
    autoRemoveUrlParams?: boolean;
    loadFileSystem?: boolean;
}): Promise<State>;
/**
 * Alias for `initialise`.
 */
export { initialise as initialize };
export declare function isSupported(): Promise<boolean>;
export * from './auth';
export * from './filesystem';
export declare const fs: typeof FileSystem;
export * as apps from './apps';
export * as dataRoot from './data-root';
export * as did from './did';
export * as errors from './errors';
export * as lobby from './lobby';
export * as setup from './setup';
export * as ucan from './ucan';
export * as dns from './dns';
export * as ipfs from './ipfs';
export * as keystore from './keystore';
