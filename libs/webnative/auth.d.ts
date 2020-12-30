import { Maybe } from './common';
import { Permissions } from './ucan/permissions';
/**
 * Retrieve the authenticated username.
 */
export declare function authenticatedUsername(): Promise<string | null>;
/**
 * Leave.
 *
 * Removes any trace of the user and redirects to the lobby.
 */
export declare function leave({ withoutRedirect }?: {
    withoutRedirect?: boolean;
}): Promise<void>;
/**
 * Redirects to a lobby.
 *
 * NOTE: Only works on the main thread, as it uses `window.location`.
 *
 * @param permissions The permissions from `initialise`.
 *                    Pass `null` if working without permissions.
 * @param redirectTo Specify the URL you want users to return to.
 *                   Uses the current url by default.
 */
export declare function redirectToLobby(permissions: Maybe<Permissions>, redirectTo?: string): Promise<void>;
