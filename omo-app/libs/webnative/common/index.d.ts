import * as api from './api';
import * as arrbufs from './arrbufs';
import * as base64 from './base64';
import * as blob from './blob';
export * from './types';
export * from './type-checks';
export * from './util';
export { api, arrbufs, base64, blob };
export declare const READ_KEY_FROM_LOBBY_NAME = "filesystem-lobby";
export declare const UCANS_STORAGE_KEY = "webnative.auth_ucans";
export declare const USERNAME_STORAGE_KEY = "webnative.auth_username";
/**
 * Retrieve the authenticated username.
 */
export declare function authenticatedUsername(): Promise<string | null>;
