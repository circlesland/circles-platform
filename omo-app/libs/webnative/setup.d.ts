import { Endpoints } from './setup/internal';
/**
 * Toggle debug mode.
 *
 * Only adds a few `console.log`s at this moment.
 */
export declare function debug({ enabled }: {
    enabled: boolean;
}): boolean;
/**
 * Override endpoints.
 *
 * You can override each of these,
 * no need to provide them all here.
 *
 * `api` Location of the Fission API
 *       (default `https://runfission.com`)
 * `lobby` Location of the authentication lobby.
 *         (default `https://auth.fission.codes`)
 * `user`  User's domain to use, will be prefixed by username.
 *         (default `fission.name`)
 */
export declare function endpoints(e: Partial<Endpoints>): Endpoints;
