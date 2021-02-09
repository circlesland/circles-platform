import {
    BASE58_DID_PREFIX,
    base58Alphabet,
    CryptoSystem,
    ECC_DID_PREFIX,
    RSA_DID_PREFIX,
} from "./consts";
import {decodeBaseN, encodeBaseN} from "./baseN";

export function publicKeyToDid(
    publicKey: string
): string {
    const pubKeyBuf = Buffer.from(publicKey, "base64");
    // Prefix public-write key
    const prefix = Buffer.from(RSA_DID_PREFIX);
    const prefixedBuf = Buffer.concat([prefix, pubKeyBuf]);

    // Encode prefixed
    return BASE58_DID_PREFIX + encodeBaseN(new Uint8Array(prefixedBuf), base58Alphabet);
}

export async function didToPublicKey(did: string): Promise<Buffer>
{
    if (!did.startsWith(BASE58_DID_PREFIX))
    {
        throw new Error("Please use a base58-encoded DID formatted `did:key:z...`")
    }

    const didWithoutPrefix = did.substr(BASE58_DID_PREFIX.length)
    const magicalBuf = decodeBaseN(didWithoutPrefix, base58Alphabet)?.buffer as ArrayBuffer
    if (!magicalBuf)
        throw new Error(`An error occurred during the base58 deconding of the did without BASE58_DID_PREFIX`);

    const {keyBuffer, type} = parseMagicBytes(magicalBuf)

    if (type === CryptoSystem.ECC)
    {
        throw new Error("NotSupported. Only RSA is supported at the moment.")
    }

    return Buffer.from(keyBuffer);
}

const parseMagicBytes = (prefixedKey: ArrayBuffer): {
    keyBuffer: ArrayBuffer
    type: CryptoSystem
} =>
{
    if (hasPrefix(prefixedKey, RSA_DID_PREFIX))
    {
        // RSA
        return {
            keyBuffer: prefixedKey.slice(RSA_DID_PREFIX.byteLength),
            type: CryptoSystem.RSA
        }
    }
    else if (hasPrefix(prefixedKey, ECC_DID_PREFIX))
    {
        // ECC
        return {
            keyBuffer: prefixedKey.slice(ECC_DID_PREFIX.byteLength),
            type: CryptoSystem.ECC
        }
    }

    throw new Error("Unsupported key algorithm. Try using RSA.")
}

const hasPrefix = (prefixedKey: ArrayBuffer, prefix: ArrayBuffer): boolean =>
{
    return arrBuffEqual(prefix, prefixedKey.slice(0, prefix.byteLength))
}

export const arrBuffEqual = (aBuf: ArrayBuffer, bBuf: ArrayBuffer): boolean => {
    const a = new Uint8Array(aBuf)
    const b = new Uint8Array(bBuf)
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}
