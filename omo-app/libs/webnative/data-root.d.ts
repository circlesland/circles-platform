import { CID } from './ipfs';
/**
 * Get the CID of a user's data root.
 * First check Fission server, then check DNS
 *
 * @param username The username of the user that we want to get the data root of.
 */
export declare function lookup(username: string): Promise<CID | null>;
/**
 * Get the CID of a user's data root from the Fission server.
 *
 * @param username The username of the user that we want to get the data root of.
 */
export declare function lookupOnFisson(username: string): Promise<CID | null>;
/**
 * Update a user's data root.
 *
 * @param cid The CID of the data root.
 * @param proof The proof to use in the UCAN sent to the API.
 */
export declare function update(cid: CID | string, proof: string): Promise<void>;
