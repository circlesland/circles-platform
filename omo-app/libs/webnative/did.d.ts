import { CryptoSystem, Msg } from 'keystore-idb/types';
/**
 * Create a DID based on the exchange key-pair.
 */
export declare function exchange(): Promise<string>;
/**
 * Get the root write-key DID for a user.
 * Stored at `_did.${username}.${endpoints.user}`
 */
export declare function root(username: string): Promise<string>;
/**
 * Alias `write` to `ucan`
 */
export { write as ucan };
/**
 * Create a DID based on the write key-pair.
 */
export declare function write(): Promise<string>;
/**
 * Convert a base64 public key to a DID (did:key).
 */
export declare function publicKeyToDid(publicKey: string, type: CryptoSystem): string;
/**
 * Convert a DID (did:key) to a base64 public key.
 */
export declare function didToPublicKey(did: string): {
    publicKey: string;
    type: CryptoSystem;
};
/**
 * Verify the signature of some data (string, ArrayBuffer or Uint8Array), given a DID.
 */
export declare function verifySignedData({ charSize, data, did, signature }: {
    charSize?: number;
    data: Msg;
    did: string;
    signature: string;
}): Promise<boolean>;
