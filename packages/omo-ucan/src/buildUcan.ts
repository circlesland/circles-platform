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
import {Resource} from "./types";
import {decodeUcan, makeUrlSafe} from "./decodeUcan";
import crypto from "crypto";

export async function buildUcan(signingKey:string, {
                                audience,
                                facts = [],
                                issuer,
                                lifetimeInSeconds = 30,
                                potency = 'APPEND',
                                proof,
                                resource = '*'
                            }: {
    audience: string
    facts?: Array<any>
    issuer: string
    lifetimeInSeconds?: number
    potency?: string | null
    proof?: string
    resource?: Resource
}): Promise<string> {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)

    // Header
    const header = {
        alg: 'RS256',
        typ: 'JWT',
        uav: '1.0.0' // actually 0.3.1 but server isn't updated yet
    }

    // Timestamps
    let exp = currentTimeInSeconds + lifetimeInSeconds
    let nbf = currentTimeInSeconds - 60

    if (proof) {
        const prf = decodeUcan(proof).payload

        exp = Math.min(prf.exp, exp)
        nbf = Math.max(prf.nbf, nbf)
    }

    // Payload
    const payload = {
        aud: audience,
        exp: exp,
        fct: facts,
        iss: issuer,
        nbf: nbf,
        prf: proof,
        ptc: potency,
        rsc: resource,
    }

    // Encode parts in JSON & Base64Url
    const encodedHeader = makeUrlSafe(Buffer.from(JSON.stringify(header), "ascii").toString("base64"));
    const encodedPayload = makeUrlSafe(Buffer.from(JSON.stringify(payload), "ascii").toString("base64"));

    // Signature
    const signature = crypto.sign("RSA-SHA256", Buffer.from(`${encodedHeader}.${encodedPayload}`), {
        key: signingKey
    });

    const encodedSignatureUrlSafe = makeUrlSafe(signature.toString("base64"))

    // Make JWT
    return encodedHeader + '.' +
        encodedPayload + '.' +
        encodedSignatureUrlSafe
}
