export enum CryptoSystem {
    ECC = "ecc",
    RSA = "rsa"
}
export enum CharSize {
    B8 = 8,
    B16 = 16
}

export const BASE58_DID_PREFIX: string = 'did:key:z'
export const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export const ECC_DID_PREFIX: ArrayBuffer = new Uint8Array([ 0xed, 0x01 ]).buffer
export const RSA_DID_PREFIX: ArrayBuffer = new Uint8Array([ 0x00, 0xf5, 0x02 ]).buffer
export const RSA_WRITE_ALG = "RSASSA-PKCS1-v1_5";
export const SALT_LENGTH = 128;
export const DEFAULT_HASH_ALG = "SHA-256";
