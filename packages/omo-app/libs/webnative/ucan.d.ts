export declare type Resource = "*" | Record<string, string>;
export declare type Ucan = {
    header: {
        alg: string;
        typ: string;
        uav: string;
    };
    payload: {
        aud: string;
        exp: number;
        fct: Array<any>;
        iss: string;
        nbf: number;
        prf: string | undefined;
        ptc: string | undefined | null;
        rsc: Resource;
    };
    signature: string;
};
export declare const WNFS_PREFIX = "floofs";
/**
 * Create a UCAN, User Controlled Authorization Networks, JWT.
 * This JWT can be used for authorization.
 *
 * ### Header
 *
 * `alg`, Algorithm, the type of signature.
 * `typ`, Type, the type of this data structure, JWT.
 * `uav`, UCAN version.
 *
 * ### Payload
 *
 * `aud`, Audience, the ID of who it's intended for.
 * `exp`, Expiry, unix timestamp of when the jwt is no longer valid.
 * `iss`, Issuer, the ID of who sent this.
 * `nbf`, Not Before, unix timestamp of when the jwt becomes valid.
 * `prf`, Proof, an optional nested token with equal or greater privileges.
 * `ptc`, Potency, which rights come with the token.
 * `rsc`, Resource, the involved resource.
 *
 */
export declare function build({ audience, facts, issuer, lifetimeInSeconds, potency, proof, resource }: {
    audience: string;
    facts?: Array<any>;
    issuer: string;
    lifetimeInSeconds?: number;
    potency?: string | null;
    proof?: string;
    resource?: Resource;
}): Promise<string>;
/**
 * Given a list of UCANs, generate a dictionary.
 * The key will be in the form of `${resourceKey}:${resourceValue}`
 */
export declare function compileDictionary(ucans: Array<string>): Record<string, Ucan>;
/**
 * Try to decode a UCAN.
 * Will throw if it fails.
 *
 * @param ucan The encoded UCAN to decode
 */
export declare function decode(ucan: string): Ucan;
/**
 * Encode a UCAN.
 *
 * @param ucan The UCAN to encode
 */
export declare function encode(ucan: Ucan): string;
/**
 * Check if a UCAN is expired.
 *
 * @param ucan The UCAN to validate
 */
export declare function isExpired(ucan: Ucan): boolean;
/**
 * Given a UCAN, lookup the root issuer.
 *
 * Throws when given an improperly formatted UCAN.
 * This could be a nested UCAN (ie. proof).
 *
 * @param ucan A UCAN.
 * @returns The root issuer.
 */
export declare function rootIssuer(ucan: string, level?: number): string;
