import {KeyFormat} from "crypto";

const {subtle} = require('crypto').webcrypto;
const crypto = require("crypto");
import jwt_decode from "jwt-decode";
import {UcanHeader, UcanPayload} from "./types";
import {didToPublicKey} from "./didToPublicKey";
import {decodeUcan, makeUrlUnsafe} from "./decodeUcan";
// import {RSA_WRITE_ALG, SALT_LENGTH} from "./consts";
export type Msg = ArrayBuffer | string | Uint8Array;

export async function verifyUcan(ucan:string, myDid:string) : Promise<string[]>
{
    const decodedUcan = decodeUcan(ucan)
    if (typeof decodedUcan !== "object")
    {
        throw new Error("Couldn't decode the jwt header");
    }

    const header:UcanHeader = decodedUcan.header;
    const payload:UcanPayload = decodedUcan.payload;

    const ucanData = ucan.split(".");
    const signedDataUrlUnsafe = makeUrlUnsafe(ucanData[0]) + "." + makeUrlUnsafe(ucanData[1]);

    const now = Math.floor(Date.now() / 1000);
    const errors:string[] = [];

    if (typeof header !== "object")
    {
        throw new Error("Couldn't decode the jwt header");
    }
    if (typeof payload !== "object")
    {
        throw new Error("Couldn't decode the jwt body");
    }

    const iss = payload.iss;
    if (!iss)
    {
        errors.push("No issuer (iss) claim.");
    }

    const exp = payload.exp;
    if (!exp)
    {
        errors.push("No expiry (exp) claim.");
    }
    else if (exp <= now)
    {
        errors.push("The token is already expired.");
    }

    const nbf = payload.nbf;
    if (nbf && nbf > now)
    {
        errors.push("The ucan is not valid before ${nbf}. Now it is ${now}.");
    }

    const rsc = payload.rsc;
    if (!rsc)
    {
        errors.push("No ressource (rsc) claim.");
    }

    const ptc = payload.ptc;
    if (!ptc)
    {
        errors.push("No potency (ptc) claim.");
    }

    const aud = payload.aud;
    if (!aud)
    {
        errors.push("No audience (aud) claim.");
    }
    else if (aud !== myDid)
    {
        errors.push(`Invalid audience. I'm '${myDid}', you wanted '${aud}'.`);
    }

    const rootIss = rootIssuer(ucan);
    if (iss !== rootIss)
    {
        // TODO: Check if the "prf" is valid

        let rootIssuerPublicKey: CryptoKey|null = null;
        try
        {
            rootIssuerPublicKey = await didToPublicKey(rootIss);
            const exportedKey = await subtle.exportKey("spki", rootIssuerPublicKey);
        }
        catch (e)
        {
            errors.push(`Couldn't extract the public key of the root issuer from the 'prf' claim:` + e.message);
        }
    }

    let issuerPublicKey: CryptoKey|null = null;
    try
    {
        issuerPublicKey = await didToPublicKey(iss);
    }
    catch (e)
    {
        errors.push(`Couldn't extract the public key from the 'iss'-DID:` + e.message);
    }

    if (!issuerPublicKey)
    {
        errors.push(`'didToPublicKey(iss)' returned 'null' or 'undefined'.`);
    }
    else
    {
        const exportedKey = await subtle.exportKey("spki", issuerPublicKey);
        const exportedKeyPem = formatAsPem(Buffer.from(exportedKey).toString("base64"));

        const verifySigResult = await verifySignaturePemKey(
            Buffer.from(exportedKeyPem),
            Buffer.from(signedDataUrlUnsafe),
            Buffer.from(decodedUcan.signature, "base64"));

        if (!verifySigResult)
        {
            errors.push("The signature is invalid or cannot be verified (using iss public key).")
        }
    }

    return errors;
}

function formatAsPem(str:string) {
    var finalString = '-----BEGIN PUBLIC KEY-----\n';

    while(str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    finalString = finalString + "-----END PUBLIC KEY-----";

    return finalString;
}


async function verifySignaturePemKey(publicKey:Buffer, msg:Buffer, signature:Buffer) : Promise<boolean>
{
    const hashingAlgorithm = 'rsa-sha256'
    const verificationResult = crypto.verify(
        hashingAlgorithm,
        msg,
        {
            key: publicKey
        },
        signature
    );

    return verificationResult;
}
/*
async function verifySignature(publicKey:CryptoKey, msg:Buffer, signature:Buffer) : Promise<boolean>
{
    const verificationResult = await subtle.verify(
        { name: RSA_WRITE_ALG, saltLength: SALT_LENGTH },
        publicKey,
        signature,
        msg
    );

    return verificationResult;
}*/

function rootIssuer(ucan: string, level = 0): string {
    const p = extractPayload(ucan, level)
    if (p.prf) return rootIssuer(p.prf, level + 1)
    return p.iss
}

function extractPayload(ucan: string, level: number): UcanPayload {
    try {
        return jwt_decode(ucan)
    } catch (_) {
        throw new Error(`Invalid UCAN (${level} level${level === 1 ? "" : "s"} deep): \`${ucan}\``)
    }
}
