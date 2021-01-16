import { Maybe } from './common';
export declare type App = {
    domain: string;
};
/**
 * Get A list of all of your apps and their associated domain names
 */
export declare function index(): Promise<Array<App>>;
/**
 * Creates a new app, assigns an initial subdomain, and sets an asset placeholder
 *
 * @param subdomain Subdomain to create the fission app with
 */
export declare function create(subdomain: Maybe<string>): Promise<App>;
/**
 * Destroy app by any associated URL
 *
 * @param url The url we want to delete
 */
export declare function deleteByURL(url: string): Promise<void>;
